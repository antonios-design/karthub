import React, { useState } from 'react';
import { X, Radio, ExternalLink, RefreshCw, Trophy, Flag, ShieldAlert, Cpu } from 'lucide-react';

interface ApexTimingLiveModalProps {
  onClose: () => void;
}

export const ApexTimingLiveModal: React.FC<ApexTimingLiveModalProps> = ({ onClose }) => {
  const [viewMode, setViewMode] = useState<'embed' | 'tower'>('tower');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const apexLiveUrl = 'https://live.apex-timing.com/circuito-di-pomposa/';

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const liveTowerData = [
    { pos: 1, kart: 14, driver: 'Apex Racing Team (Pomposa 500)', laps: 48, bestLap: '0:58.421', lastLap: '0:58.710', gap: 'LEADER', s1: '18.110', s2: '21.200', s3: '19.111', speed: 98.2, status: 'IN_PIT' },
    { pos: 2, kart: 22, driver: 'Scuderia Emilia Endurance', laps: 48, bestLap: '0:58.610', lastLap: '0:58.890', gap: '+2.410s', s1: '18.150', s2: '21.310', s3: '19.150', speed: 97.4, status: 'ON_TRACK' },
    { pos: 3, kart: 7, driver: 'Romagna Karting Hunters', laps: 47, bestLap: '0:58.850', lastLap: '0:59.120', gap: '+1 LAP', s1: '18.290', s2: '21.410', s3: '19.150', speed: 96.8, status: 'ON_TRACK' },
    { pos: 4, kart: 31, driver: 'Futura Corse SWS Team', laps: 47, bestLap: '0:59.010', lastLap: '0:59.200', gap: '+1 LAP', s1: '18.350', s2: '21.500', s3: '19.160', speed: 96.1, status: 'ON_TRACK' },
    { pos: 5, kart: 9, driver: 'Misanino Night Squad', laps: 46, bestLap: '0:59.240', lastLap: '0:59.500', gap: '+2 LAPS', s1: '18.420', s2: '21.600', s3: '19.220', speed: 95.5, status: 'ON_TRACK' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto font-sans">
      <div className="bg-[#111111] border border-[#FF0000]/60 rounded-xl max-w-4xl w-full p-4 sm:p-6 shadow-2xl space-y-4 my-auto relative text-white">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-[#151515] hover:bg-[#222] text-[#888] hover:text-white transition cursor-pointer border border-[#2A2A2A] z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Ticker */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2A2A2A] pb-3">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 bg-[#FF0000] text-black font-mono font-black text-[10px] uppercase tracking-wider rounded flex items-center">
                <Radio className="w-3 h-3 mr-1 animate-pulse" /> LIVE TIMING APEX-TIMING
              </span>
              <span className="text-xs font-mono text-[#00FF00] font-bold">
                CIRCUITO DI POMPOSA
              </span>
            </div>
            <h2 className="font-mono text-lg font-black uppercase text-white tracking-wide">
              TELEMETRIA E CRONOMETRAGGIO IN TEMPO REALE
            </h2>
          </div>

          <div className="flex items-center space-x-2 font-mono text-xs">
            <button
              onClick={() => setViewMode(viewMode === 'tower' ? 'embed' : 'tower')}
              className="px-3 py-1.5 rounded bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white border border-[#333] transition cursor-pointer font-bold uppercase text-[11px]"
            >
              {viewMode === 'tower' ? 'MOSTRA IFRAME SITO APEX' : 'MOSTRA TABELLA F1'}
            </button>

            <a
              href={apexLiveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded bg-[#FF0000] hover:bg-red-600 text-black font-black flex items-center space-x-1 transition cursor-pointer uppercase text-[11px]"
            >
              <span>SITO APEX</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {viewMode === 'tower' ? (
          <div className="space-y-3 font-mono">
            <div className="flex justify-between items-center text-xs text-[#888]">
              <span className="flex items-center text-[#00FF00]">
                <span className="w-2 h-2 rounded-full bg-[#00FF00] mr-1.5 animate-ping"></span>
                SESSIONE ATTIVA: 500 MIGLIA / PRACTICE ENDURANCE
              </span>

              <button
                onClick={handleRefresh}
                className="flex items-center space-x-1 text-[#888] hover:text-white transition cursor-pointer text-[10px]"
              >
                <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>AGGIORNA TIMING</span>
              </button>
            </div>

            {/* F1 Style Live Timing Grid */}
            <div className="bg-[#151515] border border-[#2A2A2A] rounded-xl overflow-x-auto">
              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead>
                  <tr className="bg-[#1A1A1A] text-[#888] border-b border-[#2A2A2A] text-[10px] uppercase">
                    <th className="p-2.5 text-center">POS</th>
                    <th className="p-2.5 text-center">KART</th>
                    <th className="p-2.5">TEAM / PILOTA</th>
                    <th className="p-2.5 text-center">GIRI</th>
                    <th className="p-2.5 text-center">BEST LAP</th>
                    <th className="p-2.5 text-center">ULTIMO GIRO</th>
                    <th className="p-2.5 text-center">S1 / S2 / S3</th>
                    <th className="p-2.5 text-center">GAP</th>
                    <th className="p-2.5 text-center">STATO</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#222]">
                  {liveTowerData.map(row => (
                    <tr key={row.pos} className="hover:bg-[#1C1C1C] transition">
                      <td className="p-2.5 text-center font-black text-white">
                        {row.pos === 1 ? <span className="text-[#00FF00]">P1</span> : `P${row.pos}`}
                      </td>
                      <td className="p-2.5 text-center font-bold text-amber-400">
                        #{row.kart}
                      </td>
                      <td className="p-2.5 font-bold text-white">
                        {row.driver}
                      </td>
                      <td className="p-2.5 text-center text-[#888]">
                        {row.laps}
                      </td>
                      <td className="p-2.5 text-center font-black text-[#00FF00]">
                        {row.bestLap}
                      </td>
                      <td className="p-2.5 text-center text-zinc-300">
                        {row.lastLap}
                      </td>
                      <td className="p-2.5 text-center text-[10px] text-[#888]">
                        {row.s1} | {row.s2} | {row.s3}
                      </td>
                      <td className="p-2.5 text-center font-bold text-white">
                        {row.gap}
                      </td>
                      <td className="p-2.5 text-center">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          row.status === 'IN_PIT' 
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' 
                            : 'bg-[#00FF00]/20 text-[#00FF00] border border-[#00FF00]/40'
                        }`}>
                          {row.status === 'IN_PIT' ? 'IN PIT' : 'TRACK'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="space-y-2 font-mono">
            <div className="bg-[#151515] border border-[#2A2A2A] rounded-xl p-2 text-center text-xs text-[#888]">
              Streaming Live da <strong className="text-white">Apex-Timing (Circuito di Pomposa)</strong>
            </div>
            <div className="w-full h-[480px] bg-black border border-[#2A2A2A] rounded-xl overflow-hidden relative">
              <iframe
                src={apexLiveUrl}
                title="Apex Timing Circuito di Pomposa"
                className="w-full h-full border-none"
                sandbox="allow-scripts allow-same-origin allow-forms"
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
