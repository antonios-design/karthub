import React, { useState } from 'react';
import { Race, Track, DriverProfile, Organizer } from '../types';
import { 
  Trophy, 
  Calendar, 
  MapPin, 
  Flag, 
  Users, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Radio, 
  ChevronRight, 
  LogIn, 
  UserPlus, 
  Zap, 
  Compass, 
  Award, 
  Timer,
  CheckCircle2,
  Lock,
  Mail,
  User,
  Activity,
  Search
} from 'lucide-react';
import { TabType } from './BottomNav';
import { playRevSound } from '../lib/audio';

interface HomeLandingViewProps {
  races: Race[];
  tracks: Track[];
  organizers: Organizer[];
  demoUsers: DriverProfile[];
  isLoggedIn: boolean;
  currentUser: DriverProfile | null;
  onOpenLogin: (mode?: 'login' | 'register') => void;
  onLoginSuccess: (user: DriverProfile) => void;
  onSelectRace: (race: Race) => void;
  onNavigateTab: (tab: TabType) => void;
  onOpenApexLive: () => void;
  onQuickDemoLogin: (user: DriverProfile) => void;
}

export const HomeLandingView: React.FC<HomeLandingViewProps> = ({
  races,
  tracks,
  organizers,
  demoUsers,
  isLoggedIn,
  currentUser,
  onOpenLogin,
  onLoginSuccess,
  onSelectRace,
  onNavigateTab,
  onOpenApexLive,
  onQuickDemoLogin
}) => {
  const TODAY_STR = '2026-10-09';

  // Filter category state for featured races
  const [raceCategory, setRaceCategory] = useState<'ALL' | 'Endurance' | 'Sodi' | 'Sprint' | '2T'>('ALL');

  // Filtered upcoming races (hiding past races prior to today)
  const upcomingRaces = races.filter(race => {
    if (race.date < TODAY_STR) return false;
    if (raceCategory === 'Endurance') return race.format.toLowerCase().includes('endurance') || race.title.toLowerCase().includes('endurance');
    if (raceCategory === 'Sodi') return race.organizerName.toLowerCase().includes('sodi') || race.title.toLowerCase().includes('sws');
    if (raceCategory === 'Sprint') return race.format.toLowerCase().includes('sprint') || race.title.toLowerCase().includes('sprint');
    if (raceCategory === '2T') return race.title.toLowerCase().includes('rotax') || race.title.toLowerCase().includes('championkart') || race.kartType?.toLowerCase().includes('2t');
    return true;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Top next race for hero spotlight
  const nextMainRace = upcomingRaces[0];

  // Featured top tracks
  const featuredTracks = tracks.slice(0, 4);

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen selection:bg-red-600 selection:text-white font-sans">
      
      {/* 1. HERO SECTION (White / Light Motorsport Theme matching Campionati, Gare & Community) */}
      <section className="relative overflow-hidden pt-8 pb-14 lg:pt-12 lg:pb-20 border-b border-slate-200/90 bg-white">
        {/* Ambient Motorsport Subtleties */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/5 pointer-events-none blur-3xl -z-10" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/5 pointer-events-none blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top Pill Announcement */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="inline-flex items-center space-x-2 bg-slate-100 border border-slate-200/90 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide text-slate-700 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-red-600 animate-ping mr-0.5" />
              <span className="text-red-600 uppercase font-black">🇮🇹 KARTHUB ITALIA</span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-600 font-medium">Il Portale del Rental Karting Italiano</span>
            </div>

            <button
              onClick={onOpenApexLive}
              className="inline-flex items-center space-x-2 bg-red-50 hover:bg-red-100 border border-red-200 px-3.5 py-1.5 rounded-full text-xs font-bold text-red-600 transition cursor-pointer shadow-sm"
            >
              <Radio className="w-3.5 h-3.5 text-red-600 animate-pulse" />
              <span>APEX TIMING LIVE STREAM</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Headline & Calls to action */}
            <div className="lg:col-span-7 space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black italic tracking-tight uppercase leading-[1.05] text-slate-900">
                TUTTO IL RENTAL KARTING.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 block sm:inline">
                  IN UN UNICO PADDOCK.
                </span>
              </h1>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
                Trova la tua prossima gara, scopri le piste convenzionate e confronta i tuoi tempi sul giro con cronometraggio ufficiale.
              </p>

              {/* Action Buttons: Solo Entra in Pista, Crea Account e Consulta Calendario */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {!isLoggedIn ? (
                  <>
                    <button
                      onClick={() => onOpenLogin('login')}
                      className="px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-sm tracking-wide uppercase transition shadow-md shadow-red-600/25 flex items-center space-x-2 cursor-pointer active:scale-95"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>ENTRA IN PISTA</span>
                    </button>
                    
                    <button
                      onClick={() => onOpenLogin('register')}
                      className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-extrabold text-sm tracking-wide uppercase transition flex items-center space-x-2 cursor-pointer active:scale-95 shadow-sm"
                    >
                      <UserPlus className="w-4 h-4 text-red-600" />
                      <span>CREA ACCOUNT</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => onNavigateTab('garage')}
                    className="px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-sm tracking-wide uppercase transition shadow-md shadow-red-600/25 flex items-center space-x-2 cursor-pointer"
                  >
                    <User className="w-4 h-4" />
                    <span>IL TUO GARAGE PILOTA ({currentUser?.nickname})</span>
                  </button>
                )}

                <button
                  onClick={() => onNavigateTab('calendar')}
                  className="px-5 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200/90 text-slate-700 hover:text-slate-900 font-bold text-sm transition flex items-center space-x-1.5 cursor-pointer shadow-sm"
                >
                  <Calendar className="w-4 h-4 text-amber-500" />
                  <span>CONSULTA CALENDARIO GARE</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              {/* Highlight Pillars (Reali, senza dati o statistiche inventate) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-5 border-t border-slate-200/80">
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-center space-x-3 shadow-sm">
                  <div className="w-9 h-9 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                    <Flag className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-black uppercase text-slate-900">Gare Rental</div>
                    <div className="text-[11px] text-slate-500 font-medium">Endurance & Sprint Cup</div>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-center space-x-3 shadow-sm">
                  <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                    <Radio className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-black uppercase text-slate-900">Apex Timing</div>
                    <div className="text-[11px] text-slate-500 font-medium">Tempi e Live Timing</div>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-center space-x-3 shadow-sm">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-black uppercase text-slate-900">Circuiti Nazionali</div>
                    <div className="text-[11px] text-slate-500 font-medium">Piste convenzionate</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Prossima Gara Reale in Paddock con Immagine Pista in Background */}
            <div className="lg:col-span-5">
              {nextMainRace ? (() => {
                const heroTrack = tracks.find(t => t.id === nextMainRace.trackId);
                const heroTrackImg = heroTrack?.heroImageUrl || 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80';
                return (
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-lg relative overflow-hidden group">
                    {/* Track Background Image (subtle underlay without covering text) */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 pointer-events-none opacity-20"
                      style={{ backgroundImage: `url(${heroTrackImg})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/90 to-white/75 pointer-events-none" />
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-amber-500 to-rose-600" />
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-red-100 border border-red-200 text-[10px] font-black uppercase text-red-600 tracking-wider">
                          <Flag className="w-3 h-3" />
                          <span>PROSSIMA GARA IN PROGRAMMA</span>
                        </div>
                        <span className="text-xs font-mono font-bold text-slate-500">
                          {new Date(nextMainRace.date).toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
                        </span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight mb-2">
                        {nextMainRace.title}
                      </h3>

                      <div className="flex items-center space-x-1.5 text-xs text-slate-600 mb-5">
                        <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
                        <span className="font-extrabold text-slate-800">{nextMainRace.trackName}</span>
                        <span className="text-slate-500">({nextMainRace.trackRegion})</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs bg-white/90 backdrop-blur-sm p-3.5 rounded-2xl border border-slate-200/90 shadow-sm mb-5">
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase font-bold block">FORMAT GARA</span>
                          <span className="font-extrabold text-slate-900 text-xs">{nextMainRace.format}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase font-bold block">QUOTA ISCRIZIONE</span>
                          <span className="font-extrabold text-red-600 text-sm">€{nextMainRace.entryFee}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => onSelectRace(nextMainRace)}
                          className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase transition text-center cursor-pointer border border-slate-200"
                        >
                          Scheda Gara
                        </button>
                        <button
                          onClick={onOpenApexLive}
                          className="py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase transition text-center cursor-pointer flex items-center justify-center space-x-1.5 shadow-sm shadow-red-600/30"
                        >
                          <Radio className="w-3.5 h-3.5" />
                          <span>Live Timing</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })() : (
                <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-lg relative overflow-hidden text-center py-10 space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 uppercase">CALENDARIO IN AGGIORNAMENTO</h3>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Esplora la mappa dei circuiti o accedi per gestire il tuo profilo pilota.
                  </p>
                  <button
                    onClick={() => onNavigateTab('calendar')}
                    className="py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase rounded-xl transition cursor-pointer shadow-sm"
                  >
                    Vedi Calendario Completo
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* 2. PROSSIME GARE IN EVIDENZA (Featured Races & Filters con Immagine Pista in Background) */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-200/90">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-red-600 text-xs font-black uppercase tracking-widest mb-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>CALENDARIO GARE 2026</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-slate-900 tracking-tight">
              PROSSIME GARE IN PROGRAMMA
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Solo gare con data odierna o futura. Esplora le disponibilità in griglia e i dettagli del tracciato.
            </p>
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
            {[
              { id: 'ALL', label: 'TUTTE' },
              { id: 'Endurance', label: 'ENDURANCE' },
              { id: 'Sodi', label: 'SODI SWS' },
              { id: 'Sprint', label: 'SPRINT' },
              { id: '2T', label: '2T AGONISTICI' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setRaceCategory(cat.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition cursor-pointer ${
                  raceCategory === cat.id
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Races Grid con Foto del Tracciato in sottofondo al riquadro (senza coprire le scritte) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingRaces.slice(0, 6).map((race) => {
            const track = tracks.find(t => t.id === race.trackId);
            const trackImg = track?.heroImageUrl || 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80';

            return (
              <div 
                key={race.id}
                className="bg-white hover:border-red-300 border border-slate-200/90 rounded-3xl p-5 transition flex flex-col justify-between group shadow-sm hover:shadow-md relative overflow-hidden"
              >
                {/* Immagine Pista in Sottofondo (Background fotografico leggero che non copre i testi) */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 pointer-events-none opacity-[0.14]"
                  style={{ backgroundImage: `url(${trackImg})` }}
                />
                {/* Filtro sfumato per garantire massima leggibilità dei testi */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/95 to-white pointer-events-none" />

                {/* Contenuto in primo piano */}
                <div className="relative z-10 space-y-4">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-extrabold text-[11px] border border-slate-200">
                      {race.format}
                    </span>
                    <span className="font-mono text-red-600 font-extrabold text-xs">
                      {new Date(race.date).toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
                    </span>
                  </div>

                  {/* Title & Track */}
                  <div>
                    <h3 className="text-lg font-black text-slate-900 group-hover:text-red-600 transition leading-snug">
                      {race.title}
                    </h3>
                    <div className="flex items-center space-x-1.5 text-xs text-slate-600 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
                      <span className="truncate font-semibold">{race.trackName} ({race.trackRegion})</span>
                    </div>
                  </div>

                  {/* Race Specs */}
                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50/90 backdrop-blur-sm p-3 rounded-2xl border border-slate-200/80 shadow-inner">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">QUOTA PILOTA</span>
                      <span className="font-black text-red-600 text-sm">€{race.entryFee}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">FORMAT</span>
                      <span className="font-bold text-slate-800 text-xs">
                        {race.format.toLowerCase().includes('endurance') ? 'Endurance Team' : 'Gara Singola Sprint'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="relative z-10 mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSelectRace(race)}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase transition text-center cursor-pointer border border-slate-200"
                  >
                    Dettagli Gara
                  </button>

                  <button
                    onClick={() => {
                      if (!isLoggedIn) {
                        onOpenLogin('login');
                      } else {
                        onSelectRace(race);
                      }
                    }}
                    className="py-2 px-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase transition cursor-pointer shadow-sm"
                  >
                    {isLoggedIn ? 'Iscriviti' : 'Accedi per iscriverti'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* View all races button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => onNavigateTab('calendar')}
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-sm"
          >
            <span>VEDI TUTTE LE GARE NEL CALENDARIO UFFICIALE</span>
            <ArrowRight className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </section>

      {/* 3. I GRANDI CAMPIONATI & TROFEI (Championship Spotlight) */}
      <section className="py-14 bg-white border-b border-slate-200/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center space-x-1.5 text-amber-600 text-xs font-black uppercase tracking-widest mb-1">
                <Trophy className="w-3.5 h-3.5" />
                <span>SERIE & TROFEI NAZIONALI</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black uppercase text-slate-900 tracking-tight">
                I CAMPIONATI UFFICIALI DEL PADDOCK
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">
                Classifiche a punti, montepremi e trofei monomarca per piloti amatoriali e team agonisti.
              </p>
            </div>

            <button
              onClick={() => onNavigateTab('championships')}
              className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center space-x-1 self-start md:self-auto cursor-pointer"
            >
              <span>Vedi tutti i campionati & storico</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                id: 'champ-sws',
                title: 'Sodi World Series (SWS)',
                category: 'Sprint & Endurance Cup',
                organizer: 'Sodi Kart & Piste Partner',
                badge: 'Ranking Internazionale',
                badgeColor: 'bg-red-50 text-red-700 border-red-200',
                rounds: 'Circuito Ufficiale SWS',
                desc: 'Il circuito mondiale rental più prestigioso. Punti validi per le finali internazionali Sodi SWS.'
              },
              {
                id: 'champ-pomposa',
                title: 'Pomposa Endurance Series',
                category: 'Endurance 6H / 12H / 24H',
                organizer: 'Circuito di Pomposa',
                badge: 'Serie Leggendaria',
                badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
                rounds: 'Gare di Durata',
                desc: 'La regina delle gare di durata in Italia. Cambio pilota, rifornimenti e telemetria al millesimo.'
              },
              {
                id: 'champ-ck',
                title: 'ChampionKart Series',
                category: 'Competizione Monomarca',
                organizer: 'Parolin Motorsport',
                badge: 'Motori 2T Competizione',
                badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                rounds: 'Trofeo Monomarca',
                desc: 'Adrenalina da vero kart da gara ad armi pari su telai Parolin e motori ad alte prestazioni.'
              },
              {
                id: 'champ-tbkart',
                title: 'TBkart Sprint & Night Cup',
                category: 'Rental 390cc & 4T',
                organizer: 'TBkart Racing Group',
                badge: 'Piste del Nord Italia',
                badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
                rounds: 'Gare Sprint 4T',
                desc: 'Gare sprint serrate con zavorra di livellamento peso e qualifiche ufficiali Apex Timing.'
              }
            ].map(champ => (
              <div 
                key={champ.id}
                className="bg-white border border-slate-200/90 rounded-3xl p-5 hover:border-slate-300 transition flex flex-col justify-between shadow-sm"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${champ.badgeColor}`}>
                      {champ.badge}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500">{champ.rounds}</span>
                  </div>

                  <div>
                    <h3 className="text-base font-black text-slate-900">{champ.title}</h3>
                    <p className="text-xs text-red-600 font-bold">{champ.category}</p>
                    <p className="text-[11px] text-slate-500">{champ.organizer}</p>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {champ.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100">
                  <button
                    onClick={() => onNavigateTab('championships')}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold uppercase transition cursor-pointer border border-slate-200"
                  >
                    Vedi Classifica & Gare
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. I CIRCUITI PARTNER D'ITALIA (Featured Tracks) */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-200/90">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-emerald-600 text-xs font-black uppercase tracking-widest mb-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>CIRCUITI D'ITALIA</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-slate-900 tracking-tight">
              LE PISTE DEL PADDOCK
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Esplora i migliori circuiti convenzionati, lunghezza tracciato, flotta kart e tempi record.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('map')}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-xs font-bold text-slate-800 uppercase transition cursor-pointer shadow-sm"
          >
            <Compass className="w-4 h-4 text-emerald-600" />
            <span>APRI MAPPA INTERATTIVA PISTE</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredTracks.map(track => (
            <div 
              key={track.id}
              className="bg-white border border-slate-200/90 hover:border-slate-300 rounded-3xl p-5 transition flex flex-col justify-between group shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[11px] font-bold text-slate-500">{track.region}</span>
                  <span className="font-mono text-emerald-600 font-bold">{track.lengthMeters} metri</span>
                </div>

                <div>
                  <h3 className="text-base font-black text-slate-900 group-hover:text-red-600 transition">
                    {track.name}
                  </h3>
                  <p className="text-xs text-slate-500">{track.city}</p>
                </div>

                <div className="space-y-1.5 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Flotta:</span>
                    <span className="text-slate-800 font-bold">{track.rentalFleet}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Cronometraggio:</span>
                    <span className="text-red-600 font-bold">{track.timingSystem}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Best Lap Pista:</span>
                    <span className="text-amber-600 font-mono font-bold">{track.bestLapTime}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100">
                <button
                  onClick={() => onNavigateTab('map')}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold uppercase transition cursor-pointer border border-slate-200"
                >
                  Visualizza Scheda Pista
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. PERCHÉ UNIRTI A KARTHUB? (Platform Features Pillars) */}
      <section className="py-16 bg-white border-b border-slate-200/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-black uppercase tracking-widest text-red-600">
              TECNOLOGIA & COMMUNITY
            </span>
            <h2 className="text-3xl font-black uppercase text-slate-900 mt-1">
              PERCHÉ SCEGLIERE KARTHUB ITALIA?
            </h2>
            <p className="text-slate-500 text-sm mt-2">
              Costruito da piloti per piloti. Tutti gli strumenti necessari per la tua stagione agonistica.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 space-y-3 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-red-100 border border-red-200 text-red-600 flex items-center justify-center">
                <Timer className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">Apex Timing Ufficiale</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Collegamento in tempo reale con i transponder di pista. I tuoi tempi sul giro, gap e settori salvati automaticamente.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 space-y-3 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-200 text-amber-600 flex items-center justify-center">
                <Trophy className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">Star Points & Ranking</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Guadagna punti ad ogni partecipazione e piazzamento. Converti i punti in voucher sconti per i tuoi turni noleggio.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 space-y-3 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-200 text-emerald-600 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">Bacheca Trova-Squadra</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Cerchi un compagno per una 6H Endurance? O ti manca un pilota per la tua squadra? Trova equipaggi nella community.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 space-y-3 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 border border-sky-200 text-sky-600 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">Stemma & Garage Pilota</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Personalizza il tuo stemma araldico, equipaggia i badge di categoria e mostra il tuo palmarès nel tuo profilo pubblico.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. BOTTOM CALL TO ACTION BANNER (Matching Campionati style banner) */}
      <section className="py-16 max-w-5xl mx-auto px-4 text-center">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-red-950 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
              PRONTO A SCENDERE IN PISTA?
            </h2>
            <p className="text-slate-300 text-sm">
              Crea il tuo profilo pilota gratuito oggi stesso, iscriviti alle prossime gare e scala la classifica nazionale KartHub.
            </p>

            <div className="pt-4 flex flex-wrap justify-center gap-3">
              {!isLoggedIn ? (
                <>
                  <button
                    onClick={() => onOpenLogin('login')}
                    className="px-6 py-3.5 bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-red-600/30 cursor-pointer flex items-center space-x-2"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>ENTRA IN PISTA</span>
                  </button>
                  <button
                    onClick={() => onOpenLogin('register')}
                    className="px-6 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer flex items-center space-x-2"
                  >
                    <UserPlus className="w-4 h-4 text-red-400" />
                    <span>CREA ACCOUNT</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => onNavigateTab('calendar')}
                  className="px-6 py-3.5 bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider rounded-xl transition cursor-pointer shadow-lg"
                >
                  SCOPRI TUTTE LE GARE IN CALENDARIO
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="border-t border-slate-200 py-10 bg-white text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-black text-slate-900 italic text-base">KART<span className="text-red-600">HUB</span></span>
            <span>• Piattaforma Motorsport Karting Italia © 2026</span>
          </div>

          <div className="flex items-center space-x-6 text-slate-600">
            <button onClick={() => onNavigateTab('home')} className="hover:text-red-600 transition cursor-pointer">Home</button>
            <button onClick={() => onNavigateTab('championships')} className="hover:text-red-600 transition cursor-pointer">Campionati</button>
            <button onClick={() => onNavigateTab('calendar')} className="hover:text-red-600 transition cursor-pointer">Calendario</button>
            <button onClick={() => onNavigateTab('map')} className="hover:text-red-600 transition cursor-pointer">Piste</button>
            <button onClick={() => onNavigateTab('feed')} className="hover:text-red-600 transition cursor-pointer">Community</button>
          </div>
        </div>
      </footer>

    </div>
  );
};
