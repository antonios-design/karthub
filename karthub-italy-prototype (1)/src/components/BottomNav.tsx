import React from 'react';
import { Map, Calendar, Trophy, Activity, User, Flag, PlusCircle } from 'lucide-react';

export type TabType = 'home' | 'championships' | 'calendar' | 'map' | 'feed' | 'garage';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onLogRaceClick: () => void;
  isLoggedIn?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  onLogRaceClick,
  isLoggedIn = true
}) => {
  const tabs = [
    { id: 'home' as TabType, label: 'HOME', icon: Flag },
    { id: 'championships' as TabType, label: 'CAMPIONATI', icon: Trophy },
    { id: 'calendar' as TabType, label: 'CALENDARIO', icon: Calendar },
    { id: 'map' as TabType, label: 'MAPPA', icon: Map },
    { id: 'feed' as TabType, label: 'COMMUNITY', icon: Activity },
    { id: 'garage' as TabType, label: isLoggedIn ? 'PROFILO' : 'ACCEDI', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 text-slate-500 px-3 py-2 shadow-lg">
      <div className="max-w-xl mx-auto flex items-center justify-between relative">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-red-50 text-red-600 border border-red-200 font-extrabold shadow-sm'
                  : 'hover:text-slate-900 text-slate-500 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px] text-red-600' : 'stroke-[1.8px]'}`} />
              <span className={`text-[9px] font-bold tracking-wider mt-1 uppercase ${isActive ? 'text-red-600 font-black' : ''}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

