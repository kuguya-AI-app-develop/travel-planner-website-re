import { useState, useCallback, useEffect, useRef } from 'react';
import './travel-planner.css';
import type { Trip, Flight, Hotel, ChecklistItem, TabType } from './types';
import Sidebar from './components/Sidebar';
import CoverImage from './components/CoverImage';
import CalendarView from './components/CalendarView';
import TripModal from './components/TripModal';
import FlightsView from './components/FlightsView';
import CriteriaModal from './components/CriteriaModal';
import HotelsView from './components/HotelsView';
import SummaryView from './components/SummaryView';
import MobileNav from './components/MobileNav';
import Toast from './components/Toast';

const INIT_TRIPS: Trip[] = [
  { id: 1, name: '东京购物之旅', start: '2026-05-18', end: '2026-05-22', color: 'oklch(58% 0.19 260)' },
  { id: 2, name: '京都赏樱', start: '2026-05-10', end: '2026-05-13', color: 'oklch(60% 0.18 150)' },
  { id: 3, name: '大阪美食', start: '2026-05-14', end: '2026-05-15', color: 'oklch(68% 0.16 55)' },
];

const INIT_FLIGHTS: Flight[] = [
  { id: 1, airline: '全日空航空', code: 'NH919', route: '上海 → 东京', dep: '08:30', arr: '12:45', price: 3280, cls: '经济舱', status: 'booked', selected: true },
  { id: 2, airline: '春秋航空', code: '9C6215', route: '东京 → 上海', dep: '19:00', arr: '21:30', price: 1899, cls: '经济舱', status: 'pending', selected: false },
  { id: 3, airline: '吉祥航空', code: 'HO1335', route: '上海 → 大阪', dep: '10:15', arr: '14:00', price: 2450, cls: '经济舱', status: 'compare', selected: false },
];

const INIT_CRITERIA = ['性价比', '位置', '卫生', '设施', '服务'];

const INIT_HOTELS: Hotel[] = [
  { id: 1, name: '东京新宿酒店', location: '新宿', price: '¥680/晚', priceNum: 680, scores: [4, 5, 4, 4, 3], selected: true },
  { id: 2, name: '浅草旅馆', location: '浅草', price: '¥420/晚', priceNum: 420, scores: [5, 3, 3, 3, 4], selected: false },
  { id: 3, name: '银座高端酒店', location: '银座', price: '¥1200/晚', priceNum: 1200, scores: [3, 5, 5, 5, 5], selected: false },
];

const INIT_CHECKLIST: ChecklistItem[] = [
  { id: 1, text: '购买上海→东京机票', done: true },
  { id: 2, text: '购买东京→上海机票', done: false },
  { id: 3, text: '预订东京新宿酒店', done: false },
  { id: 4, text: '办理日本签证', done: true },
  { id: 5, text: '购买旅行保险', done: false },
  { id: 6, text: '兑换日元', done: false },
  { id: 7, text: '购买迪士尼门票', done: false },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('calendar');
  const [trips, setTrips] = useState<Trip[]>(INIT_TRIPS);
  const [flights, setFlights] = useState<Flight[]>(INIT_FLIGHTS);
  const [criteria, setCriteria] = useState<string[]>(INIT_CRITERIA);
  const [hotels, setHotels] = useState<Hotel[]>(INIT_HOTELS);
  const [checklist, setChecklist] = useState<ChecklistItem[]>(INIT_CHECKLIST);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [coverVisible, setCoverVisible] = useState(() => {
    return localStorage.getItem('tp-cover-visible') !== 'false';
  });

  const [tripModalShow, setTripModalShow] = useState(false);
  const [tripModalEdit, setTripModalEdit] = useState<Trip | null>(null);
  const [tripModalDate, setTripModalDate] = useState('');

  const [criteriaModalShow, setCriteriaModalShow] = useState(false);
  const [modalKey, setModalKey] = useState(0);

  const [toastMsg, setToastMsg] = useState('');
  const [toastShow, setToastShow] = useState(false);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMsg(msg);
    setToastShow(true);
    toastTimerRef.current = setTimeout(() => setToastShow(false), 2000);
  }, []);

  const handleTabChange = useCallback((tab: TabType) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  }, []);

  const handleToggleCover = useCallback(() => {
    setCoverVisible(prev => {
      const next = !prev;
      localStorage.setItem('tp-cover-visible', String(next));
      return next;
    });
  }, []);

  // Trip modal handlers
  const handleAddTrip = useCallback((date: string) => {
    setTripModalEdit(null);
    setTripModalDate(date);
    setTripModalShow(true);
    setModalKey(k => k + 1);
  }, []);

  const handleEditTrip = useCallback((trip: Trip) => {
    setTripModalEdit(trip);
    setTripModalDate(trip.start);
    setTripModalShow(true);
    setModalKey(k => k + 1);
  }, []);

  const handleSaveTrip = useCallback((tripData: Omit<Trip, 'id'> & { id?: number }) => {
    if (tripData.id) {
      setTrips(prev => prev.map(t => t.id === tripData.id ? { ...t, ...tripData } : t));
      showToast('行程已更新');
    } else {
      const newId = Math.max(0, ...trips.map(t => t.id)) + 1;
      setTrips(prev => [...prev, { ...tripData, id: newId }]);
      showToast('行程已添加');
    }
    setTripModalShow(false);
  }, [trips, showToast]);

  const handleDeleteTrip = useCallback((id: number) => {
    setTrips(prev => prev.filter(t => t.id !== id));
    setTripModalShow(false);
    showToast('行程已删除');
  }, [showToast]);

  // Criteria modal handlers
  const handleSaveCriteria = useCallback((name: string) => {
    setCriteria(prev => [...prev, name]);
    setHotels(prev => prev.map(h => ({ ...h, scores: [...h.scores, 3] })));
    setCriteriaModalShow(false);
    showToast('已添加维度：' + name);
  }, [showToast]);

  // Cover visibility effect
  useEffect(() => {
    document.title = '旅行策划 — Travel Planner';
  }, []);

  return (
    <>
      <Sidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        coverVisible={coverVisible}
        onToggleCover={handleToggleCover}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="main">
        <CoverImage visible={coverVisible} onToast={showToast} />
        {activeTab === 'calendar' && (
          <CalendarView
            trips={trips}
            onUpdateTrips={setTrips}
            onAddTrip={handleAddTrip}
            onEditTrip={handleEditTrip}
            onDeleteTrip={handleDeleteTrip}
            onToast={showToast}
          />
        )}
        {activeTab === 'flights' && (
          <FlightsView
            flights={flights}
            onUpdateFlights={setFlights}
          />
        )}
        {activeTab === 'hotels' && (
          <HotelsView
            hotels={hotels}
            criteria={criteria}
            onUpdateHotels={setHotels}
            onUpdateCriteria={setCriteria}
            onOpenCriteriaModal={() => { setCriteriaModalShow(true); setModalKey(k => k + 1); }}
            onToast={showToast}
          />
        )}
        {activeTab === 'summary' && (
          <SummaryView
            trips={trips}
            flights={flights}
            hotels={hotels}
            checklist={checklist}
            onUpdateChecklist={setChecklist}
          />
        )}
      </div>
      <TripModal
        key={modalKey}
        show={tripModalShow}
        editTrip={tripModalEdit}
        defaultDate={tripModalDate}
        onSave={handleSaveTrip}
        onDelete={handleDeleteTrip}
        onClose={() => setTripModalShow(false)}
        onToast={showToast}
      />
      <CriteriaModal
        key={`criteria-${modalKey}`}
        show={criteriaModalShow}
        onSave={handleSaveCriteria}
        onClose={() => setCriteriaModalShow(false)}
        onToast={showToast}
      />
      <MobileNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onOpenSidebar={() => setSidebarOpen(true)}
      />
      <Toast message={toastMsg} show={toastShow} />
    </>
  );
}
