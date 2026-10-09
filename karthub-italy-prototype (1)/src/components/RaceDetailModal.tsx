import React, { useState, useEffect } from 'react';
import { Race, Track } from '../types';
import { X, Calendar, Clock, Euro, Users, ExternalLink, ShieldCheck, Sparkles, MapPin, AlertCircle, FileText, Bot } from 'lucide-react';
import { playLightsOutSequence } from '../lib/audio';

interface RaceDetailModalProps {
  race: Race | null;
  track?: Track;
  onClose: () => void;
  onBuyRaceDirect?: (race: Race) => void;
}

export const RaceDetailModal: React.FC<RaceDetailModalProps> = ({
  race,
  track,
  onClose,
  onBuyRaceDirect
}) => {
  const [lightsCount, setLightsCount] = useState<number>(0);
  const [lightsOut, setLightsOut] = useState<boolean>(false);
  const [isSimulatingLights, setIsSimulatingLights] = useState<boolean>(false);

  // Gemini AI Brief state
  const [aiBrief, setAiBrief] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState<boolean>(false);

  // Countdown clock calculation
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; mins: number; secs: number }>({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    if (!race) return;

    const targetDate = new Date(`${race.date}T${race.time || '10:00'}:00`).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = targetDate - now;

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, mins, secs });
      } else {
        setTimeLeft({ days: 0, hours: 0, mins: 0, secs: 0 });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [race]);

  if (!race) return null;

  const gridFillPct = Math.round((race.registeredTeamsCount / race.maxGridSize) * 100);

  // Trigger F1 Lights Out Sequence animation
  const handleStartLightsOut = () => {
    setIsSimulatingLights(true);
    setLightsOut(false);
    setLightsCount(0);

    let count = 0;
    playLightsOutSequence(() => {
      setLightsOut(true);
      setIsSimulatingLights(false);
    });

    const timer = setInterval(() => {
      count++;
      if (count <= 5) {
        setLightsCount(count);
      } else {
        clearInterval(timer);
      }
    }, 600);
  };

  // Generate Gemini AI Pit Wall Strategy Brief
  const handleGenerateAiBrief = async () => {
    setLoadingAi(true);
    try {
      const res = await fetch('/api/ai/race-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trackName: race.trackName,
          raceTitle: race.title,
          format: race.format,
          category: race.category,
          weather: race.weatherForecast
        })
      });
      const data = await res.json();
      setAiBrief(data.brief);
    } catch (e) {
      setAiBrief('Error generating strategy brief. Please check server connection.');
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 my-auto animate-in zoom-in-95 duration-200 relative text-slate-900">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* F1 5 Red Lights Sequence Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center space-y-3 text-white">
          <div className="flex items-center justify-between px-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">F1 LIGHTS OUT TIMER</span>
            <button
              onClick={handleStartLightsOut}
              disabled={isSimulatingLights}
              className="text-[10px] font-mono font-bold text-red-400 hover:text-red-300 underline cursor-pointer"
            >
              {isSimulatingLights ? 'SEQUENCE ACTIVE...' : 'TEST LIGHTS OUT'}
            </button>
          </div>

          <div className="flex items-center justify-center space-x-3 py-1">
            {[1, 2, 3, 4, 5].map((lightNum) => {
              const isOn = lightsCount >= lightNum && !lightsOut;
              return (
                <div
                  key={lightNum}
                  className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 transition-all duration-200 ${
                    isOn
                      ? 'bg-red-600 border-red-400 shadow-lg shadow-red-600/80 animate-pulse'
                      : lightsOut
                      ? 'bg-emerald-500 border-emerald-300 shadow-lg shadow-emerald-500/80'
                      : 'bg-slate-800 border-slate-700'
                  }`}
                />
              );
            })}
          </div>

          {lightsOut && (
            <p className="font-mono text-xs font-black text-emerald-400 animate-bounce uppercase tracking-widest">
              🏎️ LIGHTS OUT AND AWAY WE GO!
            </p>
          )}

          {/* Race Countdown Clock */}
          <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-800 font-mono text-center">
            <div className="bg-slate-800 p-2 rounded-xl border border-slate-700">
              <p className="text-base font-extrabold text-red-500">{timeLeft.days}</p>
              <p className="text-[9px] text-slate-400">DAYS</p>
            </div>
            <div className="bg-slate-800 p-2 rounded-xl border border-slate-700">
              <p className="text-base font-extrabold text-red-500">{timeLeft.hours}</p>
              <p className="text-[9px] text-slate-400">HOURS</p>
            </div>
            <div className="bg-slate-800 p-2 rounded-xl border border-slate-700">
              <p className="text-base font-extrabold text-red-500">{timeLeft.mins}</p>
              <p className="text-[9px] text-slate-400">MINS</p>
            </div>
            <div className="bg-slate-800 p-2 rounded-xl border border-slate-700">
              <p className="text-base font-extrabold text-red-500">{timeLeft.secs}</p>
              <p className="text-[9px] text-slate-400">SECS</p>
            </div>
          </div>
        </div>

        {/* Main Title & Organizer */}
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold uppercase bg-red-600 text-white shadow-sm">
              {race.format}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Organized by {race.organizerName}
            </span>
          </div>

          <h1 className="text-xl font-extrabold uppercase text-slate-900 tracking-tight">
            {race.title}
          </h1>

          <p className="text-xs text-red-600 font-bold flex items-center">
            <MapPin className="w-3.5 h-3.5 mr-1 text-red-600" />
            {race.trackName} ({race.trackRegion})
          </p>
        </div>

        {/* Key Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <p className="text-[9px] font-bold text-slate-400 tracking-wider">ENTRY FEE</p>
            <p className="text-sm font-black text-emerald-600 mt-0.5">€{race.entryFee}</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <p className="text-[9px] font-bold text-slate-400 tracking-wider">KART CATEGORY</p>
            <p className="text-xs font-bold text-slate-900 mt-0.5 truncate">{race.category}</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <p className="text-[9px] font-bold text-slate-400 tracking-wider">PIT STOPS</p>
            <p className="text-xs font-bold text-amber-600 mt-0.5">{race.mandatoryPitStops ?? 0} Mandatory</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <p className="text-[9px] font-bold text-slate-400 tracking-wider">MIN WEIGHT</p>
            <p className="text-xs font-bold text-slate-700 mt-0.5">{race.minWeightKg ? `${race.minWeightKg} kg` : 'N/A'}</p>
          </div>
        </div>

        {/* Championship Progress Section if part of a championship */}
        {race.championshipName && (
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-300/80 rounded-2xl p-4 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-base">🏆</span>
                <div>
                  <h3 className="text-xs font-black text-amber-950 uppercase tracking-tight">
                    {race.championshipName}
                  </h3>
                  <p className="text-[10px] text-amber-800 font-medium">
                    {race.organizerName} • Stato Ingressi & Classifica Campionato
                  </p>
                </div>
              </div>
              {race.championshipRound && race.totalChampionshipRaces && (
                <span className="px-3 py-1 bg-amber-600 text-white font-extrabold text-xs rounded-xl shadow-sm uppercase tracking-wider">
                  TAPPA {race.championshipRound} DI {race.totalChampionshipRaces}
                </span>
              )}
            </div>

            {/* Championship Round Progress bar */}
            {race.totalChampionshipRaces && (
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-[11px] font-bold text-amber-900">
                  <span>Avanzamento Stagione</span>
                  <span>{Math.round(((race.completedChampionshipRaces ?? 0) / race.totalChampionshipRaces) * 100)}% Completato</span>
                </div>
                <div className="flex space-x-1.5">
                  {Array.from({ length: race.totalChampionshipRaces }).map((_, idx) => {
                    const roundNum = idx + 1;
                    const isDone = roundNum < (race.championshipRound ?? 1);
                    const isCurrent = roundNum === race.championshipRound;
                    return (
                      <div
                        key={idx}
                        className={`h-2 flex-1 rounded-full transition-all ${
                          isDone
                            ? 'bg-amber-600'
                            : isCurrent
                            ? 'bg-red-600 shadow-md ring-2 ring-red-400 animate-pulse'
                            : 'bg-amber-200'
                        }`}
                        title={`Tappa ${roundNum}`}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Championship Stats pills */}
            <div className="grid grid-cols-3 gap-2 pt-1 text-center font-sans">
              <div className="bg-white/80 border border-amber-200 rounded-xl p-2">
                <p className="text-[9px] font-bold text-amber-700 uppercase">Gare Già Fatte</p>
                <p className="text-sm font-black text-amber-950">{race.completedChampionshipRaces ?? 0}</p>
              </div>
              <div className="bg-white/80 border border-amber-200 rounded-xl p-2">
                <p className="text-[9px] font-bold text-amber-700 uppercase">Gare Rimanenti</p>
                <p className="text-sm font-black text-red-600">{race.remainingChampionshipRaces ?? 0}</p>
              </div>
              <div className="bg-white/80 border border-amber-200 rounded-xl p-2">
                <p className="text-[9px] font-bold text-amber-700 uppercase">Totale Tappe</p>
                <p className="text-sm font-black text-amber-950">{race.totalChampionshipRaces ?? 0}</p>
              </div>
            </div>
          </div>
        )}

        {/* Grid Capacity Bar */}
        <div className="space-y-1.5 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-slate-600">Grid Slots Filled: <strong className="text-slate-900">{race.registeredTeamsCount} / {race.maxGridSize} Teams</strong></span>
            <span className="text-red-600 font-bold">{gridFillPct}% Capacity</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-500 rounded-full"
              style={{ width: `${gridFillPct}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-500">
            Registration deadline: <strong className="text-slate-700">{race.registrationDeadline}</strong>
          </p>
        </div>

        {/* Description & Regulations */}
        <div className="space-y-2 text-xs text-slate-600 font-sans bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <p className="leading-relaxed">{race.description}</p>
          {race.weatherForecast && (
            <p className="text-[11px] font-bold text-sky-700 pt-1">
              🌤️ <strong>Expected Track Conditions:</strong> {race.weatherForecast}
            </p>
          )}
        </div>

        {/* AI Pit Wall Strategy Brief Section */}
        <div className="bg-slate-50 border border-red-200 rounded-2xl p-4 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5 text-red-600" />
              <h3 className="text-xs font-extrabold uppercase text-red-600">
                GEMINI F1 PIT WALL STRATEGY BRIEF
              </h3>
            </div>
            <button
              onClick={handleGenerateAiBrief}
              disabled={loadingAi}
              className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition flex items-center space-x-1 cursor-pointer disabled:opacity-50 shadow-sm"
            >
              <Sparkles className={`w-3.5 h-3.5 ${loadingAi ? 'animate-spin' : ''}`} />
              <span>{loadingAi ? 'ANALYZING...' : 'GENERATE STRATEGY'}</span>
            </button>
          </div>

          {aiBrief && (
            <div className="bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-700 font-sans whitespace-pre-line leading-relaxed max-h-52 overflow-y-auto shadow-inner">
              {aiBrief}
            </div>
          )}
        </div>

        {/* Rules & Direct Official Registration Link CTA */}
        <div className="pt-2 flex flex-col sm:flex-row gap-2.5 text-xs">
          {onBuyRaceDirect && (
            <button
              onClick={() => {
                onClose();
                onBuyRaceDirect(race);
              }}
              className="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold uppercase tracking-wide transition shadow-sm cursor-pointer flex items-center justify-center space-x-2"
            >
              <span>🎟️ ACQUISTA ISCRIZIONE SU KARTHUB (€{race.entryFee})</span>
            </button>
          )}

          <a
            href={race.registrationUrl}
            target="_blank"
            rel="noreferrer"
            className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold transition flex items-center justify-center space-x-1.5 border border-slate-200 cursor-pointer"
          >
            <span>SITO ORGANIZZATORE</span>
            <ExternalLink className="w-4 h-4 text-slate-500" />
          </a>
        </div>

      </div>
    </div>
  );
};
