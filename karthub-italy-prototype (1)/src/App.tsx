/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav, TabType } from './components/BottomNav';
import { MapView } from './components/MapView';
import { CalendarView } from './components/CalendarView';
import { ActivityFeedView } from './components/ActivityFeedView';
import { ProfileGarageView } from './components/ProfileGarageView';
import { CampionatiView } from './components/CampionatiView';
import { AdminPitWallView } from './components/AdminPitWallView';
import { RaceDetailModal } from './components/RaceDetailModal';
import { LogRaceModal } from './components/LogRaceModal';
import { PitStopOnboardingModal } from './components/PitStopOnboardingModal';
import { NotificationsModal } from './components/NotificationsModal';
import { BenefitStoreModal } from './components/BenefitStoreModal';
import { RaceCheckoutModal } from './components/RaceCheckoutModal';
import { GpsTelemetryImportModal } from './components/GpsTelemetryImportModal';
import { ApexTimingLiveModal } from './components/ApexTimingLiveModal';
import { AuthView } from './components/AuthView';
import { ExportCodeModal } from './components/ExportCodeModal';
import { HomeLandingView } from './components/HomeLandingView';

import {
  INITIAL_ORGANIZERS,
  INITIAL_TRACKS,
  INITIAL_RACES,
  CURRENT_USER,
  DEMO_USERS,
  INITIAL_TELEMETRY,
  INITIAL_LEADERBOARD_POMPOSA,
  INITIAL_ACTIVITY_FEED,
  INITIAL_NOTIFICATIONS,
  TROPHY_CATALOG,
  BENEFIT_CATALOG,
  INITIAL_COMMUNITY_FRIENDS
} from './data/mockData';

import { Race, Track, Organizer, DriverProfile, TelemetryLog, ActivityFeedItem, SystemNotification, PurchasedRaceTicket, GpsTelemetryImport, BenefitReward, CrestConfig, FriendDriverProfile, ExperienceLevel } from './types';

export default function App() {
  const TODAY_STR = '2026-10-09';

  // Authentication State - Always start on login page when opening the site
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const [usersList, setUsersList] = useState<DriverProfile[]>(() => {
    const saved = localStorage.getItem('karthub_users_db');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        // fallback
      }
    }
    return DEMO_USERS;
  });

  const [currentUser, setCurrentUser] = useState<DriverProfile>(() => {
    const savedUserId = localStorage.getItem('karthub_current_user_id');
    if (savedUserId) {
      const found = usersList.find(u => u.id === savedUserId);
      if (found) return found;
    }
    return usersList[0] || CURRENT_USER;
  });

  // Save usersList whenever it changes
  useEffect(() => {
    localStorage.setItem('karthub_users_db', JSON.stringify(usersList));
  }, [usersList]);

  // Handle User Login
  const handleLoginSuccess = (user: DriverProfile) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    localStorage.setItem('karthub_logged_in', 'true');
    localStorage.setItem('karthub_current_user_id', user.id);

    // Ensure user is in usersList without duplicates by ID or Email
    setUsersList(prev => {
      const targetEmail = user.email.trim().toLowerCase();
      const exists = prev.some(u => u.id === user.id || u.email.trim().toLowerCase() === targetEmail);
      if (!exists) return [user, ...prev];
      return prev.map(u => (u.id === user.id || u.email.trim().toLowerCase() === targetEmail) ? { ...u, ...user } : u);
    });
  };

  // Handle User Logout / Account Switch
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('karthub_logged_in');
  };

  // Handle User Account Creation
  const handleCreateAccount = (newUserData: {
    name: string;
    email: string;
    nickname: string;
    weightKg: number;
    experienceLevel: ExperienceLevel;
  }) => {
    const targetEmail = newUserData.email.trim().toLowerCase();

    // Prevent duplicate registration if email already exists in usersList
    const existingUser = usersList.find(u => u.email.trim().toLowerCase() === targetEmail);
    if (existingUser) {
      handleLoginSuccess(existingUser);
      return;
    }

    const newProfile: DriverProfile = {
      id: `driver-${Date.now()}`,
      name: newUserData.name,
      nickname: newUserData.nickname || newUserData.name || 'Pilota',
      avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80`,
      avatarType: 'crest',
      crestConfig: {
        shape: 'classic_shield',
        pattern: 'split_v',
        primaryColor: '#dc2626',
        secondaryColor: '#0f172a',
        symbolCategory: 'karting',
        symbolIcon: 'steering_wheel',
        crestInitials: (newUserData.nickname || newUserData.name || 'KH').slice(0, 4).toUpperCase()
      },
      email: newUserData.email.trim(),
      experienceLevel: newUserData.experienceLevel,
      weightKg: newUserData.weightKg,
      favoriteTrackIds: ['track-pomposa', 'track-misanino'],
      friendsIds: [],
      bio: 'Pilota KartHub appena iscritto al Paddock Italia!',
      totalRaces: 0,
      podiumsCount: 0,
      winsCount: 0,
      starPoints: 100, // 100 Welcome points
      unlockedBadges: [
        {
          id: 'badge-1',
          title: 'First Green Light',
          description: 'Account registrato su KartHub Motorsport Italia.',
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

    setUsersList(prev => [newProfile, ...prev]);
    handleLoginSuccess(newProfile);
  };

  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [tracks, setTracks] = useState<Track[]>(INITIAL_TRACKS);
  const [organizers, setOrganizers] = useState<Organizer[]>(INITIAL_ORGANIZERS);
  const [races, setRaces] = useState<Race[]>(() => INITIAL_RACES);
  const [communityFriends, setCommunityFriends] = useState<FriendDriverProfile[]>(INITIAL_COMMUNITY_FRIENDS);
  const [telemetryLogs, setTelemetryLogs] = useState<TelemetryLog[]>(INITIAL_TELEMETRY);
  const [activityFeed, setActivityFeed] = useState<ActivityFeedItem[]>(INITIAL_ACTIVITY_FEED);
  const [notifications, setNotifications] = useState<SystemNotification[]>(INITIAL_NOTIFICATIONS);
  const [scrapeLogs, setScrapeLogs] = useState<any[]>([]);

  // Selection states
  const [selectedRace, setSelectedRace] = useState<Race | null>(null);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [raceToCheckout, setRaceToCheckout] = useState<Race | null>(null);

  // Modals
  const [showLogModal, setShowLogModal] = useState<boolean>(false);
  const [showAdminModal, setShowAdminModal] = useState<boolean>(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState<boolean>(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState<boolean>(false);
  const [showBenefitModal, setShowBenefitModal] = useState<boolean>(false);
  const [showGpsModal, setShowGpsModal] = useState<boolean>(false);
  const [showApexLiveModal, setShowApexLiveModal] = useState<boolean>(false);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [isScraping, setIsScraping] = useState<boolean>(false);

  // Load server state on startup if available
  useEffect(() => {
    async function loadBackendData() {
      try {
        const [racesRes, tracksRes, orgsRes, logsRes] = await Promise.all([
          fetch('/api/races'),
          fetch('/api/tracks'),
          fetch('/api/organizers'),
          fetch('/api/scrape/logs')
        ]);

        if (racesRes.ok) {
          const fetchedRaces = await racesRes.json();
          if (Array.isArray(fetchedRaces) && fetchedRaces.length > 0) {
            setRaces(fetchedRaces);
          }
        }
        if (tracksRes.ok) {
          const fetchedTracks = await tracksRes.json();
          if (Array.isArray(fetchedTracks) && fetchedTracks.length > 0) setTracks(fetchedTracks);
        }
        if (orgsRes.ok) {
          const fetchedOrgs = await orgsRes.json();
          if (Array.isArray(fetchedOrgs) && fetchedOrgs.length > 0) setOrganizers(fetchedOrgs);
        }
        if (logsRes.ok) {
          const fetchedLogs = await logsRes.json();
          if (Array.isArray(fetchedLogs)) setScrapeLogs(fetchedLogs);
        }
      } catch (e) {
        console.log('Using local client state');
      }
    }
    loadBackendData();
  }, []);

  // Trigger live web scraper sync for Italian organizers
  const handleTriggerScrape = async () => {
    setIsScraping(true);
    try {
      const res = await fetch('/api/scrape/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ generateNewSample: true })
      });
      const data = await res.json();
      if (data.success) {
        // Refresh races
        const racesRes = await fetch('/api/races');
        if (racesRes.ok) {
          const updatedRaces = await racesRes.json();
          setRaces(updatedRaces);
        }
        if (data.logs) {
          setScrapeLogs(data.logs);
        }
        // Add a notification for user
        setNotifications(prev => [
          {
            id: `notif-${Date.now()}`,
            title: 'Live Scraper Cycle Complete',
            message: 'Updated listings across 8 Italian organizers.',
            type: 'scraper_update',
            timestamp: 'Just now',
            read: false
          },
          ...prev
        ]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsScraping(false);
    }
  };

  // Add race manually in Admin
  const handleAdminAddRace = async (newRaceData: Partial<Race>) => {
    try {
      const res = await fetch('/api/admin/races', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRaceData)
      });
      const data = await res.json();
      if (data.success && data.race) {
        setRaces(prev => [data.race, ...prev]);
      }
    } catch (e) {
      // Fallback local add
      const fallbackRace: Race = {
        id: `race-${Date.now()}`,
        organizerId: newRaceData.organizerId || 'org-rrk',
        organizerName: newRaceData.organizerName || 'Romagna Rental Karting',
        trackId: newRaceData.trackId || 'track-pomposa',
        trackName: newRaceData.trackName || 'Circuito di Pomposa',
        trackRegion: newRaceData.trackRegion || 'Emilia-Romagna',
        title: newRaceData.title || 'New Race Entry',
        date: newRaceData.date || '2026-09-15',
        time: newRaceData.time || '18:00',
        category: newRaceData.category || 'Sodi 390cc',
        format: newRaceData.format as any || 'Endurance',
        durationLabel: '2 Hours Endurance',
        entryFee: newRaceData.entryFee || 200,
        registeredTeamsCount: 2,
        maxGridSize: 20,
        registrationDeadline: newRaceData.date || '2026-09-10',
        registrationUrl: 'https://www.circuitodipomposa.com',
        isScraped: false,
        status: 'Upcoming',
        description: newRaceData.description || 'Custom manual entry.'
      };
      setRaces(prev => [fallbackRace, ...prev]);
    }
  };

  // Delete race in Admin
  const handleAdminDeleteRace = async (raceId: string) => {
    try {
      await fetch(`/api/admin/races/${raceId}`, { method: 'DELETE' });
    } catch (e) {
      // ignore
    }
    setRaces(prev => prev.filter(r => r.id !== raceId));
  };

  // Submit telemetry race log
  const handleLogRaceSubmit = (newLog: TelemetryLog) => {
    setTelemetryLogs(prev => [newLog, ...prev]);

    // Create an activity feed post
    const newFeedItem: ActivityFeedItem = {
      id: `act-${Date.now()}`,
      driverId: currentUser.id,
      driverName: currentUser?.name || 'Pilota',
      driverAvatar: currentUser.avatarUrl,
      type: 'personal_best',
      title: `Logged new time at ${newLog.trackName}!`,
      description: `Set best lap of ${newLog.bestLapFormatted} in kart #${newLog.kartNumber} (${newLog.eventTitle}).`,
      timestamp: 'Just now',
      trackName: newLog.trackName,
      bestLapFormatted: newLog.bestLapFormatted,
      position: newLog.finishPosition,
      likesCount: 1,
      likedByMe: true,
      commentsCount: 0
    };

    setActivityFeed(prev => [newFeedItem, ...prev]);

    // Update currentUser race count
    setCurrentUser(prev => ({
      ...prev,
      totalRaces: prev.totalRaces + 1,
      podiumsCount: newLog.finishPosition <= 3 ? prev.podiumsCount + 1 : prev.podiumsCount,
      winsCount: newLog.finishPosition === 1 ? prev.winsCount + 1 : prev.winsCount
    }));
  };

  // Redeem Benefit Reward
  const handleRedeemBenefit = (reward: BenefitReward, voucherCode: string) => {
    setCurrentUser(prev => {
      const newVoucher = {
        id: `vch-${Date.now()}`,
        rewardId: reward.id,
        rewardTitle: reward.title,
        voucherCode,
        discountEur: reward.discountAmountEur,
        redeemedAt: new Date().toISOString().split('T')[0],
        used: false
      };
      return {
        ...prev,
        starPoints: Math.max(0, prev.starPoints - reward.costStarPoints),
        redeemedBenefits: [newVoucher, ...(prev.redeemedBenefits || [])]
      };
    });

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: 'BENEFIT SBLOCCATO! 🎁',
        message: `Hai riscattato "${reward.title}" per ${reward.costStarPoints} Star Points. Codice: ${voucherCode}`,
        type: 'reward_unlocked',
        timestamp: 'Ora',
        read: false
      },
      ...prev
    ]);
  };

  // Complete Race Purchase
  const handlePurchaseRaceSuccess = (ticket: PurchasedRaceTicket) => {
    setCurrentUser(prev => ({
      ...prev,
      starPoints: prev.starPoints + 100, // Award 100 Star Points for booking a race
      purchasedRaces: [ticket, ...(prev.purchasedRaces || [])]
    }));

    // Update race registered count
    setRaces(prev => prev.map(r => r.id === ticket.raceId ? { ...r, registeredTeamsCount: r.registeredTeamsCount + 1 } : r));

    // Post to feed
    setActivityFeed(prev => [
      {
        id: `act-${Date.now()}`,
        driverId: currentUser.id,
        driverName: currentUser.name,
        driverAvatar: currentUser.avatarUrl,
        type: 'personal_best',
        title: `Iscritto a ${ticket.raceTitle}!`,
        description: `Team ${ticket.teamName} confermato in griglia per il ${ticket.date} @ ${ticket.trackName}. +100 Star Points guadagnati!`,
        timestamp: 'Ora',
        trackName: ticket.trackName,
        bestLapFormatted: 'ISCRIZIONE CONF.',
        likesCount: 2,
        likedByMe: true,
        commentsCount: 0
      },
      ...prev
    ]);

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: 'ISCRIZIONE GARA CONFERMATA 🎟️',
        message: `Pass registrato per ${ticket.raceTitle}. QR Code: ${ticket.qrCodeToken}. +100 Star Points sbloccati!`,
        type: 'race_alert',
        timestamp: 'Ora',
        read: false
      },
      ...prev
    ]);
  };

  // Import GPS Telemetry Success
  const handleGpsImportSuccess = (gpsImport: GpsTelemetryImport) => {
    setCurrentUser(prev => ({
      ...prev,
      starPoints: prev.starPoints + 50, // Award 50 Star Points for uploading telemetry
      gpsTelemetryLogs: [gpsImport, ...(prev.gpsTelemetryLogs || [])]
    }));

    setActivityFeed(prev => [
      {
        id: `act-${Date.now()}`,
        driverId: currentUser.id,
        driverName: currentUser.name,
        driverAvatar: currentUser.avatarUrl,
        type: 'personal_best',
        title: `Telemetria GPS importata da ${gpsImport.deviceType}!`,
        description: `Caricati ${gpsImport.lapsCount} giri su ${gpsImport.trackName}. Best Lap: ${gpsImport.bestLapFormatted} (Giro Ideale: ${gpsImport.theoreticalBestFormatted}). +50 Star Points!`,
        timestamp: 'Ora',
        trackName: gpsImport.trackName,
        bestLapFormatted: gpsImport.bestLapFormatted,
        likesCount: 3,
        likedByMe: true,
        commentsCount: 1
      },
      ...prev
    ]);

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: 'TELEMETRIA GPS CARICATA 📡',
        message: `Dati telemetrici registrati con successo. +50 Star Points aggiunti al tuo saldo.`,
        type: 'telemetry_pb',
        timestamp: 'Ora',
        read: false
      },
      ...prev
    ]);
  };

  // Like feed item
  const handleLikeToggle = (itemId: string) => {
    setActivityFeed(prev =>
      prev.map(item => {
        if (item.id === itemId) {
          const liked = !item.likedByMe;
          return {
            ...item,
            likedByMe: liked,
            likesCount: liked ? item.likesCount + 1 : item.likesCount - 1
          };
        }
        return item;
      })
    );
  };

  // Toggle favorite track
  const handleToggleFavoriteTrack = (trackId: string) => {
    setCurrentUser(prev => {
      const isFav = prev.favoriteTrackIds.includes(trackId);
      return {
        ...prev,
        favoriteTrackIds: isFav
          ? prev.favoriteTrackIds.filter(id => id !== trackId)
          : [...prev.favoriteTrackIds, trackId]
      };
    });
  };

  // Profile Customization Handlers
  const handleUpdatePrivacySettings = (
    timesVisibility: 'public' | 'friends' | 'private',
    racesVisibility: 'public' | 'friends' | 'private'
  ) => {
    setCurrentUser(prev => ({
      ...prev,
      timesVisibility,
      racesVisibility,
      isTimesPublic: timesVisibility !== 'private',
      isRacesPublic: racesVisibility !== 'private'
    }));
  };

  const handleSaveCrest = (avatarType: 'image' | 'crest', crestConfig: CrestConfig, avatarUrl: string) => {
    setCurrentUser(prev => ({
      ...prev,
      avatarType,
      crestConfig,
      avatarUrl: avatarUrl || prev.avatarUrl
    }));
  };

  const handleEquipTitleBadge = (badgeId: string | undefined) => {
    setCurrentUser(prev => ({
      ...prev,
      activeTitleBadgeId: badgeId
    }));
  };

  const handleUpdateProfile = (updatedData: Partial<DriverProfile>) => {
    setCurrentUser(prev => {
      if (!prev) return prev;
      return { ...prev, ...updatedData };
    });

    setUsersList(prev =>
      prev.map(u => (u.id === currentUser?.id ? { ...u, ...updatedData } : u))
    );
  };

  const handleAddFriend = (friendId: string) => {
    setCurrentUser(prev => {
      if (prev.friendsIds.includes(friendId)) return prev;
      const updatedFriends = [...prev.friendsIds, friendId];
      return {
        ...prev,
        friendsIds: updatedFriends
      };
    });

    setUsersList(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        return {
          ...u,
          friendsIds: u.friendsIds.includes(friendId) ? u.friendsIds : [...u.friendsIds, friendId]
        };
      }
      if (u.id === friendId) {
        return {
          ...u,
          friendsIds: u.friendsIds.includes(currentUser.id) ? u.friendsIds : [...u.friendsIds, currentUser.id]
        };
      }
      return u;
    }));
  };

  const nextRace = races.find(r => r.status === 'Upcoming' && r.date >= TODAY_STR) || races.find(r => r.status === 'Upcoming');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* Header Bar */}
      <Header
        currentUser={isLoggedIn ? currentUser : null}
        notifications={notifications}
        nextRace={nextRace}
        onOpenNotifications={() => setShowNotificationsModal(true)}
        onOpenAdmin={() => setShowAdminModal(!showAdminModal)}
        onOpenOnboarding={() => setShowOnboardingModal(true)}
        onTriggerScrape={handleTriggerScrape}
        onOpenApexLive={() => setShowApexLiveModal(true)}
        onLogout={handleLogout}
        onOpenExportCode={() => setShowExportModal(true)}
        isScraping={isScraping}
        isAdminOpen={showAdminModal}
        isLoggedIn={isLoggedIn}
        onOpenLogin={(mode) => {
          setAuthModalMode(mode || 'login');
          setShowAuthModal(true);
        }}
        activeTab={activeTab}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          setShowAdminModal(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main View router */}
      <main className="flex-1 relative">
        {showAdminModal && currentUser?.email?.toLowerCase() === 'antonio.santoro8959@gmail.com' ? (
          <AdminPitWallView
            organizers={organizers}
            races={races}
            tracks={tracks}
            onTriggerScrape={handleTriggerScrape}
            isScraping={isScraping}
            onAddRace={handleAdminAddRace}
            onDeleteRace={handleAdminDeleteRace}
            scrapeLogs={scrapeLogs}
            onOpenExportCode={() => setShowExportModal(true)}
          />
        ) : (
          <>
            {activeTab === 'home' && (
              <HomeLandingView
                races={races}
                tracks={tracks}
                organizers={organizers}
                demoUsers={usersList}
                isLoggedIn={isLoggedIn}
                currentUser={currentUser}
                onOpenLogin={(mode) => {
                  setAuthModalMode(mode || 'login');
                  setShowAuthModal(true);
                }}
                onLoginSuccess={(user) => {
                  handleLoginSuccess(user);
                  setShowAuthModal(false);
                }}
                onSelectRace={(race) => setSelectedRace(race)}
                onNavigateTab={(tab) => {
                  setActiveTab(tab);
                  setShowAdminModal(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenApexLive={() => setShowApexLiveModal(true)}
                onQuickDemoLogin={(user) => {
                  handleLoginSuccess(user);
                  setShowAuthModal(false);
                }}
              />
            )}

            {activeTab === 'map' && (
              <MapView
                tracks={tracks}
                races={races}
                onSelectRace={(race) => setSelectedRace(race)}
                onSelectTrack={(track) => setSelectedTrack(track)}
                selectedTrack={selectedTrack}
                onCloseTrackDrawer={() => setSelectedTrack(null)}
              />
            )}

            {activeTab === 'championships' && (
              <CampionatiView
                races={races}
                tracks={tracks}
                onSelectRace={(race) => setSelectedRace(race)}
                onBuyRaceDirect={(race) => {
                  if (!isLoggedIn) {
                    setAuthModalMode('login');
                    setShowAuthModal(true);
                  } else {
                    setRaceToCheckout(race);
                  }
                }}
              />
            )}

            {activeTab === 'calendar' && (
              <CalendarView
                races={races}
                tracks={tracks}
                onSelectRace={(race) => setSelectedRace(race)}
              />
            )}

            {activeTab === 'feed' && (
              <ActivityFeedView
                feedItems={activityFeed}
                currentUser={currentUser}
                telemetryLogs={telemetryLogs}
                onOpenLogModal={() => {
                  if (!isLoggedIn) {
                    setAuthModalMode('login');
                    setShowAuthModal(true);
                    return;
                  }
                  setShowLogModal(true);
                }}
                onLikeToggle={handleLikeToggle}
              />
            )}

            {activeTab === 'garage' && (
              <ProfileGarageView
                currentUser={currentUser}
                allUsers={usersList}
                tracks={tracks}
                races={races}
                telemetryLogs={telemetryLogs}
                allBadges={TROPHY_CATALOG}
                communityFriends={communityFriends}
                onToggleFavoriteTrack={handleToggleFavoriteTrack}
                onToggleNotifications={() => setCurrentUser(prev => ({ ...prev, notifyOnNewRaces: !prev.notifyOnNewRaces }))}
                onOpenBenefitStore={() => setShowBenefitModal(true)}
                onOpenGpsImport={() => setShowGpsModal(true)}
                onUpdatePrivacySettings={handleUpdatePrivacySettings}
                onSaveCrest={handleSaveCrest}
                onEquipTitleBadge={handleEquipTitleBadge}
                onUpdateProfile={handleUpdateProfile}
                onAddFriend={handleAddFriend}
                onLogout={handleLogout}
                onOpenExportCode={() => setShowExportModal(true)}
              />
            )}
          </>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          setShowAdminModal(false);
          if (tab === 'garage' && !isLoggedIn) {
            setAuthModalMode('login');
            setShowAuthModal(true);
            return;
          }
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onLogRaceClick={() => {
          if (!isLoggedIn) {
            setAuthModalMode('login');
            setShowAuthModal(true);
            return;
          }
          setShowLogModal(true);
        }}
        isLoggedIn={isLoggedIn}
      />

      {/* Modals */}
      {showAuthModal && (
        <AuthView
          demoUsers={usersList}
          onLoginSuccess={(user) => {
            handleLoginSuccess(user);
            setShowAuthModal(false);
          }}
          onCreateAccount={(data) => {
            handleCreateAccount(data);
            setShowAuthModal(false);
          }}
          initialMode={authModalMode}
          onClose={() => setShowAuthModal(false)}
          isModal={true}
        />
      )}

      {selectedRace && (
        <RaceDetailModal
          race={selectedRace}
          track={tracks.find(t => t.id === selectedRace.trackId)}
          onClose={() => setSelectedRace(null)}
          onBuyRaceDirect={(race) => {
            if (!isLoggedIn) {
              setAuthModalMode('login');
              setShowAuthModal(true);
            } else {
              setRaceToCheckout(race);
            }
          }}
        />
      )}

      {raceToCheckout && (
        <RaceCheckoutModal
          race={raceToCheckout}
          currentUser={currentUser}
          onClose={() => setRaceToCheckout(null)}
          onSuccessPurchase={handlePurchaseRaceSuccess}
        />
      )}

      {showBenefitModal && (
        <BenefitStoreModal
          currentUser={currentUser}
          rewards={BENEFIT_CATALOG}
          onClose={() => setShowBenefitModal(false)}
          onRedeemReward={handleRedeemBenefit}
        />
      )}

      {showGpsModal && (
        <GpsTelemetryImportModal
          tracks={tracks}
          onClose={() => setShowGpsModal(false)}
          onImportSuccess={handleGpsImportSuccess}
        />
      )}

      {showApexLiveModal && (
        <ApexTimingLiveModal
          onClose={() => setShowApexLiveModal(false)}
        />
      )}

      {showLogModal && (
        <LogRaceModal
          tracks={tracks}
          onClose={() => setShowLogModal(false)}
          onSubmitLog={handleLogRaceSubmit}
        />
      )}

      {showOnboardingModal && (
        <PitStopOnboardingModal
          currentUser={currentUser}
          tracks={tracks}
          onClose={() => setShowOnboardingModal(false)}
          onSaveProfile={(updated) => setCurrentUser(prev => ({ ...prev, ...updated }))}
        />
      )}

      {showNotificationsModal && (
        <NotificationsModal
          notifications={notifications}
          onClose={() => setShowNotificationsModal(false)}
          onMarkAllRead={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
        />
      )}

      {showExportModal && (
        <ExportCodeModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          racesCount={races.length}
        />
      )}
    </div>
  );
}
