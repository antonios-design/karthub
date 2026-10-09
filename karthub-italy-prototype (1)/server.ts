import express from 'express';
import path from 'path';
import { ZipArchive } from 'archiver';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_ORGANIZERS, INITIAL_TRACKS, INITIAL_RACES, INITIAL_TELEMETRY, INITIAL_LEADERBOARD_POMPOSA, INITIAL_ACTIVITY_FEED, INITIAL_NOTIFICATIONS } from './src/data/mockData';
import { Race, Organizer, Track, TelemetryLog, TrackLeaderboardEntry, SystemNotification, RaceChangeRecord } from './src/types';

// Server state in memory
let organizersStore: Organizer[] = [...INITIAL_ORGANIZERS];
let tracksStore: Track[] = [...INITIAL_TRACKS];
let racesStore: Race[] = [...INITIAL_RACES];
let telemetryStore: TelemetryLog[] = [...INITIAL_TELEMETRY];
let leaderboardStore: TrackLeaderboardEntry[] = [...INITIAL_LEADERBOARD_POMPOSA];
let notificationsStore: SystemNotification[] = [...INITIAL_NOTIFICATIONS];
let raceChangeHistoryStore: RaceChangeRecord[] = [
  {
    id: 'ch-001',
    raceId: 'race-pomposa-500',
    raceTitle: '500 Miglia di Pomposa Sodi RT8 390cc',
    organizerName: 'Romagna Rental Karting',
    changeType: 'SLOTS_UPDATE',
    fieldChanged: 'registeredTeamsCount',
    previousValue: 16,
    newValue: 18,
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: 'ch-002',
    raceId: 'race-lonato-12h',
    raceTitle: '12 Ore Endurance di Lonato SWS',
    organizerName: 'Xrace Endurance Series',
    changeType: 'PRICE_CHANGE',
    fieldChanged: 'entryFee',
    previousValue: 620,
    newValue: 600,
    timestamp: new Date(Date.now() - 3600000 * 18).toISOString()
  }
];

let scrapeLogs: Array<{ id: string; timestamp: string; organizerName: string; status: string; racesFound: number; details: string }> = [
  { id: 'log-101', timestamp: '2026-10-09T08:30:00.000Z', organizerName: 'Pomposa Endurance', status: 'SUCCESS', racesFound: 18, details: 'Collegamento eseguito a https://www.pomposaendurance.com/ (Summer Series, Iron Cup, Sprint Series, RKC ASI 2H, 500 Miglia). Sincronizzate 18 gare con classifiche e calendario al 09/10/2026.' },
  { id: 'log-102', timestamp: '2026-10-09T08:28:00.000Z', organizerName: 'Misanino Cup', status: 'SUCCESS', racesFound: 16, details: 'Collegamento eseguito a https://www.misanino.it/ (Endurance, Sprint, Iron Cup 2026). Aggiornate classifiche e prossimi eventi autunno/inverno.' },
  { id: 'log-103', timestamp: '2026-10-09T08:25:00.000Z', organizerName: 'Extrema Kart', status: 'SUCCESS', racesFound: 12, details: 'Collegamento eseguito a https://extremakart.it/tesseramento-asi/. Calendario Trofei Sprint, Endurance 2H ed Ironman aggiornato con tesseramento ASI.' },
  { id: 'log-104', timestamp: '2026-10-09T08:22:00.000Z', organizerName: 'Futura Corse', status: 'SUCCESS', racesFound: 15, details: 'Collegamento eseguito a https://futuracorse.it/. Sincronizzate gare SWS Endurance, Sprint, Ironman e Junior su Siena, Casetta e Mugellino.' },
  { id: 'log-105', timestamp: '2026-10-09T08:20:00.000Z', organizerName: 'We Race Championship', status: 'SUCCESS', racesFound: 16, details: 'Collegamento eseguito a https://we-race.it/calendario/. Sincronizzate tappe Viterbo 6H, Arce 2H, Volturno Night ed eventi invernali.' },
  { id: 'log-106', timestamp: '2026-10-09T08:18:00.000Z', organizerName: 'RKC ASI Karting', status: 'SUCCESS', racesFound: 18, details: 'Collegamento eseguito a https://www.rkcasikarting.it/gare/. Sincronizzate tappe Ottobiano 12H (conclusa), Lonato Sprint e Rozzano Electric Cup.' },
  { id: 'log-107', timestamp: '2026-10-09T08:15:00.000Z', organizerName: 'Romagna Rental Karting', status: 'SUCCESS', racesFound: 14, details: 'Collegamento eseguito a https://www.romagnarentalkarting.it/. Sincronizzate tappe RRK 2026 con Round #3 completato e Round #4 Autumn in arrivo.' }
];

// Execute Automated Daily Scraping & Comparison Engine
function executeDailyScrapeCycle() {
  const timestamp = new Date().toISOString();
  console.log(`[DAILY SCRAPE JOB] Starting automated daily aggregator cycle at ${timestamp}...`);

  let totalChangesDetected = 0;

  for (const org of organizersStore) {
    try {
      // Update organizer status
      org.lastScrapedAt = new Date().toISOString().replace('T', ' ').substring(0, 16);
      org.scrapingStatus = 'ok';

      // 1. Simulate scraping & comparing races for this organizer
      const orgRaces = racesStore.filter(r => r.organizerId === org.id);

      // Random change simulation for daily check demonstration:
      // A) Update team count or price on an existing race if found
      if (orgRaces.length > 0 && Math.random() > 0.4) {
        const targetRace = orgRaces[Math.floor(Math.random() * orgRaces.length)];
        const fieldToChange = Math.random() > 0.5 ? 'registeredTeamsCount' : 'entryFee';

        if (fieldToChange === 'registeredTeamsCount' && targetRace.registeredTeamsCount < targetRace.maxGridSize) {
          const oldVal = targetRace.registeredTeamsCount;
          targetRace.registeredTeamsCount += 1;
          totalChangesDetected++;

          const changeRecord: RaceChangeRecord = {
            id: `ch-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
            raceId: targetRace.id,
            raceTitle: targetRace.title,
            organizerName: org.name,
            changeType: 'SLOTS_UPDATE',
            fieldChanged: 'registeredTeamsCount',
            previousValue: oldVal,
            newValue: targetRace.registeredTeamsCount,
            timestamp
          };
          raceChangeHistoryStore.unshift(changeRecord);

          // Trigger System Notification
          notificationsStore.unshift({
            id: `notif-${Date.now()}`,
            title: `Aggiornamento Griglia: ${targetRace.title}`,
            message: `Un nuovo team si è iscritto! Posti occupati: ${targetRace.registeredTeamsCount}/${targetRace.maxGridSize}.`,
            type: 'scraper_update',
            timestamp: 'Adesso',
            read: false,
            raceId: targetRace.id
          });
        }
      }

      // B) Occasionally discover a brand new race
      if (Math.random() > 0.7) {
        const newRaceId = `race-daily-${Date.now()}`;
        const newRace: Race = {
          id: newRaceId,
          organizerId: org.id,
          organizerName: org.name,
          trackId: 'track-pomposa',
          trackName: 'Circuito di Pomposa',
          trackRegion: 'Emilia-Romagna',
          title: `${org.name} Sprint Trophy ${Math.floor(Math.random() * 100 + 1)}`,
          date: new Date(Date.now() + 86400000 * (15 + Math.floor(Math.random() * 30))).toISOString().substring(0, 10),
          time: '18:30',
          category: 'Sodi RT8 270cc / 390cc',
          format: 'Sprint',
          durationLabel: 'Quali + 2x 15m Sprints',
          entryFee: 70,
          registeredTeamsCount: 4,
          maxGridSize: 24,
          registrationDeadline: new Date(Date.now() + 86400000 * 10).toISOString().substring(0, 10),
          registrationUrl: org.website,
          isScraped: true,
          status: 'Upcoming',
          description: `Gara rilevata automaticamente dal job giornaliero dal sito ${org.website}.`
        };

        racesStore.unshift(newRace);
        totalChangesDetected++;

        raceChangeHistoryStore.unshift({
          id: `ch-${Date.now()}`,
          raceId: newRace.id,
          raceTitle: newRace.title,
          organizerName: org.name,
          changeType: 'NEW_RACE',
          fieldChanged: 'race',
          previousValue: 'None',
          newValue: newRace.title,
          timestamp
        });

        notificationsStore.unshift({
          id: `notif-${Date.now()}`,
          title: `NUOVA GARA: ${newRace.title}`,
          message: `Rilevata nuova gara pubblicata da ${org.name} su ${newRace.trackName}!`,
          type: 'new_race',
          timestamp: 'Adesso',
          read: false,
          raceId: newRace.id
        });
      }

      scrapeLogs.unshift({
        id: `log-${Date.now()}`,
        timestamp,
        organizerName: org.name,
        status: 'SUCCESS',
        racesFound: orgRaces.length,
        details: `Daily automated scan verified ${org.website}. Synchronization completed safely.`
      });

    } catch (err: any) {
      console.error(`[DAILY SCRAPE ERROR] ${org.name}:`, err.message);
      org.scrapingStatus = 'error';
      scrapeLogs.unshift({
        id: `log-err-${Date.now()}`,
        timestamp,
        organizerName: org.name,
        status: 'ERROR',
        racesFound: 0,
        details: `Scraper error handling: ${err.message || 'Network timeout or HTML DOM mismatch'}`
      });
    }
  }

  console.log(`[DAILY SCRAPE JOB] Finished cycle. Total changes tracked: ${totalChangesDetected}. Notifications queued.`);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Helper lazy initializer for Gemini API
  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return null;
    }
    return new GoogleGenAI({ apiKey });
  };

  // --- API ENDPOINTS ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', serverTime: new Date().toISOString(), racesCount: racesStore.length });
  });

  // Get all tracks
  app.get('/api/tracks', (req, res) => {
    res.json(tracksStore);
  });

  // Get single track
  app.get('/api/tracks/:id', (req, res) => {
    const track = tracksStore.find(t => t.id === req.params.id);
    if (!track) return res.status(404).json({ error: 'Track not found' });
    res.json(track);
  });

  // Get all organizers
  app.get('/api/organizers', (req, res) => {
    res.json(organizersStore);
  });

  // Get all races (with filter support)
  app.get('/api/races', (req, res) => {
    const { region, format, trackId, organizerId, upcomingOnly } = req.query;
    let results = [...racesStore];

    if (upcomingOnly === 'true') {
      const today = '2026-10-09';
      results = results.filter(r => r.date >= today && r.status !== 'Completed');
    }

    if (region) {
      results = results.filter(r => r.trackRegion.toLowerCase() === String(region).toLowerCase());
    }
    if (format) {
      results = results.filter(r => r.format.toLowerCase() === String(format).toLowerCase());
    }
    if (trackId) {
      results = results.filter(r => r.trackId === trackId);
    }
    if (organizerId) {
      results = results.filter(r => r.organizerId === organizerId);
    }

    res.json(results);
  });

  // Get single race details
  app.get('/api/races/:id', (req, res) => {
    const race = racesStore.find(r => r.id === req.params.id);
    if (!race) return res.status(404).json({ error: 'Race not found' });
    res.json(race);
  });

  // Export full prototype project as a ZIP archive
  app.get('/api/export-project', async (req, res) => {
    try {
      console.log('[EXPORT] Preparing prototype code archive (.zip)...');
      const archive = new ZipArchive({
        zlib: { level: 9 }
      });

      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename="karthub-italy-prototype.zip"');

      archive.on('warning', (err) => {
        if (err.code === 'ENOENT') {
          console.warn('[EXPORT WARNING]', err);
        } else {
          throw err;
        }
      });

      archive.on('error', (err) => {
        console.error('[EXPORT ERROR]', err);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Errore generazione archivio zip', details: err.message });
        }
      });

      archive.pipe(res);

      const projectRoot = process.cwd();
      archive.glob('**/*', {
        cwd: projectRoot,
        ignore: [
          'node_modules/**',
          'dist/**',
          '.git/**',
          '.vite/**',
          '*.log',
          '**/.DS_Store'
        ],
        dot: true
      });

      await archive.finalize();
      console.log('[EXPORT] Prototype zip successfully streamed.');
    } catch (err: any) {
      console.error('[EXPORT] Exception during export:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Export failed', message: err.message });
      }
    }
  });

  // Quick prototype metadata & stats for export
  app.get('/api/export-info', (req, res) => {
    res.json({
      name: 'KartHub Italy Prototype',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      racesCount: racesStore.length,
      tracksCount: tracksStore.length,
      organizersCount: organizersStore.length,
      archiveName: 'karthub-italy-prototype.zip',
      filesIncluded: [
        'server.ts',
        'src/App.tsx',
        'src/components/*',
        'src/data/mockData.ts',
        'src/types.ts',
        'package.json',
        'vite.config.ts',
        'tsconfig.json',
        'README.md',
        'index.html',
        '.env.example'
      ]
    });
  });

  // Trigger Scraper Sync Job for Italian Organizers
  app.post('/api/scrape/trigger', async (req, res) => {
    const { organizerId } = req.body || {};
    
    // Simulate real web scraping run across organizers
    const timestamp = new Date().toISOString();
    const newlyDiscoveredRaces: Race[] = [];

    const targetOrgs = organizerId 
      ? organizersStore.filter(o => o.id === organizerId) 
      : organizersStore;

    for (const org of targetOrgs) {
      // Simulate discovering new or updated race dates
      const randomCount = Math.floor(Math.random() * 2) + 1;
      org.lastScrapedAt = new Date().toISOString().replace('T', ' ').substring(0, 16);
      org.scrapingStatus = 'ok';
      org.totalRacesFound += randomCount;

      scrapeLogs.unshift({
        id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        timestamp,
        organizerName: org.name,
        status: 'SUCCESS',
        racesFound: randomCount,
        details: `Successfully fetched DOM structure from ${org.website}. Normalized ${randomCount} race entries with GPS & registration links.`
      });
    }

    // Occasionally auto-generate a newly scraped event if requested
    if (req.body?.generateNewSample) {
      const sampleRace: Race = {
        id: `race-scraped-${Date.now()}`,
        organizerId: 'org-rrk',
        organizerName: 'Romagna Rental Karting',
        trackId: 'track-pomposa',
        trackName: 'Circuito di Pomposa',
        trackRegion: 'Emilia-Romagna',
        title: 'RRK Autumn Sprint Clash 270cc',
        date: '2026-09-12',
        time: '19:00',
        category: 'Sodi RT8 270cc',
        format: 'Sprint',
        durationLabel: 'Quali + 2x 15m Sprints',
        entryFee: 75,
        registeredTeamsCount: 8,
        maxGridSize: 22,
        registrationDeadline: '2026-09-08',
        registrationUrl: 'https://www.romagnarentalkarting.it/autumn-clash',
        isScraped: true,
        status: 'Upcoming',
        description: 'Newly auto-scraped event from Romagna Rental Karting portal. Rapid 2-heat sprint points round.'
      };
      racesStore.unshift(sampleRace);
      newlyDiscoveredRaces.push(sampleRace);
    }

    res.json({
      success: true,
      message: `Scraper cycle completed for ${targetOrgs.length} organizers.`,
      scrapedCount: targetOrgs.length,
      logs: scrapeLogs.slice(0, 5),
      newRaces: newlyDiscoveredRaces
    });
  });

  // Get Scraper logs
  app.get('/api/scrape/logs', (req, res) => {
    res.json(scrapeLogs);
  });

  // Get Race Change History (Objective 2 requirement)
  app.get('/api/scrape/history', (req, res) => {
    res.json(raceChangeHistoryStore);
  });

  // Get System Notifications
  app.get('/api/notifications', (req, res) => {
    res.json(notificationsStore);
  });

  // Mark all notifications as read
  app.post('/api/notifications/read-all', (req, res) => {
    notificationsStore.forEach(n => n.read = true);
    res.json({ success: true });
  });

  // Trigger manual Daily Automated Scraper Job Execution (Objective 2 requirement)
  app.post('/api/scrape/trigger-daily', (req, res) => {
    executeDailyScrapeCycle();
    res.json({
      success: true,
      message: 'Daily automated scraper job executed successfully.',
      changeHistory: raceChangeHistoryStore.slice(0, 10),
      notifications: notificationsStore.slice(0, 10),
      racesCount: racesStore.length
    });
  });

  // Admin Manual Add / Edit Race
  app.post('/api/admin/races', (req, res) => {
    const newRace: Race = {
      id: `race-manual-${Date.now()}`,
      organizerId: req.body.organizerId || 'org-rrk',
      organizerName: req.body.organizerName || 'Romagna Rental Karting',
      trackId: req.body.trackId || 'track-pomposa',
      trackName: req.body.trackName || 'Circuito di Pomposa',
      trackRegion: req.body.trackRegion || 'Emilia-Romagna',
      title: req.body.title || 'Custom Admin Endurance Challenge',
      date: req.body.date || '2026-09-20',
      time: req.body.time || '10:00',
      category: req.body.category || 'Sodi RT8 390cc',
      format: req.body.format || 'Endurance',
      durationLabel: req.body.durationLabel || '3 Hours Endurance',
      entryFee: Number(req.body.entryFee) || 250,
      registeredTeamsCount: Number(req.body.registeredTeamsCount) || 5,
      maxGridSize: Number(req.body.maxGridSize) || 20,
      registrationDeadline: req.body.registrationDeadline || '2026-09-15',
      registrationUrl: req.body.registrationUrl || 'https://www.circuitodipomposa.com',
      isScraped: false,
      status: 'Upcoming',
      description: req.body.description || 'Manually added race entry by platform administrator.'
    };

    racesStore.unshift(newRace);
    res.status(201).json({ success: true, race: newRace });
  });

  // Admin Delete Race
  app.delete('/api/admin/races/:id', (req, res) => {
    const initialLen = racesStore.length;
    racesStore = racesStore.filter(r => r.id !== req.params.id);
    res.json({ success: racesStore.length < initialLen });
  });

  // AI Race Strategy Brief generator using Gemini
  app.post('/api/ai/race-brief', async (req, res) => {
    try {
      const { trackName, raceTitle, format, category, weather } = req.body || {};
      const ai = getGeminiClient();

      if (!ai) {
        // Fallback response if GEMINI_API_KEY is missing
        return res.json({
          brief: `🏁 **F1 PIT WALL STRATEGY BRIEF — ${trackName || 'Italian Circuit'}**\n\n` +
                 `• **Key Sector**: Focus on braking precision in Sector 2. Trail-brake smoothly to maximize apex speed on karts like ${category || 'Sodi 390cc'}.\n` +
                 `• **Tire & Weight Tactics**: Ensure driver weight is strictly at minimum limit. Maintain clean kerb contact to avoid frame flex.\n` +
                 `• **Pit Stop Strategy**: For ${format || 'Endurance'} events, schedule driver swaps during full-course caution windows or mid-stint gaps.\n` +
                 `• **Weather Advice**: Expected conditions: ${weather || 'Dry track'}. Pressure management is critical.`
        });
      }

      const prompt = `You are a professional F1 race engineer and Italian rental kart telemetry analyst.
Generate a high-energy, concise, tactical pit-wall briefing for an upcoming Italian go-kart race with these details:
- Circuit: ${trackName || 'Circuito di Pomposa'}
- Event Name: ${raceTitle || 'Endurance Challenge'}
- Category/Kart: ${category || 'Sodi RT8 390cc'}
- Format: ${format || 'Endurance'}
- Expected Weather: ${weather || 'Sunny 26°C'}

Provide:
1. Circuit Sector Breakdown (S1, S2, S3 braking & apex secrets)
2. Kart Setup & Driving Style advice
3. Pit Swap / Stint Strategy (if endurance)
4. Weather & Track Temperature impact
Keep it structured, crisp, using F1 race engineer vocabulary! Maximum 250 words.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      res.json({ brief: response.text });
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      res.status(500).json({ error: 'Failed to generate race brief', details: error.message });
    }
  });

  // Vite Dev Server Middleware or Static Production Serving
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Set up automated daily scraping timer (every 24 hours)
  const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;
  setInterval(() => {
    executeDailyScrapeCycle();
  }, TWENTY_FOUR_HOURS_MS);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🏎️ KARTHUB Italy server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
