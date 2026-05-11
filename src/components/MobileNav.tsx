import type { ReactElement } from 'react';
import type { TabType } from '../types';

interface MobileNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onOpenSidebar: () => void;
}

const navItems: { id: TabType; label: string; icon: ReactElement }[] = [
  {
    id: 'calendar',
    label: '日历',
    icon: (
      <svg viewBox="0 0 20 20" fill="none">
        <rect x="3" y="4" width="14" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.3" />
        <path d="M3 8.5h14M7 2v4M13 2v4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'flights',
    label: '机票',
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
    label: '酒店',
    icon: (
      <svg viewBox="0 0 20 20" fill="none">
        <rect x="3" y="8" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.3" />
        <path d="M7 8V6.5a3 3 0 016 0V8" stroke="currentColor" strokeWidth="1.3" />
        <rect x="8.5" y="11" width="3" height="3.5" rx=".8" fill="currentColor" opacity=".15" />
      </svg>
    ),
  },
  {
    id: 'summary',
    label: '总结',
    icon: (
      <svg viewBox="0 0 20 20" fill="none">
        <path d="M4 5h12M4 10h8M4 15h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="16" cy="15" r="2.5" fill="currentColor" opacity=".2" stroke="currentColor" strokeWidth="1" />
      </svg>
    ),
  },
];

export default function MobileNav({ activeTab, onTabChange, onOpenSidebar }: MobileNavProps) {
  return (
    <>
      <button className="mobile-menu-btn" onClick={onOpenSidebar}>
        <svg viewBox="0 0 20 20" fill="none">
          <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
      <div className="mobile-nav">
        <div className="mobile-nav-inner">
          {navItems.map(item => (
            <div
              key={item.id}
              className={`mobile-nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => onTabChange(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
