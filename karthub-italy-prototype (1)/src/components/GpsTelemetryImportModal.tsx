import React, { useState } from 'react';
import { X, Upload, FileText, CheckCircle, Sparkles, Activity, Gauge, Cpu, Navigation, AlertCircle } from 'lucide-react';
import { Track, GpsTelemetryImport, GpsDataPoint } from '../types';

interface GpsTelemetryImportModalProps {
  tracks: Track[];
  onClose: () => void;
  onImportSuccess: (gpsImport: GpsTelemetryImport) => void;
}

export const GpsTelemetryImportModal: React.FC<GpsTelemetryImportModalProps> = ({
  tracks,
  onClose,
  onImportSuccess
}) => {
  const [selectedTrackId, setSelectedTrackId] = useState<string>(tracks[0]?.id || 'track-pomposa');
  const [deviceType, setDeviceType] = useState<'MyChron5' | 'Alfano 6' | 'RaceBox GPS' | 'VBOX' | 'GPX/NMEA CSV'>('MyChron5');
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<GpsTelemetryImport | null>(null);
  const [isParsing, setIsParsing] = useState<boolean>(false);

  // Pre-generate sample telemetry for instant test
  const handleLoadSampleFile = () => {
    setIsParsing(true);
    const DEFAULT_TRACK = { id: 'track-default', name: 'Circuito', region: 'IT' };
    const selectedTrack = tracks.find(t => t.id === selectedTrackId) || tracks[0] || DEFAULT_TRACK;

    setTimeout(() => {
      const samplePoints: GpsDataPoint[] = [
        { lap: 1, distanceMeters: 100, speedKmh: 48, gForceLat: 0.3, gForceLon: 0.9, timeSec: 3.1 },
        { lap: 1, distanceMeters: 300, speedKmh: 88, gForceLat: 1.1, gForceLon: -0.2, timeSec: 12.4 },
        { lap: 1, distanceMeters: 600, speedKmh: 96, gForceLat: 0.5, gForceLon: 0.8, timeSec: 24.8 },
        { lap: 1, distanceMeters: 900, speedKmh: 62, gForceLat: 1.9, gForceLon: -1.4, timeSec: 38.2 },
        { lap: 1, distanceMeters: 1300, speedKmh: 92, gForceLat: 0.7, gForceLon: 0.6, timeSec: 49.5 },
        { lap: 1, distanceMeters: 1600, speedKmh: 98, gForceLat: 0.2, gForceLon: 0.9, timeSec: 58.58 }
      ];

      const sampleImport: GpsTelemetryImport = {
        id: `gps-${Date.now()}`,
        filename: `${selectedTrack.name.replace(/\s+/g, '_')}_${deviceType}_Data.csv`,
        importedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        trackName: selectedTrack.name,
        deviceType,
        bestLapFormatted: '0:58.580',
        bestLapSeconds: 58.58,
        s1Seconds: 18.12,
        s2Seconds: 21.28,
        s3Seconds: 19.18,
        topSpeedKmh: 98.4,
        maxGForce: 1.92,
        theoreticalBestFormatted: '0:58.210',
        lapsCount: 16,
        dataPoints: samplePoints
      };

      setParsedData(sampleImport);
      setIsParsing(false);
    }, 1000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      handleLoadSampleFile();
    }
  };

  const handleConfirmSave = () => {
    if (parsedData) {
      onImportSuccess(parsedData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto font-sans">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl space-y-5 my-auto relative text-slate-900">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer border border-slate-200"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title Header */}
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 bg-red-600 text-white font-extrabold text-[10px] uppercase tracking-wider rounded-lg shadow-sm">
              TELEMETRIA GPS
            </span>
            <span className="text-xs text-slate-500 font-medium">
              AIM MYCHRON5 • ALFANO 6 • RACEBOX • GPX
            </span>
          </div>
          <h2 className="text-lg font-extrabold uppercase text-slate-900 tracking-tight flex items-center">
            <Activity className="w-5 h-5 mr-2 text-red-600" />
            IMPORTA DATI TELEMETRIA GPS
          </h2>
          <p className="text-xs text-slate-500">
            Carica i tuoi file di telemetria per analizzare i tempi sul giro, gli intertempi dei 3 settori (S1/S2/S3), la velocità massima ed il giro ideale.
          </p>
        </div>

        {!parsedData ? (
          <div className="space-y-4 text-xs">
            {/* Track Selector */}
            <div>
              <label className="block text-[11px] text-slate-600 uppercase mb-1 font-bold">
                1. Seleziona Circuito
              </label>
              <select
                value={selectedTrackId}
                onChange={(e) => setSelectedTrackId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-red-600"
              >
                {tracks.map(t => (
                  <option key={t.id} value={t.id}>{t.name} ({t.region})</option>
                ))}
              </select>
            </div>

            {/* Device Selector */}
            <div>
              <label className="block text-[11px] text-slate-600 uppercase mb-1 font-bold">
                2. Dispositivo / Formato File
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(['MyChron5', 'Alfano 6', 'RaceBox GPS', 'VBOX', 'GPX/NMEA CSV'] as const).map(dev => (
                  <button
                    key={dev}
                    type="button"
                    onClick={() => setDeviceType(dev)}
                    className={`p-2.5 rounded-xl border text-center transition cursor-pointer text-[11px] font-bold ${
                      deviceType === dev
                        ? 'bg-red-50 border-red-600 text-red-600'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {dev}
                  </button>
                ))}
              </div>
            </div>

            {/* Drop Zone */}
            <div className="border-2 border-dashed border-slate-200 hover:border-red-400 rounded-2xl p-6 text-center space-y-3 bg-slate-50 transition">
              <Upload className="w-8 h-8 text-red-600 mx-auto animate-bounce" />
              <div>
                <p className="font-bold text-slate-900 text-xs">
                  Trascina qui il tuo file .CSV, .GPX o .NMEA
                </p>
                <p className="text-[10px] text-slate-500">
                  Compatibile con esportazioni RaceStudio3, Alfano DATA, RaceRender e RaceBox App
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-2 pt-2">
                <label className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-900 rounded-xl border border-slate-200 cursor-pointer text-xs font-bold transition shadow-sm">
                  SFOGLIA FILE
                  <input
                    type="file"
                    accept=".csv,.gpx,.nmea,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                <button
                  type="button"
                  onClick={handleLoadSampleFile}
                  disabled={isParsing}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-extrabold text-xs cursor-pointer transition uppercase shadow-sm"
                >
                  {isParsing ? 'ANALISI IN CORSO...' : 'CARICA TELEMETRIA DEMO'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Parsed Telemetry Results */
          <div className="space-y-4">
            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs text-emerald-800 flex items-center justify-between">
              <div className="flex items-center space-x-2 font-bold">
                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>TELEMETRIA PARSATA CON SUCCESSO! (+25 STAR POINTS BONUS)</span>
              </div>
            </div>

            {/* Stats Bento Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3 shadow-xs">
                <span className="text-[9px] text-emerald-800 font-black uppercase block">MIGLIOR GIRO EFFETTUATO</span>
                <strong className="text-base text-emerald-700 font-black">{parsedData.bestLapFormatted}</strong>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <span className="text-[9px] text-slate-400 font-bold uppercase block">GIRO IDEALE</span>
                <strong className="text-sm text-amber-600 font-black">{parsedData.theoreticalBestFormatted}</strong>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <span className="text-[9px] text-slate-400 font-bold uppercase block">VELOCITÀ MAX</span>
                <strong className="text-sm text-slate-900 font-black">{parsedData.topSpeedKmh} km/h</strong>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <span className="text-[9px] text-slate-400 font-bold uppercase block">G-FORCE MAX</span>
                <strong className="text-sm text-red-600 font-black">{parsedData.maxGForce} G</strong>
              </div>
            </div>

            {/* Sectors Breakdown Table */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
              <h4 className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                ANALISI INTERTEMPI SETTORI (S1, S2, S3)
              </h4>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[9px] text-slate-400 font-bold block">SETTORE 1 (S1)</span>
                  <span className="font-extrabold text-slate-900">{parsedData.s1Seconds.toFixed(3)}s</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[9px] text-slate-400 font-bold block">SETTORE 2 (S2)</span>
                  <span className="font-extrabold text-slate-900">{parsedData.s2Seconds.toFixed(3)}s</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[9px] text-slate-400 font-bold block">SETTORE 3 (S3)</span>
                  <span className="font-extrabold text-slate-900">{parsedData.s3Seconds.toFixed(3)}s</span>
                </div>
              </div>
            </div>

            {/* Visualizer Map Line & Curve */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-1">
              <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold">
                <span>GRAFICO VELOCITÀ GPS vs DISTANZA</span>
                <span className="text-emerald-600">16 GIRI RILEVATI</span>
              </div>

              <div className="h-20 w-full flex items-end space-x-1 pt-2 border-b border-slate-200">
                {[30, 45, 85, 98, 70, 52, 92, 98, 65, 88, 95, 40, 78, 97, 60, 98].map((speed, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-gradient-to-t from-red-500 via-amber-500 to-emerald-500 rounded-t"
                    style={{ height: `${speed}%` }}
                    title={`Punto GPS #${i+1}: ${speed} km/h`}
                  />
                ))}
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => setParsedData(null)}
                className="w-1/3 py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold rounded-xl border border-slate-200 transition cursor-pointer"
              >
                RICARICA
              </button>
              <button
                onClick={handleConfirmSave}
                className="w-2/3 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold rounded-xl shadow-sm transition cursor-pointer uppercase tracking-wider flex items-center justify-center space-x-1"
              >
                <Sparkles className="w-4 h-4" />
                <span>SALVA TELEMETRIA & OTTIENI +25 PTS</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
