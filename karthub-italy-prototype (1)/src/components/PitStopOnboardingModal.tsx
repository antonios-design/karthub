import React, { useState } from 'react';
import { DriverProfile, Track } from '../types';
import { X, Sparkles, CheckCircle2, Flag, Bell, ShieldCheck } from 'lucide-react';
import { playRevSound } from '../lib/audio';

interface PitStopOnboardingModalProps {
  currentUser: DriverProfile;
  tracks: Track[];
  onClose: () => void;
  onSaveProfile: (updatedProfile: Partial<DriverProfile>) => void;
}

export const PitStopOnboardingModal: React.FC<PitStopOnboardingModalProps> = ({
  currentUser,
  tracks,
  onClose,
  onSaveProfile
}) => {
  const [nickname, setNickname] = useState(currentUser?.nickname || '');
  const [weightKg, setWeightKg] = useState(currentUser?.weightKg || 75);
  const [experienceLevel, setExperienceLevel] = useState(currentUser?.experienceLevel || 'Amateur');
  const [favoriteTrackIds, setFavoriteTrackIds] = useState<string[]>(currentUser?.favoriteTrackIds || []);
  const [notifyOnNewRaces, setNotifyOnNewRaces] = useState(currentUser?.notifyOnNewRaces || false);

  const toggleTrack = (id: string) => {
    if (favoriteTrackIds.includes(id)) {
      setFavoriteTrackIds(favoriteTrackIds.filter(t => t !== id));
    } else {
      setFavoriteTrackIds([...favoriteTrackIds, id]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playRevSound();
    onSaveProfile({
      nickname,
      weightKg,
      experienceLevel,
      favoriteTrackIds,
      notifyOnNewRaces
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto font-sans">
      <div className="bg-[#111111] border border-[#FF0000]/60 rounded-xl max-w-lg w-full p-5 space-y-4 shadow-2xl relative text-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-[#151515] hover:bg-[#222] text-[#888] hover:text-white transition cursor-pointer border border-[#2A2A2A] z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-[#FF0000] text-black">
              <Sparkles className="w-5 h-5" />
            </span>
            <h2 className="font-mono text-lg font-black uppercase tracking-wide">
              PROFILO PILOTA & LIVE SETUP
            </h2>
          </div>
          <p className="text-xs text-[#888] font-sans">
            Personalizza il tuo nickname paddock, il livello di esperienza e le preferenze di notifica.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] text-[#888] uppercase font-bold">NICKNAME PILOTA</label>
              <input
                type="text"
                required
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg px-3 py-2 text-white font-bold focus:outline-none focus:border-[#FF0000]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-[#888] uppercase font-bold">PESO PILOTA (KG)</label>
              <input
                type="number"
                required
                min="50"
                max="130"
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg px-3 py-2 text-white font-bold focus:outline-none focus:border-[#FF0000]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-[#888] uppercase font-bold">LIVELLO ESPERIENZA PILOTA</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {['Rookie', 'Amateur', 'Semi-Pro', 'Professionist', 'Kart-Legend'].map(rank => (
                <button
                  key={rank}
                  type="button"
                  onClick={() => setExperienceLevel(rank as any)}
                  className={`p-2 rounded-lg text-xs font-bold transition border ${
                    experienceLevel === rank
                      ? 'bg-[#FF0000] text-black border-[#FF0000] shadow'
                      : 'bg-[#151515] text-[#888] border-[#2A2A2A] hover:text-white'
                  }`}
                >
                  {rank}
                </button>
              ))}
            </div>
          </div>

          {/* Favorite Tracks selection */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-[#888] uppercase font-bold">CIRCUITI PREFERITI (NOTIFICHE GARE)</label>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-1">
              {tracks.map(t => {
                const isSelected = favoriteTrackIds.includes(t.id);
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => toggleTrack(t.id)}
                    className={`p-2 rounded-lg text-left text-[11px] font-bold transition border truncate ${
                      isSelected
                        ? 'bg-[#FF0000]/20 text-[#FF0000] border-[#FF0000]'
                        : 'bg-[#151515] text-[#888] border-[#2A2A2A] hover:text-white'
                    }`}
                  >
                    {isSelected ? '⭐ ' : ''}{t.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notifications toggle */}
          <div className="bg-[#151515] p-3 rounded-lg border border-[#2A2A2A] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="w-4 h-4 text-[#FF0000]" />
              <div>
                <p className="text-xs font-bold text-white">AVVISI GARE & PROMO SWS</p>
                <p className="text-[10px] text-[#888]">Notifica quando vengono pubblicate gare nei circuiti preferiti</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={notifyOnNewRaces}
              onChange={(e) => setNotifyOnNewRaces(e.target.checked)}
              className="w-5 h-5 accent-[#FF0000] rounded cursor-pointer"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#FF0000] hover:bg-red-600 text-black font-mono text-xs font-black rounded-lg shadow-xl transition cursor-pointer uppercase tracking-wider"
          >
            SALVA MODIFICHE PROFILO
          </button>
        </form>
      </div>
    </div>
  );
};
