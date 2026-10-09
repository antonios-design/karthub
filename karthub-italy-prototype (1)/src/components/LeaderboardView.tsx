import React, { useState } from 'react';
import { TrackLeaderboardEntry, Track, DriverProfile } from '../types';
import { Trophy, Gauge, Flag, Zap, Award, ArrowUp, ArrowDown, User, ShieldCheck } from 'lucide-react';

interface LeaderboardViewProps {
  tracks: Track[];
  leaderboards: { [trackId: string]: TrackLeaderboardEntry[] };
  currentUser: DriverProfile;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  tracks,
  leaderboards,
  currentUser
}) => {
  const [activeTab, setActiveTab] = useState<'track' | 'national'>('track');
  const [selectedTrackId, setSelectedTrackId] = useState<string>(tracks[0]?.id || 'track-pomposa');

  const DEFAULT_TRACK: Track = {
    id: 'track-default',
    name: 'Circuito',
    region: 'Emilia-Romagna',
    province: 'IT',
    city: 'Italia',
    address: 'Via Circuito 1',
    lat: 44.8,
    lng: 12.1,
    lengthMeters: 1200,
    turnCount: 14,
    direction: 'clockwise',
    topSpeedKmh: 95,
    heroImageUrl: '',
    description: 'Circuito di prova',
    allTimeRecord: {
      timeSeconds: 58.0,
      timeFormatted: '0:58.000',
      driverName: 'Pro Driver',
      date: '2026-01-01',
      kartType: 'Sodi RT8 390cc'
    }
  };

  const selectedTrack = tracks.find(t => t.id === selectedTrackId) || tracks[0] || DEFAULT_TRACK;
  const entries = leaderboards[selectedTrackId] || leaderboards['track-pomposa'] || [];

  // Simulated National Driver Championship Standings
  const nationalDrivers = [
    { rank: 1, name: 'Marco "Apex" Rossi', nickname: 'ApexRossi', region: 'Emilia-Romagna', points: 420, races: 18, wins: 8, podiums: 14, badge: 'Apex Predator', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
    { rank: 2, name: 'Antonio Santoro (You)', nickname: 'ApexAnto', region: 'Emilia-Romagna', points: 385, races: 14, wins: 2, podiums: 5, badge: 'Pro-Am', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', isCurrentUser: true },
    { rank: 3, name: 'Matteo "TuscanyFlyer" Bianchi', nickname: 'TuscanyFlyer', region: 'Toscana', points: 350, races: 12, wins: 3, podiums: 7, badge: 'Pro-Am', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80' },
    { rank: 4, name: 'Giulia "RacerGirl" Moretti', nickname: 'RacerGirl', region: 'Lombardia', points: 310, races: 11, wins: 1, podiums: 4, badge: 'Semi-Pro', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80' },
    { rank: 5, name: 'Federico "BolognaFullGas" Neri', nickname: 'FullGas', region: 'Emilia-Romagna', points: 280, races: 10, wins: 1, podiums: 3, badge: 'Amateur', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80' }
  ];

  // Find user's entry on selected track
  const userEntry = entries.find(e => e.isCurrentUser);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 pb-24 space-y-6">
      {/* Top Header & Tab Toggle */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold uppercase tracking-tight text-slate-900 flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-red-600" />
            LIVE TIMING & CLASSIFICA NAZIONALE PILOTI
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-sans">
            Sector deltas in tempo reale, record sul giro per circuito e campionato nazionale a punti rental/endurance.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('track')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer uppercase tracking-wider ${
              activeTab === 'track'
                ? 'bg-red-600 text-white shadow font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            RECORD PER CIRCUITO
          </button>
          <button
            onClick={() => setActiveTab('national')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer uppercase tracking-wider ${
              activeTab === 'national'
                ? 'bg-red-600 text-white shadow font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            RANKING NAZIONALE A PUNTI
          </button>
        </div>
      </div>

      {activeTab === 'track' ? (
        <div className="space-y-6">
          {/* Circuit selector tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
            {tracks.map(t => (
              <button
                key={t.id}
                onClick={() => setSelectedTrackId(t.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition cursor-pointer border uppercase tracking-wider ${
                  selectedTrackId === t.id
                    ? 'bg-red-600 text-white border-red-600 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                🏁 {t.name}
              </button>
            ))}
          </div>

          {/* User Gap/Delta Banner */}
          {userEntry && (
            <div className="bg-white border-l-4 border-l-red-600 border border-slate-200/80 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-slate-900">
              <div className="flex items-center space-x-3">
                <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-10 h-10 rounded-full border-2 border-red-600 object-cover" />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-extrabold text-red-600 uppercase tracking-wider">TUA TELEMETRIA A {(selectedTrack?.name || 'Circuito').toUpperCase()}</span>
                    <span className="px-2 py-0.5 rounded-lg bg-red-50 text-red-600 border border-red-200 text-[10px] font-bold">POSIZIONE #{userEntry.rank}</span>
                  </div>
                  <p className="text-sm font-extrabold text-slate-900">{currentUser?.name || 'Pilota'} ({currentUser?.nickname || 'GP'})</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200 text-right">
                  <p className="text-[9px] font-bold text-slate-400 tracking-wider uppercase">MIGLIOR GIRO</p>
                  <p className="text-sm font-black text-slate-900">{userEntry.timeFormatted}</p>
                </div>
                <div className="bg-red-50 px-3.5 py-1.5 rounded-xl border border-red-200 text-right">
                  <p className="text-[9px] font-bold text-red-700 tracking-wider uppercase">DISTACCO DA #1</p>
                  <p className="text-sm font-black text-red-600">+{userEntry.deltaToRecordSeconds.toFixed(3)}s</p>
                </div>
              </div>
            </div>
          )}

          {/* F1 Live Timing Tower Table */}
          <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
            {/* Table Header */}
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 text-[10px] text-slate-500 uppercase tracking-wider grid grid-cols-12 gap-2 items-center font-extrabold">
              <span className="col-span-1">POS</span>
              <span className="col-span-4 sm:col-span-3">PILOTA</span>
              <span className="col-span-3 sm:col-span-2 text-right">BEST LAP</span>
              <span className="col-span-2 text-right">DELTA #1</span>
              <span className="hidden sm:inline sm:col-span-3 text-center">SETTORI (S1 / S2 / S3)</span>
              <span className="hidden md:inline md:col-span-1 text-right">KART</span>
            </div>

            {/* Drivers Rows */}
            <div className="divide-y divide-slate-100">
              {entries.map((entry) => {
                const isLeader = entry.rank === 1;

                return (
                  <div
                    key={entry.rank}
                    className={`px-4 py-3 grid grid-cols-12 gap-2 items-center transition ${
                      entry.isCurrentUser
                        ? 'bg-red-50/60 border-l-4 border-l-red-600'
                        : 'hover:bg-slate-50/80'
                    }`}
                  >
                    {/* Position */}
                    <div className="col-span-1 font-extrabold flex items-center">
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs ${
                        isLeader
                          ? 'bg-red-600 text-white font-extrabold shadow-sm'
                          : entry.rank === 2
                          ? 'bg-slate-200 text-slate-800 font-bold'
                          : entry.rank === 3
                          ? 'bg-amber-100 text-amber-800 font-bold border border-amber-300'
                          : 'text-slate-500 bg-slate-100'
                      }`}>
                        P{entry.rank}
                      </span>
                    </div>

                    {/* Driver Name & Avatar */}
                    <div className="col-span-4 sm:col-span-3 flex items-center space-x-2 truncate">
                      <img src={entry.driverAvatar} alt={entry.driverName} className="w-7 h-7 rounded-full object-cover border border-slate-200" />
                      <div className="truncate">
                        <span className={`text-xs font-bold truncate block ${entry.isCurrentUser ? 'text-red-600 font-extrabold' : 'text-slate-900'}`}>
                          {entry.driverName}
                        </span>
                        <span className="text-[9px] text-slate-400 block truncate font-sans">
                          {entry.date} {entry.isFriend ? '• 👥 Amico' : ''}
                        </span>
                      </div>
                    </div>

                    {/* Best Lap */}
                    <div className="col-span-3 sm:col-span-2 text-right font-black text-xs text-emerald-600">
                      {entry.timeFormatted}
                    </div>

                    {/* Gap to record */}
                    <div className="col-span-2 text-right text-xs font-bold text-slate-600">
                      {isLeader ? (
                        <span className="text-white bg-red-600 text-[9px] font-extrabold px-2 py-0.5 rounded-lg shadow-sm">RECORD</span>
                      ) : (
                        <span className="text-red-600">+{entry.deltaToRecordSeconds.toFixed(3)}s</span>
                      )}
                    </div>

                    {/* Sector Breakdown */}
                    <div className="hidden sm:flex sm:col-span-3 justify-center space-x-1 text-[10px] text-slate-500 font-medium">
                      <span className="bg-slate-50 px-1.5 py-0.5 rounded-lg border border-slate-200">S1: {entry.s1.toFixed(3)}s</span>
                      <span className="bg-slate-50 px-1.5 py-0.5 rounded-lg border border-slate-200">S2: {entry.s2.toFixed(3)}s</span>
                      <span className="bg-slate-50 px-1.5 py-0.5 rounded-lg border border-slate-200">S3: {entry.s3.toFixed(3)}s</span>
                    </div>

                    {/* Kart Category */}
                    <div className="hidden md:block md:col-span-1 text-right text-[10px] text-slate-400 truncate font-medium">
                      {entry.kartCategory.split(' ')[0]}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* National Points Championship Standings */
        <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm space-y-2">
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 text-[10px] text-slate-500 uppercase tracking-wider grid grid-cols-12 gap-2 items-center font-extrabold">
            <span className="col-span-1">RANK</span>
            <span className="col-span-4 sm:col-span-4">PILOTA</span>
            <span className="col-span-2 text-center">PUNTI</span>
            <span className="col-span-2 text-center">GARE</span>
            <span className="col-span-3 text-right">CATEGORIA</span>
          </div>

          <div className="divide-y divide-slate-100">
            {nationalDrivers.map((driver) => (
              <div
                key={driver.rank}
                className={`px-4 py-3 grid grid-cols-12 gap-2 items-center transition ${
                  driver.isCurrentUser ? 'bg-red-50/60 border-l-4 border-l-red-600' : 'hover:bg-slate-50/80'
                }`}
              >
                <div className="col-span-1 font-bold text-xs text-slate-400">
                  #{driver.rank}
                </div>

                <div className="col-span-4 sm:col-span-4 flex items-center space-x-2.5 truncate">
                  <img src={driver.avatar} alt={driver.name} className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                  <div className="truncate">
                    <span className={`text-xs font-bold block truncate ${driver.isCurrentUser ? 'text-red-600 font-extrabold' : 'text-slate-900'}`}>
                      {driver.name}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      📍 {driver.region}
                    </span>
                  </div>
                </div>

                <div className="col-span-2 text-center font-extrabold text-sm text-red-600">
                  {driver.points} <span className="text-[9px] text-slate-400 font-normal">PTS</span>
                </div>

                <div className="col-span-2 text-center text-xs font-bold text-slate-600">
                  {driver.races} <span className="text-[9px] text-slate-400 font-normal">({driver.wins}W / {driver.podiums}P)</span>
                </div>

                <div className="col-span-3 text-right">
                  <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold uppercase bg-red-50 text-red-600 border border-red-200">
                    {driver.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
