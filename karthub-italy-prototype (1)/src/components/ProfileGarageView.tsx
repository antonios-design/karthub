import React, { useState, useMemo } from 'react';
import {
  DriverProfile,
  Track,
  TelemetryLog,
  TrophyBadge,
  FriendDriverProfile,
  FriendRequest,
  Race,
  CrestConfig,
  getBadgeSymbolOnly
} from '../types';
import { playRevSound } from '../lib/audio';
import { CrestAvatar } from './CrestAvatar';
import { CrestBuilderModal } from './CrestBuilderModal';
import {
  User,
  Trophy,
  Flame,
  Bell,
  ShieldCheck,
  MapPin,
  Gauge,
  Award,
  ChevronRight,
  Zap,
  CheckCircle,
  Sparkles,
  Gift,
  Activity,
  Ticket,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  UserCheck,
  Users,
  Search,
  ChevronDown,
  ChevronUp,
  Shield,
  Edit3,
  Settings,
  Clock,
  Car,
  Plus,
  AlertTriangle,
  Upload,
  Check,
  Camera,
  X,
  FolderArchive
} from 'lucide-react';

interface ProfileGarageViewProps {
  currentUser: DriverProfile;
  allUsers?: DriverProfile[];
  tracks: Track[];
  races: Race[];
  telemetryLogs: TelemetryLog[];
  allBadges: TrophyBadge[];
  communityFriends: FriendDriverProfile[];
  onToggleFavoriteTrack: (trackId: string) => void;
  onToggleNotifications: () => void;
  onOpenBenefitStore: () => void;
  onOpenGpsImport: () => void;
  onUpdatePrivacySettings: (timesVisibility: 'public' | 'friends' | 'private', racesVisibility: 'public' | 'friends' | 'private') => void;
  onSaveCrest: (avatarType: 'image' | 'crest', crestConfig: CrestConfig, avatarUrl: string) => void;
  onEquipTitleBadge: (badgeId: string | undefined) => void;
  onUpdateProfile?: (updated: Partial<DriverProfile>) => void;
  onAddFriend: (friendId: string) => void;
  onLogout?: () => void;
  onOpenExportCode?: () => void;
}

export const ProfileGarageView: React.FC<ProfileGarageViewProps> = ({
  currentUser,
  allUsers,
  tracks,
  races,
  telemetryLogs,
  allBadges,
  communityFriends,
  onToggleFavoriteTrack,
  onToggleNotifications,
  onOpenBenefitStore,
  onOpenGpsImport,
  onUpdatePrivacySettings,
  onSaveCrest,
  onEquipTitleBadge,
  onUpdateProfile,
  onAddFriend,
  onLogout,
  onOpenExportCode
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'performance' | 'friends' | 'badges' | 'tickets'>('performance');
  const [selectedReportTrackId, setSelectedReportTrackId] = useState<string>(tracks[0]?.id || 'track-misanino');
  const [isCrestModalOpen, setIsCrestModalOpen] = useState<boolean>(false);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState<boolean>(false);
  const [friendSearchQuery, setFriendSearchQuery] = useState<string>('');
  const [profileToast, setProfileToast] = useState<string | null>(null);

  const quickAvatarUploadRef = React.useRef<HTMLInputElement>(null);

  const handleQuickAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert('Immagine troppo pesante (max 10MB)!');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        onSaveCrest('image', currentUser.crestConfig || {
          shape: 'classic_shield',
          pattern: 'split_v',
          primaryColor: '#dc2626',
          secondaryColor: '#18181b',
          symbolCategory: 'karting',
          symbolIcon: 'steering_wheel',
          crestInitials: currentUser.nickname?.slice(0, 4).toUpperCase() || 'KH'
        }, dataUrl);
        try { playRevSound(); } catch {}
        setProfileToast('Nuova foto profilo caricata con successo dal dispositivo!');
        setTimeout(() => setProfileToast(null), 3500);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleOpenEditProfileModal = () => {
    setIsCrestModalOpen(true);
  };

  // Custom free sessions state (sessions not tied to official race schedule)
  const [isAddCustomSessionOpen, setIsAddCustomSessionOpen] = useState<boolean>(false);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [customSessions, setCustomSessions] = useState<Array<{
    id: string;
    type?: 'gara' | 'sessione_libera';
    title: string;
    date: string;
    trackId: string;
    trackName: string;
    bestLapFormatted: string;
    bestLapSeconds: number;
    s1Seconds?: number;
    s2Seconds?: number;
    s3Seconds?: number;
    startingGrid?: number;
    finishPosition?: number;
    totalTeams?: number;
    kartNumber: number;
    kartCategory?: string;
    notes?: string;
    verified: boolean;
    hasTelemetry: boolean;
    gpsDeviceType?: string;
  }>>(() => {
    try {
      const saved = localStorage.getItem(`kart_custom_free_sessions_${currentUser.id}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Friend Requests state (persisted across accounts)
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>(() => {
    try {
      const saved = localStorage.getItem('karthub_friend_requests');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Friend actions toast feedback
  const [friendToast, setFriendToast] = useState<string | null>(null);

  // Search query for "Cerca Nuovo Amico"
  const [searchNewFriendQuery, setSearchNewFriendQuery] = useState<string>('');

  // Custom session form state
  const [sessionType, setSessionType] = useState<'gara' | 'sessione_libera'>('sessione_libera');
  const [newSessionTitle, setNewSessionTitle] = useState('Sessione Libera');
  const [newSessionDate, setNewSessionDate] = useState(new Date().toISOString().split('T')[0]);
  const [newSessionBestLap, setNewSessionBestLap] = useState('00:48.500');
  const [newSessionS1, setNewSessionS1] = useState('15.200');
  const [newSessionS2, setNewSessionS2] = useState('18.400');
  const [newSessionS3, setNewSessionS3] = useState('14.900');
  const [newSessionKartNumber, setNewSessionKartNumber] = useState('12');
  const [newSessionKartCategory, setNewSessionKartCategory] = useState('Sodi RT8 390cc');
  const [newSessionStartGrid, setNewSessionStartGrid] = useState('4');
  const [newSessionFinishPos, setNewSessionFinishPos] = useState('2');
  const [newSessionTotalTeams, setNewSessionTotalTeams] = useState('20');
  const [newSessionNotes, setNewSessionNotes] = useState('');

  const DEFAULT_TRACK: Track = {
    id: 'track-default',
    name: 'Circuito Generico',
    region: 'Emilia-Romagna',
    province: 'IT',
    city: 'Italia',
    address: 'Via Circuito 1',
    lat: 44.8,
    lng: 12.1,
    lengthMeters: 1200,
    turnCount: 14,
    direction: 'clockwise',
    topSpeedKmh: 95,
    heroImageUrl: '',
    description: 'Circuito di prova',
    allTimeRecord: {
      timeSeconds: 58.0,
      timeFormatted: '0:58.000',
      driverName: 'Pro Driver',
      date: '2026-01-01',
      kartType: 'Sodi RT8 390cc'
    }
  };

  const handleAddCustomSessionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trackObj = tracks.find((t) => t.id === selectedReportTrackId) || tracks[0] || DEFAULT_TRACK;
    const isRace = sessionType === 'gara';

    if (editingSessionId) {
      // Edit existing session
      const updated = customSessions.map((s) => {
        if (s.id === editingSessionId) {
          return {
            ...s,
            type: sessionType,
            title: newSessionTitle.trim() || (isRace ? 'Gara Ufficiale' : 'Sessione Libera'),
            date: newSessionDate || new Date().toISOString().split('T')[0],
            trackId: trackObj.id,
            trackName: trackObj.name,
            bestLapFormatted: newSessionBestLap.trim() || '00:48.500',
            bestLapSeconds: parseFloat(newSessionBestLap.replace(/[^0-9.]/g, '')) || 48.5,
            s1Seconds: parseFloat(newSessionS1) || 15.2,
            s2Seconds: parseFloat(newSessionS2) || 18.4,
            s3Seconds: parseFloat(newSessionS3) || 14.9,
            startingGrid: isRace ? (parseInt(newSessionStartGrid) || 1) : undefined,
            finishPosition: isRace ? (parseInt(newSessionFinishPos) || 1) : undefined,
            totalTeams: isRace ? (parseInt(newSessionTotalTeams) || 10) : undefined,
            kartNumber: parseInt(newSessionKartNumber) || 12,
            kartCategory: newSessionKartCategory || 'Sodi RT8 390cc',
            notes: newSessionNotes
          };
        }
        return s;
      });
      setCustomSessions(updated);
      try {
        localStorage.setItem(`kart_custom_free_sessions_${currentUser.id}`, JSON.stringify(updated));
      } catch {}
      setEditingSessionId(null);
    } else {
      // Create new session
      const newSess = {
        id: `custom-sess-${Date.now()}`,
        type: sessionType,
        title: newSessionTitle.trim() || (isRace ? 'Gara Ufficiale' : 'Sessione Libera'),
        date: newSessionDate || new Date().toISOString().split('T')[0],
        trackId: trackObj.id,
        trackName: trackObj.name,
        bestLapFormatted: newSessionBestLap.trim() || '00:48.500',
        bestLapSeconds: parseFloat(newSessionBestLap.replace(/[^0-9.]/g, '')) || 48.5,
        s1Seconds: parseFloat(newSessionS1) || 15.2,
        s2Seconds: parseFloat(newSessionS2) || 18.4,
        s3Seconds: parseFloat(newSessionS3) || 14.9,
        startingGrid: isRace ? (parseInt(newSessionStartGrid) || 1) : undefined,
        finishPosition: isRace ? (parseInt(newSessionFinishPos) || 1) : undefined,
        totalTeams: isRace ? (parseInt(newSessionTotalTeams) || 10) : undefined,
        kartNumber: parseInt(newSessionKartNumber) || 12,
        kartCategory: newSessionKartCategory || 'Sodi RT8 390cc',
        notes: newSessionNotes,
        verified: false,
        hasTelemetry: false
      };

      const updated = [newSess, ...customSessions];
      setCustomSessions(updated);
      try {
        localStorage.setItem(`kart_custom_free_sessions_${currentUser.id}`, JSON.stringify(updated));
      } catch {}
    }

    setIsAddCustomSessionOpen(false);
  };

  const handleOpenEditSessionModal = (sess: typeof customSessions[0]) => {
    setEditingSessionId(sess.id);
    setSessionType(sess.type || 'sessione_libera');
    setNewSessionTitle(sess.title);
    setNewSessionDate(sess.date);
    setNewSessionBestLap(sess.bestLapFormatted);
    setNewSessionS1(sess.s1Seconds ? String(sess.s1Seconds) : '15.2');
    setNewSessionS2(sess.s2Seconds ? String(sess.s2Seconds) : '18.4');
    setNewSessionS3(sess.s3Seconds ? String(sess.s3Seconds) : '14.9');
    setNewSessionKartNumber(String(sess.kartNumber || 12));
    setNewSessionKartCategory(sess.kartCategory || 'Sodi RT8 390cc');
    setNewSessionStartGrid(sess.startingGrid ? String(sess.startingGrid) : '4');
    setNewSessionFinishPos(sess.finishPosition ? String(sess.finishPosition) : '2');
    setNewSessionTotalTeams(sess.totalTeams ? String(sess.totalTeams) : '20');
    setNewSessionNotes(sess.notes || '');
    setIsAddCustomSessionOpen(true);
  };

  const handleDeleteSession = (sessionId: string) => {
    const updated = customSessions.filter((s) => s.id !== sessionId);
    setCustomSessions(updated);
    try {
      localStorage.setItem(`kart_custom_free_sessions_${currentUser.id}`, JSON.stringify(updated));
    } catch {}
  };

  const handleAttachTelemetryToSession = (sessionId: string) => {
    const updated = customSessions.map((s) => {
      if (s.id === sessionId) {
        return {
          ...s,
          verified: true,
          hasTelemetry: true,
          gpsDeviceType: 'MyChron5 GPS'
        };
      }
      return s;
    });
    setCustomSessions(updated);
    try {
      localStorage.setItem('kart_custom_free_sessions', JSON.stringify(updated));
    } catch {
      // fallback
    }
    onOpenGpsImport();
  };

  // Determine active primary category
  const activeMainCategory: 'performance' | 'friends' | 'badges' | 'garage' =
    activeSubTab === 'performance'
      ? 'performance'
      : activeSubTab === 'friends'
      ? 'friends'
      : activeSubTab === 'badges'
      ? 'badges'
      : 'garage';

  // Filter user's logs
  const myLogs = telemetryLogs.filter((l) => l.driverId === currentUser.id);

  // Currently selected track for report
  const selectedTrack = tracks.find((t) => t.id === selectedReportTrackId) || tracks[0] || DEFAULT_TRACK;

  // Logs for selected track
  const trackLogs = myLogs.filter(
    (l) =>
      l.trackId === selectedTrack.id ||
      l.trackName.toLowerCase().includes((selectedTrack.name || '').toLowerCase()) ||
      (selectedTrack.name || '').toLowerCase().includes(l.trackName.toLowerCase())
  );

  // GPS Telemetry logs for selected track
  const trackGpsLogs = (currentUser.gpsTelemetryLogs || []).filter(
    (g) =>
      g.trackName.toLowerCase().includes((selectedTrack.name || '').toLowerCase()) ||
      (selectedTrack.name || '').toLowerCase().includes(g.trackName.toLowerCase())
  );

  // Custom free practice sessions for selected track
  const trackCustomSessions = customSessions.filter(
    (s) =>
      s.trackId === selectedTrack.id ||
      s.trackName.toLowerCase().includes((selectedTrack.name || '').toLowerCase()) ||
      (selectedTrack.name || '').toLowerCase().includes(s.trackName.toLowerCase())
  );

  // Calculate Personal Best for selected track
  let personalBestSeconds: number | null = null;
  let personalBestFormatted: string = '--:--.---';
  let personalBestDate: string = 'Nessuna data';

  trackLogs.forEach((l) => {
    if (personalBestSeconds === null || l.bestLapSeconds < personalBestSeconds) {
      personalBestSeconds = l.bestLapSeconds;
      personalBestFormatted = l.bestLapFormatted;
      personalBestDate = l.date;
    }
  });

  trackCustomSessions.forEach((s) => {
    if (personalBestSeconds === null || s.bestLapSeconds < personalBestSeconds) {
      personalBestSeconds = s.bestLapSeconds;
      personalBestFormatted = s.bestLapFormatted;
      personalBestDate = s.date;
    }
  });

  trackGpsLogs.forEach((g) => {
    if (personalBestSeconds === null || g.bestLapSeconds < personalBestSeconds) {
      personalBestSeconds = g.bestLapSeconds;
      personalBestFormatted = g.bestLapFormatted;
      personalBestDate = g.importedAt || 'GPS Data';
    }
  });

  const trackRecordSeconds = selectedTrack.allTimeRecord?.timeSeconds || 58.0;
  const deltaToTrackRecord =
    personalBestSeconds !== null ? (personalBestSeconds - trackRecordSeconds).toFixed(3) : null;

  const timesVis: 'public' | 'friends' | 'private' = currentUser.timesVisibility || (currentUser.isTimesPublic === false ? 'private' : 'public');
  const racesVis: 'public' | 'friends' | 'private' = currentUser.racesVisibility || (currentUser.isRacesPublic === false ? 'private' : 'public');

  // Find currently equipped badge
  const equippedBadge = allBadges.find((b) => b.id === currentUser.activeTitleBadgeId);

  // Combine all available drivers from communityFriends and allUsers
  const combinedAllDrivers = useMemo(() => {
    const map = new Map<string, FriendDriverProfile>();

    // Add communityFriends
    communityFriends.forEach((f) => {
      map.set(f.id, f);
    });

    // Add or update with allUsers
    if (allUsers) {
      allUsers.forEach((u) => {
        if (!map.has(u.id)) {
          map.set(u.id, {
            id: u.id,
            name: u.name,
            nickname: u.nickname || u.name || 'Pilota',
            avatarUrl: u.avatarUrl,
            avatarType: u.avatarType,
            crestConfig: u.crestConfig,
            activeTitleBadge: u.activeTitleBadgeId
              ? {
                  id: u.activeTitleBadgeId,
                  title: 'Titolo Equipaggiato',
                  titleIcon: '🏆 [Pilota GP]'
                }
              : undefined,
            experienceLevel: u.experienceLevel,
            weightKg: u.weightKg,
            bio: u.bio || 'Pilota KarTHUB',
            registeredRaceIds: [],
            personalBests: [],
            isTimesPublic: u.isTimesPublic !== false,
            isRacesPublic: u.isRacesPublic !== false
          });
        }
      });
    }

    return Array.from(map.values());
  }, [communityFriends, allUsers]);

  // Actual friends list matching currentUser.friendsIds (starts at 0 for new users)
  const myFriends = useMemo(() => {
    return combinedAllDrivers.filter((f) => currentUser.friendsIds.includes(f.id));
  }, [combinedAllDrivers, currentUser.friendsIds]);

  const filteredFriends = useMemo(() => {
    if (!friendSearchQuery.trim()) return myFriends;
    const q = friendSearchQuery.toLowerCase();
    return myFriends.filter(
      (f) =>
        (f.name || '').toLowerCase().includes(q) ||
        (f.nickname || '').toLowerCase().includes(q)
    );
  }, [myFriends, friendSearchQuery]);

  // Incoming friend requests for current user
  const incomingRequests = useMemo(() => {
    return friendRequests.filter(
      (r) => r.receiverId === currentUser.id && r.status === 'pending'
    );
  }, [friendRequests, currentUser.id]);

  // Sent pending requests by current user
  const sentPendingRequests = useMemo(() => {
    return friendRequests.filter(
      (r) => r.senderId === currentUser.id && r.status === 'pending'
    );
  }, [friendRequests, currentUser.id]);

  // Candidate drivers to add as new friends (excluding current user and existing friends)
  const newFriendCandidates = useMemo(() => {
    const rawQuery = searchNewFriendQuery.trim();
    if (!rawQuery) return []; // STRICT: No auto suggestions when search query is empty

    const queryLower = rawQuery.toLowerCase();
    const queryTerms = queryLower.split(/\s+/).filter(Boolean);

    const nonFriends = combinedAllDrivers.filter(
      (f) => f.id !== currentUser.id && !currentUser.friendsIds.includes(f.id)
    );

    const scored = nonFriends.map((f) => {
      const name = (f.name || '').toLowerCase();
      const nickname = (f.nickname || '').toLowerCase();
      const bio = (f.bio || '').toLowerCase();
      const level = (f.experienceLevel || '').toLowerCase();

      let score = 0;

      // Exact full or partial match
      if (name.includes(queryLower) || nickname.includes(queryLower)) {
        score += 100;
        if (name.startsWith(queryLower) || nickname.startsWith(queryLower)) score += 50;
      }

      if (name === queryLower || nickname === queryLower) score += 200;

      // Match individual query terms (flexible / fuzzy alternative matching)
      for (const term of queryTerms) {
        if (name.includes(term)) score += 25;
        if (nickname.includes(term)) score += 25;
        if (bio.includes(term)) score += 15;
        if (level.includes(term)) score += 10;
      }

      return { driver: f, score };
    });

    return scored
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.driver);
  }, [combinedAllDrivers, currentUser.id, currentUser.friendsIds, searchNewFriendQuery]);

  const handleSaveFriendRequests = (updated: FriendRequest[]) => {
    setFriendRequests(updated);
    try {
      localStorage.setItem('karthub_friend_requests', JSON.stringify(updated));
    } catch {}
  };

  const handleSendFriendRequest = (targetUser: FriendDriverProfile) => {
    const newReq: FriendRequest = {
      id: `freq-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderNickname: currentUser?.nickname || currentUser?.name || 'Pilota',
      senderAvatarUrl: currentUser.avatarUrl,
      senderAvatarType: currentUser.avatarType,
      senderCrestConfig: currentUser.crestConfig,
      receiverId: targetUser.id,
      receiverName: targetUser.name,
      timestamp: 'Pochi secondi fa',
      status: 'pending'
    };

    const updated = [newReq, ...friendRequests];
    handleSaveFriendRequests(updated);
    try { playRevSound(); } catch {}
    setFriendToast(`Richiesta di amicizia inviata a ${targetUser.name}! 📩`);
    setTimeout(() => setFriendToast(null), 3500);
  };

  const handleAcceptRequest = (req: FriendRequest) => {
    onAddFriend(req.senderId);

    const updated = friendRequests.filter((r) => r.id !== req.id);
    handleSaveFriendRequests(updated);

    try { playRevSound(); } catch {}
    setFriendToast(`Richiesta accettata! Ora sei amico di ${req.senderName}! 🎉`);
    setTimeout(() => setFriendToast(null), 3500);
  };

  const handleDeclineRequest = (req: FriendRequest) => {
    const updated = friendRequests.filter((r) => r.id !== req.id);
    handleSaveFriendRequests(updated);

    setFriendToast(`Richiesta di amicizia da ${req.senderName} rifiutata.`);
    setTimeout(() => setFriendToast(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 pb-24 space-y-6">
      {/* Driver Header Card - Bento Container */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4 relative">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center space-x-4">
            {/* Hidden Direct File Input for Fast Device Photo Upload */}
            <input
              ref={quickAvatarUploadRef}
              type="file"
              accept="image/*"
              onChange={handleQuickAvatarUpload}
              className="hidden"
            />

            {/* Avatar / Crest Display with Edit & Camera Buttons */}
            <div className="relative group">
              <div
                onClick={() => setIsCrestModalOpen(true)}
                className="cursor-pointer"
                title="Clicca per modificare stemma e profilo"
              >
                {currentUser.avatarType === 'crest' && currentUser.crestConfig ? (
                  <CrestAvatar crest={currentUser.crestConfig} size="lg" />
                ) : (
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-red-600 shadow-md group-hover:scale-102 transition"
                  />
                )}
              </div>

              {/* Fast Action Buttons: Camera (Instant photo upload) & Pencil (Full stemma & profile editor) */}
              <div className="absolute -bottom-1 -right-1 flex items-center space-x-1">
                <button
                  type="button"
                  onClick={() => quickAvatarUploadRef.current?.click()}
                  className="p-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-md transition cursor-pointer flex items-center justify-center border border-slate-700 active:scale-95"
                  title="Carica subito una foto dal dispositivo"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsCrestModalOpen(true)}
                  className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-md transition cursor-pointer flex items-center justify-center active:scale-95"
                  title="Modifica Foto, Stemma e Profilo"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-extrabold uppercase text-slate-900 tracking-tight flex items-center gap-2">
                  <span>{currentUser.name}</span>
                  {equippedBadge?.titleIcon && (
                    <span className="text-sm px-2 py-0.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-300 font-extrabold shadow-sm" title={equippedBadge.title}>
                      {getBadgeSymbolOnly(equippedBadge.titleIcon)}
                    </span>
                  )}
                </h1>

                <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold uppercase bg-red-600 text-white shadow-sm">
                  {currentUser.experienceLevel}
                </span>
              </div>

              <p className="text-xs text-slate-500 font-medium flex flex-wrap items-center gap-3">
                <span>@{currentUser?.nickname || 'pilota'}</span>
                <span>• Peso Pilota: <strong className="text-slate-900">{currentUser.weightKg} kg</strong></span>
              </p>

              <div className="flex items-center space-x-2 pt-0.5">
                <p className="text-xs text-slate-600 font-sans italic">
                  "{currentUser.bio}"
                </p>
                <button
                  type="button"
                  onClick={handleOpenEditProfileModal}
                  className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-red-600 transition cursor-pointer shrink-0"
                  title="Modifica scritta di presentazione sotto al nome"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Action CTAs: Modifica Profilo, Benefit & Impostazioni */}
          <div className="flex flex-wrap items-center gap-2 text-xs w-full lg:w-auto">
            <button
              type="button"
              onClick={handleOpenEditProfileModal}
              className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold transition cursor-pointer flex items-center space-x-1.5 uppercase shadow-sm"
            >
              <Edit3 className="w-4 h-4 text-red-500" />
              <span>MODIFICA PROFILO</span>
            </button>

            <button
              onClick={onOpenBenefitStore}
              className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold transition cursor-pointer flex items-center space-x-2 uppercase shadow-sm tracking-wide"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>BENEFIT ({currentUser.starPoints} PTS)</span>
            </button>

            {/* Profile Settings Menu */}
            <div className="relative z-50">
              <button
                onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
                className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 font-bold transition cursor-pointer flex items-center space-x-1.5 uppercase"
              >
                <Settings className="w-4 h-4 text-slate-600" />
                <span>IMPOSTAZIONI</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showSettingsDropdown && (
                <div className="absolute right-0 mt-1.5 w-72 sm:w-80 max-w-[calc(100vw-2rem)] bg-white border border-slate-200/90 rounded-2xl shadow-2xl p-3.5 z-50 space-y-2.5 animate-fade-in text-xs ring-1 ring-slate-900/5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                    <span className="font-black uppercase text-[11px] text-slate-900 flex items-center gap-1.5 tracking-tight">
                      <Settings className="w-3.5 h-3.5 text-red-600" />
                      IMPOSTAZIONI PROFILO
                    </span>
                    <button onClick={() => setShowSettingsDropdown(false)} className="text-slate-400 hover:text-slate-600 p-0.5">
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-2 pt-0.5">
                    {/* Tempi e Record su Pista */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-700 font-extrabold uppercase">Tempi e Record su Pista</span>
                        <span className="font-black uppercase text-red-600 text-[9px]">
                          {timesVis === 'public' ? 'PUBBLICI 👁️' : timesVis === 'friends' ? 'AMICI 👥' : 'PRIVATO 🔒'}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-1 bg-slate-100/90 p-0.5 rounded-lg">
                        <button
                          type="button"
                          onClick={() => onUpdatePrivacySettings('public', racesVis)}
                          className={`py-1 px-1.5 rounded text-[9px] font-black uppercase transition cursor-pointer text-center ${
                            timesVis === 'public'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          PUBBLICI
                        </button>
                        <button
                          type="button"
                          onClick={() => onUpdatePrivacySettings('friends', racesVis)}
                          className={`py-1 px-1.5 rounded text-[9px] font-black uppercase transition cursor-pointer text-center ${
                            timesVis === 'friends'
                              ? 'bg-cyan-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          AMICI
                        </button>
                        <button
                          type="button"
                          onClick={() => onUpdatePrivacySettings('private', racesVis)}
                          className={`py-1 px-1.5 rounded text-[9px] font-black uppercase transition cursor-pointer text-center ${
                            timesVis === 'private'
                              ? 'bg-slate-900 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          PRIVATO
                        </button>
                      </div>
                    </div>

                    {/* Gare e Partecipazioni */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-700 font-extrabold uppercase">Gare e Partecipazioni</span>
                        <span className="font-black uppercase text-red-600 text-[9px]">
                          {racesVis === 'public' ? 'PUBBLICI 👁️' : racesVis === 'friends' ? 'AMICI 👥' : 'PRIVATO 🔒'}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-1 bg-slate-100/90 p-0.5 rounded-lg">
                        <button
                          type="button"
                          onClick={() => onUpdatePrivacySettings(timesVis, 'public')}
                          className={`py-1 px-1.5 rounded text-[9px] font-black uppercase transition cursor-pointer text-center ${
                            racesVis === 'public'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          PUBBLICI
                        </button>
                        <button
                          type="button"
                          onClick={() => onUpdatePrivacySettings(timesVis, 'friends')}
                          className={`py-1 px-1.5 rounded text-[9px] font-black uppercase transition cursor-pointer text-center ${
                            racesVis === 'friends'
                              ? 'bg-cyan-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          AMICI
                        </button>
                        <button
                          type="button"
                          onClick={() => onUpdatePrivacySettings(timesVis, 'private')}
                          className={`py-1 px-1.5 rounded text-[9px] font-black uppercase transition cursor-pointer text-center ${
                            racesVis === 'private'
                              ? 'bg-slate-900 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          PRIVATO
                        </button>
                      </div>
                    </div>

                    {/* Notifications */}
                    <div className="space-y-1 pt-1.5 border-t border-slate-100">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-700 font-extrabold uppercase">Avvisi Nuove Gare</span>
                        <span className="font-black uppercase text-red-600 text-[9px]">
                          {currentUser.notifyOnNewRaces ? 'ATTIVI 🔔' : 'DISATTIVI 🔕'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-1 bg-slate-100/90 p-0.5 rounded-lg">
                        <button
                          type="button"
                          onClick={() => {
                            if (!currentUser.notifyOnNewRaces) onToggleNotifications();
                          }}
                          className={`py-1 px-1.5 rounded text-[9px] font-black uppercase transition cursor-pointer text-center ${
                            currentUser.notifyOnNewRaces
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          ATTIVI
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (currentUser.notifyOnNewRaces) onToggleNotifications();
                          }}
                          className={`py-1 px-1.5 rounded text-[9px] font-black uppercase transition cursor-pointer text-center ${
                            !currentUser.notifyOnNewRaces
                              ? 'bg-slate-900 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          DISATTIVI
                        </button>
                      </div>
                    </div>

                    {/* Export Code Link */}
                    {onOpenExportCode && (
                      <div className="pt-2 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => {
                            setShowSettingsDropdown(false);
                            onOpenExportCode();
                          }}
                          className="w-full py-1.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[10px] font-black uppercase transition cursor-pointer flex items-center justify-center space-x-1.5 shadow-sm"
                        >
                          <FolderArchive className="w-3.5 h-3.5 text-red-400" />
                          <span>ESPORTA CODICE (.ZIP)</span>
                        </button>
                      </div>
                    )}

                    {onLogout && (
                      <div className="pt-2 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={onLogout}
                          className="w-full py-1.5 px-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[10px] font-black uppercase transition cursor-pointer flex items-center justify-center space-x-1.5 shadow-sm"
                        >
                          <Settings className="w-3.5 h-3.5" />
                          <span>DISCONNETTI / CAMBIA ACCOUNT</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-3 border-t border-slate-100 text-center">
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <p className="text-[9px] font-bold text-slate-400 tracking-wider uppercase">STAR POINTS</p>
            <p className="text-base font-extrabold text-red-600 mt-0.5">{currentUser.starPoints} PTS</p>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <p className="text-[9px] font-bold text-slate-400 tracking-wider uppercase">GARE TOTALI</p>
            <p className="text-base font-extrabold text-slate-900 mt-0.5">{currentUser.totalRaces}</p>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <p className="text-[9px] font-bold text-slate-400 tracking-wider uppercase">PODI</p>
            <p className="text-base font-extrabold text-red-600 mt-0.5">{currentUser.podiumsCount} 🏆</p>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <p className="text-[9px] font-bold text-slate-400 tracking-wider uppercase">VITTORIE</p>
            <p className="text-base font-extrabold text-emerald-600 mt-0.5">{currentUser.winsCount} 🥇</p>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 col-span-2 sm:col-span-1">
            <p className="text-[9px] font-bold text-slate-400 tracking-wider uppercase">TROFEI SBLOCCATI</p>
            <p className="text-base font-extrabold text-red-600 mt-0.5">{currentUser.unlockedBadges.length} / {allBadges.length}</p>
          </div>
        </div>
      </div>

      {/* Primary Category Grid Navigation (Symmetrical 4-Column Layout) */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
          <button
            onClick={() => setActiveSubTab('performance')}
            className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex items-center justify-between ${
              activeMainCategory === 'performance'
                ? 'bg-red-600 text-white border-red-600 shadow-md ring-2 ring-red-300'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <div>
              <h3 className="text-xs font-black uppercase tracking-tight">PRESTAZIONI & TEMPI</h3>
            </div>
            <Clock className={`w-5 h-5 ${activeMainCategory === 'performance' ? 'text-white' : 'text-red-600'}`} />
          </button>

          <button
            onClick={() => setActiveSubTab('friends')}
            className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex items-center justify-between ${
              activeMainCategory === 'friends'
                ? 'bg-red-600 text-white border-red-600 shadow-md ring-2 ring-red-300'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center space-x-1.5">
              <h3 className="text-xs font-black uppercase tracking-tight">AMICI</h3>
              {incomingRequests.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-900 text-[9px] font-black animate-pulse">
                  {incomingRequests.length}
                </span>
              )}
            </div>
            <Users className={`w-5 h-5 ${activeMainCategory === 'friends' ? 'text-white' : 'text-red-600'}`} />
          </button>

          <button
            onClick={() => setActiveSubTab('badges')}
            className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex items-center justify-between ${
              activeMainCategory === 'badges'
                ? 'bg-red-600 text-white border-red-600 shadow-md ring-2 ring-red-300'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <div>
              <h3 className="text-xs font-black uppercase tracking-tight">TROFEI & TITOLI</h3>
            </div>
            <Trophy className={`w-5 h-5 ${activeMainCategory === 'badges' ? 'text-white' : 'text-amber-500'}`} />
          </button>

          <button
            onClick={() => setActiveSubTab('tickets')}
            className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex items-center justify-between ${
              activeMainCategory === 'garage'
                ? 'bg-red-600 text-white border-red-600 shadow-md ring-2 ring-red-300'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <div>
              <h3 className="text-xs font-black uppercase tracking-tight">GARAGE GARE</h3>
            </div>
            <Ticket className={`w-5 h-5 ${activeMainCategory === 'garage' ? 'text-white' : 'text-red-600'}`} />
          </button>
        </div>
      </div>

      {/* 1. REPORT PRESTAZIONI UNIFICATO PER CIRCUITO */}
      {activeSubTab === 'performance' && (
        <div className="space-y-6">
          {/* Circuit Selector Header */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center space-x-2 mb-1">
                  <MapPin className="w-4 h-4 text-red-600" />
                  <span>REPORT PRESTAZIONI PER CIRCUITO</span>
                </h3>
                <p className="text-xs text-slate-500 font-sans mb-3">
                  Seleziona la pista dal menu a tendina per analizzare il tuo record, la telemetria e lo storico delle sessioni.
                </p>

                {/* Dropdown Menu for All Circuits */}
                <div className="relative max-w-xl">
                  <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                    CIRCUITO SELEZIONATO ({tracks.length} PISTE)
                  </label>
                  <div className="relative">
                    <select
                      value={selectedReportTrackId}
                      onChange={(e) => setSelectedReportTrackId(e.target.value)}
                      className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-900 font-extrabold text-xs uppercase rounded-xl px-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 cursor-pointer shadow-sm pr-10 transition"
                    >
                      {tracks.map((track) => (
                        <option key={track.id} value={track.id} className="py-1 text-slate-900 font-bold">
                          📍 {track.name} — {track.city} ({track.region}) • {track.lengthMeters}m
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    setSessionType('sessione_libera');
                    setNewSessionTitle('Sessione Libera');
                    setIsAddCustomSessionOpen(true);
                  }}
                  className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-extrabold uppercase shadow-xs cursor-pointer transition flex items-center space-x-1.5"
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-400" />
                  <span>+ AGGIUNGI GARA / SESSIONE LIBERA</span>
                </button>

                <button
                  onClick={onOpenGpsImport}
                  className="px-3.5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-extrabold uppercase shadow-xs cursor-pointer transition flex items-center space-x-1.5"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>+ IMPORTA TELEMETRIA GPS</span>
                </button>
              </div>
            </div>
          </div>

          {/* Modal to Add Race or Free Practice Session */}
          {isAddCustomSessionOpen && (
            <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
              <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 my-auto relative text-slate-900 font-sans">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-slate-100 text-slate-900 rounded-xl">
                      <Clock className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-black text-sm uppercase text-slate-900">AGGIUNGI GARA / SESSIONE LIBERA</h3>
                      <p className="text-[11px] text-slate-500">Inserisci i dati della tua sessione o gara in pista</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsAddCustomSessionOpen(false)}
                    className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleAddCustomSessionSubmit} className="space-y-3.5 text-xs">
                  {/* Session Type Toggle */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-extrabold uppercase text-slate-500">TIPO DI SESSIONE</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSessionType('gara');
                          if (newSessionTitle === 'Sessione Libera') {
                            setNewSessionTitle('');
                          }
                        }}
                        className={`py-2.5 px-3 rounded-xl font-extrabold uppercase text-xs flex items-center justify-center space-x-1.5 transition cursor-pointer border ${
                          sessionType === 'gara'
                            ? 'bg-red-600 text-white border-red-600 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <Trophy className="w-4 h-4" />
                        <span>GARA</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSessionType('sessione_libera');
                          setNewSessionTitle('Sessione Libera');
                        }}
                        className={`py-2.5 px-3 rounded-xl font-extrabold uppercase text-xs flex items-center justify-center space-x-1.5 transition cursor-pointer border ${
                          sessionType === 'sessione_libera'
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <Clock className="w-4 h-4 text-emerald-400" />
                        <span>SESSIONE LIBERA</span>
                      </button>
                    </div>
                  </div>

                  {/* Circuit & Date */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase text-slate-600 mb-1">CIRCUITO</label>
                      <input
                        type="text"
                        value={selectedTrack.name}
                        disabled
                        className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 font-extrabold text-slate-700 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase text-slate-600 mb-1">DATA SESSIONE</label>
                      <input
                        type="date"
                        value={newSessionDate}
                        onChange={(e) => setNewSessionDate(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600"
                        required
                      />
                    </div>
                  </div>

                  {/* Event Title & Kart Category */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase text-slate-600 mb-1">
                        {sessionType === 'gara' ? 'NOME EVENTO / GARA *' : 'TITOLO SESSIONE'}
                      </label>
                      <input
                        type="text"
                        placeholder={sessionType === 'gara' ? 'es. Gran Premio Sprint Cup' : 'Sessione Libera'}
                        value={newSessionTitle}
                        onChange={(e) => setNewSessionTitle(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase text-slate-600 mb-1">CATEGORIA KART</label>
                      <input
                        type="text"
                        placeholder="es. Sodi RT8 390cc"
                        value={newSessionKartCategory}
                        onChange={(e) => setNewSessionKartCategory(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600"
                      />
                    </div>
                  </div>

                  {/* Lap Times & Sectors */}
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex justify-between items-center text-red-600 font-extrabold text-[11px]">
                      <span>⏱️ TEMPI SUL GIRO & SETTORI</span>
                      <span className="text-[9px] text-slate-400 font-normal">(es. 00:48.500 o 15.2)</span>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      <div>
                        <label className="text-[9px] text-emerald-600 font-extrabold block mb-0.5 uppercase">BEST LAP</label>
                        <input
                          type="text"
                          value={newSessionBestLap}
                          onChange={(e) => setNewSessionBestLap(e.target.value)}
                          placeholder="00:48.500"
                          className="w-full bg-white border border-emerald-300 rounded-xl px-2 py-1.5 text-emerald-700 font-black text-center focus:outline-none shadow-2xs"
                          required
                        />
                      </div>

                      <div>
                        <label className="text-[9px] text-slate-500 font-bold block mb-0.5 uppercase">SETTORE 1</label>
                        <input
                          type="text"
                          value={newSessionS1}
                          onChange={(e) => setNewSessionS1(e.target.value)}
                          placeholder="15.200"
                          className="w-full bg-white border border-slate-200 rounded-xl px-2 py-1.5 text-slate-900 text-center focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[9px] text-slate-500 font-bold block mb-0.5 uppercase">SETTORE 2</label>
                        <input
                          type="text"
                          value={newSessionS2}
                          onChange={(e) => setNewSessionS2(e.target.value)}
                          placeholder="18.400"
                          className="w-full bg-white border border-slate-200 rounded-xl px-2 py-1.5 text-slate-900 text-center focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[9px] text-slate-500 font-bold block mb-0.5 uppercase">SETTORE 3</label>
                        <input
                          type="text"
                          value={newSessionS3}
                          onChange={(e) => setNewSessionS3(e.target.value)}
                          placeholder="14.900"
                          className="w-full bg-white border border-slate-200 rounded-xl px-2 py-1.5 text-slate-900 text-center focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Grid positions & Driver count - ONLY IF GARA */}
                  {sessionType === 'gara' ? (
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div>
                        <label className="text-[9px] text-slate-500 font-bold block mb-0.5 uppercase">START GRID</label>
                        <input
                          type="number"
                          min="1"
                          max="50"
                          value={newSessionStartGrid}
                          onChange={(e) => setNewSessionStartGrid(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-slate-900 text-center"
                        />
                      </div>

                      <div>
                        <label className="text-[9px] text-amber-600 font-bold block mb-0.5 uppercase">FINISH POS</label>
                        <input
                          type="number"
                          min="1"
                          max="50"
                          value={newSessionFinishPos}
                          onChange={(e) => setNewSessionFinishPos(e.target.value)}
                          className="w-full bg-amber-50 border border-amber-300 rounded-xl px-2 py-1.5 text-amber-700 font-extrabold text-center"
                        />
                      </div>

                      <div>
                        <label className="text-[9px] text-slate-500 font-bold block mb-0.5 uppercase">TOT PILOTI</label>
                        <input
                          type="number"
                          min="1"
                          max="50"
                          value={newSessionTotalTeams}
                          onChange={(e) => setNewSessionTotalTeams(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-slate-900 text-center"
                        />
                      </div>

                      <div>
                        <label className="text-[9px] text-slate-500 font-bold block mb-0.5 uppercase">KART #</label>
                        <input
                          type="number"
                          min="1"
                          max="99"
                          value={newSessionKartNumber}
                          onChange={(e) => setNewSessionKartNumber(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-slate-900 text-center"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="w-1/2">
                      <label className="block text-[10px] font-extrabold uppercase text-slate-600 mb-1">NUMERO KART</label>
                      <input
                        type="number"
                        placeholder="12"
                        value={newSessionKartNumber}
                        onChange={(e) => setNewSessionKartNumber(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600"
                      />
                    </div>
                  )}

                  {/* Technical Notes */}
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase text-slate-600 mb-1">NOTE TECNICHE / NOTE ASSETTO</label>
                    <textarea
                      rows={2}
                      placeholder="Pressione gomme, meteo, sensazioni di guida..."
                      value={newSessionNotes}
                      onChange={(e) => setNewSessionNotes(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setIsAddCustomSessionOpen(false)}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-extrabold uppercase cursor-pointer"
                    >
                      Annulla
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-black uppercase shadow-sm cursor-pointer"
                    >
                      {sessionType === 'gara' ? 'Salva Gara' : 'Salva Sessione Libera'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Selected Track Personal Best & Delta Banner */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800 space-y-4 relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-40 h-40 bg-red-600/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-black text-red-500 tracking-wider uppercase block">SCHEDA CIRCUITO</span>
                <h2 className="text-xl font-black uppercase text-white tracking-tight">{selectedTrack.name}</h2>
                <p className="text-xs text-slate-400">📍 {selectedTrack.city} ({selectedTrack.region}) • {selectedTrack.lengthMeters} metri • {selectedTrack.turnCount} Curve</p>
              </div>

              <div className="bg-slate-800/80 px-4 py-2.5 rounded-xl border border-slate-700 text-right">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">RECORD ASSOLUTO DELLA PISTA</span>
                <span className="text-sm font-extrabold text-amber-400">{selectedTrack.allTimeRecord?.timeFormatted || '0:58.000'}</span>
                <span className="text-[10px] text-slate-400 block">({selectedTrack.allTimeRecord?.driverName || 'Pro Driver'})</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 relative z-10">
              <div className="bg-slate-800/90 p-4 rounded-xl border border-slate-700">
                <p className="text-[9px] font-extrabold text-slate-400 tracking-wider uppercase">IL TUO RECORD PERSONALE</p>
                <p className="text-xl font-black text-emerald-400 mt-1">{personalBestFormatted}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Registrato il: {personalBestDate}</p>
              </div>

              <div className="bg-slate-800/90 p-4 rounded-xl border border-slate-700">
                <p className="text-[9px] font-extrabold text-slate-400 tracking-wider uppercase">DELTA DA RECORD CIRCUITO</p>
                <p className={`text-xl font-black mt-1 ${deltaToTrackRecord ? 'text-red-400' : 'text-slate-400'}`}>
                  {deltaToTrackRecord ? `+${deltaToTrackRecord}s` : 'N/A'}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {deltaToTrackRecord ? `Distacco dal miglior tempo #1` : 'Nessun tempo salvato'}
                </p>
              </div>

              <div className="bg-slate-800/90 p-4 rounded-xl border border-slate-700">
                <p className="text-[9px] font-extrabold text-slate-400 tracking-wider uppercase">SESSIONI TOTALI REGISTRATE</p>
                <p className="text-xl font-black text-white mt-1">{trackLogs.length + trackCustomSessions.length + trackGpsLogs.length}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Include gare, sessioni libere e file GPS</p>
              </div>
            </div>
          </div>

          {/* Session History and Telemetry List for Selected Track */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold uppercase text-slate-900 tracking-wider">
                STORICO SESSIONI E TELEMETRIA ({trackLogs.length + trackCustomSessions.length + trackGpsLogs.length})
              </h3>
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                ORDINATO PER DATA
              </span>
            </div>

            {trackLogs.length === 0 && trackCustomSessions.length === 0 && trackGpsLogs.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-xs text-slate-500 shadow-sm space-y-2">
                <p className="text-2xl">⏱️</p>
                <p className="font-extrabold text-slate-800 uppercase">Nessuna sessione registrata su questo circuito</p>
                <p className="text-slate-500">
                  Aggiungi una sessione di prove libere o importa un file GPS dal tuo MyChron5 / Alfano per visualizzare il report dettagliato.
                </p>
                <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
                  <button
                    onClick={() => setIsAddCustomSessionOpen(true)}
                    className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase shadow-sm cursor-pointer"
                  >
                    + Aggiungi Sessione Libera
                  </button>
                  <button
                    onClick={onOpenGpsImport}
                    className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold uppercase shadow-sm cursor-pointer"
                  >
                    + Importa Telemetria GPS
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {/* 1. Custom Free Practice Sessions */}
                {trackCustomSessions.map((s) => (
                  <div
                    key={s.id}
                    className="bg-white border border-slate-200/90 hover:border-slate-300 rounded-xl p-3 shadow-2xs hover:shadow-xs transition space-y-2"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div className="flex items-center space-x-2 min-w-0 flex-wrap gap-y-1">
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase border shrink-0 ${
                          s.type === 'gara'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : 'bg-cyan-50 text-cyan-800 border-cyan-200'
                        }`}>
                          {s.type === 'gara' ? 'GARA' : 'PROVE LIBERE'}
                        </span>
                        <h4 className="font-black text-xs text-slate-900 uppercase truncate">{s.title}</h4>
                        <span className="text-[10px] text-slate-400 font-medium shrink-0">📅 {s.date}</span>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto">
                        <div className="bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-lg text-right">
                          <span className="text-[8px] font-black text-slate-400 block uppercase leading-none">MIGLIOR GIRO</span>
                          <strong className="text-emerald-700 font-black text-xs">{s.bestLapFormatted}</strong>
                        </div>

                        {s.verified || s.hasTelemetry ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-800 text-[9px] font-black uppercase rounded-lg border border-emerald-200 shrink-0">
                            <CheckCircle className="w-3 h-3 text-emerald-600" /> VERIFICATO
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-800 text-[9px] font-black uppercase rounded-lg border border-amber-200 shrink-0">
                            <AlertTriangle className="w-3 h-3 text-amber-600" /> NON-VERIFICATO
                          </span>
                        )}

                        <button
                          onClick={() => handleOpenEditSessionModal(s)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-[9px] font-black uppercase transition flex items-center gap-1 cursor-pointer shrink-0 border border-slate-200"
                          title="Modifica Sessione"
                        >
                          <Edit3 className="w-3 h-3 text-slate-600" />
                          <span>MODIFICA</span>
                        </button>

                        <button
                          onClick={() => handleDeleteSession(s.id)}
                          className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-[9px] font-black uppercase transition flex items-center gap-1 cursor-pointer shrink-0 border border-red-200"
                          title="Elimina Sessione"
                        >
                          <X className="w-3 h-3 text-red-600" />
                        </button>

                        <button
                          onClick={() => handleAttachTelemetryToSession(s.id)}
                          className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[9px] font-black uppercase shadow-2xs cursor-pointer transition flex items-center gap-1 shrink-0"
                        >
                          <Upload className="w-3 h-3" />
                          <span>IMPORTA TELEMETRIA</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-slate-600 pt-1.5 border-t border-slate-100/90 font-medium">
                      {s.type === 'gara' && s.finishPosition && (
                        <span className="font-bold text-slate-900">🏁 Posizione: P{s.finishPosition}/{s.totalTeams || '?'}</span>
                      )}
                      <span>🏎️ Kart #{s.kartNumber}</span>
                      <span>⚖️ {currentUser.weightKg} kg</span>
                      {s.s1Seconds && <span className="font-mono text-slate-500">S1: {s.s1Seconds}s | S2: {s.s2Seconds}s | S3: {s.s3Seconds}s</span>}
                      {s.notes && <span className="text-slate-500 italic">📝 {s.notes}</span>}
                      {s.gpsDeviceType && <span className="text-emerald-700 font-bold">📡 {s.gpsDeviceType}</span>}
                    </div>
                  </div>
                ))}

                {/* 2. Official Race Telemetry Logs */}
                {trackLogs.map((log) => (
                  <div
                    key={log.id}
                    className="bg-white border border-slate-200/90 hover:border-slate-300 rounded-xl p-3 shadow-2xs hover:shadow-xs transition space-y-2"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div className="flex items-center space-x-2 min-w-0 flex-wrap gap-y-1">
                        <span className="px-1.5 py-0.5 bg-red-50 text-red-700 rounded text-[8px] font-black uppercase border border-red-200 shrink-0">
                          GARA UFFICIALE
                        </span>
                        <h4 className="font-black text-xs text-slate-900 uppercase truncate">{log.eventTitle}</h4>
                        <span className="text-[10px] text-slate-400 font-medium shrink-0">📅 {log.date}</span>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto">
                        <div className="bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-lg text-right">
                          <span className="text-[8px] font-black text-slate-400 block uppercase leading-none">MIGLIOR GIRO</span>
                          <strong className="text-emerald-700 font-black text-xs">{log.bestLapFormatted}</strong>
                        </div>

                        {log.verified ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-800 text-[9px] font-black uppercase rounded-lg border border-emerald-200 shrink-0">
                            <CheckCircle className="w-3 h-3 text-emerald-600" /> VERIFICATO
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-800 text-[9px] font-black uppercase rounded-lg border border-amber-200 shrink-0">
                            <AlertTriangle className="w-3 h-3 text-amber-600" /> NON-VERIFICATO
                          </span>
                        )}

                        <button
                          onClick={onOpenGpsImport}
                          className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[9px] font-black uppercase shadow-2xs cursor-pointer transition flex items-center gap-1 shrink-0"
                        >
                          <Upload className="w-3 h-3" />
                          <span>IMPORTA TELEMETRIA</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-slate-600 pt-1.5 border-t border-slate-100/90 font-medium">
                      <span className="font-bold text-slate-900">🏁 Posizione: P{log.finishPosition}/{log.totalTeams}</span>
                      <span>🏎️ Kart #{log.id.slice(-2)}</span>
                      <span>⚖️ {currentUser.weightKg} kg</span>
                      <span>☀️ Sole, 22°C</span>
                    </div>
                  </div>
                ))}

                {/* 3. Render GPS Telemetry Imports */}
                {trackGpsLogs.map((gps) => (
                  <div
                    key={gps.id}
                    className="bg-white border border-slate-200/90 hover:border-slate-300 rounded-xl p-3 shadow-2xs hover:shadow-xs transition space-y-2"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div className="flex items-center space-x-2 min-w-0 flex-wrap gap-y-1">
                        <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded text-[8px] font-black uppercase border border-amber-300 shrink-0">
                          GPS {gps.deviceType}
                        </span>
                        <h4 className="font-black text-xs text-slate-900 uppercase truncate">{gps.sessionType || 'Sessione Telemetrica'}</h4>
                        <span className="text-[10px] text-slate-400 font-medium shrink-0">📅 Importato: {gps.importedAt || 'Recente'}</span>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto">
                        <div className="bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-lg text-right">
                          <span className="text-[8px] font-black text-slate-400 block uppercase leading-none">MIGLIOR GIRO</span>
                          <strong className="text-emerald-700 font-black text-xs">{gps.bestLapFormatted}</strong>
                        </div>

                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-800 text-[9px] font-black uppercase rounded-lg border border-emerald-200 shrink-0">
                          <CheckCircle className="w-3 h-3 text-emerald-600" /> VERIFICATO
                        </span>

                        <button
                          onClick={onOpenGpsImport}
                          className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[9px] font-black uppercase shadow-2xs cursor-pointer transition flex items-center gap-1 shrink-0"
                        >
                          <Upload className="w-3 h-3 text-emerald-400" />
                          <span>IMPORTA TELEMETRIA</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-slate-600 pt-1.5 border-t border-slate-100/90 font-medium">
                      <span>⚡ Giro Ideale: <strong className="text-amber-700 font-bold">{gps.theoreticalBestFormatted}</strong></span>
                      <span>🚀 Vel Max: <strong className="text-slate-900 font-bold">{gps.topSpeedKmh} km/h</strong></span>
                      <span>🔄 Giri: {gps.lapsCount}</span>
                      <span className="font-mono text-slate-500">S1: {gps.s1Seconds}s | S2: {gps.s2Seconds}s | S3: {gps.s3Seconds}s</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toast Feedback Banner */}
      {friendToast && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center space-x-2 text-xs font-extrabold animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{friendToast}</span>
        </div>
      )}

      {/* 2. AMICI & RIVALI */}
      {activeSubTab === 'friends' && (
        <div className="space-y-6">
          {/* Incoming Friend Requests Notification Panel */}
          {incomingRequests.length > 0 && (
            <div className="bg-red-50 border-2 border-red-500 rounded-2xl p-5 shadow-sm space-y-3 animate-fade-in">
              <div className="flex items-center space-x-2 text-red-700">
                <UserPlus className="w-5 h-5 animate-bounce text-red-600" />
                <h4 className="text-sm font-extrabold uppercase tracking-tight">
                  RICHIESTE DI AMICIZIA IN ARRIVO ({incomingRequests.length})
                </h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {incomingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="bg-white p-3.5 rounded-xl border border-red-200 flex items-center justify-between shadow-xs"
                  >
                    <div className="flex items-center space-x-3">
                      {req.senderAvatarType === 'crest' && req.senderCrestConfig ? (
                        <CrestAvatar crest={req.senderCrestConfig} size="sm" />
                      ) : (
                        <img
                          src={req.senderAvatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb"}
                          alt={req.senderName}
                          className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                        />
                      )}
                      <div>
                        <p className="text-xs font-extrabold text-slate-900">{req.senderName}</p>
                        <p className="text-[10px] text-slate-500">@{req.senderNickname}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => handleAcceptRequest(req)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-black uppercase flex items-center space-x-1 cursor-pointer transition shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>ACCETTA</span>
                      </button>
                      <button
                        onClick={() => handleDeclineRequest(req)}
                        className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-[10px] font-black uppercase flex items-center space-x-1 cursor-pointer transition"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>RIFIUTA</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Header & Search Bar for Existing Friends */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 border border-slate-200 rounded-2xl shadow-sm">
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <div className="p-2.5 bg-red-50 text-red-600 rounded-xl">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 uppercase">
                  I MIEI AMICI & RIVALI SEGUITI ({myFriends.length})
                </h3>
                <p className="text-xs text-slate-500">
                  {myFriends.length === 0
                    ? "Nessun amico aggiunto. Usa la sezione 'Cerca Nuovo Amico' in basso per connetterti!"
                    : "Vedi quali gare hanno in programma i tuoi amici e confronta i tempi sul giro"}
                </p>
              </div>
            </div>

            {myFriends.length > 0 && (
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filtra i tuoi amici per nome..."
                  value={friendSearchQuery}
                  onChange={(e) => setFriendSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-red-600 font-medium"
                />
              </div>
            )}
          </div>

          {/* Friends List */}
          {myFriends.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-xs text-slate-500 shadow-sm space-y-2">
              <Users className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="font-extrabold text-slate-800 text-sm">NON HAI ANCORA NESSUN AMICO NELLA TUA CERCHIA</p>
              <p className="max-w-md mx-auto text-slate-500">
                Al primo accesso la tua cerchia di amici è vuota (0). Cerca nuovi piloti della community nella sezione sottostante ed invia loro una richiesta di amicizia!
              </p>
            </div>
          ) : filteredFriends.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-xs text-slate-500 shadow-sm">
              Nessun amico trovato con questo nome nella tua lista.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredFriends.map((friend) => (
                <div
                  key={friend.id}
                  className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4"
                >
                  {/* Friend Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center space-x-3">
                      {friend.avatarType === 'crest' && friend.crestConfig ? (
                        <CrestAvatar crest={friend.crestConfig} size="md" />
                      ) : (
                        <img
                          src={friend.avatarUrl}
                          alt={friend.name}
                          className="w-12 h-12 rounded-xl object-cover border-2 border-slate-200"
                        />
                      )}
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-extrabold text-sm text-slate-900 uppercase">{friend.name}</h4>
                          {friend.activeTitleBadge?.titleIcon && (
                            <span className="text-xs font-extrabold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200" title={friend.activeTitleBadge.title}>
                              {getBadgeSymbolOnly(friend.activeTitleBadge.titleIcon)}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500">
                          @{friend.nickname || 'pilota'} • {friend.experienceLevel} • {friend.weightKg} kg
                        </p>
                      </div>
                    </div>

                    <span className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-extrabold uppercase border border-emerald-200 flex items-center space-x-1">
                      <UserCheck className="w-3 h-3" />
                      <span>AMICO</span>
                    </span>
                  </div>

                  {/* Registered Scheduled Races */}
                  {friend.isRacesPublic !== false && (
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                        GARE IN PROGRAMMA:
                      </span>

                      {friend.registeredRaceIds.length === 0 ? (
                        <p className="text-[11px] text-slate-400 italic">Nessuna gara in programma nell'immediato</p>
                      ) : (
                        <div className="space-y-1">
                          {friend.registeredRaceIds.map((raceId) => {
                            const race = races.find((r) => r.id === raceId);
                            if (!race) return null;
                            return (
                              <div
                                key={race.id}
                                className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                              >
                                <div>
                                  <span className="font-extrabold text-slate-900 block">{race.title}</span>
                                  <span className="text-[10px] text-slate-500">📍 {race.trackName} • {race.date}</span>
                                </div>
                                <span className="px-2 py-0.5 bg-red-600 text-white rounded text-[9px] font-bold uppercase">
                                  ISCRITTO
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Personal Bests */}
                  {friend.isTimesPublic !== false && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                        MIGLIORI TEMPI SU PISTA:
                      </span>

                      {friend.personalBests.length === 0 ? (
                        <p className="text-[11px] text-slate-400 italic">Nessun tempo registrato</p>
                      ) : (
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {friend.personalBests.map((pb) => (
                            <div key={pb.trackId} className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                              <span className="text-[9px] font-bold text-slate-400 block truncate">{pb.trackName}</span>
                              <strong className="text-emerald-600 font-extrabold block mt-0.5">{pb.bestLapFormatted}</strong>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Dedicated "Cerca Nuovo Amico" Search & Request Section */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-xs font-extrabold uppercase text-slate-900 flex items-center space-x-1.5">
                  <UserPlus className="w-4 h-4 text-red-600" />
                  <span>CERCA NUOVO AMICO NEL PADDOCK</span>
                </h4>
                <p className="text-[11px] text-slate-500">
                  Digita il nome o nickname di un pilota per inviargli una richiesta di amicizia con notifica in tempo reale
                </p>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cerca per nome o nickname..."
                  value={searchNewFriendQuery}
                  onChange={(e) => setSearchNewFriendQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-red-600 font-medium"
                />
              </div>
            </div>

            {!searchNewFriendQuery.trim() ? (
              <div className="p-6 text-center text-xs text-slate-500 italic space-y-1">
                <Search className="w-5 h-5 text-slate-300 mx-auto mb-1" />
                <p className="font-bold text-slate-600">Nessun suggerimento automatico attivo.</p>
                <p className="text-[11px] text-slate-400">
                  Digita il nome o nickname di un pilota nella barra di ricerca in alto per trovare nuovi amici nella community.
                </p>
              </div>
            ) : newFriendCandidates.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 italic">
                Nessun pilota trovato con i criteri "{searchNewFriendQuery}". Prova con un altro nome o nickname.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {newFriendCandidates.map((cand) => {
                  const isPending = sentPendingRequests.some((r) => r.receiverId === cand.id);

                  return (
                    <div
                      key={cand.id}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        {cand.avatarType === 'crest' && cand.crestConfig ? (
                          <CrestAvatar crest={cand.crestConfig} size="sm" />
                        ) : (
                          <img
                            src={cand.avatarUrl}
                            alt={cand.name}
                            className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                          />
                        )}
                        <div>
                          <p className="text-xs font-extrabold text-slate-900">{cand.name}</p>
                          <p className="text-[10px] text-slate-500">
                            @{cand.nickname || 'pilota'} • {cand.experienceLevel}
                          </p>
                        </div>
                      </div>

                      {isPending ? (
                        <span className="px-3 py-1.5 bg-amber-100 text-amber-800 rounded-xl text-[10px] font-extrabold uppercase flex items-center space-x-1 border border-amber-300">
                          <span>INVIATA ⏳</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSendFriendRequest(cand)}
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-extrabold uppercase flex items-center space-x-1 cursor-pointer transition shadow-sm"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>AGGIUNGI</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. TROFEI & BADGES ESPANSI */}
      {activeSubTab === 'badges' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
            <div>
              <h3 className="text-sm font-extrabold uppercase text-slate-900">BACHECA TROFEI</h3>
              <p className="text-xs text-slate-500">
                Sblocca i trofei partecipando alle gare in programma. Equipaggia l'icona titolo al tuo nome per sfoggiarla davanti ai rivali!
              </p>
            </div>

            {equippedBadge && (
              <div className="px-3.5 py-2 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 text-xs font-extrabold flex items-center space-x-2">
                <span>TITOLO EQUIPAGGIATO:</span>
                <span className="text-red-600 font-black flex items-center gap-1.5">
                  <span className="text-sm">{getBadgeSymbolOnly(equippedBadge.titleIcon)}</span>
                  <span>{equippedBadge.title}</span>
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {allBadges.map((badge) => {
              const isUnlocked = currentUser.unlockedBadges.some((b) => b.id === badge.id);
              const isEquipped = currentUser.activeTitleBadgeId === badge.id;

              return (
                <div
                  key={badge.id}
                  className={`border rounded-2xl p-5 shadow-sm space-y-3 relative overflow-hidden transition ${
                    isEquipped
                      ? 'bg-amber-50/60 border-amber-400 text-slate-900 ring-2 ring-amber-300'
                      : isUnlocked
                      ? 'bg-white border-red-200 text-slate-900'
                      : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`p-2.5 rounded-xl ${
                        isUnlocked ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-slate-200 text-slate-400'
                      }`}
                    >
                      <Trophy className="w-6 h-6" />
                    </div>

                    <span
                      className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded-lg uppercase tracking-wider ${
                        isEquipped
                          ? 'bg-amber-500 text-white shadow-sm'
                          : isUnlocked
                          ? 'bg-red-600 text-white shadow-sm'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {isEquipped ? 'EQUIPAGGIATO ⚡' : isUnlocked ? 'SBLOCCATO 🏆' : 'BLOCCATO 🔒'}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-extrabold uppercase text-slate-900 flex items-center justify-between">
                      <span>{badge.title}</span>
                      {badge.titleIcon && <span className="text-sm font-bold text-amber-600" title={badge.titleIcon}>{getBadgeSymbolOnly(badge.titleIcon)}</span>}
                    </h4>
                    <p className="text-xs text-slate-600 font-sans mt-1">{badge.description}</p>
                  </div>

                  {/* Race Association Note */}
                  {badge.associatedTrackName && (
                    <p className="text-[10px] text-red-600 font-bold uppercase">
                      📍 Pista: {badge.associatedTrackName}
                    </p>
                  )}

                  {/* Equip Button */}
                  {isUnlocked && (
                    <div className="pt-2">
                      <button
                        onClick={() => onEquipTitleBadge(isEquipped ? undefined : badge.id)}
                        className={`w-full py-2 rounded-xl text-xs font-extrabold uppercase transition cursor-pointer flex items-center justify-center space-x-1 border ${
                          isEquipped
                            ? 'bg-slate-200 text-slate-700 border-slate-300 hover:bg-slate-300'
                            : 'bg-red-600 hover:bg-red-700 text-white border-red-600 shadow-sm'
                        }`}
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>{isEquipped ? 'RIMUOVI TITOLO' : 'EQUIPAGGIA VICINO AL NOME'}</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. GARE ACQUISTATE */}
      {activeSubTab === 'tickets' && (
        <div className="space-y-3">
          <p className="text-xs text-slate-500">
            Ecco i tuoi pass ed iscrizioni acquistati direttamente su KARTHUB. Presenta il voucher QR code ai commissari al briefing di gara.
          </p>

          {!currentUser.purchasedRaces || currentUser.purchasedRaces.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-xs text-slate-500 shadow-sm">
              Non hai ancora acquistato nessuna iscrizione gara. Esplora il Calendario per acquistare direttamente su KARTHUB!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentUser.purchasedRaces.map((ticket) => (
                <div key={ticket.id} className="bg-white border border-red-200 rounded-2xl p-5 shadow-sm space-y-3">
                  <div className="flex justify-between items-start border-b border-slate-100 pb-2">
                    <div>
                      <span className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 text-[9px] font-extrabold uppercase border border-emerald-200">
                        {ticket.status}
                      </span>
                      <h4 className="font-extrabold text-sm text-slate-900 uppercase mt-1">{ticket.raceTitle}</h4>
                    </div>
                    <Ticket className="w-5 h-5 text-red-600" />
                  </div>

                  <div className="space-y-1 text-xs">
                    <p className="text-slate-500">Circuito: <strong className="text-slate-900">{ticket.trackName}</strong></p>
                    <p className="text-slate-500">Team: <strong className="text-slate-900">{ticket.teamName}</strong> ({ticket.driversCount} Piloti)</p>
                    <p className="text-slate-500">Data & Ora: <strong className="text-slate-900">{ticket.date} @ {ticket.time}</strong></p>
                    <p className="text-slate-500">Pagamento: <strong className="text-emerald-600 font-extrabold">€{ticket.paidAmountEur}</strong> ({ticket.paymentMethod})</p>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">QR VERIFICA IN PISTA:</span>
                    <strong className="text-red-600 text-xs font-black tracking-wider">{ticket.qrCodeToken}</strong>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Crest & Photo Builder Modal */}
      <CrestBuilderModal
        isOpen={isCrestModalOpen}
        onClose={() => setIsCrestModalOpen(false)}
        currentUser={currentUser}
        tracks={tracks}
        onSave={(avatarType, crestConfig, avatarUrl, profileData) => {
          onSaveCrest(avatarType, crestConfig, avatarUrl);
          if (profileData && onUpdateProfile) {
            onUpdateProfile(profileData);
          }
          setProfileToast('Profilo e foto/stemma aggiornati con successo!');
          setTimeout(() => setProfileToast(null), 3000);
        }}
      />

      {/* Toast Notification */}
      {profileToast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl font-bold text-xs shadow-xl flex items-center space-x-2 animate-bounce">
          <Check className="w-4 h-4" />
          <span>{profileToast}</span>
        </div>
      )}
    </div>
  );
};
