import type { ReactElement } from 'react';
import type { TabType } from '../types';

interface SidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  coverVisible: boolean;
  onToggleCover: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({
  activeTab,
  onTabChange,
  coverVisible,
  onToggleCover,
  isOpen,
  onClose,
}: SidebarProps) {
  const tabs: { id: TabType; label: string; icon: ReactElement }[] = [
    {
      id: 'calendar',
      label: '行程日历',
      icon: (
        <svg viewBox="0 0 20 20" fill="none">
          <rect x="3" y="4" width="14" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.3" />
          <path d="M3 8.5h14M7 2v4M13 2v4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      id: 'flights',
      label: '机票对比',
      icon: (
        <svg viewBox="0 0 20 20" fill="none">
          <path
            d="M10 2.5c.3 0 .5.2.5.5v4.2l5.8-1.2c.4-.1.8.1.9.5.1.3 0 .6-.3.8L12 10l1.7 4.7c.1.3 0 .6-.3.8-.3.1-.6 0-.8-.2L10 13.3l-2.6 2c-.2.2-.5.3-.8.2-.3-.1-.5-.4-.3-.8L8 10 3.1 7.3c-.3-.2-.4-.5-.3-.8.1-.4.5-.6.9-.5L9.5 7.2V3c0-.3.2-.5.5-.5z"
            fill="currentColor"
            opacity=".18"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      id: 'hotels',
      label: '酒店评分',
      icon: (
        <svg viewBox="0 0 20 20" fill="none">
          <rect x="3" y="8" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.3" />
          <path d="M7 8V6.5a3 3 0 016 0V8" stroke="currentColor" strokeWidth="1.3" />
          <rect x="8.5" y="11" width="3" height="3.5" rx=".8" fill="currentColor" opacity=".15" />
        </svg>
      ),
    },
  ];

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'show' : ''}`} onClick={onClose} />
      <nav className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <rect x="2" y="2" width="18" height="18" rx="5" fill="var(--accent-subtle)" stroke="var(--accent)" strokeWidth="1.2" />
            <path d="M7 11h8M11 7v8" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          旅行策划
        </div>
        <div className="sidebar-label">规划</div>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`sidebar-item ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.icon}
            {tab.label}
          </div>
        ))}
        <div className="sidebar-divider" />
        <div className="sidebar-label">汇总</div>
        <div
          className={`sidebar-item ${activeTab === 'summary' ? 'active' : ''}`}
          onClick={() => onTabChange('summary')}
        >
          <svg viewBox="0 0 20 20" fill="none">
            <path d="M4 5h12M4 10h8M4 15h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            <circle cx="16" cy="15" r="2.5" fill="currentColor" opacity=".2" stroke="currentColor" strokeWidth="1" />
          </svg>
          预算总结
        </div>
        <div style={{ flex: 1 }} />
        <div className="sidebar-cover-toggle" onClick={onToggleCover}>
          <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
            <rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.2" />
            <path d="M1 10l4-3 3 2 3-4 4 5" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
          </svg>
          封面背景
          <div
            className="toggle-track"
            style={{ background: coverVisible ? 'var(--accent)' : 'var(--muted-light)' }}
          >
            <div
              className="toggle-thumb"
              style={{ left: coverVisible ? '18px' : '2px' }}
            />
          </div>
        </div>
      </nav>
    </>
  );
}
