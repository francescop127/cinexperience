# CINÉXPERIENCE

Applicazione React/Vite per un'esperienza photo booth cinematografica con green screen: scelta dello scenario, registrazione dei partecipanti, archivio locale ed esportazione CSV.

## Run Locally

**Prerequisiti:** Node.js

1. Install dependencies:
   `npm install`
2. Run the app:
   `npm run dev`

## Automazione richieste

Dal pannello admin puoi configurare una Web App Google Apps Script e una mail destinataria. Ogni nuova registrazione viene salvata in locale, inviata via email in formato leggibile e aggiunta come riga al foglio Google collegato allo script.

Passaggi:
1. Crea un Google Sheet.
2. Apri `Estensioni > Apps Script`.
3. Incolla il codice copiabile dal pannello admin.
4. Distribuisci come `Applicazione web`, con accesso consentito a chiunque abbia il link.
5. Incolla l'URL `/exec` nel pannello admin e imposta la mail destinataria.

## Deploy GitHub Pages

Il progetto include una GitHub Action per pubblicare automaticamente la build su GitHub Pages a ogni push su `main`.

Per preconfigurare tutti i dispositivi senza usare il pannello admin, aggiungi nel repository GitHub:

- `Settings > Secrets and variables > Actions > Variables`
- `VITE_AUTOMATION_URL`: URL `/exec` della Web App Apps Script
- `VITE_NOTIFICATION_EMAIL`: email destinataria delle richieste
