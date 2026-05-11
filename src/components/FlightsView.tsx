import { useCallback } from 'react';
import type { Flight } from '../types';

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  booked: { label: '已预订', cls: 'pill-booked' },
  pending: { label: '待定', cls: 'pill-pending' },
  compare: { label: '对比中', cls: 'pill-compare' },
};

interface FlightsViewProps {
  flights: Flight[];
  onUpdateFlights: (flights: Flight[]) => void;
}

export default function FlightsView({ flights, onUpdateFlights }: FlightsViewProps) {
  const toggleSelect = useCallback((id: number) => {
    onUpdateFlights(flights.map(f => f.id === id ? { ...f, selected: !f.selected } : f));
  }, [flights, onUpdateFlights]);

  const addFlight = useCallback(() => {
    const newFlight: Flight = {
      id: Math.max(0, ...flights.map(f => f.id)) + 1,
      airline: '新航班',
      code: '',
      route: '',
      dep: '',
      arr: '',
      price: 0,
      cls: '经济舱',
      status: 'compare',
      selected: false,
    };
    onUpdateFlights([...flights, newFlight]);
  }, [flights, onUpdateFlights]);

  const deleteFlight = useCallback((id: number) => {
    onUpdateFlights(flights.filter(f => f.id !== id));
  }, [flights, onUpdateFlights]);

  const cycleStatus = useCallback((id: number) => {
    const cycle: Flight['status'][] = ['compare', 'pending', 'booked'];
    onUpdateFlights(flights.map(f => {
      if (f.id === id) {
        return { ...f, status: cycle[(cycle.indexOf(f.status) + 1) % 3] };
      }
      return f;
    }));
  }, [flights, onUpdateFlights]);

  const updateField = useCallback((id: number, field: keyof Flight, value: string) => {
    onUpdateFlights(flights.map(f => {
      if (f.id === id) {
        if (field === 'price') {
          const num = parseInt(value.replace(/[^\d]/g, ''), 10) || 0;
          return { ...f, price: num };
        }
        return { ...f, [field]: value };
      }
      return f;
    }));
  }, [flights, onUpdateFlights]);

  return (
    <div className="section active">
      <div className="section-header">
        <h1>机票价格对比</h1>
        <p>勾选已确定的航班，价格将计入预算总结。点击单元格可直接编辑</p>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th className="select-cell">选定</th>
              <th>航空公司</th>
              <th>航班号</th>
              <th>出发 → 到达</th>
              <th>出发时间</th>
              <th>到达时间</th>
              <th>价格 (¥)</th>
              <th>舱位</th>
              <th>状态</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {flights.map(f => (
              <tr key={f.id}>
                <td className="select-cell">
                  <input
                    type="checkbox"
                    checked={f.selected}
                    onChange={() => toggleSelect(f.id)}
                  />
                </td>
                <td
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => updateField(f.id, 'airline', e.currentTarget.textContent?.trim() || '')}
                >
                  {f.airline}
                </td>
                <td
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => updateField(f.id, 'code', e.currentTarget.textContent?.trim() || '')}
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}
                >
                  {f.code}
                </td>
                <td
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => updateField(f.id, 'route', e.currentTarget.textContent?.trim() || '')}
                >
                  {f.route}
                </td>
                <td
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => updateField(f.id, 'dep', e.currentTarget.textContent?.trim() || '')}
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {f.dep}
                </td>
                <td
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => updateField(f.id, 'arr', e.currentTarget.textContent?.trim() || '')}
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {f.arr}
                </td>
                <td
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => updateField(f.id, 'price', e.currentTarget.textContent?.trim() || '')}
                  style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}
                >
                  ¥{f.price.toLocaleString()}
                </td>
                <td
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => updateField(f.id, 'cls', e.currentTarget.textContent?.trim() || '')}
                >
                  {f.cls}
                </td>
                <td>
                  <span
                    className={`pill ${STATUS_MAP[f.status].cls}`}
                    onClick={() => cycleStatus(f.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    {STATUS_MAP[f.status].label}
                  </span>
                </td>
                <td>
                  <span
                    className="btn-danger btn-sm"
                    onClick={() => deleteFlight(f.id)}
                    style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '14px' }}
                  >
                    ×
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="table-actions">
        <button className="btn-sm" onClick={addFlight}>+ 添加航班</button>
      </div>
    </div>
  );
}
