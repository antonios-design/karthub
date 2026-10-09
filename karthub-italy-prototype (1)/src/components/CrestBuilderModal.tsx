import React, { useState, useRef } from 'react';
import { CrestConfig, DriverProfile, ExperienceLevel, Track } from '../types';
import { CrestAvatar } from './CrestAvatar';
import { X, Check, Shield, Camera, Upload, RefreshCw, User, Weight, Sparkles, Image as ImageIcon } from 'lucide-react';
import { playRevSound } from '../lib/audio';

interface CrestBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: DriverProfile;
  currentAvatarType?: 'image' | 'crest';
  currentCrestConfig?: CrestConfig;
  currentAvatarUrl?: string;
  tracks?: Track[];
  initialTab?: 'profile_data' | 'crest' | 'image';
  onSave: (avatarType: 'image' | 'crest', crestConfig: CrestConfig, avatarUrl: string, profileData?: Partial<DriverProfile>) => void;
}

const COLOR_SWATCHES = [
  { name: 'Rosso Corsa', hex: '#dc2626' },
  { name: 'Nero Carbonio', hex: '#18181b' },
  { name: 'Giallo Modena', hex: '#eab308' },
  { name: 'Blu Italia', hex: '#2563eb' },
  { name: 'Verde Smeraldo', hex: '#16a34a' },
  { name: 'Oro Reale', hex: '#d97706' },
  { name: 'Bianco Puro', hex: '#f8fafc' },
  { name: 'Arancio Racing', hex: '#ea580c' },
  { name: 'Viola GP', hex: '#9333ea' },
  { name: 'Grigio Titanio', hex: '#475569' }
];

const SHAPES = [
  { id: 'classic_shield', label: 'Classico', desc: 'Scudo Tradizionale' },
  { id: 'gothic_shield', label: 'Gotico', desc: 'Sagomato Appuntito' },
  { id: 'round_shield', label: 'Circolare', desc: 'Medaglione Racing' },
  { id: 'crown_shield', label: 'Coronato', desc: 'Cima a Corona' }
] as const;

const PATTERNS = [
  { id: 'solid', label: 'Tinta Unita' },
  { id: 'split_v', label: 'Diviso Verticale' },
  { id: 'split_diag', label: 'Diagonale' },
  { id: 'checkered', label: 'A Scacchi' },
  { id: 'stripes', label: 'Strisce Racing' }
] as const;

const SYMBOLS = {
  karting: [
    { id: 'steering_wheel', label: 'Volante', icon: '🏎️' },
    { id: 'checkered_flag', label: 'Bandiera', icon: '🏁' },
    { id: 'helmet', label: 'Casco', icon: '🪖' },
    { id: 'piston', label: 'Pistone', icon: '⚙️' },
    { id: 'flame', label: 'Fiamma', icon: '🔥' }
  ],
  animals: [
    { id: 'lion', label: 'Leone', icon: '🦁' },
    { id: 'eagle', label: 'Aquila', icon: '🦅' },
    { id: 'bull', label: 'Toro', icon: '🐂' },
    { id: 'wolf', label: 'Lupo', icon: '🐺' },
    { id: 'dragon', label: 'Drago', icon: '🐉' }
  ],
  medieval: [
    { id: 'crown', label: 'Corona', icon: '👑' },
    { id: 'swords', label: 'Spade', icon: '⚔️' },
    { id: 'shield', label: 'Scudo', icon: '🛡️' }
  ]
};

export const CrestBuilderModal: React.FC<CrestBuilderModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  currentAvatarType,
  currentCrestConfig,
  currentAvatarUrl,
  onSave
}) => {
  if (!isOpen) return null;

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Avatar visual mode: 'image' or 'crest'
  const [avatarType, setAvatarType] = useState<'image' | 'crest'>(
    currentUser?.avatarType || currentAvatarType || 'crest'
  );

  // Photo state
  const [imageUrl, setImageUrl] = useState<string>(
    currentUser?.avatarUrl || currentAvatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
  );
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  // Crest state
  const [crest, setCrest] = useState<CrestConfig>({
    shape: currentUser?.crestConfig?.shape || currentCrestConfig?.shape || 'classic_shield',
    pattern: currentUser?.crestConfig?.pattern || currentCrestConfig?.pattern || 'split_v',
    primaryColor: currentUser?.crestConfig?.primaryColor || currentCrestConfig?.primaryColor || '#dc2626',
    secondaryColor: currentUser?.crestConfig?.secondaryColor || currentCrestConfig?.secondaryColor || '#18181b',
    symbolCategory: currentUser?.crestConfig?.symbolCategory || currentCrestConfig?.symbolCategory || 'karting',
    symbolIcon: currentUser?.crestConfig?.symbolIcon || currentCrestConfig?.symbolIcon || 'steering_wheel',
    crestInitials: currentUser?.crestConfig?.crestInitials || currentCrestConfig?.crestInitials || (currentUser?.nickname ? currentUser.nickname.slice(0, 4).toUpperCase() : 'KH')
  });

  // Profile fields state
  const [name, setName] = useState(currentUser?.name || '');
  const [nickname, setNickname] = useState(currentUser?.nickname || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [weightKg, setWeightKg] = useState<number>(currentUser?.weightKg || 75);
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>(currentUser?.experienceLevel || 'Amateur');

  // Handle instant photo upload from device (camera or gallery)
  const handleDeviceFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('Immagine troppo pesante! Scegli una foto inferiore a 10MB.');
      return;
    }

    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setImageUrl(dataUrl);
        setAvatarType('image');
        try { playRevSound(); } catch {}
      }
    };
    reader.readAsDataURL(file);
  };

  // Fast random crest generator
  const handleRandomizeCrest = () => {
    try { playRevSound(); } catch {}
    const randomShape = SHAPES[Math.floor(Math.random() * SHAPES.length)].id;
    const randomPattern = PATTERNS[Math.floor(Math.random() * PATTERNS.length)].id;
    const randomPrimary = COLOR_SWATCHES[Math.floor(Math.random() * COLOR_SWATCHES.length)].hex;
    const randomSecondary = COLOR_SWATCHES[Math.floor(Math.random() * COLOR_SWATCHES.length)].hex;
    const categories: Array<'karting' | 'animals' | 'medieval'> = ['karting', 'animals', 'medieval'];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const symbolsList = SYMBOLS[randomCategory];
    const randomSymbol = symbolsList[Math.floor(Math.random() * symbolsList.length)].id;
    const initials = (nickname || name || 'KH').replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase();

    setCrest({
      shape: randomShape,
      pattern: randomPattern,
      primaryColor: randomPrimary,
      secondaryColor: randomSecondary,
      symbolCategory: randomCategory,
      symbolIcon: randomSymbol,
      crestInitials: initials || 'KH'
    });
    setAvatarType('crest');
  };

  // Submit and save
  const handleSave = () => {
    try { playRevSound(); } catch {}
    onSave(
      avatarType,
      crest,
      imageUrl,
      {
        name: name.trim() || 'Pilota KartHub',
        nickname: nickname.trim() || (name.trim() ? name.trim().replace(/\s+/g, '') : 'pilota'),
        bio: bio.trim(),
        weightKg: Number(weightKg) || 75,
        experienceLevel
      }
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in overflow-y-auto font-sans">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl my-auto overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Hidden Device File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="user"
          onChange={handleDeviceFileUpload}
          className="hidden"
        />

        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-600 rounded-xl text-white shadow-md">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black uppercase tracking-tight">
                MODIFICA STEMMA & PROFILO
              </h2>
              <p className="text-[11px] text-slate-400">
                Carica foto da dispositivo, personalizza lo stemma o aggiorna i tuoi dati
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-900">
          
          {/* TOP BANNER: LIVE AVATAR PREVIEW + FAST MODE TOGGLE */}
          <div className="bg-slate-900 rounded-2xl p-4 text-white flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-800 shadow-md">
            <div className="flex items-center space-x-4 w-full sm:w-auto">
              <div className="relative shrink-0">
                {avatarType === 'crest' ? (
                  <CrestAvatar crest={crest} size="lg" />
                ) : (
                  <img
                    src={imageUrl}
                    alt="Foto Profilo"
                    className="w-18 h-18 rounded-2xl object-cover border-2 border-red-500 shadow-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                    }}
                  />
                )}
                {avatarType === 'image' && (
                  <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-md bg-emerald-500 text-[9px] font-black uppercase text-white shadow">
                    Foto
                  </span>
                )}
                {avatarType === 'crest' && (
                  <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-md bg-red-600 text-[9px] font-black uppercase text-white shadow">
                    Stemma
                  </span>
                )}
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-base font-extrabold uppercase text-white truncate max-w-[200px]">
                    {name || 'Nome Pilota'}
                  </h3>
                  <span className="px-2 py-0.5 rounded bg-red-600 text-white text-[9px] font-black uppercase">
                    {experienceLevel}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-medium">
                  @{nickname || 'driver'} • {weightKg} kg
                </p>
                {bio && (
                  <p className="text-[11px] text-slate-400 italic mt-0.5 line-clamp-1 max-w-xs">
                    "{bio}"
                  </p>
                )}
              </div>
            </div>

            {/* Mode Selector Buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 sm:flex-initial px-3.5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black uppercase shadow-md flex items-center justify-center space-x-1.5 transition cursor-pointer active:scale-95"
                title="Carica foto dal tuo telefono o computer"
              >
                <Upload className="w-4 h-4" />
                <span>CARICA FOTO</span>
              </button>

              <button
                type="button"
                onClick={handleRandomizeCrest}
                className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold uppercase transition cursor-pointer flex items-center space-x-1.5 border border-slate-700 active:scale-95"
                title="Genera uno stemma casuale con un click"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">STEMMA RANDOM</span>
              </button>
            </div>
          </div>

          {/* SECTION 1: AVATAR TYPE TABS */}
          <div className="space-y-4">
            <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => setAvatarType('image')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-black uppercase transition cursor-pointer flex items-center justify-center space-x-2 ${
                  avatarType === 'image'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>1. FOTO DAL DISPOSITIVO</span>
              </button>

              <button
                type="button"
                onClick={() => setAvatarType('crest')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-black uppercase transition cursor-pointer flex items-center justify-center space-x-2 ${
                  avatarType === 'crest'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>2. STEMMA SCUDERIA</span>
              </button>
            </div>

            {/* TAB CONTENT: FOTO DA DISPOSITIVO */}
            {avatarType === 'image' && (
              <div className="space-y-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl animate-fade-in">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-red-300 hover:border-red-600 bg-white hover:bg-red-50/50 p-5 rounded-xl text-center cursor-pointer transition space-y-2 group shadow-2xs"
                >
                  <div className="w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mx-auto group-hover:scale-110 transition shadow-2xs">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-extrabold text-xs uppercase text-slate-800">
                      Tocca qui per caricare una foto da Smartphone o PC
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                      Supporta JPG, PNG, WEBP e fotocamera diretta (Max 10MB)
                    </p>
                  </div>
                  {uploadedFileName && (
                    <span className="inline-block text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                      ✓ Foto caricata: {uploadedFileName}
                    </span>
                  )}
                </div>

                {/* Preset Avatars for fast selection */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1.5">
                    OPPURE SCEGLI UN AVATAR RACING RAPIDO:
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
                      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
                      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
                      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80'
                    ].map((url, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setImageUrl(url);
                          setAvatarType('image');
                        }}
                        className={`p-1 rounded-xl border-2 transition cursor-pointer overflow-hidden ${
                          imageUrl === url ? 'border-red-600 ring-2 ring-red-200 scale-102' : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <img src={url} alt="preset" className="w-full h-12 object-cover rounded-lg" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: STEMMA SCUDERIA */}
            {avatarType === 'crest' && (
              <div className="space-y-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl animate-fade-in text-xs">
                {/* Initials & Shape */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-600 mb-1">
                      SIGLA SCUDETTO (MAX 4 CARATTERI)
                    </label>
                    <input
                      type="text"
                      maxLength={4}
                      value={crest.crestInitials || ''}
                      onChange={(e) => setCrest({ ...crest, crestInitials: e.target.value.toUpperCase() })}
                      placeholder="es. APEX, KH, 46"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-black uppercase tracking-wider text-slate-900 focus:outline-none focus:border-red-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-600 mb-1">
                      FORMA SCUDO
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {SHAPES.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setCrest({ ...crest, shape: s.id })}
                          className={`py-1.5 px-2 rounded-lg text-center transition cursor-pointer border text-[11px] font-extrabold uppercase ${
                            crest.shape === s.id
                              ? 'bg-red-600 text-white border-red-600 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Colors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-600 mb-1">
                      COLORE PRIMARIO
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {COLOR_SWATCHES.map((c) => (
                        <button
                          key={c.hex}
                          type="button"
                          onClick={() => setCrest({ ...crest, primaryColor: c.hex })}
                          style={{ backgroundColor: c.hex }}
                          className={`w-6 h-6 rounded-full border-2 transition cursor-pointer ${
                            crest.primaryColor === c.hex ? 'border-red-600 ring-2 ring-red-400 scale-115' : 'border-slate-300'
                          }`}
                          title={c.name}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-600 mb-1">
                      COLORE SECONDARIO
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {COLOR_SWATCHES.map((c) => (
                        <button
                          key={c.hex}
                          type="button"
                          onClick={() => setCrest({ ...crest, secondaryColor: c.hex })}
                          style={{ backgroundColor: c.hex }}
                          className={`w-6 h-6 rounded-full border-2 transition cursor-pointer ${
                            crest.secondaryColor === c.hex ? 'border-red-600 ring-2 ring-red-400 scale-115' : 'border-slate-300'
                          }`}
                          title={c.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Central Symbol */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[10px] font-black uppercase text-slate-600">
                      SIMBOLO CENTRALE
                    </label>
                    <div className="flex space-x-1">
                      {(['karting', 'animals', 'medieval'] as const).map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setCrest({ ...crest, symbolCategory: cat })}
                          className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase transition cursor-pointer ${
                            crest.symbolCategory === cat
                              ? 'bg-slate-900 text-white'
                              : 'bg-white border border-slate-200 text-slate-600'
                          }`}
                        >
                          {cat === 'karting' ? '🏎️ Kart' : cat === 'animals' ? '🦁 Animali' : '⚔️ Storici'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-5 gap-1.5">
                    {SYMBOLS[crest.symbolCategory].map((sym) => (
                      <button
                        key={sym.id}
                        type="button"
                        onClick={() => setCrest({ ...crest, symbolIcon: sym.id })}
                        className={`p-2 rounded-xl border flex flex-col items-center justify-center transition cursor-pointer ${
                          crest.symbolIcon === sym.id
                            ? 'bg-red-50 border-red-600 text-red-700 font-extrabold ring-1 ring-red-300'
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <span className="text-lg">{sym.icon}</span>
                        <span className="text-[9px] font-bold uppercase truncate">{sym.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 2: DATI PROFILO PILOTA */}
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-red-600" />
              <span>DATI PILOTA & PRESENTAZIONE</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">
                  NOME & COGNOME *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Es. Mario Rossi"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-red-600"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">
                  NICKNAME GP (@TAG)
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Es. ApexMario"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-red-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">
                FRASE DI PRESENTAZIONE (BIO)
              </label>
              <input
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Es. Pilota Endurance Sodi RT8 • Sempre a caccia del miglior Apex!"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:bg-white focus:border-red-600"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Questa frase apparirà sotto al tuo nome nella scheda profilo e tra i tuoi amici.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1 flex items-center gap-1">
                  <Weight className="w-3 h-3 text-slate-400" />
                  <span>PESO PILOTA (KG)</span>
                </label>
                <input
                  type="number"
                  min="40"
                  max="140"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">
                  LIVELLO ESPERIENZA
                </label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value as ExperienceLevel)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-red-600 cursor-pointer"
                >
                  <option value="Rookie">Rookie (Esordiente)</option>
                  <option value="Amateur">Amateur (Amatoriale)</option>
                  <option value="Semi-Pro">Semi-Pro (Esperto)</option>
                  <option value="Professionist">Professionist</option>
                  <option value="Kart-Legend">Kart-Legend (Pro)</option>
                </select>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 py-3.5 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold uppercase transition cursor-pointer"
          >
            Annulla
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black uppercase shadow-md hover:shadow-lg transition cursor-pointer flex items-center space-x-1.5 active:scale-95"
          >
            <Check className="w-4 h-4" />
            <span>SALVA MODIFICHE</span>
          </button>
        </div>

      </div>
    </div>
  );
};
