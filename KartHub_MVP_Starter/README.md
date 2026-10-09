# KartHub MVP Starter

Prima base pulita per trasformare il prototipo in un MVP reale.

## Avvio
1. `npm install`
2. copia `.env.example` in `.env.local`
3. `npm run dev`

Senza credenziali Supabase l'interfaccia usa esclusivamente i dati demo in `src/data/demo.ts`.

## Incluso
- struttura React + TypeScript + Vite
- navigazione mobile: Feed, Gare, Ranking, Mappa, Profilo
- pagina dettaglio gara
- distinzione eventi Listed / KartHub Booking
- design system responsive
- client Supabase predisposto
- schema SQL iniziale con RLS

## Non incluso intenzionalmente
- checkout simulato
- scraping casuale
- telemetria e live timing
- Gemini race brief
- autenticazione finta/localStorage

## Passo successivo
Creare il progetto Supabase, eseguire `supabase/schema.sql`, configurare Auth e sostituire gradualmente i dati demo con query reali.
