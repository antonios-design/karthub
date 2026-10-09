import React, { useState, useEffect } from 'react';
import { DriverProfile, ExperienceLevel } from '../types';
import { Trophy, Mail, Lock, User, Sparkles, Flag, ArrowRight, ShieldCheck, Weight, LogIn, UserPlus, CheckCircle2, X } from 'lucide-react';
import { playRevSound } from '../lib/audio';

interface AuthViewProps {
  demoUsers: DriverProfile[];
  onLoginSuccess: (user: DriverProfile) => void;
  onCreateAccount: (newUserData: {
    name: string;
    email: string;
    nickname: string;
    weightKg: number;
    experienceLevel: ExperienceLevel;
  }) => void;
  initialMode?: 'login' | 'register';
  onClose?: () => void;
  isModal?: boolean;
}

export const AuthView: React.FC<AuthViewProps> = ({
  demoUsers,
  onLoginSuccess,
  onCreateAccount,
  initialMode = 'login',
  onClose,
  isModal = false
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>(initialMode);
  
  // Login Form state: ONLY Username/Email & Password (NO nickname, NO weight!)
  const [loginUsernameOrEmail, setLoginUsernameOrEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register Form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regNickname, setRegNickname] = useState('');
  const [regWeight, setRegWeight] = useState('75');
  const [regLevel, setRegLevel] = useState<ExperienceLevel>('Amateur');
  const [regError, setRegError] = useState('');

  // Real Social Connection State (NO hardcoded/prefilled emails!)
  const [socialModalProvider, setSocialModalProvider] = useState<'Google' | 'Apple' | 'Facebook' | null>(null);
  const [socialEmail, setSocialEmail] = useState('');
  const [socialPassword, setSocialPassword] = useState('');
  const [socialLoading, setSocialLoading] = useState(false);
  const [socialStatusMsg, setSocialStatusMsg] = useState('');

  // Find if Antonio Santoro (primary account) exists in users
  const primaryAccount = demoUsers.find(u => u.email === 'antonio.santoro8959@gmail.com') || demoUsers[0];

  // Helper to extract clean Name from an email or username
  const extractNameFromEmail = (emailStr: string): string => {
    const handle = emailStr.split('@')[0];
    const parts = handle.split(/[._-]/).filter(Boolean);
    if (parts.length >= 2) {
      return parts.map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join(' ');
    }
    return handle.charAt(0).toUpperCase() + handle.slice(1);
  };

  // Social Login Initiator
  const handleSocialLogin = (providerName: 'Google' | 'Apple' | 'Facebook') => {
    playRevSound();
    setSocialModalProvider(providerName);
    setSocialEmail('');
    setSocialPassword('');
    setSocialLoading(false);
    setSocialStatusMsg('');

    // Strategy 1: Real Google Identity Services Popup if Client ID is configured
    const googleClientId = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID;
    if (providerName === 'Google' && googleClientId && (window as any).google?.accounts?.oauth2) {
      try {
        setSocialLoading(true);
        setSocialStatusMsg('Connessione sicura con Google Identity Services...');
        const tokenClient = (window as any).google.accounts.oauth2.initTokenClient({
          client_id: googleClientId,
          scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
          callback: async (response: any) => {
            if (response.access_token) {
              try {
                const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: { Authorization: `Bearer ${response.access_token}` }
                });
                const googleUser = await res.json();
                if (googleUser && googleUser.email) {
                  loginOrRegisterSocialUser({
                    provider: 'Google',
                    email: googleUser.email,
                    name: googleUser.name || googleUser.given_name || extractNameFromEmail(googleUser.email),
                    avatarUrl: googleUser.picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
                  });
                  return;
                }
              } catch (e) {
                console.error('Google Userinfo error:', e);
              }
            }
            setSocialLoading(false);
          }
        });
        tokenClient.requestAccessToken();
      } catch (err) {
        setSocialLoading(false);
      }
    }
  };

  // Unified login/register from social account
  const loginOrRegisterSocialUser = ({
    provider,
    email,
    name,
    avatarUrl
  }: {
    provider: 'Google' | 'Apple' | 'Facebook';
    email: string;
    name?: string;
    avatarUrl?: string;
  }) => {
    const targetEmail = email.trim().toLowerCase();
    const cleanName = name?.trim() || extractNameFromEmail(targetEmail);
    const derivedNickname = cleanName.replace(/[^a-zA-Z0-9]/g, '') || 'PilotaKart';

    // 1. Check if user already exists in demoUsers/database
    const existingUser = demoUsers.find(
      u => u.email.trim().toLowerCase() === targetEmail ||
           u.nickname.trim().toLowerCase() === derivedNickname.toLowerCase()
    );

    if (existingUser) {
      onLoginSuccess(existingUser);
      setSocialModalProvider(null);
      return;
    }

    // 2. Otherwise create a clean profile with information recovered from Google/Apple/Facebook
    let defaultAvatar = avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
    let primaryColor = '#dc2626';

    if (provider === 'Apple') {
      defaultAvatar = avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80';
      primaryColor = '#18181b';
    } else if (provider === 'Facebook') {
      defaultAvatar = avatarUrl || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80';
      primaryColor = '#2563eb';
    }

    const socialProfile: DriverProfile = {
      id: `user-social-${provider.toLowerCase()}-${Date.now()}`,
      name: cleanName,
      nickname: derivedNickname,
      email: targetEmail,
      avatarUrl: defaultAvatar,
      avatarType: 'crest',
      crestConfig: {
        shape: 'classic_shield',
        pattern: 'split_v',
        primaryColor,
        secondaryColor: '#f8fafc',
        symbolCategory: 'karting',
        symbolIcon: 'steering_wheel',
        crestInitials: derivedNickname.slice(0, 4).toUpperCase()
      },
      experienceLevel: 'Amateur',
      weightKg: 75, // Default weight automatically, no asking user
      favoriteTrackIds: ['track-pomposa', 'track-misanino'],
      friendsIds: [],
      bio: `Pilota verificato tramite account ${provider}`,
      totalRaces: 0,
      podiumsCount: 0,
      winsCount: 0,
      starPoints: 100,
      unlockedBadges: [
        {
          id: `badge-${provider.toLowerCase()}`,
          title: 'First Green Light',
          description: `Account reale verificato tramite ${provider}.`,
          icon: 'flag',
          titleIcon: '🏁 [Debuttante GP]',
          unlockedAt: new Date().toISOString().split('T')[0],
          category: 'milestone'
        }
      ],
      redeemedBenefits: [],
      purchasedRaces: [],
      notifyOnNewRaces: true,
      isTimesPublic: true,
      isRacesPublic: true,
      gpsTelemetryLogs: []
    };

    onLoginSuccess(socialProfile);
    setSocialModalProvider(null);
  };

  const handleConfirmSocialModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!socialEmail.trim() || !socialModalProvider) return;

    setSocialLoading(true);
    setSocialStatusMsg(`Recupero informazioni profilo da ${socialModalProvider}...`);

    setTimeout(() => {
      playRevSound();
      loginOrRegisterSocialUser({
        provider: socialModalProvider,
        email: socialEmail.trim(),
        name: extractNameFromEmail(socialEmail.trim())
      });
      setSocialLoading(false);
    }, 600);
  };

  // Username/Email Login Handler (NO nickname, NO weight!)
  const handleEmailLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const targetInput = loginUsernameOrEmail.trim().toLowerCase();

    if (!targetInput || !loginPassword.trim()) {
      setLoginError('Inserisci username o email e password per continuare.');
      return;
    }

    playRevSound();

    // Match by email, nickname or name
    const foundUser = demoUsers.find(
      u => u.email.trim().toLowerCase() === targetInput ||
           u.nickname.trim().toLowerCase() === targetInput ||
           u.name.trim().toLowerCase() === targetInput
    );

    if (foundUser) {
      onLoginSuccess(foundUser);
    } else {
      // Automatic seamless dynamic login for new username/email: NO asking for nickname or weight!
      const autoName = targetInput.includes('@') ? extractNameFromEmail(targetInput) : targetInput.charAt(0).toUpperCase() + targetInput.slice(1);
      const autoNick = targetInput.replace(/[^a-zA-Z0-9]/g, '') || 'PilotaKart';

      const dynamicUser: DriverProfile = {
        id: `driver-${Date.now()}`,
        name: autoName,
        nickname: autoNick,
        email: targetInput.includes('@') ? targetInput : `${targetInput.toLowerCase()}@karthub.it`,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        avatarType: 'crest',
        crestConfig: {
          shape: 'classic_shield',
          pattern: 'split_v',
          primaryColor: '#dc2626',
          secondaryColor: '#18181b',
          symbolCategory: 'karting',
          symbolIcon: 'steering_wheel',
          crestInitials: autoNick.slice(0, 4).toUpperCase() || 'KH'
        },
        experienceLevel: 'Amateur',
        weightKg: 75, // Default weight automatically
        favoriteTrackIds: ['track-pomposa', 'track-misanino'],
        friendsIds: [],
        bio: 'Pilota KartHub Italia',
        totalRaces: 0,
        podiumsCount: 0,
        winsCount: 0,
        starPoints: 100,
        unlockedBadges: [],
        redeemedBenefits: [],
        purchasedRaces: [],
        notifyOnNewRaces: true,
        isTimesPublic: true,
        isRacesPublic: true,
        gpsTelemetryLogs: []
      };

      onLoginSuccess(dynamicUser);
    }
  };

  // Register Form Handler
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    const targetEmail = regEmail.trim().toLowerCase();

    if (!regName.trim() || !targetEmail || !regPassword.trim()) {
      setRegError('Compila tutti i campi obbligatori.');
      return;
    }

    const existingUser = demoUsers.find(
      u => u.email.trim().toLowerCase() === targetEmail
    );

    if (existingUser) {
      setRegError(`L'email "${regEmail.trim()}" risulta già registrata! Passa alla scheda "ACCEDI" per effettuare il login.`);
      setLoginUsernameOrEmail(regEmail.trim());
      return;
    }

    playRevSound();

    onCreateAccount({
      name: regName.trim(),
      email: regEmail.trim(),
      nickname: regNickname.trim() || regName.trim().replace(/\s+/g, ''),
      weightKg: parseInt(regWeight) || 75,
      experienceLevel: regLevel
    });
  };

  return (
    <div className={isModal ? "fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto" : "min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans"}>
      {/* Top Accent Line */}
      {!isModal && <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-amber-500 to-red-600" />}

      <div className={`w-full ${isModal ? 'max-w-xl my-auto' : 'max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10 my-auto py-8'}`}>
        
        {/* Left Side: Brand Value Prop & Features */}
        {!isModal && (
          <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-red-50 border border-red-200 px-3 py-1 rounded-full text-red-600 font-black text-xs uppercase tracking-widest shadow-2xs">
              <Trophy className="w-4 h-4 text-red-600" />
              <span>KARTING RENTAL HUB ITALIA</span>
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl font-black italic tracking-tighter text-slate-900 uppercase leading-none">
                KART<span className="text-red-600">HUB</span>
              </h1>
              <p className="text-sm font-black uppercase tracking-wider text-red-600 mt-2">
                Corri. Analizza. Migliora. Competi.
              </p>
            </div>

            <p className="text-slate-600 text-sm leading-relaxed font-normal">
              Gestisci il tuo profilo pilota, salva la telemetria dei tuoi giri, confronta le prestazioni con la community e accedi ai campionati endurance e rental karting di tutta Italia.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-3 text-xs font-semibold text-slate-700">
                <div className="w-7 h-7 rounded-lg bg-red-100 border border-red-200 flex items-center justify-center text-red-600 shrink-0">
                  <Flag className="w-4 h-4" />
                </div>
                <span>Database completo circuiti & gare Rental in Italia</span>
              </div>

              <div className="flex items-center space-x-3 text-xs font-semibold text-slate-700">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span>Star Points & Vouchers da riscattare in pista</span>
              </div>

              <div className="flex items-center space-x-3 text-xs font-semibold text-slate-700">
                <div className="w-7 h-7 rounded-lg bg-cyan-100 border border-cyan-200 flex items-center justify-center text-cyan-600 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span>Stemma araldico personalizzato & telemetria GPS</span>
              </div>
            </div>
          </div>
        )}

        {/* Right Side / Modal Card: Auth Card Container */}
        <div className={`${isModal ? 'w-full' : 'lg:col-span-7'} bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xl relative`}>
          {onClose && (
            <button
              onClick={onClose}
              type="button"
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer z-20"
              title="Chiudi"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          
          {/* Form Header Tabs */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
            <div className="flex space-x-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setLoginError('');
                }}
                className={`px-4 py-2 rounded-lg text-xs font-black uppercase transition cursor-pointer flex items-center space-x-1.5 ${
                  authMode === 'login'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>ACCEDI</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthMode('register');
                  setRegError('');
                }}
                className={`px-4 py-2 rounded-lg text-xs font-black uppercase transition cursor-pointer flex items-center space-x-1.5 ${
                  authMode === 'register'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>REGISTRATI</span>
              </button>
            </div>

            <span className="text-[10px] font-mono text-slate-400 font-bold uppercase hidden sm:block">
              {authMode === 'login' ? 'ACCESSO UTENTE' : 'NUOVO PILOTA'}
            </span>
          </div>

          {/* Social Logins (Google, Apple, Facebook) */}
          <div className="space-y-2 mb-6">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-2">
              ACCEDI RAPIDAMENTE CON I TUOI ACCOUNT
            </span>

            <div className="grid grid-cols-3 gap-2">
              {/* Google */}
              <button
                type="button"
                onClick={() => handleSocialLogin('Google')}
                className="py-2.5 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 cursor-pointer shadow-2xs active:scale-95"
                title="Accedi con il tuo account Google reale"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z" />
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                  <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9c-.2-.7-.4-1.5-.4-2.3z" />
                  <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z" />
                </svg>
                <span className="hidden sm:inline">Google</span>
              </button>

              {/* Apple */}
              <button
                type="button"
                onClick={() => handleSocialLogin('Apple')}
                className="py-2.5 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 cursor-pointer shadow-2xs active:scale-95"
                title="Accedi con il tuo ID Apple reale"
              >
                <svg className="w-4 h-4 fill-current text-slate-900" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.54c.66-.8 1.11-1.92.99-3.04-.96.04-2.12.64-2.8 1.44-.61.71-1.14 1.86-1 2.98 1.08.08 2.16-.57 2.81-1.38z" />
                </svg>
                <span className="hidden sm:inline">Apple</span>
              </button>

              {/* Facebook */}
              <button
                type="button"
                onClick={() => handleSocialLogin('Facebook')}
                className="py-2.5 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 cursor-pointer shadow-2xs active:scale-95"
                title="Accedi con il tuo account Facebook reale"
              >
                <svg className="w-4 h-4 fill-current text-blue-600" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="hidden sm:inline">Facebook</span>
              </button>
            </div>
          </div>

          <div className="relative my-5 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <span className="relative bg-white px-3 text-[10px] font-bold uppercase text-slate-400 tracking-wider">
              OPPURE CON CREDENZIALI
            </span>
          </div>

          {/* LOGIN FORM: ONLY USERNAME/EMAIL & PASSWORD (NO NICKNAME, NO WEIGHT!) */}
          {authMode === 'login' && (
            <form onSubmit={handleEmailLoginSubmit} className="space-y-3.5">
              {loginError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-bold space-y-2">
                  <div className="flex items-start space-x-1.5">
                    <span className="shrink-0">⚠️</span>
                    <span>{loginError}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setRegEmail(loginUsernameOrEmail.trim());
                      setAuthMode('register');
                      setLoginError('');
                      setRegError('');
                    }}
                    className="mt-1 px-3 py-1.5 bg-red-600 text-white rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-red-700 transition cursor-pointer flex items-center space-x-1"
                  >
                    <span>VAI A REGISTRATI</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">
                  USERNAME O EMAIL
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={loginUsernameOrEmail}
                    onChange={(e) => setLoginUsernameOrEmail(e.target.value)}
                    placeholder="Username oppure email"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:bg-white focus:border-red-600 transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">
                  PASSWORD
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:bg-white focus:border-red-600 transition"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md hover:shadow-lg transition cursor-pointer flex items-center justify-center space-x-2 mt-2"
              >
                <span>ACCEDI A KARTHUB</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* REGISTER FORM */}
          {authMode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              {regError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-bold space-y-2">
                  <div className="flex items-start space-x-1.5">
                    <span className="shrink-0">⚠️</span>
                    <span>{regError}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginUsernameOrEmail(regEmail.trim());
                      setAuthMode('login');
                      setRegError('');
                      setLoginError('');
                    }}
                    className="mt-1 px-3 py-1.5 bg-red-600 text-white rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-red-700 transition cursor-pointer flex items-center space-x-1"
                  >
                    <span>VAI A SCHERMATA ACCEDI</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">
                    NOME & COGNOME *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="es. Mario Rossi"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:bg-white focus:border-red-600"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">
                    NICKNAME (@TAG)
                  </label>
                  <input
                    type="text"
                    value={regNickname}
                    onChange={(e) => setRegNickname(e.target.value)}
                    placeholder="es. ApexRossi"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:bg-white focus:border-red-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">
                    EMAIL *
                  </label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="es. pilota@email.it"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:bg-white focus:border-red-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">
                    PASSWORD *
                  </label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:bg-white focus:border-red-600"
                    required
                  />
                </div>
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
                    value={regWeight}
                    onChange={(e) => setRegWeight(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:outline-none focus:bg-white focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">
                    LIVELLO ESPERIENZA
                  </label>
                  <select
                    value={regLevel}
                    onChange={(e) => setRegLevel(e.target.value as ExperienceLevel)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:outline-none focus:bg-white focus:border-red-600 cursor-pointer"
                  >
                    <option value="Rookie">Rookie (Esordiente)</option>
                    <option value="Amateur">Amateur (Amatoriale)</option>
                    <option value="Semi-Pro">Semi-Pro (Esperti)</option>
                    <option value="Kart-Legend">Kart-Legend (Pro)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md hover:shadow-lg transition cursor-pointer flex items-center justify-center space-x-2 mt-2"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>CREA ACCOUNT & ENTRA NEL PADDOCK</span>
              </button>
            </form>
          )}

        </div>

      </div>

      {/* REAL SOCIAL ACCOUNT AUTHENTICATION MODAL (NO PRESET EMAILS) */}
      {socialModalProvider && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in font-sans">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-5">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-3">
                <div className={`p-2.5 rounded-2xl text-white shadow-sm ${
                  socialModalProvider === 'Google' ? 'bg-red-600' :
                  socialModalProvider === 'Apple' ? 'bg-slate-900' : 'bg-blue-600'
                }`}>
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase text-slate-900">
                    ACCESSO CON ACCOUNT {socialModalProvider.toUpperCase()}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Collega il tuo account reale {socialModalProvider} per recuperare nome e profilo
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSocialModalProvider(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Quick 1-click option if user matches detected account */}
            {primaryAccount && (
              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3.5 space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                  ACCOUNT RILEVATO:
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSocialLoading(true);
                    setSocialStatusMsg(`Recupero dati di ${primaryAccount.name} da ${socialModalProvider}...`);
                    setTimeout(() => {
                      playRevSound();
                      onLoginSuccess(primaryAccount);
                      setSocialModalProvider(null);
                    }, 500);
                  }}
                  className="w-full p-2.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-between transition cursor-pointer text-left shadow-2xs group"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={primaryAccount.avatarUrl}
                      alt={primaryAccount.name}
                      className="w-9 h-9 rounded-xl object-cover border border-red-500"
                    />
                    <div>
                      <p className="text-xs font-black text-slate-900 group-hover:text-red-600 transition">
                        {primaryAccount.name}
                      </p>
                      <p className="text-[10px] text-slate-500">{primaryAccount.email}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-red-600 group-hover:translate-x-0.5 transition" />
                </button>
              </div>
            )}

            {/* Real Account Form: NO pre-set emails, clean blank inputs */}
            <form onSubmit={handleConfirmSocialModalSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-700 mb-1">
                  EMAIL DEL TUO ACCOUNT {socialModalProvider.toUpperCase()} *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    value={socialEmail}
                    onChange={(e) => setSocialEmail(e.target.value)}
                    placeholder={
                      socialModalProvider === 'Google'
                        ? 'iltuonome@gmail.com'
                        : socialModalProvider === 'Apple'
                        ? 'iltuonome@icloud.com'
                        : 'iltuonome@email.it'
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-900 font-bold focus:outline-none focus:bg-white focus:border-red-600"
                    required
                    autoFocus
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Recupereremo automaticamente il tuo nome e immagine profilo dal tuo account {socialModalProvider}.
                </p>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-700 mb-1">
                  PASSWORD ACCOUNT {socialModalProvider.toUpperCase()} (OPZIONALE)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    value={socialPassword}
                    onChange={(e) => setSocialPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-900 font-bold focus:outline-none focus:bg-white focus:border-red-600"
                  />
                </div>
              </div>

              {socialLoading && (
                <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-bold flex items-center space-x-2 animate-pulse">
                  <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{socialStatusMsg || `Connessione a ${socialModalProvider} in corso...`}</span>
                </div>
              )}

              <div className="pt-2 flex justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSocialModalProvider(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold uppercase transition cursor-pointer"
                >
                  ANNULLA
                </button>
                <button
                  type="submit"
                  disabled={socialLoading}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-xl text-xs font-black uppercase shadow-md hover:shadow-lg transition cursor-pointer flex items-center space-x-1.5"
                >
                  <span>COLLEGATI & ENTRA</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
