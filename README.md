# CINÉXPERIENCE

Applicazione React/Vite per un'esperienza photo booth cinematografica con green screen: scelta dello scenario, registrazione dei partecipanti, archivio locale ed esportazione CSV.

## Run Locally

**Prerequisiti:** Node.js

1. Install dependencies:
   `npm install`
2. Run the app:
   `npm run dev`

## Step 1: Mail riepilogativa

Dal pannello admin puoi configurare una Web App Google Apps Script e una mail destinataria. Ogni nuova registrazione viene salvata in locale e inviata via email in formato leggibile con dati partecipante, scenario richiesto, descrizione creativa, suggerimento posa, consenso privacy e note operative. La mail predefinita per la ricezione richieste è `cinexperience26@gmail.com`.

Passaggi:
1. Crea un Google Sheet.
2. Apri `Estensioni > Apps Script`.
3. Incolla il codice copiabile dal pannello admin.
4. Distribuisci come `Applicazione web`, con accesso consentito a chiunque abbia il link.
5. Incolla l'URL `/exec` nel pannello admin e imposta la mail destinataria.

## Step 2: Database centralizzato Supabase

Supabase permette di sincronizzare le richieste tra dispositivi. Se configurato, l'app carica, crea, aggiorna ed elimina richieste dalla tabella cloud `photo_requests`. Se Supabase non è configurato o non risponde, l'app continua a usare il salvataggio locale del browser.

Passaggi:
1. Crea un progetto Supabase.
2. Apri `SQL Editor`.
3. Incolla ed esegui il file `supabase/schema.sql`.
4. Copia `Project URL` e `anon public key` da `Project Settings > API`.
5. Aggiungi le variabili:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

Nota sicurezza: questa prima configurazione è pensata per uso operativo controllato durante evento. Per bloccare davvero lettura/modifica/eliminazione dietro login admin, il prossimo step sarà aggiungere Supabase Auth o una Edge Function server-side.

## Deploy Vercel con Supabase

Su Vercel le variabili devono essere presenti prima della build. Apri `Project Settings > Environment Variables`, aggiungi le variabili per `Production` e poi fai `Redeploy` dell'ultimo deployment.

Variabili supportate:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

Se usi l'integrazione Supabase di Vercel, l'app supporta anche questi nomi:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_PUBLISHABLE_KEY`

Se dopo il redeploy il pannello admin mostra ancora `Database locale`, significa che la build pubblicata non sta ricevendo le variabili Supabase oppure che i nomi non corrispondono esattamente.

## Deploy GitHub Pages

Il progetto include una GitHub Action per pubblicare automaticamente la build su GitHub Pages a ogni push su `main`.

Per preconfigurare tutti i dispositivi senza usare il pannello admin, aggiungi nel repository GitHub:

- `Settings > Secrets and variables > Actions > Variables`
- `VITE_AUTOMATION_URL`: URL `/exec` della Web App Apps Script
- `VITE_NOTIFICATION_EMAIL`: email destinataria delle richieste, default `cinexperience26@gmail.com`
- `VITE_SUPABASE_URL`: URL progetto Supabase
- `VITE_SUPABASE_ANON_KEY`: anon public key Supabase
