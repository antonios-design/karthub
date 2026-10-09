import React, { useState } from 'react';
import { 
  Download, 
  Terminal, 
  FolderArchive, 
  FileCode, 
  Copy, 
  Check, 
  X, 
  ExternalLink, 
  Sparkles, 
  Layers, 
  Cpu, 
  PackageCheck,
  CheckCircle2,
  FolderTree
} from 'lucide-react';

interface ExportCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  racesCount: number;
}

export const ExportCodeModal: React.FC<ExportCodeModalProps> = ({
  isOpen,
  onClose,
  racesCount
}) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const handleDownloadZip = () => {
    setIsDownloading(true);
    // Trigger download
    const link = document.createElement('a');
    link.href = '/api/export-project';
    link.download = 'karthub-italy-prototype.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setIsDownloading(false);
    }, 2000);
  };

  const setupCommands = `# 1. Estrai il file ZIP scaricato
unzip karthub-italy-prototype.zip -d karthub-italy
cd karthub-italy

# 2. Installa le dipendenze npm
npm install

# 3. Avvia il server di sviluppo (Vite + Express su porta 3000)
npm run dev`;

  const gitCommands = `# Pubblica su un nuovo repository GitHub
git init
git add .
git commit -m "feat: esportazione prototipo karthub italia"
git branch -M main
git remote add origin https://github.com/<TUO-UTENTE>/karthub-italy.git
git push -u origin main`;

  const productionCommands = `# Compilazione bundle di produzione
npm run build

# Avvio del server Node.js in produzione
npm start`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 text-slate-900 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 bg-slate-900 text-white rounded-t-3xl relative flex items-start justify-between border-b border-slate-800">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-600/30 border border-red-500/50 text-red-300 text-xs font-mono font-bold tracking-wider uppercase">
              <FolderArchive className="w-3.5 h-3.5 text-red-400" />
              <span>EXPORT SOURCE CODE</span>
            </div>
            <h2 className="text-2xl font-black italic tracking-tight text-white flex items-center gap-2">
              Esporta Codice del Prototipo
            </h2>
            <p className="text-xs text-slate-300 max-w-xl">
              Scarica il pacchetto completo del progetto in formato <strong>.ZIP</strong> comprensivo di backend Express, frontend React 19, dataset gare italiane e configurazioni pronte per l'esecuzione locale o deploy su GitHub.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition cursor-pointer"
            aria-label="Chiudi finestra"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 flex-1">
          {/* Main Action Banner: 1-Click ZIP Download */}
          <div className="bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 border-2 border-red-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1.5">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-md bg-red-600 text-white text-[11px] font-black uppercase tracking-wider">
                  PACCHETTO ZIP COMPLETO
                </span>
                <span className="text-xs text-slate-600 font-medium">
                  Include tutti i sorgenti ({racesCount} gare, circuiti, telemetria, backend & frontend)
                </span>
              </div>
              <h3 className="text-base font-extrabold text-slate-900">
                karthub-italy-prototype.zip
              </h3>
              <p className="text-xs text-slate-600 font-sans">
                Esclude automaticamente cartelle pesanti (es. <code className="bg-red-100 text-red-800 px-1 py-0.5 rounded text-[11px]">node_modules</code> e <code className="bg-red-100 text-red-800 px-1 py-0.5 rounded text-[11px]">dist</code>) per un download leggero e immediato.
              </p>
            </div>

            <button
              onClick={handleDownloadZip}
              disabled={isDownloading}
              className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white font-extrabold text-sm tracking-wide transition shadow-lg shadow-red-600/30 shrink-0 cursor-pointer disabled:opacity-50"
            >
              <Download className={`w-5 h-5 ${isDownloading ? 'animate-bounce' : ''}`} />
              <span>{isDownloading ? 'PREPARAZIONE...' : 'SCARICA ARCHIVIO .ZIP'}</span>
            </button>
          </div>

          {/* Key Specs Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
              <div className="text-[10px] font-bold uppercase text-slate-500">Framework</div>
              <div className="text-sm font-black text-slate-800 mt-0.5">React 19 + Vite</div>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
              <div className="text-[10px] font-bold uppercase text-slate-500">Backend API</div>
              <div className="text-sm font-black text-slate-800 mt-0.5">Express + Node</div>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
              <div className="text-[10px] font-bold uppercase text-slate-500">Styling</div>
              <div className="text-sm font-black text-slate-800 mt-0.5">Tailwind CSS v4</div>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
              <div className="text-[10px] font-bold uppercase text-slate-500">Linguaggio</div>
              <div className="text-sm font-black text-slate-800 mt-0.5">TypeScript 100%</div>
            </div>
          </div>

          {/* Quick Terminal Guide */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-red-600" />
                <span>1. Guida Avvio Locale Rapido</span>
              </h4>
              <button
                onClick={() => copyToClipboard(setupCommands, 'setup')}
                className="inline-flex items-center space-x-1.5 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition font-mono cursor-pointer"
              >
                {copiedSection === 'setup' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">Copiato!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copia Comandi</span>
                  </>
                )}
              </button>
            </div>
            <pre className="bg-slate-900 text-slate-200 p-4 rounded-xl text-xs font-mono overflow-x-auto border border-slate-800 leading-relaxed select-all">
              {setupCommands}
            </pre>
          </div>

          {/* Git Publish Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center space-x-2">
                <ExternalLink className="w-4 h-4 text-blue-600" />
                <span>2. Inizializzazione Repository Git / GitHub</span>
              </h4>
              <button
                onClick={() => copyToClipboard(gitCommands, 'git')}
                className="inline-flex items-center space-x-1.5 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition font-mono cursor-pointer"
              >
                {copiedSection === 'git' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">Copiato!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copia Git</span>
                  </>
                )}
              </button>
            </div>
            <pre className="bg-slate-900 text-slate-200 p-4 rounded-xl text-xs font-mono overflow-x-auto border border-slate-800 leading-relaxed select-all">
              {gitCommands}
            </pre>
          </div>

          {/* Included Structure Overview */}
          <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center space-x-2">
              <FolderTree className="w-4 h-4 text-emerald-600" />
              <span>Struttura File Inclusa nel Pacchetto</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono text-slate-700">
              <div className="flex items-center space-x-2 bg-white p-2 rounded-lg border border-slate-200">
                <FileCode className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span className="font-bold">server.ts</span>
                <span className="text-slate-400 text-[10px] ml-auto">Backend Express API</span>
              </div>
              <div className="flex items-center space-x-2 bg-white p-2 rounded-lg border border-slate-200">
                <FileCode className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span className="font-bold">src/App.tsx</span>
                <span className="text-slate-400 text-[10px] ml-auto">Routing & State</span>
              </div>
              <div className="flex items-center space-x-2 bg-white p-2 rounded-lg border border-slate-200">
                <FileCode className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span className="font-bold">src/components/CampionatiView.tsx</span>
                <span className="text-slate-400 text-[10px] ml-auto">Storico Gare & Classifiche</span>
              </div>
              <div className="flex items-center space-x-2 bg-white p-2 rounded-lg border border-slate-200">
                <FileCode className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span className="font-bold">src/data/mockData.ts</span>
                <span className="text-slate-400 text-[10px] ml-auto">Database Gare Italiane</span>
              </div>
              <div className="flex items-center space-x-2 bg-white p-2 rounded-lg border border-slate-200">
                <FileCode className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span className="font-bold">package.json</span>
                <span className="text-slate-400 text-[10px] ml-auto">Scripts & Dipendenze</span>
              </div>
              <div className="flex items-center space-x-2 bg-white p-2 rounded-lg border border-slate-200">
                <FileCode className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="font-bold">README.md</span>
                <span className="text-slate-400 text-[10px] ml-auto">Istruzioni Complete</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 rounded-b-3xl flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Pacchetto generato al volo dal server KartHub Italia
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider transition cursor-pointer"
          >
            Chiudi
          </button>
        </div>
      </div>
    </div>
  );
};
