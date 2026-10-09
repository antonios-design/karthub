import React, { useState } from 'react';
import { Organizer, Race, Track } from '../types';
import { Shield, RefreshCw, Plus, CheckCircle, AlertTriangle, Terminal, Trash2, Edit2, Globe, ExternalLink, Download, FolderArchive } from 'lucide-react';

interface AdminPitWallViewProps {
  organizers: Organizer[];
  races: Race[];
  tracks: Track[];
  onTriggerScrape: () => void;
  isScraping: boolean;
  onAddRace: (newRace: Partial<Race>) => void;
  onDeleteRace: (raceId: string) => void;
  scrapeLogs: Array<{ id: string; timestamp: string; organizerName: string; status: string; racesFound: number; details: string }>;
  onOpenExportCode?: () => void;
}

export const AdminPitWallView: React.FC<AdminPitWallViewProps> = ({
  organizers,
  races,
  tracks,
  onTriggerScrape,
  isScraping,
  onAddRace,
  onDeleteRace,
  scrapeLogs,
  onOpenExportCode
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [organizerId, setOrganizerId] = useState(organizers[0]?.id || 'org-rrk');
  const [trackId, setTrackId] = useState(tracks[0]?.id || 'track-pomposa');
  const [date, setDate] = useState('2026-09-15');
  const [time, setTime] = useState('18:00');
  const [format, setFormat] = useState<'Endurance' | 'Sprint' | 'Ironman'>('Endurance');
  const [category, setCategory] = useState('Sodi RT8 390cc');
  const [entryFee, setEntryFee] = useState(250);
  const [registrationUrl, setRegistrationUrl] = useState('https://www.circuitodipomposa.com');
  const [description, setDescription] = useState('');

  const handleManualAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const DEFAULT_ORG = { id: 'org-default', name: 'Organizzatore' };
    const DEFAULT_TRACK = { id: 'track-default', name: 'Circuito', region: 'IT' };
    const selOrg = organizers.find(o => o.id === organizerId) || organizers[0] || DEFAULT_ORG;
    const selTrack = tracks.find(t => t.id === trackId) || tracks[0] || DEFAULT_TRACK;

    onAddRace({
      title,
      organizerId: selOrg.id,
      organizerName: selOrg.name,
      trackId: selTrack.id,
      trackName: selTrack.name,
      trackRegion: selTrack.region,
      date,
      time,
      format,
      category,
      entryFee,
      registeredTeamsCount: 4,
      maxGridSize: 24,
      registrationDeadline: date,
      registrationUrl,
      description: description || 'Manual admin override race entry.'
    });

    setShowAddModal(false);
    setTitle('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 pb-24 space-y-6 text-white font-sans">
      {/* Top Banner */}
      <div className="bg-[#121620] border border-orange-500/50 rounded-3xl p-5 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Shield className="w-6 h-6 text-orange-500" />
            <h1 className="font-mono text-xl font-black uppercase text-white tracking-wide">
              PIT WALL ADMIN & ITALIAN DATA SCRAPER ENGINE
            </h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1 font-sans">
            Manage automated web aggregators, override scraped listings, and manually register custom races.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {onOpenExportCode && (
            <button
              onClick={onOpenExportCode}
              className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-mono text-xs font-bold rounded-2xl border border-blue-400/40 shadow-lg transition flex items-center space-x-1.5 cursor-pointer"
              title="Esporta il codice sorgente del prototipo (.ZIP)"
            >
              <FolderArchive className="w-4 h-4 text-white" />
              <span>ESPORTA CODICE (.ZIP)</span>
            </button>
          )}

          <button
            onClick={onTriggerScrape}
            disabled={isScraping}
            className="px-4 py-2.5 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-mono text-xs font-bold rounded-2xl shadow-lg border border-orange-400/40 transition flex items-center space-x-2 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isScraping ? 'animate-spin' : ''}`} />
            <span>{isScraping ? 'SCRAPING ALL SITES...' : 'RUN LIVE SCRAPER SYNC'}</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-mono text-xs font-bold rounded-2xl border border-zinc-700 transition flex items-center space-x-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-orange-400" />
            <span>MANUAL RACE OVERRIDE</span>
          </button>
        </div>
      </div>

      {/* Organizers Status Grid */}
      <div className="space-y-3">
        <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-orange-400 flex items-center">
          <Globe className="w-4 h-4 mr-1.5" />
          CONNECTED ITALIAN GO-KART ORGANIZERS ({organizers.length})
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {organizers.map(org => (
            <div key={org.id} className="bg-[#121620] border border-zinc-800 rounded-2xl p-3.5 space-y-2 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-white truncate">{org.name}</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  ONLINE
                </span>
              </div>

              <p className="text-[11px] text-zinc-400 font-sans">{org.regionCovered}</p>

              <div className="pt-1 border-t border-zinc-800/80 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                <span>Last Sync: {org.lastScrapedAt}</span>
                <a href={org.website} target="_blank" rel="noreferrer" className="hover:text-orange-400">
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scraper Terminal Output Logs */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-4 space-y-3 font-mono">
        <div className="flex items-center space-x-2 text-xs font-bold text-orange-400 uppercase">
          <Terminal className="w-4 h-4" />
          <span>SCRAPER LOG HISTORY TERMINAL</span>
        </div>

        <div className="bg-black/90 rounded-2xl p-3 text-[11px] text-zinc-300 space-y-1.5 max-h-48 overflow-y-auto font-mono">
          {scrapeLogs.map(log => (
            <div key={log.id} className="flex items-start space-x-2 border-b border-zinc-900 pb-1">
              <span className="text-zinc-500 shrink-0">[{log.timestamp.substring(11, 19)}]</span>
              <span className="text-emerald-400 font-bold shrink-0">{log.organizerName}:</span>
              <span className="text-zinc-300">{log.details}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scraped & Aggregated Races Table with Admin Controls */}
      <div className="bg-[#121620] border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="bg-zinc-950 px-4 py-3 border-b border-zinc-800 font-mono text-[10px] text-zinc-400 uppercase tracking-widest grid grid-cols-12 gap-2">
          <span className="col-span-4">RACE TITLE & TRACK</span>
          <span className="col-span-3">ORGANIZER</span>
          <span className="col-span-2">DATE</span>
          <span className="col-span-1 text-center">FEE</span>
          <span className="col-span-2 text-right">ACTION</span>
        </div>

        <div className="divide-y divide-zinc-800/80 font-mono text-xs">
          {races.map(race => (
            <div key={race.id} className="px-4 py-3 grid grid-cols-12 gap-2 items-center hover:bg-zinc-800/50">
              <div className="col-span-4">
                <span className="font-bold text-white block uppercase truncate">{race.title}</span>
                <span className="text-[10px] text-orange-400 block truncate">{race.trackName} ({race.trackRegion})</span>
              </div>
              <div className="col-span-3 text-zinc-300 truncate">
                {race.organizerName}
              </div>
              <div className="col-span-2 text-zinc-400">
                {race.date} @ {race.time}
              </div>
              <div className="col-span-1 text-center text-emerald-400 font-bold">
                €{race.entryFee}
              </div>
              <div className="col-span-2 text-right">
                <button
                  onClick={() => onDeleteRace(race.id)}
                  className="p-1.5 rounded-lg bg-red-950 text-red-400 hover:bg-red-900 border border-red-500/40 transition cursor-pointer"
                  title="Remove Race"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Manual Override Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121620] border border-orange-500/50 rounded-3xl max-w-lg w-full p-5 space-y-4 shadow-2xl relative text-white font-mono text-xs">
            <h3 className="text-sm font-extrabold uppercase text-orange-400">ADD MANUAL RACE OVERRIDE ENTRY</h3>

            <form onSubmit={handleManualAddSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] text-zinc-400">RACE TITLE</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Romagna Winter Endurance Trophy"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-zinc-400">ORGANIZER</label>
                  <select
                    value={organizerId}
                    onChange={(e) => setOrganizerId(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white"
                  >
                    {organizers.map(o => (
                      <option key={o.id} value={o.id}>{o.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-zinc-400">TRACK</label>
                  <select
                    value={trackId}
                    onChange={(e) => setTrackId(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white"
                  >
                    {tracks.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] text-zinc-400">DATE</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-2 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-zinc-400">FORMAT</label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value as any)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-2 py-2 text-white"
                  >
                    <option value="Endurance">Endurance</option>
                    <option value="Sprint">Sprint</option>
                    <option value="Ironman">Ironman</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-zinc-400">ENTRY FEE (€)</label>
                  <input
                    type="number"
                    value={entryFee}
                    onChange={(e) => setEntryFee(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-2 py-2 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-orange-600 text-white font-bold"
                >
                  SAVE OVERRIDE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
