import React from 'react';
import { SystemNotification } from '../types';
import { X, Bell, CheckCircle, Flag, Users, RefreshCw } from 'lucide-react';

interface NotificationsModalProps {
  notifications: SystemNotification[];
  onClose: () => void;
  onMarkAllRead: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  notifications,
  onClose,
  onMarkAllRead
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative text-slate-900 font-sans">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-red-600" />
            <h2 className="text-base font-extrabold uppercase text-slate-900 tracking-tight">NOTIFICHE PADDOCK</h2>
          </div>

          <button
            onClick={onMarkAllRead}
            className="text-xs font-bold text-red-600 hover:underline cursor-pointer"
          >
            Segna lette
          </button>
        </div>

        <div className="space-y-2 max-h-80 overflow-y-auto">
          {notifications.map(n => (
            <div
              key={n.id}
              className={`p-3.5 rounded-2xl border transition space-y-1 ${
                n.read
                  ? 'bg-slate-50 border-slate-200 text-slate-500'
                  : 'bg-red-50/50 border-red-200 text-slate-900 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-extrabold text-red-600 uppercase">{n.type.replace('_', ' ')}</span>
                <span className="text-slate-400 font-medium">{n.timestamp}</span>
              </div>
              <h4 className="font-extrabold text-xs text-slate-900">{n.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
