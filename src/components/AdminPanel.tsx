import React, { useState } from 'react';
import { PhotoRequest, ProcessingStatus, MovieSetting } from '../types';
import { 
  Users, 
  Search, 
  Trash2, 
  Download, 
  RefreshCw, 
  CheckCircle, 
  Clock, 
  Send,
  Copy,
  Mail,
  Link,
  Filter, 
  Database, 
  Settings, 
  Sparkles, 
  Check, 
  Settings2,
  AlertTriangle,
  Image,
  Pencil,
  RotateCcw,
  Save,
  Upload,
  X
} from 'lucide-react';

interface AdminPanelProps {
  requests: PhotoRequest[];
  onUpdateStatus: (id: string, status: ProcessingStatus) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onDeleteRequest: (id: string) => void;
  onClearAllRequests: () => void;
  onSeedMockData: () => void;
  settings: MovieSetting[];
  onUpdateSetting: (setting: MovieSetting) => void;
  onResetSettings: () => void;
  autoResetTime: number;
  onUpdateAutoResetTime: (time: number) => void;
  automationUrl: string;
  onUpdateAutomationUrl: (url: string) => void;
  notificationEmail: string;
  onUpdateNotificationEmail: (email: string) => void;
  databaseStatus: 'local' | 'loading' | 'connected' | 'error';
  isCentralDatabaseConfigured: boolean;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  requests,
  onUpdateStatus,
  onUpdateNotes,
  onDeleteRequest,
  onClearAllRequests,
  onSeedMockData,
  settings,
  onUpdateSetting,
  onResetSettings,
  autoResetTime,
  onUpdateAutoResetTime,
  automationUrl,
  onUpdateAutomationUrl,
  notificationEmail,
  onUpdateNotificationEmail,
  databaseStatus,
  isCentralDatabaseConfigured,
  onClose
}) => {
  const [search, setSearch] = useState('');
  const [selectedSettingFilter, setSelectedSettingFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState('');
  const [copiedScript, setCopiedScript] = useState(false);
  const [testAutomationStatus, setTestAutomationStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testAutomationMessage, setTestAutomationMessage] = useState('');
  const [editingSettingId, setEditingSettingId] = useState<string | null>(null);
  const [settingDraft, setSettingDraft] = useState<MovieSetting | null>(null);
  const [showResetSettingsConfirm, setShowResetSettingsConfirm] = useState(false);
  const [imageUploadError, setImageUploadError] = useState('');

  const automationScript = `const DEFAULT_NOTIFICATION_EMAIL = "cinexperience26@gmail.com";

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents || "{}");

    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "ID richiesta",
        "Nome",
        "Cognome",
        "Email partecipante",
        "Scenario richiesto",
        "ID scenario",
        "Genere scenario",
        "Descrizione scenario",
        "Suggerimento posa",
        "Data registrazione",
        "Consenso privacy",
        "Stato",
        "Note"
      ]);
    }

    sheet.appendRow([
      data.id || "",
      data.firstName || "",
      data.lastName || "",
      data.email || "",
      data.settingTitle || "",
      data.settingId || "",
      data.settingGenre || "",
      data.settingDescription || "",
      data.settingPromptHint || "",
      data.timestamp || "",
      data.privacyAccepted ? "SI" : "NO",
      data.status || "da_elaborare",
      data.notes || ""
    ]);

    const recipient = data.notificationEmail || DEFAULT_NOTIFICATION_EMAIL;
    if (recipient) {
      const subject = "Nuova richiesta CINÉXPERIENCE - " + (data.settingTitle || "Scenario");
      const body = [
        "NUOVA RICHIESTA CINÉXPERIENCE",
        "",
        "DATI RICHIESTA",
        "ID richiesta: " + (data.id || ""),
        "Data registrazione: " + (data.timestamp || ""),
        "Stato: " + (data.status || "da_elaborare"),
        "",
        "DATI PARTECIPANTE",
        "Nome: " + (data.firstName || "") + " " + (data.lastName || ""),
        "Email partecipante: " + (data.email || ""),
        "Consenso privacy: " + (data.privacyAccepted ? "SI" : "NO"),
        "",
        "SCENARIO DA REALIZZARE",
        "Scenario richiesto: " + (data.settingTitle || ""),
        "ID scenario: " + (data.settingId || ""),
        "Genere scenario: " + (data.settingGenre || ""),
        "Descrizione scenario: " + (data.settingDescription || ""),
        "Suggerimento posa: " + (data.settingPromptHint || ""),
        "",
        "NOTE OPERATIVE",
        data.notes || "-"
      ].join("\\n");

      MailApp.sendEmail(recipient, subject, body);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: String(error) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;

  // Filtering
  const filteredRequests = requests.filter((req) => {
    const matchesSearch = 
      req.firstName.toLowerCase().includes(search.toLowerCase()) ||
      req.lastName.toLowerCase().includes(search.toLowerCase()) ||
      req.email.toLowerCase().includes(search.toLowerCase()) ||
      req.id.includes(search);
    
    const matchesSetting = selectedSettingFilter === 'all' || req.settingId === selectedSettingFilter;
    const matchesStatus = selectedStatusFilter === 'all' || req.status === selectedStatusFilter;

    return matchesSearch && matchesSetting && matchesStatus;
  });

  // Calculate statistics
  const totalRequests = requests.length;
  const pendingCount = requests.filter(r => r.status === 'da_elaborare').length;
  const processingCount = requests.filter(r => r.status === 'in_lavorazione').length;
  const sentCount = requests.filter(r => r.status === 'inviato').length;
  const databaseLabel = databaseStatus === 'connected'
    ? 'Cloud Database'
    : databaseStatus === 'loading'
      ? 'Sync in corso'
      : databaseStatus === 'error'
        ? 'Fallback locale'
        : 'Database locale';

  // Movie setting popularity stats
  const settingStats = settings.map(setting => {
    const count = requests.filter(r => r.settingId === setting.id).length;
    const percentage = totalRequests > 0 ? Math.round((count / totalRequests) * 100) : 0;
    return { ...setting, count, percentage };
  }).sort((a, b) => b.count - a.count);

  // CSV Export Utility
  const handleExportCSV = () => {
    if (requests.length === 0) return;
    
    // Header
    const headers = ['ID', 'Nome', 'Cognome', 'Email', 'Scenario', 'Data Registrazione', 'Consenso Privacy', 'Stato Lavorazione', 'Note'];
    
    // Rows
    const rows = requests.map(r => [
      r.id,
      r.firstName,
      r.lastName,
      r.email,
      r.settingTitle,
      r.timestamp,
      r.privacyAccepted ? 'Sì' : 'No',
      r.status,
      r.notes || ''
    ]);

    // Build CSV Content
    const csvContent = [
      headers.join(';'), // Semicolon is better for Italian Excel default
      ...rows.map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(';'))
    ].join('\r\n');

    // Create download link
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    // Create current timestamp for the file name
    const dateStr = new Date().toISOString().slice(0, 10);
    link.setAttribute('href', url);
    link.setAttribute('download', `CINEXPERIENCE_Registrazioni_${dateStr}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const startEditingNotes = (id: string, currentNotes: string) => {
    setEditingNotesId(id);
    setTempNotes(currentNotes || '');
  };

  const saveNotes = (id: string) => {
    onUpdateNotes(id, tempNotes);
    setEditingNotesId(null);
  };

  const startEditingSetting = (setting: MovieSetting) => {
    setEditingSettingId(setting.id);
    setSettingDraft({ ...setting });
  };

  const cancelEditingSetting = () => {
    setEditingSettingId(null);
    setSettingDraft(null);
  };

  const updateSettingDraft = (field: keyof MovieSetting, value: string) => {
    setSettingDraft((current) => current ? { ...current, [field]: value } : current);
  };

  const resizeImageFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const img = new window.Image();

        img.onload = () => {
          const maxSize = 1400;
          const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, Math.round(img.width * scale));
          canvas.height = Math.max(1, Math.round(img.height * scale));

          const context = canvas.getContext('2d');
          if (!context) {
            reject(new Error('Impossibile preparare l’immagine.'));
            return;
          }

          context.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.82));
        };

        img.onerror = () => reject(new Error('File immagine non leggibile.'));
        img.src = String(reader.result || '');
      };

      reader.onerror = () => reject(new Error('Caricamento immagine non riuscito.'));
      reader.readAsDataURL(file);
    });
  };

  const handleSettingImageUpload = async (file: File | undefined) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setImageUploadError('Seleziona un file immagine valido.');
      return;
    }

    try {
      setImageUploadError('');
      const imageUrl = await resizeImageFile(file);
      updateSettingDraft('imageUrl', imageUrl);
    } catch (err: any) {
      setImageUploadError(err.message || 'Caricamento immagine non riuscito.');
    }
  };

  const saveSettingDraft = () => {
    if (!settingDraft) return;
    onUpdateSetting(settingDraft);
    cancelEditingSetting();
  };

  const copyAutomationScript = async () => {
    await navigator.clipboard.writeText(automationScript);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 3000);
  };

  const testAutomation = async () => {
    if (!automationUrl) {
      setTestAutomationStatus('error');
      setTestAutomationMessage('Inserisci prima l’URL della Web App.');
      return;
    }

    setTestAutomationStatus('testing');
    setTestAutomationMessage('');

    try {
      await fetch(automationUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        mode: 'no-cors',
        body: JSON.stringify({
          id: 'REQ_TEST',
          firstName: 'Mario',
          lastName: 'Rossi',
          email: 'mario.rossi@test.it',
          settingId: 'test',
          settingTitle: 'Scenario test CINÉXPERIENCE',
          settingGenre: 'Test operativo',
          settingDescription: 'Richiesta di prova per verificare foglio e notifica email.',
          settingPromptHint: 'Controllare che questa riga appaia nel foglio e nella mail.',
          timestamp: new Date().toLocaleString('it-IT'),
          privacyAccepted: true,
          status: 'da_elaborare',
          notes: 'Test automazione da pannello admin',
          notificationEmail,
          source: 'CINÉXPERIENCE'
        })
      });

      setTestAutomationStatus('success');
      setTestAutomationMessage('Richiesta test inviata. Controlla il foglio e la casella email configurata.');
    } catch (err: any) {
      setTestAutomationStatus('error');
      setTestAutomationMessage(`Errore invio test: ${err.message || err}`);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto bg-white/5 border border-white/10 p-6 md:p-8 shadow-2xl flex flex-col gap-8 text-white rounded-none">
      
      {/* Header Admin */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center text-white">
            <Settings className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl uppercase tracking-wider font-semibold text-white">Pannello di Controllo</h1>
              <span className="text-[9px] font-mono font-semibold bg-white text-black px-2 py-0.5 uppercase">
                {databaseLabel}
              </span>
            </div>
            <p className="text-xs text-white/40 mt-1 uppercase tracking-wider">
              Amministrazione stand evento, automazioni mail e archivio contatti.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportCSV}
            disabled={requests.length === 0}
            className={`flex items-center gap-2 py-2.5 px-4 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer rounded-none border ${
              requests.length === 0
                ? 'border-white/5 text-white/20 bg-white/5 cursor-not-allowed'
                : 'border-white/20 hover:border-white/40 hover:bg-white/5 text-white'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Esporta Excel/CSV</span>
          </button>

          <button
            onClick={onClose}
            className="flex items-center gap-2 py-2.5 px-5 bg-white text-black hover:bg-white/90 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer rounded-none"
          >
            Torna al Booth
          </button>
        </div>
      </div>

      {/* Sezione Statistiche Rapide */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Stat 1: Total registrati */}
        <div className="bg-white/5 border border-white/10 p-4 flex items-center gap-4 rounded-none">
          <div className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center text-white shrink-0">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase block mb-0.5">Totale Richieste</span>
            <p className="text-2xl font-light text-white">{totalRequests}</p>
          </div>
        </div>

        {/* Stat 2: Da Elaborare */}
        <div className="bg-white/5 border border-white/10 p-4 flex items-center gap-4 rounded-none">
          <div className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center text-white shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase block mb-0.5">Da Elaborare</span>
            <p className="text-2xl font-light text-white">{pendingCount}</p>
          </div>
        </div>

        {/* Stat 3: In Lavorazione */}
        <div className="bg-white/5 border border-white/10 p-4 flex items-center gap-4 rounded-none">
          <div className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center text-white shrink-0">
            <RefreshCw className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase block mb-0.5">In Lavorazione</span>
            <p className="text-2xl font-light text-white">{processingCount}</p>
          </div>
        </div>

        {/* Stat 4: Inviate */}
        <div className="bg-white/5 border border-white/10 p-4 flex items-center gap-4 rounded-none">
          <div className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center text-white shrink-0">
            <CheckCircle className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase block mb-0.5">Foto Inviate</span>
            <p className="text-2xl font-light text-white">{sentCount}</p>
          </div>
        </div>

      </div>

      {/* Layout Principale: Tabella Richieste (Sinistra) + Opzioni e Statistiche (Destra) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* COLONNA SINISTRA: Gestione Richieste (8/12) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Barra di ricerca e filtri */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/5 border border-white/10 p-4 rounded-none">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Cerca per nome, email o ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-none py-2.5 pl-10 pr-4 text-xs text-white placeholder-white/20 focus:outline-none focus:border-white/30"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
              {/* Filtro Scenario */}
              <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-none px-3 py-2 shrink-0">
                <Filter className="w-3.5 h-3.5 text-white/40" />
                <select
                  value={selectedSettingFilter}
                  onChange={(e) => setSelectedSettingFilter(e.target.value)}
                  className="bg-transparent text-xs text-white/80 focus:outline-none cursor-pointer uppercase tracking-wider font-semibold"
                >
                  <option value="all" className="bg-[#0F1012] text-white">Tutti gli scenari</option>
                  {settings.map(s => (
                    <option key={s.id} value={s.id} className="bg-[#0F1012] text-white">{s.title}</option>
                  ))}
                </select>
              </div>

              {/* Filtro Stato */}
              <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-none px-3 py-2 shrink-0">
                <Database className="w-3.5 h-3.5 text-white/40" />
                <select
                  value={selectedStatusFilter}
                  onChange={(e) => setSelectedStatusFilter(e.target.value)}
                  className="bg-transparent text-xs text-white/80 focus:outline-none cursor-pointer uppercase tracking-wider font-semibold"
                >
                  <option value="all" className="bg-[#0F1012] text-white">Tutti gli stati</option>
                  <option value="da_elaborare" className="bg-[#0F1012] text-white">Da elaborare</option>
                  <option value="in_lavorazione" className="bg-[#0F1012] text-white">In lavorazione</option>
                  <option value="inviato" className="bg-[#0F1012] text-white">Inviato via Email</option>
                </select>
              </div>
            </div>
          </div>

          {/* Elenco/Tabella Richieste */}
          <div className="bg-white/5 border border-white/10 rounded-none overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              {filteredRequests.length === 0 ? (
                <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
                  <Database className="w-10 h-10 text-white/25" />
                  <div>
                    <h4 className="text-white/80 font-bold text-sm uppercase tracking-wider">Nessuna registrazione trovata</h4>
                    <p className="text-xs text-white/40 mt-1 font-light">
                      Prova a cambiare i filtri di ricerca o genera dei dati di prova con il pulsante in basso.
                    </p>
                  </div>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5 text-[9px] font-mono tracking-widest text-white/40 uppercase">
                      <th className="py-4 px-5 font-semibold">Utente / Email</th>
                      <th className="py-4 px-4 font-semibold">Scenario Scelto</th>
                      <th className="py-4 px-4 font-semibold">Stato Lavorazione</th>
                      <th className="py-4 px-4 font-semibold">Note operative</th>
                      <th className="py-4 px-5 text-right font-semibold">Azioni</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-xs">
                    {filteredRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-white/5 transition-colors group">
                        
                        {/* Utente Info */}
                        <td className="py-4 px-5">
                          <div className="font-semibold text-white">
                            <span>{req.lastName} {req.firstName}</span>
                          </div>
                          <span className="text-white/40 font-mono text-[11px] block mt-0.5">{req.email}</span>
                          <span className="text-[10px] text-white/30 block mt-1 font-mono">
                            {req.timestamp}
                          </span>
                        </td>

                        {/* Scenario */}
                        <td className="py-4 px-4">
                          <span className="font-semibold text-white/90 block">{req.settingTitle}</span>
                          <span className="text-[9px] font-mono uppercase text-white/60 bg-white/5 px-1.5 py-0.5 rounded-none border border-white/10 inline-block mt-1">
                            {req.settingId}
                          </span>
                        </td>

                        {/* Stato Lavorazione */}
                        <td className="py-4 px-4">
                          <select
                            value={req.status}
                            onChange={(e) => onUpdateStatus(req.id, e.target.value as ProcessingStatus)}
                            className="bg-[#0F1012] border border-white/10 px-2.5 py-1.5 rounded-none font-semibold text-[11px] uppercase tracking-wider text-white focus:outline-none cursor-pointer"
                          >
                            <option value="da_elaborare" className="bg-[#0F1012] text-white">Da elaborare</option>
                            <option value="in_lavorazione" className="bg-[#0F1012] text-white">In lavorazione</option>
                            <option value="inviato" className="bg-[#0F1012] text-white">Inviato via Email</option>
                          </select>
                        </td>

                        {/* Note operative */}
                        <td className="py-4 px-4">
                          {editingNotesId === req.id ? (
                            <div className="flex items-center gap-1.5">
                              <input
                                type="text"
                                value={tempNotes}
                                onChange={(e) => setTempNotes(e.target.value)}
                                placeholder="Aggiungi dettagli..."
                                className="bg-white/10 border-none rounded-none px-2 py-1 text-xs text-white w-32 focus:outline-none"
                              />
                              <button
                                onClick={() => saveNotes(req.id)}
                                className="p-1 bg-white text-black hover:bg-white/90 cursor-pointer"
                                title="Salva nota"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 group">
                              <span className={`italic text-xs ${req.notes ? 'text-white/80' : 'text-white/30'}`}>
                                {req.notes || 'Nessuna nota'}
                              </span>
                              <button
                                onClick={() => startEditingNotes(req.id, req.notes || '')}
                                className="text-white/40 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px] underline uppercase tracking-wider font-semibold"
                              >
                                Modifica
                              </button>
                            </div>
                          )}
                        </td>

                        {/* Azioni del singolo record */}
                        <td className="py-4 px-5 text-right">
                          {showDeleteConfirm === req.id ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <span className="text-[10px] text-red-400 font-semibold uppercase tracking-wider">Eliminare?</span>
                              <button
                                onClick={() => onDeleteRequest(req.id)}
                                className="bg-red-600 hover:bg-red-500 text-white py-0.5 px-2 text-[10px] uppercase font-bold cursor-pointer rounded-none"
                              >
                                Sì
                              </button>
                              <button
                                onClick={() => setShowDeleteConfirm(null)}
                                className="bg-white/10 hover:bg-white/20 text-white py-0.5 px-2 text-[10px] uppercase font-bold cursor-pointer rounded-none"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setShowDeleteConfirm(req.id)}
                              className="p-1.5 text-white/30 hover:text-red-400 rounded-none hover:bg-white/5 transition-colors inline-flex cursor-pointer"
                              title="Elimina richiesta"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Sezione Genera Dati di Esempio / Svuota Database */}
          <div className="flex items-center justify-between bg-white/5 border border-white/10 p-5 rounded-none">
            <div>
              <h4 className="text-xs uppercase tracking-wider font-semibold text-white/80">Azioni database locale</h4>
              <p className="text-[10px] text-white/40 mt-0.5 uppercase tracking-wider">
                Utile per preparare lo stand prima dell'avvio dell'evento reale.
              </p>
            </div>
            
            <div className="flex items-center gap-2.5">
              <button
                onClick={onSeedMockData}
                className="py-2 px-3 border border-white/10 hover:border-white/25 hover:bg-white/5 text-[10px] text-white font-bold uppercase tracking-wider transition-all cursor-pointer rounded-none"
              >
                Genera 5 Record Esempio
              </button>

              {showClearConfirm ? (
                <div className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 p-1.5 rounded-none">
                  <span className="text-[10px] text-red-400 font-bold px-1 uppercase tracking-wider">Sicuro?</span>
                  <button
                    onClick={() => {
                      onClearAllRequests();
                      setShowClearConfirm(false);
                    }}
                    className="bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold py-1 px-2.5 uppercase cursor-pointer rounded-none"
                  >
                    Sì, Cancella Tutto
                  </button>
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="bg-white/10 text-white text-[10px] font-bold py-1 px-2.5 uppercase cursor-pointer rounded-none"
                  >
                    No
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowClearConfirm(true)}
                  disabled={requests.length === 0}
                  className={`py-2 px-3 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all rounded-none ${
                    requests.length === 0
                      ? 'border border-white/5 text-white/20 bg-white/5 cursor-not-allowed'
                      : 'border border-red-500/20 hover:border-red-500 hover:bg-red-500/10 text-red-400'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Svuota Database
                </button>
              )}
            </div>
          </div>

        </div>

        {/* COLONNA DESTRA: Opzioni e Statistiche Classifica (4/12) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className={`border p-4 rounded-none ${
            databaseStatus === 'connected'
              ? 'bg-emerald-500/5 border-emerald-500/20'
              : databaseStatus === 'error'
                ? 'bg-red-500/5 border-red-500/20'
                : 'bg-white/5 border-white/10'
          }`}>
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-white/70" />
              <h3 className="text-xs uppercase tracking-widest font-bold text-white">Database richieste</h3>
            </div>
            <p className="text-[11px] text-white/50 leading-relaxed font-light mt-2">
              {databaseStatus === 'connected' && 'Supabase è collegato: le richieste sono sincronizzate tra dispositivi.'}
              {databaseStatus === 'loading' && 'Caricamento richieste dal database centralizzato in corso.'}
              {databaseStatus === 'error' && 'Supabase non risponde: l’app continua a salvare in locale su questo dispositivo.'}
              {databaseStatus === 'local' && (
                isCentralDatabaseConfigured
                  ? 'Database centralizzato configurato, in attesa di connessione.'
                  : 'Supabase non è ancora configurato: per ora le richieste restano solo su questo dispositivo.'
              )}
            </p>
          </div>

          {/* Box 1: Automazioni Mail e Database */}
          <div className="bg-white/5 border border-white/10 p-6 shadow-xl flex flex-col gap-4 rounded-none">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-white/80" />
              <h3 className="text-xs uppercase tracking-widest font-bold text-white">Mail e database</h3>
            </div>

            <p className="text-[11px] text-white/50 leading-relaxed font-light">
              Ogni nuova richiesta viene inviata alla Web App configurata, che aggiunge una riga al foglio e manda una mail riepilogativa.
            </p>

            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-mono tracking-widest text-white/40 uppercase font-semibold">
                Email destinataria richieste
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                <input
                  type="email"
                  value={notificationEmail}
                  onChange={(e) => onUpdateNotificationEmail(e.target.value)}
                  placeholder="produzione@esempio.it"
                  className="w-full bg-white/5 border border-white/10 px-3 py-2 pl-9 text-xs text-white placeholder-white/20 focus:outline-none focus:border-white/30 rounded-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-mono tracking-widest text-white/40 uppercase font-semibold">
                URL Web App Google Apps Script
              </label>
              <div className="relative">
                <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                <input
                  type="url"
                  value={automationUrl}
                  onChange={(e) => onUpdateAutomationUrl(e.target.value)}
                  placeholder="https://script.google.com/macros/s/.../exec"
                  className="w-full bg-white/5 border border-white/10 px-3 py-2 pl-9 text-xs text-white placeholder-white/20 focus:outline-none focus:border-white/30 font-mono rounded-none"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={testAutomation}
              disabled={testAutomationStatus === 'testing'}
              className="py-2 px-3 border border-white/10 hover:border-white/20 text-[10px] text-white font-bold uppercase tracking-wider rounded-none flex items-center justify-center gap-1.5 cursor-pointer bg-white/5 hover:bg-white/10 transition-all disabled:cursor-wait disabled:text-white/40"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{testAutomationStatus === 'testing' ? 'Invio test...' : 'Test automazione'}</span>
            </button>

            {testAutomationStatus !== 'idle' && (
              <div className={`p-3 rounded-none border text-[10px] leading-relaxed uppercase tracking-wider ${
                testAutomationStatus === 'success'
                  ? 'bg-white/5 border-white/10 text-white'
                  : testAutomationStatus === 'error'
                    ? 'bg-red-500/5 border-red-500/10 text-red-400'
                    : 'bg-white/5 border-white/5 text-white/40'
              }`}>
                {testAutomationMessage || 'Invio richiesta test in corso...'}
              </div>
            )}

            <div className="border-t border-white/10 pt-4">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[9px] font-mono text-white/40 tracking-wider uppercase font-semibold">
                  Codice Apps Script
                </span>
                <button
                  type="button"
                  onClick={copyAutomationScript}
                  className="text-[9px] text-white hover:underline flex items-center gap-1 font-bold uppercase tracking-wider cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedScript ? 'Copiato' : 'Copia'}</span>
                </button>
              </div>

              <div className="relative overflow-hidden bg-black/40 border border-white/5 max-h-36 overflow-y-auto rounded-none">
                <pre className="text-[9px] font-mono p-3 text-white/40 leading-normal select-all">
                  {automationScript}
                </pre>
              </div>
            </div>
          </div>

          {/* Box 2: Impostazioni Generali Booth */}
          <div className="bg-white/5 border border-white/10 p-6 shadow-xl flex flex-col gap-4 rounded-none">
            <div className="flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-white/80" />
              <h3 className="text-xs uppercase tracking-widest font-bold text-white">Opzioni Schermo Booth</h3>
            </div>

            {/* Auto Reset Timer */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-mono tracking-widest text-white/40 uppercase font-semibold">
                Tempo Reset automatico (secondi)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="5"
                  max="45"
                  step="1"
                  value={autoResetTime}
                  onChange={(e) => onUpdateAutoResetTime(Number(e.target.value))}
                  className="flex-1 accent-white h-1 bg-white/10 rounded-none cursor-pointer"
                />
                <span className="text-xs font-mono font-bold text-white shrink-0 bg-white/5 px-2 py-1 border border-white/10">
                  {autoResetTime}s
                </span>
              </div>
              <p className="text-[10px] text-white/40 leading-relaxed font-light mt-1">
                La durata del countdown della schermata finale di successo prima di ricaricare il selettore film.
              </p>
            </div>
          </div>

          {/* Box 3: Editor Scenari */}
          <div className="bg-white/5 border border-white/10 p-6 shadow-xl flex flex-col gap-4 rounded-none">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Image className="w-4 h-4 text-white/80" />
                <h3 className="text-xs uppercase tracking-widest font-bold text-white">Schede scenari</h3>
              </div>

              {showResetSettingsConfirm ? (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      onResetSettings();
                      setShowResetSettingsConfirm(false);
                      cancelEditingSetting();
                    }}
                    className="px-2 py-1 bg-red-600 hover:bg-red-500 text-[9px] text-white font-bold uppercase tracking-wider rounded-none cursor-pointer"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowResetSettingsConfirm(false)}
                    className="p-1.5 border border-white/10 hover:bg-white/10 text-white/70 rounded-none cursor-pointer"
                    title="Annulla reset"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowResetSettingsConfirm(true)}
                  className="p-1.5 border border-white/10 hover:border-red-500/30 hover:bg-red-500/10 text-white/50 hover:text-red-300 rounded-none cursor-pointer"
                  title="Ripristina scenari predefiniti"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <p className="text-[11px] text-white/50 leading-relaxed font-light">
              Modifica testi e immagine delle schede. Se Supabase è collegato, le modifiche vengono salvate nel database centralizzato.
            </p>

            <div className="flex flex-col gap-3">
              {settings.map((setting) => {
                const isEditing = editingSettingId === setting.id && settingDraft;
                const draft = isEditing ? settingDraft : setting;

                return (
                  <div key={setting.id} className="border border-white/10 bg-black/20 rounded-none overflow-hidden">
                    <div className="flex gap-3 p-3">
                      <div className="w-20 h-20 bg-white/5 border border-white/10 shrink-0 overflow-hidden">
                        <img
                          src={draft.imageUrl}
                          alt={draft.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        {isEditing ? (
                          <div className="flex flex-col gap-2">
                            <input
                              type="text"
                              value={draft.title}
                              onChange={(e) => updateSettingDraft('title', e.target.value)}
                              placeholder="Titolo scenario"
                              className="w-full bg-white/5 border border-white/10 px-2.5 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-white/30 rounded-none"
                            />
                            <input
                              type="text"
                              value={draft.genre}
                              onChange={(e) => updateSettingDraft('genre', e.target.value)}
                              placeholder="Genere"
                              className="w-full bg-white/5 border border-white/10 px-2.5 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-white/30 rounded-none"
                            />
                            <input
                              type="text"
                              value={draft.overlayLabel}
                              onChange={(e) => updateSettingDraft('overlayLabel', e.target.value)}
                              placeholder="Etichetta immagine"
                              className="w-full bg-white/5 border border-white/10 px-2.5 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-white/30 rounded-none"
                            />
                          </div>
                        ) : (
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-white truncate">
                              {setting.title}
                            </h4>
                            <p className="text-[10px] text-white/40 uppercase tracking-wider mt-0.5 truncate">
                              {setting.genre}
                            </p>
                            <p className="text-[10px] text-white/45 leading-relaxed mt-2 line-clamp-2">
                              {setting.description}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-1.5 shrink-0">
                        {isEditing ? (
                          <>
                            <button
                              type="button"
                              onClick={saveSettingDraft}
                              className="p-2 bg-white text-black hover:bg-white/90 rounded-none cursor-pointer"
                              title="Salva scenario"
                            >
                              <Save className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={cancelEditingSetting}
                              className="p-2 border border-white/10 hover:bg-white/10 text-white/70 rounded-none cursor-pointer"
                              title="Annulla modifica"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => startEditingSetting(setting)}
                            className="p-2 border border-white/10 hover:border-white/25 hover:bg-white/10 text-white/60 hover:text-white rounded-none cursor-pointer"
                            title="Modifica scenario"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {isEditing && (
                      <div className="border-t border-white/10 p-3 flex flex-col gap-2">
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            type="text"
                            value={draft.imageUrl}
                            onChange={(e) => updateSettingDraft('imageUrl', e.target.value)}
                            placeholder="URL immagine o immagine caricata"
                            className="w-full bg-white/5 border border-white/10 px-2.5 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-white/30 font-mono rounded-none"
                          />
                          <label className="shrink-0 py-2 px-3 border border-white/10 hover:border-white/25 hover:bg-white/10 text-[10px] text-white font-bold uppercase tracking-wider rounded-none flex items-center justify-center gap-1.5 cursor-pointer transition-all">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Carica immagine</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                handleSettingImageUpload(e.target.files?.[0]);
                                e.target.value = '';
                              }}
                            />
                          </label>
                        </div>
                        {imageUploadError && (
                          <p className="text-[10px] text-red-400 uppercase tracking-wider">
                            {imageUploadError}
                          </p>
                        )}
                        <textarea
                          value={draft.description}
                          onChange={(e) => updateSettingDraft('description', e.target.value)}
                          placeholder="Descrizione scenario"
                          rows={3}
                          className="w-full bg-white/5 border border-white/10 px-2.5 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-white/30 rounded-none resize-none"
                        />
                        <textarea
                          value={draft.promptHint}
                          onChange={(e) => updateSettingDraft('promptHint', e.target.value)}
                          placeholder="Suggerimento posa"
                          rows={2}
                          className="w-full bg-white/5 border border-white/10 px-2.5 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-white/30 rounded-none resize-none"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Box 4: Classifica Popolarità Film / Scenari */}
          <div className="bg-white/5 border border-white/10 p-6 shadow-xl flex flex-col gap-4 rounded-none">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-white/80" />
              <h3 className="text-xs uppercase tracking-widest font-bold text-white">Gradimento Scenari</h3>
            </div>

            <div className="flex flex-col gap-3">
              {settingStats.map((item, index) => (
                <div key={item.id} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white/80 truncate max-w-[180px] uppercase tracking-wider text-[11px]">
                      {index + 1}. {item.title}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-white shrink-0">
                      {item.count} {item.count === 1 ? 'scatto' : 'scatti'} ({item.percentage}%)
                    </span>
                  </div>
                  
                  {/* Progress bar di visualizzazione */}
                  <div className="w-full bg-white/5 h-1 border border-white/5 rounded-none overflow-hidden">
                    <div 
                      className="bg-white h-full" 
                      style={{ width: `${item.percentage || 1}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
