import React, { useState } from 'react';
import { Race, Track } from '../types';
import { Calendar as CalendarIcon, Filter, Search, Tag, Users, Euro, ChevronRight, CheckCircle, Clock, Sparkles } from 'lucide-react';

interface CalendarViewProps {
  races: Race[];
  tracks: Track[];
  onSelectRace: (race: Race) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  races,
  tracks,
  onSelectRace
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');
  const [selectedFormat, setSelectedFormat] = useState<string>('ALL');
  const [maxCostFilter, setMaxCostFilter] = useState<number>(1000);

  const regions = ['ALL', 'Emilia-Romagna', 'Toscana', 'Lombardia', 'Veneto', 'Lazio', 'Piemonte'];
  const formats = ['ALL', 'Endurance', 'Sprint', 'Ironman'];

  const TODAY_STR = '2026-10-09';

  // Filter & Sort races in strict chronological date order (ONLY UPCOMING / CURRENT RACES)
  // Races prior to today are hidden and archived in Campionati -> Storico Gare
  const filteredRaces = races.filter(race => {
    // Hide races with date prior to today
    if (race.date < TODAY_STR) return false;

    const matchesSearch = race.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          race.trackName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          race.organizerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegion === 'ALL' || race.trackRegion.toLowerCase() === selectedRegion.toLowerCase();
    const matchesFormat = selectedFormat === 'ALL' || race.format.toLowerCase() === selectedFormat.toLowerCase();
    const matchesCost = race.entryFee <= maxCostFilter;

    return matchesSearch && matchesRegion && matchesFormat && matchesCost;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Group races by Month (e.g., "Agosto 2026", "Settembre 2026")
  const racesByMonth: { [monthKey: string]: Race[] } = {};
  filteredRaces.forEach(race => {
    const d = new Date(race.date);
    const monthKey = d.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' }).toUpperCase();
    if (!racesByMonth[monthKey]) {
      racesByMonth[monthKey] = [];
    }
    racesByMonth[monthKey].push(race);
  });

  const monthKeys = Object.keys(racesByMonth);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 pb-24 space-y-6">
      {/* Header & Controls */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-extrabold uppercase tracking-tight text-slate-900 flex items-center">
              <CalendarIcon className="w-5 h-5 mr-2 text-red-600" />
              CALENDARIO MENSILE GARE RENTAL & ENDURANCE
            </h1>
            <p className="text-xs text-slate-500 mt-1 font-sans">
              Elenco mensile completo e compatto delle prossime gare con costo, pista e data.
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200/80 rounded-xl px-3.5 py-2 text-xs text-amber-900 flex items-center gap-2">
            <span className="text-sm">📜</span>
            <div className="text-[11px] leading-tight">
              <strong className="font-extrabold uppercase text-amber-950">Storico Gare:</strong> Le gare antecedenti a oggi sono archiviate all'apertura del campionato nella sezione <strong>🏆 CAMPIONATI → 📜 Storico Gare</strong> con ordini d'arrivo e classifiche ufficiali.
            </div>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cerca evento, circuito, organizzatore..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Region Dropdown */}
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-500 font-bold"
          >
            {regions.map(r => (
              <option key={r} value={r}>
                {r === 'ALL' ? '🇮🇹 Regione: Tutta Italia' : `📍 Regione: ${r}`}
              </option>
            ))}
          </select>

          {/* Format Dropdown */}
          <select
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-500 font-bold"
          >
            {formats.map(f => (
              <option key={f} value={f}>
                {f === 'ALL' ? '🏁 Categoria: Tutte' : `🏎️ Categoria: ${f}`}
              </option>
            ))}
          </select>

          {/* Max Cost Range */}
          <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
            <Euro className="w-4 h-4 text-red-600 shrink-0" />
            <div className="w-full space-y-0.5">
              <div className="flex justify-between text-[10px] font-bold text-slate-500">
                <span>Quota Max</span>
                <span className="text-red-600 font-extrabold">€{maxCostFilter}</span>
              </div>
              <input
                type="range"
                min="50"
                max="1000"
                step="25"
                value={maxCostFilter}
                onChange={(e) => setMaxCostFilter(Number(e.target.value))}
                className="w-full accent-red-600 h-1 bg-slate-200 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Race Listings by Month */}
      {monthKeys.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-sm">
          <p className="text-3xl">🏁</p>
          <h3 className="text-sm font-bold text-slate-900 uppercase">Nessuna gara trovata con i filtri correnti</h3>
          <p className="text-xs text-slate-500">Prova a modificare la regione o la quota massima di iscrizione.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {monthKeys.map((monthName) => {
            const monthRaces = racesByMonth[monthName];

            return (
              <div key={monthName} className="space-y-3">
                {/* Month Group Header */}
                <div className="flex items-center space-x-3">
                  <div className="px-4 py-1.5 bg-slate-900 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-sm">
                    🗓️ {monthName}
                  </div>
                  <div className="h-px bg-slate-200 flex-1" />
                  <span className="text-[11px] font-extrabold text-slate-400 tracking-wider uppercase">
                    {monthRaces.length} GARE
                  </span>
                </div>

                  {/* Compact Table / List */}
                  <div className="bg-white border border-slate-200/80 rounded-2xl divide-y divide-slate-100 shadow-sm overflow-hidden">
                    {monthRaces.map((race) => {
                      const gridFillPct = Math.round((race.registeredTeamsCount / race.maxGridSize) * 100);
                      const track = tracks.find(t => t.id === race.trackId);
                      const trackImg = track?.heroImageUrl;

                      return (
                        <div
                          key={race.id}
                          onClick={() => onSelectRace(race)}
                          className="relative overflow-hidden p-4 hover:bg-slate-50/90 transition cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3 group"
                        >
                          {/* Subtle Track Photo Underlay */}
                          {trackImg && (
                            <div 
                              className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-[0.06] group-hover:opacity-[0.12] transition-opacity duration-300"
                              style={{ backgroundImage: `url(${trackImg})` }}
                            />
                          )}

                          {/* Essential Info 1: Date & Time */}
                          <div className="relative z-10 flex items-center space-x-3 md:w-1/4 shrink-0">
                            <div className="bg-red-50 text-red-600 font-extrabold text-xs px-3 py-2 rounded-xl text-center border border-red-100 min-w-[70px]">
                              <span className="block text-[10px] uppercase font-bold text-slate-400">DATA</span>
                              <span>{race.date.slice(8, 10)}/{race.date.slice(5, 7)}</span>
                            </div>
                            <div>
                              <span className="text-xs font-bold text-slate-900 block">🕘 {race.time}</span>
                              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[9px] font-extrabold uppercase mt-0.5 inline-block">
                                {race.format}
                              </span>
                            </div>
                          </div>

                          {/* Essential Info 2: Title & Track */}
                          <div className="relative z-10 flex-1 space-y-0.5">
                            <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-red-600 transition uppercase">
                              {race.title}
                            </h3>
                            <p className="text-xs text-slate-600 flex items-center">
                              📍 <strong className="ml-1 text-slate-900">{race.trackName}</strong> ({race.trackRegion})
                            </p>
                          </div>

                          {/* Essential Info 3: Costo & Action */}
                          <div className="relative z-10 flex items-center justify-between md:justify-end space-x-4 md:w-1/3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                            <div className="text-left md:text-right">
                              <span className="text-[9px] font-bold text-slate-400 block uppercase">QUOTA / TEAM</span>
                              <strong className="text-sm font-black text-red-600">€{race.entryFee}</strong>
                            </div>

                            <div className="flex items-center space-x-2">
                              <span className="text-[10px] font-extrabold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 uppercase">
                                {gridFillPct}% ISCRITTI
                              </span>
                              <button className="p-2 bg-slate-900 group-hover:bg-red-600 text-white rounded-xl transition shadow-sm">
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
