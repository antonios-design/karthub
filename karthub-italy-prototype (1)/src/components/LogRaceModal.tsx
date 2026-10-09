import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Track, TelemetryLog } from '../types';
import { X, Trophy, Timer, Clock, Sparkles } from 'lucide-react';
import { playRevSound } from '../lib/audio';

interface LogRaceModalProps {
  tracks: Track[];
  onClose: () => void;
  onSubmitLog: (newLog: TelemetryLog) => void;
}

export const LogRaceModal: React.FC<LogRaceModalProps> = ({
  tracks,
  onClose,
  onSubmitLog
}) => {
  const [sessionType, setSessionType] = useState<'gara' | 'sessione_libera'>('gara');
  const [trackId, setTrackId] = useState<string>(tracks[0]?.id || 'track-pomposa');
  const [eventTitle, setEventTitle] = useState<string>('Weekend Sprint Cup');
  const [date, setDate] = useState<string>(new Date().toISOString().substring(0, 10));
  const [bestLapSecs, setBestLapSecs] = useState<string>('58.784');
  const [s1Secs, setS1Secs] = useState<string>('18.210');
  const [s2Secs, setS2Secs] = useState<string>('21.402');
  const [s3Secs, setS3Secs] = useState<string>('19.172');
  const [finishPosition, setFinishPosition] = useState<number>(2);
  const [startingGrid, setStartingGrid] = useState<number>(4);
  const [totalTeams, setTotalTeams] = useState<number>(20);
  const [kartNumber, setKartNumber] = useState<number>(14);
  const [kartCategory, setKartCategory] = useState<string>('Sodi RT8 390cc');
  const [notes, setNotes] = useState<string>('');

  const DEFAULT_TRACK = { id: 'track-default', name: 'Circuito', region: 'IT' };
  const selectedTrack = tracks.find(t => t.id === trackId) || tracks[0] || DEFAULT_TRACK;

  const handleSessionTypeChange = (type: 'gara' | 'sessione_libera') => {
    setSessionType(type);
    if (type === 'sessione_libera') {
      setEventTitle('Sessione Libera');
    } else if (eventTitle === 'Sessione Libera') {
      setEventTitle('Weekend Sprint Cup');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isRace = sessionType === 'gara';
    const lapNum = parseFloat(bestLapSecs) || 58.784;
    const formattedTime = lapNum >= 60 
      ? `${Math.floor(lapNum / 60)}:${(lapNum % 60).toFixed(3).padStart(6, '0')}`
      : `0:${lapNum.toFixed(3).padStart(6, '0')}`;

    const newLog: TelemetryLog = {
      id: `log-${Date.now()}`,
      driverId: 'driver-me',
      driverName: 'Antonio Santoro',
      driverAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      trackId,
      trackName: selectedTrack.name,
      date,
      eventTitle: eventTitle.trim() || (isRace ? 'Gara Ufficiale' : 'Sessione Libera'),
      bestLapSeconds: lapNum,
      bestLapFormatted: formattedTime,
      s1Seconds: parseFloat(s1Secs) || 18.0,
      s2Seconds: parseFloat(s2Secs) || 21.0,
      s3Seconds: parseFloat(s3Secs) || 19.0,
      finishPosition: isRace ? finishPosition : undefined,
      startingGrid: isRace ? startingGrid : undefined,
      totalTeams: isRace ? totalTeams : undefined,
      kartNumber,
      kartCategory,
      notes,
      verified: true,
      likesCount: 1
    };

    // Trigger engine rev audio & podium confetti explosion!
    playRevSound();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    onSubmitLog(newLog);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 my-auto relative text-slate-900 font-sans">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer z-10 border border-slate-200"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <h2 className="text-lg font-extrabold uppercase text-slate-900 flex items-center tracking-tight">
            <Trophy className="w-5 h-5 mr-2 text-red-600" />
            AGGIUNGI GARA / SESSIONE LIBERA
          </h2>
          <p className="text-xs text-slate-500">
            Inserisci i tuoi tempi sul giro, i settori e i dettagli della tua sessione in pista.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {/* Toggle Type */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-500 font-bold uppercase">TIPO DI SESSIONE</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleSessionTypeChange('gara')}
                className={`py-2.5 px-3 rounded-xl font-extrabold uppercase text-xs flex items-center justify-center space-x-1.5 transition cursor-pointer border ${
                  sessionType === 'gara'
                    ? 'bg-red-600 text-white border-red-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Trophy className="w-4 h-4" />
                <span>GARA</span>
              </button>

              <button
                type="button"
                onClick={() => handleSessionTypeChange('sessione_libera')}
                className={`py-2.5 px-3 rounded-xl font-extrabold uppercase text-xs flex items-center justify-center space-x-1.5 transition cursor-pointer border ${
                  sessionType === 'sessione_libera'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>SESSIONE LIBERA</span>
              </button>
            </div>
          </div>

          {/* Select Track & Date */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 font-bold uppercase">CIRCUITO</label>
              <select
                value={trackId}
                onChange={(e) => setTrackId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-red-600"
              >
                {tracks.map(t => (
                  <option key={t.id} value={t.id}>{t.name} ({t.region})</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 font-bold uppercase">DATA</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-red-600"
              />
            </div>
          </div>

          {/* Event Title & Kart Model */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 font-bold uppercase">
                {sessionType === 'gara' ? 'NOME EVENTO / GARA *' : 'TITOLO SESSIONE'}
              </label>
              <input
                type="text"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                placeholder={sessionType === 'gara' ? 'es. SWS Sprint Heat 1' : 'Sessione Libera'}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-red-600"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 font-bold uppercase">CATEGORIA KART</label>
              <input
                type="text"
                value={kartCategory}
                onChange={(e) => setKartCategory(e.target.value)}
                placeholder="es. Sodi RT8 390cc"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-red-600"
              />
            </div>
          </div>

          {/* Best Lap & Sectors Grid */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex justify-between items-center text-red-600 font-extrabold text-[11px]">
              <span>⏱️ TEMPI SUL GIRO & SETTORI</span>
              <span className="text-[9px] text-slate-400 font-normal">(In Secondi es. 58.784)</span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <div>
                <label className="text-[9px] text-emerald-600 font-extrabold block mb-0.5">BEST LAP</label>
                <input
                  type="text"
                  value={bestLapSecs}
                  onChange={(e) => setBestLapSecs(e.target.value)}
                  className="w-full bg-white border border-emerald-300 rounded-xl px-2 py-1.5 text-emerald-700 font-black text-center focus:outline-none shadow-xs"
                />
              </div>

              <div>
                <label className="text-[9px] text-slate-500 font-bold block mb-0.5">SETTORE 1</label>
                <input
                  type="text"
                  value={s1Secs}
                  onChange={(e) => setS1Secs(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-2 py-1.5 text-slate-900 text-center focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[9px] text-slate-500 font-bold block mb-0.5">SETTORE 2</label>
                <input
                  type="text"
                  value={s2Secs}
                  onChange={(e) => setS2Secs(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-2 py-1.5 text-slate-900 text-center focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[9px] text-slate-500 font-bold block mb-0.5">SETTORE 3</label>
                <input
                  type="text"
                  value={s3Secs}
                  onChange={(e) => setS3Secs(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-2 py-1.5 text-slate-900 text-center focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Grid & Finish Positions - ONLY IF GARA */}
          {sessionType === 'gara' ? (
            <div className="grid grid-cols-4 gap-2 text-center">
              <div>
                <label className="text-[9px] text-slate-500 font-bold block mb-0.5">START GRID</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={startingGrid}
                  onChange={(e) => setStartingGrid(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-slate-900 text-center"
                />
              </div>

              <div>
                <label className="text-[9px] text-amber-600 font-bold block mb-0.5">FINISH POS</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={finishPosition}
                  onChange={(e) => setFinishPosition(Number(e.target.value))}
                  className="w-full bg-amber-50 border border-amber-300 rounded-xl px-2 py-1.5 text-amber-700 font-extrabold text-center"
                />
              </div>

              <div>
                <label className="text-[9px] text-slate-500 font-bold block mb-0.5">TOT PILOTI</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={totalTeams}
                  onChange={(e) => setTotalTeams(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-slate-900 text-center"
                />
              </div>

              <div>
                <label className="text-[9px] text-slate-500 font-bold block mb-0.5">KART #</label>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={kartNumber}
                  onChange={(e) => setKartNumber(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-slate-900 text-center"
                />
              </div>
            </div>
          ) : (
            <div className="w-1/2">
              <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">NUMERO KART</label>
              <input
                type="number"
                min="1"
                max="99"
                value={kartNumber}
                onChange={(e) => setKartNumber(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-red-600"
              />
            </div>
          )}

          {/* Notes */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-500 font-bold uppercase">NOTE TECNICHE & ASSETTO</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="es. Kart #14 aveva un'ottima velocità di punta. Pressione gomme 0.9 bar."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-sans focus:outline-none focus:border-red-600"
            />
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center justify-center space-x-2 uppercase tracking-wide"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>{sessionType === 'gara' ? 'SALVA GARA E PUBBLICA NEL PADDOCK' : 'SALVA SESSIONE LIBERA E PUBBLICA'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
