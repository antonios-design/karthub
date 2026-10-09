# 🏎️ KART HUB ITALIA — Motorsport & Rental Karting Hub

Piattaforma full-stack di aggregazione, tracciamento telemetria, gestione campionati e storico gare per il rental karting ed endurance in Italia (Pomposa, Lonato, Misano, Siena, Viterbo, Ottobiano e molti altri).

---

## 🚀 Requisiti di Sistema
- **Node.js** >= 18.0.0 (consigliato Node 20 LTS o superiore)
- **npm** >= 9.0.0 (oppure `pnpm` / `bun`)

---

## 📦 Installazione Rapida

1. **Estrai il pacchetto ZIP** in una cartella a tua scelta:
   ```bash
   unzip karthub-italy-prototype.zip -d karthub-italy
   cd karthub-italy
   ```

2. **Installa tutte le dipendenze npm**:
   ```bash
   npm install
   ```

3. **Configura le variabili d'ambiente** (opzionale):
   Copia il file di esempio se desideri configurare API personalizzate:
   ```bash
   cp .env.example .env
   ```
   *(L'applicazione funziona perfettamente anche senza chiavi esterne per tutte le funzionalità di base).*

---

## 🏁 Avvio del Prototipo

### Modalità Sviluppo (Dev Server):
```bash
npm run dev
```
Apri il browser su: **`http://localhost:3000`**  
*(Vite Dev Server con Hot Module Replacement integrato sul backend Express).*

### Compilazione e Avvio in Produzione:
```bash
npm run build
npm start
```

### Verifica e Controllo Tipi TypeScript:
```bash
npm run lint
```

---

## 🛠️ Architettura del Progetto

```
├── server.ts                   # Backend Express con API REST, simulatore scraper, endpoint zip export
├── index.html                  # HTML5 entrypoint con Leaflet CSS & Google Fonts
├── package.json                # Dipendenze e script npm
├── vite.config.ts              # Configurazione Vite e Tailwind CSS v4
├── tsconfig.json               # Configurazione TypeScript
└── src/
    ├── main.tsx                # Mount di React 19 SPA
    ├── App.tsx                 # Controller principale dell'applicazione, stato utenti, navigazione e modali
    ├── index.css               # Styling globale Tailwind CSS v4
    ├── types.ts                # Definizioni TypeScript (Gare, Campionati, Piloti, Circuiti, Telemetria)
    ├── data/
    │   └── mockData.ts         # Dataset iniziale con oltre 35 gare italiane, 8 organizzatori e circuiti
    └── components/
        ├── CampionatiView.tsx  # Vista Campionati con Archivio "Storico Gare" antecedenti ad oggi e Classifiche
        ├── CalendarView.tsx    # Calendario gare mensile filtrato per date future con avviso archivio
        ├── MapView.tsx         # Mappa interattiva Leaflet dei circuiti italiani con tappe in programma
        ├── LeaderboardView.tsx # Classifiche piloti SWS e tempi sul giro
        ├── ProfileGarageView.tsx # Garage pilota, tessere ASI/CSAI, badge sbloccati, voucher e biglietti
        ├── AdminPitWallView.tsx# Pit Wall Admin, log scraper, aggiunta/cancellazione gare, export
        ├── ExportCodeModal.tsx # Modale di download codice sorgente, istruzioni Git e guida al deploy
        ├── Header.tsx          # Navigazione superiore con pulsante Live Apex, Scraper Sync ed Esporta Codice
        └── ... (altri modali e viste interattive)
```

---

## 🌐 Endpoint API Principali

- `GET /api/health` — Controllo stato del server e conteggio gare
- `GET /api/races` — Elenco completo gare con filtri (`format`, `region`, `upcomingOnly`)
- `GET /api/tracks` — Circuiti italiani geolocalizzati (Pomposa, Misano, Lonato, ecc.)
- `GET /api/organizers` — Organizzatori ed enti ufficiali (Pomposa Endurance, SWS, RKC ASI, We-Race...)
- `GET /api/export-project` — **Download automatico dell'intero archivio ZIP del codice sorgente**
- `POST /api/scrape/trigger` — Sincronizzazione automatica gare e rilevamento variazioni prezzi/slot

---

## 🐙 Condivisione su Git / GitHub

Per pubblicare il codice esportato su un repository GitHub:
```bash
git init
git add .
git commit -m "feat: karthub italy prototype export"
git branch -M main
git remote add origin https://github.com/<tuo-utente>/<tuo-repo>.git
git push -u origin main
```

---
*Creato per KartHub Italia — Aggregatore Rental & Endurance Karting.*
