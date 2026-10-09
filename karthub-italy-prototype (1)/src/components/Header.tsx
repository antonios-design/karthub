import React from 'react';
import { Flag, Bell, Shield, Sparkles, RefreshCw, Radio, LogOut, FolderArchive, LogIn, UserPlus, User } from 'lucide-react';
import { Race, SystemNotification, DriverProfile } from '../types';
import { TabType } from './BottomNav';

interface HeaderProps {
  currentUser?: DriverProfile | null;
  notifications: SystemNotification[];
  nextRace?: Race;
  onOpenNotifications: () => void;
  onOpenAdmin: () => void;
  onOpenOnboarding: () => void;
  onTriggerScrape: () => void;
  onOpenApexLive?: () => void;
  onLogout?: () => void;
  onOpenExportCode?: () => void;
  isScraping: boolean;
  isAdminOpen: boolean;
  isLoggedIn?: boolean;
  onOpenLogin?: (mode?: 'login' | 'register') => void;
  activeTab?: TabType;
  onNavigateTab?: (tab: TabType) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  notifications,
  nextRace,
  onOpenNotifications,
  onOpenAdmin,
  onOpenOnboarding,
  onTriggerScrape,
  onOpenApexLive,
  onLogout,
  onOpenExportCode,
  isScraping,
  isAdminOpen,
  isLoggedIn = false,
  onOpenLogin,
  activeTab = 'home',
  onNavigateTab
}) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-900 shadow-sm">
      {/* Top Banner Ticker */}
      <div className="bg-slate-900 px-4 py-1.5 text-xs font-mono font-bold tracking-wider uppercase text-white flex items-center justify-between overflow-hidden">
        <div className="flex items-center space-x-3 truncate">
          <button
            onClick={onOpenApexLive}
            className="inline-flex items-center px-2 py-0.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-extrabold text-[10px] tracking-tight shrink-0 animate-pulse cursor-pointer shadow-sm"
          >
            <Radio className="w-3 h-3 mr-1" /> LIVE TIMING APEX
          </button>
          <span className="truncate text-slate-300 text-[11px] tracking-wide font-medium">
            {nextRace 
              ? `PROSSIMA GARA: ${nextRace.title.toUpperCase()} @ ${nextRace.trackName.toUpperCase()} (${nextRace.date})`
              : 'KARTHUB • AGGREGATORE ENDURANCE & RENTAL ITALIA • POMPOSA ENDURANCE & APEX TIMING'}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          {!isLoggedIn && (
            <span className="hidden md:inline-block text-[10px] text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
              MODALITÀ OSPITE
            </span>
          )}

          <button 
            onClick={onTriggerScrape}
            disabled={isScraping}
            className="ml-2 flex items-center space-x-1.5 text-[10px] bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-lg border border-slate-700 transition shrink-0 cursor-pointer font-bold tracking-wider text-slate-200"
            title="Force Live Scraper Sync"
          >
            <RefreshCw className={`w-3 h-3 text-red-500 ${isScraping ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isScraping ? 'SYNC IN CORSO...' : 'LIVE SYNC'}</span>
          </button>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Desktop Nav Links */}
        <div className="flex items-center space-x-6">
          <div 
            className="flex items-center space-x-3 cursor-pointer group" 
            onClick={() => onNavigateTab ? onNavigateTab('home') : window.location.reload()}
          >
            <div className="bg-slate-900 text-white px-3 py-1 font-black text-xl italic tracking-tighter rounded-xl shadow-sm border border-slate-800 flex items-center space-x-1 group-hover:border-red-500 transition">
              <span>KART</span>
              <span className="text-red-500">HUB</span>
            </div>
            <div className="h-5 w-px bg-slate-200 hidden sm:block"></div>
            <div className="hidden sm:block">
              <div className="text-[10px] uppercase tracking-[0.2em] font-extrabold text-slate-500">
                Motorsport Hub Italia
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          {onNavigateTab && (
            <nav className="hidden lg:flex items-center space-x-1">
              {[
                { id: 'home' as TabType, label: 'Home' },
                { id: 'championships' as TabType, label: 'Campionati' },
                { id: 'calendar' as TabType, label: 'Gare' },
                { id: 'map' as TabType, label: 'Piste' },
                { id: 'feed' as TabType, label: 'Community' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => onNavigateTab(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-red-50 text-red-600 font-black'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          )}
        </div>

        {/* Quick Actions & Auth */}
        <div className="flex items-center space-x-2 sm:space-x-3 text-xs font-bold uppercase tracking-wider">

          {/* Export Prototype Code Button */}
          {onOpenExportCode && (
            <button
              onClick={onOpenExportCode}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl transition border cursor-pointer bg-slate-900 hover:bg-slate-800 text-white border-slate-900 shadow-sm"
              title="Esporta il codice sorgente del prototipo (.ZIP)"
            >
              <FolderArchive className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden sm:inline text-[11px] font-extrabold tracking-wide">ESPORTA CODICE</span>
            </button>
          )}

          {/* Admin Pit Wall */}
          {isLoggedIn && currentUser?.email?.toLowerCase() === 'antonio.santoro8959@gmail.com' && (
            <button
              onClick={onOpenAdmin}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl transition border cursor-pointer ${
                isAdminOpen
                  ? 'bg-red-600 text-white border-red-600 font-extrabold shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">PIT WALL DEV</span>
            </button>
          )}

          {/* Logged-In User Profile & Notifications */}
          {isLoggedIn ? (
            <>
              {/* Notifications */}
              <button
                onClick={onOpenNotifications}
                className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4 text-slate-700" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-[10px] font-black text-white flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Profile Pill */}
              {currentUser && onNavigateTab && (
                <button
                  onClick={() => onNavigateTab('garage')}
                  className="flex items-center space-x-2 pl-2 pr-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 transition cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-lg bg-red-600 text-white font-black text-[10px] flex items-center justify-center">
                    {currentUser.nickname.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="hidden md:inline font-bold text-slate-800 text-xs">
                    {currentUser.nickname}
                  </span>
                </button>
              )}

              {/* Logout / Switch User */}
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white border border-slate-800 transition cursor-pointer flex items-center space-x-1.5"
                  title="Disconnetti / Cambia Account"
                >
                  <LogOut className="w-4 h-4 text-red-400" />
                  <span className="hidden xl:inline text-[10px] font-black uppercase">ESCI</span>
                </button>
              )}
            </>
          ) : (
            /* Guest / Non-Logged-In Action Buttons */
            <div className="flex items-center space-x-2">
              {onOpenLogin && (
                <>
                  <button
                    onClick={() => onOpenLogin('login')}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-extrabold text-xs transition cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5 text-slate-700" />
                    <span>ACCEDI</span>
                  </button>

                  <button
                    onClick={() => onOpenLogin('register')}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs transition cursor-pointer shadow-sm"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">CREA ACCOUNT</span>
                  </button>
                </>
              )}
            </div>
          )}

        </div>
      </div>
    </header>
  );
};


