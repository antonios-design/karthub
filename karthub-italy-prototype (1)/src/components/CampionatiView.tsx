import React, { useState, useMemo, useEffect } from 'react';
import { Race, Track, RaceResultEntry } from '../types';
import {
  Flag,
  Trophy,
  Calendar,
  Clock,
  Users,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  MapPin,
  Award,
  Sparkles,
  Euro,
  ExternalLink,
  Shield,
  Medal,
  Info,
  Car
} from 'lucide-react';

interface CampionatiViewProps {
  races: Race[];
  tracks: Track[];
  onSelectRace: (race: Race) => void;
  onBuyRaceDirect?: (race: Race) => void;
}

export const CampionatiView: React.FC<CampionatiViewProps> = ({
  races,
  tracks,
  onSelectRace,
  onBuyRaceDirect
}) => {
  // Extract all unique championship names from races
  const championshipList = useMemo(() => {
    const names = new Set<string>();
    races.forEach(r => {
      if (r.championshipName) {
        names.add(r.championshipName);
      }
    });
    // Default list if none
    if (names.size === 0) {
      names.add('Romagna Rental Karting Championship 2026');
      names.add('Misanino Cup 2026 Sprint');
      names.add('Misanino Cup 2026 Endurance');
    }
    return Array.from(names).sort();
  }, [races]);

  // Active selected championship
  const [selectedChampionship, setSelectedChampionship] = useState<string>(() => {
    // Prefer Romagna Rental Karting or Misanino Sprint if available, else first in list
    const found = championshipList.find(c => c.toLowerCase().includes('romagna') || c.toLowerCase().includes('misanino sprint'));
    return found || championshipList[0] || 'Misanino Cup 2026 Sprint';
  });

  // Filter tab inside championship view: 'future' | 'past' | 'all'
  const [filterMode, setFilterMode] = useState<'future' | 'past' | 'all'>('future');

  // Expanded results for past races (map of raceId -> boolean)
  const [expandedResults, setExpandedResults] = useState<{ [raceId: string]: boolean }>({});

  // Show championship standings modal / panel
  const [showStandingsTab, setShowStandingsTab] = useState<boolean>(false);

  // Get races for the currently selected championship
  const championshipRaces = useMemo(() => {
    return races.filter(r => r.championshipName === selectedChampionship);
  }, [races, selectedChampionship]);

  // Sort championship races chronologically
  const sortedRaces = useMemo(() => {
    return [...championshipRaces].sort((a, b) => a.date.localeCompare(b.date));
  }, [championshipRaces]);

  // Separate past vs future (Today is 2026-10-09)
  const TODAY_STR = '2026-10-09';
  const pastRaces = useMemo(() => {
    return sortedRaces.filter(r => r.status === 'Completed' || r.date < TODAY_STR);
  }, [sortedRaces]);

  const futureRaces = useMemo(() => {
    return sortedRaces.filter(r => r.status !== 'Completed' && r.date >= TODAY_STR);
  }, [sortedRaces]);

  // Auto-switch to past tab if championship has 0 future races (concluded)
  useEffect(() => {
    if (futureRaces.length === 0 && pastRaces.length > 0) {
      setFilterMode('past');
    } else if (filterMode === 'all') {
      setFilterMode('future');
    }
  }, [selectedChampionship, futureRaces.length, pastRaces.length]);

  // Summary list for all championships
  const championshipsSummary = useMemo(() => {
    return championshipList.map(champName => {
      const cRaces = races.filter(r => r.championshipName === champName);
      const cPast = cRaces.filter(r => r.status === 'Completed' || r.date < TODAY_STR);
      const cFuture = cRaces.filter(r => r.status !== 'Completed' && r.date >= TODAY_STR);
      const first = cRaces[0];
      return {
        name: champName,
        pastCount: cPast.length,
        futureCount: cFuture.length,
        total: cRaces.length,
        organizer: first?.organizerName || 'Organizzatore Ufficiale',
        format: first?.format || 'Sprint / Endurance',
        category: first?.category || 'Rental Kart',
        isCurrent: champName === selectedChampionship
      };
    });
  }, [championshipList, races, selectedChampionship]);

  // Displayed races based on sub-filter
  const displayedRaces = useMemo(() => {
    if (filterMode === 'past') return pastRaces;
    if (filterMode === 'future') return futureRaces;
    return sortedRaces;
  }, [sortedRaces, pastRaces, futureRaces, filterMode]);

  // Compute Championship Overview Info
  const firstRace = sortedRaces[0];
  const organizerName = firstRace?.organizerName || 'Organizzatore Ufficiale';
  const categoryLabel = firstRace?.category || 'Rental Kart 270cc / 390cc';
  const formatLabel = firstRace?.format || 'Sprint & Endurance';
  const totalRacesCount = firstRace?.totalChampionshipRaces || sortedRaces.length;
  const completedCount = pastRaces.length;
  const remainingCount = futureRaces.length;

  // Calculate Championship Drivers / Teams Standings dynamically from results
  const championshipStandings = useMemo(() => {
    const pointsMap: {
      [name: string]: {
        name: string;
        teamName?: string;
        points: number;
        wins: number;
        podiums: number;
        racesCount: number;
        bestPosition: number;
        isCurrentUser?: boolean;
      }
    } = {};

    pastRaces.forEach(race => {
      if (race.results) {
        race.results.forEach(res => {
          const key = res.driverName;
          if (!pointsMap[key]) {
            pointsMap[key] = {
              name: res.driverName,
              teamName: res.teamName,
              points: 0,
              wins: 0,
              podiums: 0,
              racesCount: 0,
              bestPosition: 99,
              isCurrentUser: res.isCurrentUser
            };
          }
          pointsMap[key].points += res.pointsEarned || (res.position === 1 ? 25 : res.position === 2 ? 20 : res.position === 3 ? 16 : 10);
          pointsMap[key].racesCount += 1;
          if (res.position === 1) pointsMap[key].wins += 1;
          if (res.position <= 3) pointsMap[key].podiums += 1;
          if (res.position < pointsMap[key].bestPosition) {
            pointsMap[key].bestPosition = res.position;
          }
        });
      }
    });

    return Object.values(pointsMap).sort((a, b) => b.points - a.points);
  }, [pastRaces]);

  const toggleExpandResults = (raceId: string) => {
    setExpandedResults(prev => ({
      ...prev,
      [raceId]: !prev[raceId]
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 pb-28 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-red-950 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 opacity-10 pointer-events-none">
          <Flag className="w-96 h-96 text-red-500" />
        </div>

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center space-x-2 bg-red-600/30 border border-red-500/40 text-red-300 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>HUB CAMPIONATI UFFICIALI KARTING</span>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              {championshipList.length} Campionati Disponibili
            </span>
          </div>

          <div className="space-y-1.5">
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white flex items-center gap-2">
              <Flag className="w-7 h-7 text-red-500 shrink-0" />
              <span>CAMPIONATI & TORNEI REGIONALI</span>
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Esplora tutti i campionati di Rental Karting disponibili e scopri le classifiche aggiornate e le prossime gare.
            </p>
          </div>

          {/* Dropdown Menu & Quick Championship Switcher */}
          <div className="pt-2 space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-red-400" />
                SELEZIONA CAMPIONATO DA APRIRE:
              </label>
              <span className="text-[10px] text-amber-300 font-bold uppercase">
                💡 Clicca su un campionato per aprire il suo Storico Gare o le Prossime Tappe
              </span>
            </div>

            <div className="relative max-w-2xl">
              <select
                value={selectedChampionship}
                onChange={(e) => {
                  setSelectedChampionship(e.target.value);
                  setShowStandingsTab(false);
                }}
                className="w-full bg-slate-800/90 hover:bg-slate-800 text-white font-extrabold text-sm md:text-base py-3.5 pl-4 pr-10 rounded-2xl border-2 border-red-500/60 focus:border-red-500 focus:outline-none shadow-lg cursor-pointer appearance-none uppercase transition-all"
              >
                {championshipList.map((champName) => (
                  <option key={champName} value={champName} className="bg-slate-900 text-white font-bold py-2">
                    🏆 {champName}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-5 h-5 text-red-400 absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Quick Championship Cards Scrollable Row */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1 pb-1">
              {championshipsSummary.map((c) => (
                <button
                  key={c.name}
                  onClick={() => {
                    setSelectedChampionship(c.name);
                    setShowStandingsTab(false);
                  }}
                  className={`px-3 py-2 rounded-xl text-left transition shrink-0 cursor-pointer border ${
                    c.isCurrent
                      ? 'bg-red-600/90 text-white border-red-400 shadow-md ring-2 ring-red-400/50'
                      : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700/80 hover:text-white'
                  }`}
                >
                  <div className="text-xs font-black truncate max-w-[200px] uppercase">
                    {c.name}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] mt-0.5 opacity-90">
                    <span className="font-extrabold text-emerald-300">📜 {c.pastCount} Nello Storico</span>
                    <span className="font-bold text-slate-300">• {c.futureCount} Future</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Selected Championship Hero Card & Stats */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-md bg-red-100 text-red-700 text-[10px] font-black uppercase tracking-wide">
                {formatLabel}
              </span>
              <span className="text-xs text-slate-500 font-bold uppercase">
                {organizerName}
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-slate-900">
              {selectedChampionship}
            </h2>
            <p className="text-xs text-slate-600 flex items-center gap-2">
              <Car className="w-3.5 h-3.5 text-red-600" />
              <span>Categoria Kart: <strong>{categoryLabel}</strong></span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setFilterMode('past');
                setShowStandingsTab(false);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition cursor-pointer border flex items-center space-x-2 shadow-sm ${
                filterMode === 'past' && !showStandingsTab
                  ? 'bg-emerald-600 text-white border-emerald-600 ring-2 ring-emerald-300'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
              }`}
            >
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>📜 APRI STORICO GARE ({completedCount})</span>
            </button>

            <button
              onClick={() => {
                setFilterMode('future');
                setShowStandingsTab(false);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition cursor-pointer border flex items-center space-x-2 shadow-sm ${
                filterMode === 'future' && !showStandingsTab
                  ? 'bg-blue-600 text-white border-blue-600 ring-2 ring-blue-300'
                  : 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200'
              }`}
            >
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>PROSSIME TAPPE ({remainingCount})</span>
            </button>

            <button
              onClick={() => setShowStandingsTab(!showStandingsTab)}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition cursor-pointer border flex items-center space-x-2 ${
                showStandingsTab
                  ? 'bg-amber-500 text-white border-amber-500 shadow-md'
                  : 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800'
              }`}
            >
              <Trophy className="w-4 h-4 text-amber-300" />
              <span>{showStandingsTab ? 'MOSTRA GARE' : 'CLASSIFICA GENERALE'}</span>
            </button>
          </div>
        </div>

        {/* Stats Grid - Clickable for quick navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-1">
          <div
            onClick={() => {
              setFilterMode('all');
              setShowStandingsTab(false);
            }}
            className="bg-slate-50 hover:bg-slate-100 p-3 rounded-xl border border-slate-200/80 text-center cursor-pointer transition"
          >
            <span className="text-[10px] text-slate-500 font-extrabold uppercase block">TAPPE TOTALI</span>
            <span className="text-lg font-black text-slate-900">{totalRacesCount}</span>
          </div>

          <div
            onClick={() => {
              setFilterMode('past');
              setShowStandingsTab(false);
            }}
            className="bg-emerald-50 hover:bg-emerald-100/80 p-3 rounded-xl border border-emerald-300/80 text-center cursor-pointer transition shadow-2xs group"
          >
            <span className="text-[10px] text-emerald-800 font-black uppercase flex items-center justify-center gap-1">
              <span>📜 STORICO GARE</span>
            </span>
            <span className="text-lg font-black text-emerald-900">{completedCount} Concluse</span>
            <span className="text-[9px] text-emerald-700 block font-bold group-hover:underline mt-0.5">Clicca per aprire lo storico</span>
          </div>

          <div
            onClick={() => {
              setFilterMode('future');
              setShowStandingsTab(false);
            }}
            className="bg-blue-50 hover:bg-blue-100/80 p-3 rounded-xl border border-blue-200/80 text-center cursor-pointer transition shadow-2xs group"
          >
            <span className="text-[10px] text-blue-800 font-black uppercase block">PROSSIME TAPPE</span>
            <span className="text-lg font-black text-blue-900">{remainingCount} In programma</span>
            <span className="text-[9px] text-blue-700 block font-bold group-hover:underline mt-0.5">Clicca per visualizzare</span>
          </div>

          <div className="bg-amber-50 p-3 rounded-xl border border-amber-200/80 text-center">
            <span className="text-[10px] text-amber-800 font-extrabold uppercase block">PROSSIMO EVENTO</span>
            <span className="text-xs font-black text-amber-900 truncate block mt-1">
              {futureRaces[0] ? `${futureRaces[0].date} @ ${futureRaces[0].trackName}` : 'Campionato Concluso'}
            </span>
          </div>
        </div>
      </div>

      {/* Standings Table View (If Toggled) */}
      {showStandingsTab && (
        <div className="bg-white border-2 border-amber-400 rounded-2xl p-5 shadow-lg space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <h3 className="text-base font-black uppercase text-slate-900">
                CLASSIFICA GENERALE CAMPIONATO - {selectedChampionship}
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Calcolata su {completedCount} tappe svolte
            </span>
          </div>

          {championshipStandings.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              Nessuna gara passata registrata per questo campionato ancora. Le classifiche verranno generate al termine del primo evento!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 uppercase text-[10px] font-black border-b border-slate-200">
                    <th className="py-2.5 px-3 rounded-tl-xl">POS</th>
                    <th className="py-2.5 px-3">PILOTA / SQUADRA</th>
                    <th className="py-2.5 px-3 text-center">GARE</th>
                    <th className="py-2.5 px-3 text-center">VITTORIE</th>
                    <th className="py-2.5 px-3 text-center">PODI</th>
                    <th className="py-2.5 px-3 text-right rounded-tr-xl">PUNTI TOT.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {championshipStandings.map((st, idx) => {
                    const pos = idx + 1;
                    const isTop1 = pos === 1;
                    const isTop2 = pos === 2;
                    const isTop3 = pos === 3;

                    return (
                      <tr
                        key={st.name}
                        className={`hover:bg-slate-50 transition ${
                          st.isCurrentUser ? 'bg-red-50/70 font-bold border-l-4 border-red-600' : ''
                        }`}
                      >
                        <td className="py-2.5 px-3 font-black text-slate-900">
                          {isTop1 && <span className="text-amber-500 font-extrabold flex items-center gap-1">🥇 1°</span>}
                          {isTop2 && <span className="text-slate-400 font-extrabold flex items-center gap-1">🥈 2°</span>}
                          {isTop3 && <span className="text-amber-700 font-extrabold flex items-center gap-1">🥉 3°</span>}
                          {!isTop1 && !isTop2 && !isTop3 && <span>{pos}°</span>}
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="flex flex-col">
                            <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                              {st.name}
                              {st.isCurrentUser && (
                                <span className="px-1.5 py-0.2 bg-red-600 text-white text-[9px] rounded font-black">
                                  TU
                                </span>
                              )}
                            </span>
                            {st.teamName && (
                              <span className="text-[10px] text-slate-500 font-medium">
                                Team: {st.teamName}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-slate-700">
                          {st.racesCount}
                        </td>
                        <td className="py-2.5 px-3 text-center font-extrabold text-amber-600">
                          {st.wins}
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-slate-700">
                          {st.podiums}
                        </td>
                        <td className="py-2.5 px-3 text-right font-black text-sm text-red-600">
                          {st.points} PTS
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Sub-Nav Filters: Future, Past (Storico), All */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-3 gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setFilterMode('future');
              setShowStandingsTab(false);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer uppercase tracking-wider flex items-center space-x-1.5 ${
              filterMode === 'future' && !showStandingsTab
                ? 'bg-blue-600 text-white shadow-sm font-black ring-2 ring-blue-300'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>PROSSIME GARE ({futureRaces.length})</span>
          </button>

          <button
            onClick={() => {
              setFilterMode('past');
              setShowStandingsTab(false);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer uppercase tracking-wider flex items-center space-x-1.5 ${
              filterMode === 'past' && !showStandingsTab
                ? 'bg-emerald-600 text-white shadow-sm font-black ring-2 ring-emerald-300'
                : 'bg-white text-emerald-800 border border-emerald-300 hover:bg-emerald-50'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>📜 STORICO GARE ({pastRaces.length} CONCLUSE)</span>
          </button>

          <button
            onClick={() => {
              setFilterMode('all');
              setShowStandingsTab(false);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer uppercase tracking-wider ${
              filterMode === 'all' && !showStandingsTab
                ? 'bg-slate-900 text-white shadow-sm font-black'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            TUTTE LE TAPPE ({sortedRaces.length})
          </button>
        </div>

        <span className="text-xs text-slate-500 hidden md:inline font-medium">
          {filterMode === 'past' ? 'Archivio storico gare completate' : 'Tappe ordinate cronologicamente'}
        </span>
      </div>

      {/* Storico Gare Header Banner when in past mode */}
      {filterMode === 'past' && !showStandingsTab && (
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border-2 border-emerald-500/50 rounded-2xl p-4 text-white shadow-md flex items-center justify-between flex-wrap gap-3 animate-fade-in">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <Trophy className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded bg-emerald-500/30 text-emerald-300 text-[10px] font-black uppercase tracking-wider">
                  ARCHIVIO UFFICIALE
                </span>
                <h3 className="font-black text-sm uppercase tracking-wide text-white">
                  STORICO GARE — {selectedChampionship}
                </h3>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Tutte le gare concluse antecedentemente ad oggi ({TODAY_STR}) con classifiche ufficiali, distacchi, tempi sul giro e punteggio valido per il campionato.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 bg-emerald-600/30 border border-emerald-400/40 text-emerald-300 rounded-xl text-xs font-black uppercase">
              📜 {pastRaces.length} Gare Nello Storico
            </span>
          </div>
        </div>
      )}

      {/* Display Races List */}
      {displayedRaces.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
          <Info className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-extrabold text-slate-800 uppercase">Nessuna gara trovata</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Non ci sono tappe corrispondenti al filtro selezionato per il campionato "{selectedChampionship}".
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {displayedRaces.map((race) => {
            const isCompleted = race.status === 'Completed' || race.date < TODAY_STR;
            const isExpanded = expandedResults[race.id] !== false; // expanded by default or toggled
            const trackObj = tracks.find(t => t.id === race.trackId);

            return (
              <div
                key={race.id}
                className={`bg-white border rounded-2xl shadow-sm overflow-hidden transition-all duration-200 ${
                  isCompleted
                    ? 'border-emerald-200 hover:border-emerald-300'
                    : 'border-slate-200/80 hover:border-slate-300'
                }`}
              >
                {/* Race Header Banner */}
                <div className={`p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b ${
                  isCompleted ? 'bg-emerald-50/50 border-emerald-100' : 'bg-slate-50/60 border-slate-100'
                }`}>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                        isCompleted
                          ? 'bg-emerald-600 text-white'
                          : 'bg-red-600 text-white'
                      }`}>
                        {isCompleted ? '📜 STORICO • TAPPA CONCLUSA' : 'PROSSIMO EVENTO'}
                      </span>

                      {race.championshipRound && (
                        <span className="px-2.5 py-0.5 rounded-md bg-slate-900 text-white text-[10px] font-extrabold uppercase">
                          TAPPA #{race.championshipRound}
                        </span>
                      )}

                      <span className="text-xs font-extrabold text-slate-600 uppercase flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-red-600" />
                        {race.trackName} ({race.trackRegion})
                      </span>
                    </div>

                    <h3 className="text-lg md:text-xl font-black uppercase tracking-tight text-slate-900">
                      {race.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 pt-0.5">
                      <span className="flex items-center gap-1 font-bold">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        Data: {race.date} ore {race.time}
                      </span>
                      <span className="flex items-center gap-1 font-bold">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        Formato: {race.durationLabel}
                      </span>
                      <span className="flex items-center gap-1 font-bold">
                        <Euro className="w-3.5 h-3.5 text-emerald-600" />
                        Quota: €{race.entryFee}
                      </span>
                    </div>
                  </div>

                  {/* Header Actions */}
                  <div className="flex items-center space-x-2 shrink-0">
                    {isCompleted ? (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onSelectRace(race)}
                          className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold uppercase transition cursor-pointer border border-slate-200"
                          title="Vedi scheda completa e dettagli pista"
                        >
                          INFO TAPPA
                        </button>
                        <button
                          onClick={() => toggleExpandResults(race.id)}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold uppercase transition cursor-pointer flex items-center space-x-1.5 shadow-sm"
                        >
                          <Trophy className="w-3.5 h-3.5" />
                          <span>{isExpanded ? 'NASCONDI ORDINE ARRIVO' : 'VEDI ORDINE ARRIVO'}</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => onSelectRace(race)}
                        className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold uppercase transition cursor-pointer flex items-center space-x-1.5 shadow-md"
                      >
                        <span>INFO & ISCRIVITI</span>
                        <ChevronDown className="w-3.5 h-3.5 -rotate-90" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-4 md:p-5 space-y-4">
                  {/* Podium Preview if Completed */}
                  {isCompleted && race.results && race.results.length >= 3 && (
                    <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="text-base">🏆</span>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                          <span className="font-extrabold text-slate-900">
                            🥇 1° <strong className="text-emerald-800">{race.results[0].driverName}</strong> ({race.results[0].teamName || 'Solo'})
                          </span>
                          <span className="font-medium text-slate-700">
                            🥈 2° {race.results[1].driverName}
                          </span>
                          <span className="font-medium text-slate-700">
                            🥉 3° {race.results[2].driverName}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        Giro Veloce: {race.results[0].bestLapFormatted || '58.2s'}
                      </span>
                    </div>
                  )}

                  {/* Race Description & Key Info Badges */}
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {race.description}
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 text-xs pt-1">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] text-slate-500 font-extrabold uppercase block">CATEGORIA KART</span>
                      <span className="font-extrabold text-slate-900">{race.category}</span>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] text-slate-500 font-extrabold uppercase block">PIT STOP OBBLIGATORI</span>
                      <span className="font-extrabold text-slate-900">{race.mandatoryPitStops ?? 0} Cambi Box</span>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] text-slate-500 font-extrabold uppercase block">ZAVORRA MINIMA</span>
                      <span className="font-extrabold text-slate-900">{race.minWeightKg ?? 80} kg</span>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] text-slate-500 font-extrabold uppercase block">METEO PREVISTO</span>
                      <span className="font-extrabold text-slate-900">{race.weatherForecast || 'Soleggiato • 25°C'}</span>
                    </div>
                  </div>

                  {/* IS COMPLETED -> SHOW RESULTS TABLE (ORDINE DI ARRIVO) */}
                  {isCompleted && isExpanded && (
                    <div className="pt-2 space-y-3 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Trophy className="w-4 h-4 text-amber-500" />
                          <h4 className="text-xs font-black uppercase text-slate-900">
                            ORDINE DI ARRIVO & RISULTATI UFFICIALI (TAPPA #{race.championshipRound || 1})
                          </h4>
                        </div>
                        <span className="text-[11px] text-slate-500 font-medium">
                          Cronometraggio Ufficiale Apex Timing
                        </span>
                      </div>

                      {race.results && race.results.length > 0 ? (
                        <div className="overflow-x-auto rounded-xl border border-slate-200">
                          <table className="w-full text-left text-xs">
                            <thead>
                              <tr className="bg-slate-900 text-white uppercase text-[10px] font-black">
                                <th className="py-2.5 px-3">POS</th>
                                <th className="py-2.5 px-3">PILOTA / SQUADRA</th>
                                <th className="py-2.5 px-3 text-center">N. KART</th>
                                <th className="py-2.5 px-3 text-center">GIRI</th>
                                <th className="py-2.5 px-3 text-center">GIRO VELOCE</th>
                                <th className="py-2.5 px-3 text-center">TEMPO / DISTACCO</th>
                                <th className="py-2.5 px-3 text-right">PUNTI</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium">
                              {race.results.map((res) => {
                                const is1 = res.position === 1;
                                const is2 = res.position === 2;
                                const is3 = res.position === 3;

                                return (
                                  <tr
                                    key={res.position}
                                    className={`hover:bg-slate-50 transition ${
                                      res.isCurrentUser ? 'bg-red-50/80 font-bold border-l-4 border-red-600' : ''
                                    }`}
                                  >
                                    <td className="py-2 px-3 font-black text-slate-900">
                                      {is1 && <span className="text-amber-500 font-black">🥇 1°</span>}
                                      {is2 && <span className="text-slate-400 font-black">🥈 2°</span>}
                                      {is3 && <span className="text-amber-700 font-black">🥉 3°</span>}
                                      {!is1 && !is2 && !is3 && <span>{res.position}°</span>}
                                    </td>
                                    <td className="py-2 px-3">
                                      <div className="flex flex-col">
                                        <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                                          {res.driverName}
                                          {res.isCurrentUser && (
                                            <span className="px-1.5 py-0.2 bg-red-600 text-white text-[9px] rounded font-black">
                                              TU
                                            </span>
                                          )}
                                        </span>
                                        {res.teamName && (
                                          <span className="text-[10px] text-slate-500">
                                            Team: {res.teamName}
                                          </span>
                                        )}
                                      </div>
                                    </td>
                                    <td className="py-2 px-3 text-center font-bold text-slate-700">
                                      #{res.kartNumber || (res.position * 3 + 4)}
                                    </td>
                                    <td className="py-2 px-3 text-center font-bold text-slate-700">
                                      {res.lapsCompleted || 120}
                                    </td>
                                    <td className="py-2 px-3 text-center font-mono font-bold text-slate-800">
                                      {res.bestLapFormatted || '0:58.420'}
                                    </td>
                                    <td className="py-2 px-3 text-center font-mono text-slate-600">
                                      {res.totalTimeFormatted || res.gapFormatted || 'LEADER'}
                                    </td>
                                    <td className="py-2 px-3 text-right font-black text-red-600">
                                      +{res.pointsEarned || (is1 ? 25 : is2 ? 20 : is3 ? 16 : 10)}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs text-slate-500">
                          Risultati in fase di omologazione da parte dell'organizzazione {race.organizerName}.
                        </div>
                      )}
                    </div>
                  )}

                  {/* IS FUTURE -> SHOW SLOTS, DEADLINE & DIRECT REGISTER BUTTON */}
                  {!isCompleted && (
                    <div className="pt-2 space-y-3 border-t border-slate-100">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2 text-xs font-extrabold text-slate-700">
                            <Users className="w-4 h-4 text-red-600" />
                            <span>ISCRITTI IN GRIGLIA: {race.registeredTeamsCount} / {race.maxGridSize} SQUADRE</span>
                          </div>
                          <div className="w-48 bg-slate-200 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-red-600 h-full rounded-full"
                              style={{ width: `${Math.min(100, (race.registeredTeamsCount / race.maxGridSize) * 100)}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => onSelectRace(race)}
                            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-extrabold uppercase transition cursor-pointer"
                          >
                            SCHEDA DETTAGLI
                          </button>

                          {onBuyRaceDirect && (
                            <button
                              onClick={() => onBuyRaceDirect(race)}
                              className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider transition cursor-pointer shadow-md flex items-center space-x-1.5"
                            >
                              <span>ACQUISTA POSTO IN GRIGLIA (€{race.entryFee})</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
