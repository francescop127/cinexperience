import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MOVIE_SETTINGS } from './data/settings';
import { MovieSetting, PhotoRequest, ProcessingStatus } from './types';
import { SettingCard } from './components/SettingCard';
import { RegistrationForm } from './components/RegistrationForm';
import { ConfirmationScreen } from './components/ConfirmationScreen';
import { AdminPanel } from './components/AdminPanel';
import { Camera, Settings, Lock, X, ShieldAlert, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

const defaultAutomationUrl = import.meta.env.VITE_AUTOMATION_URL || '';
const defaultNotificationEmail = import.meta.env.VITE_NOTIFICATION_EMAIL || '';

export default function App() {
  // DB & Persistence States
  const [requests, setRequests] = useState<PhotoRequest[]>(() => {
    const saved = localStorage.getItem('photobooth_requests');
    return saved ? JSON.parse(saved) : [];
  });

  const [autoResetTime, setAutoResetTime] = useState<number>(() => {
    const saved = localStorage.getItem('photobooth_auto_reset');
    return saved ? Number(saved) : 15;
  });

  const [automationUrl, setAutomationUrl] = useState<string>(() => {
    return localStorage.getItem('cinexperience_automation_url') || defaultAutomationUrl;
  });

  const [notificationEmail, setNotificationEmail] = useState<string>(() => {
    return localStorage.getItem('cinexperience_notification_email') || defaultNotificationEmail;
  });

  // Flow states
  const [selectedSetting, setSelectedSetting] = useState<MovieSetting | null>(null);
  const [currentScreen, setCurrentScreen] = useState<'select' | 'form' | 'success' | 'admin'>('select');
  const [latestEmail, setLatestEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const settingsSliderRef = useRef<HTMLDivElement | null>(null);

  // Admin Security States
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Persist settings whenever they change
  useEffect(() => {
    localStorage.setItem('photobooth_requests', JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem('photobooth_auto_reset', String(autoResetTime));
  }, [autoResetTime]);

  useEffect(() => {
    localStorage.setItem('cinexperience_automation_url', automationUrl);
  }, [automationUrl]);

  useEffect(() => {
    localStorage.setItem('cinexperience_notification_email', notificationEmail);
  }, [notificationEmail]);

  // Handle setting selection
  const handleSelectSetting = (setting: MovieSetting) => {
    setSelectedSetting(setting);
    setCurrentScreen('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollSettingsSlider = (direction: 'left' | 'right') => {
    settingsSliderRef.current?.scrollBy({
      left: direction === 'left' ? -360 : 360,
      behavior: 'smooth'
    });
  };

  // Handle request submission
  const handleSubmitForm = async (formData: { firstName: string; lastName: string; email: string }) => {
    if (!selectedSetting) return;
    setIsSubmitting(true);

    const newRequest: PhotoRequest = {
      id: 'REQ_' + Math.random().toString(36).substring(2, 9).toUpperCase(),
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      settingId: selectedSetting.id,
      settingTitle: selectedSetting.title,
      timestamp: new Date().toLocaleString('it-IT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }),
      privacyAccepted: true,
      status: 'da_elaborare'
    };

    // Save locally
    setRequests((prev) => [newRequest, ...prev]);
    setLatestEmail(formData.email);

    if (automationUrl) {
      try {
        await fetch(automationUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          mode: 'no-cors',
          body: JSON.stringify({
            ...newRequest,
            settingGenre: selectedSetting.genre,
            settingDescription: selectedSetting.description,
            settingPromptHint: selectedSetting.promptHint,
            notificationEmail,
            source: 'CINÉXPERIENCE'
          })
        });
      } catch (err) {
        console.warn('Errore invio automazione richiesta:', err);
      }
    }

    // Delay slightly for premium feeling submission animation
    setTimeout(() => {
      setIsSubmitting(false);
      setCurrentScreen('success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1200);
  };

  // Reset flow back to first screen
  const handleResetFlow = () => {
    setSelectedSetting(null);
    setLatestEmail('');
    setCurrentScreen('select');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Admin access validation
  const handleAdminAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'EGF26') {
      setPasswordError('');
      setAdminPassword('');
      setShowPasswordPrompt(false);
      setCurrentScreen('admin');
    } else {
      setPasswordError('Codice di sicurezza non corretto.');
    }
  };

  // Admin callbacks
  const handleUpdateStatus = (id: string, status: ProcessingStatus) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status } : req))
    );
  };

  const handleUpdateNotes = (id: string, notes: string) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, notes } : req))
    );
  };

  const handleDeleteRequest = (id: string) => {
    setRequests((prev) => prev.filter((req) => req.id !== id));
  };

  const handleClearAllRequests = () => {
    setRequests([]);
  };

  const handleSeedMockData = () => {
    const mockNames = [
      { f: 'Giulia', l: 'Bianchi', email: 'giulia.b@example.it' },
      { f: 'Marco', l: 'Neri', email: 'm.neri@esempio.com' },
      { f: 'Francesca', l: 'Rossi', email: 'franci.rossi@test.it' },
      { f: 'Alessandro', l: 'Verdi', email: 'ale.verdi@posta.it' },
      { f: 'Elena', l: 'Ferrari', email: 'elena.ferrari@dominio.it' }
    ];

    const seeded: PhotoRequest[] = mockNames.map((name, idx) => {
      const setting = MOVIE_SETTINGS[idx % MOVIE_SETTINGS.length];
      const randomMinutesAgo = Math.floor(Math.random() * 120) + 5;
      const date = new Date(Date.now() - randomMinutesAgo * 60000);
      
      const statusOptions: ProcessingStatus[] = ['da_elaborare', 'in_lavorazione', 'inviato'];
      const status = statusOptions[idx % statusOptions.length];

      return {
        id: 'REQ_SEED' + (100 + idx),
        firstName: name.f,
        lastName: name.l,
        email: name.email,
        settingId: setting.id,
        settingTitle: setting.title,
        timestamp: date.toLocaleString('it-IT'),
        privacyAccepted: true,
        status,
        notes: idx % 3 === 0 ? 'Richiesta posa personalizzata' : undefined
      };
    });

    setRequests((prev) => [...seeded, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#0F1012] text-white flex flex-col font-sans selection:bg-white selection:text-black">
      
      {/* HEADER DELLA WEB APP - Elegante, con indicatore REC */}
      <header className="sticky top-0 z-40 bg-[#0F1012]/90 backdrop-blur-md border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo Brand */}
          <button 
            onClick={handleResetFlow}
            className="flex items-center gap-3 text-left focus:outline-none cursor-pointer"
          >
            <div className="w-10 h-10 border border-white/10 bg-white/5 flex items-center justify-center text-white">
              <Camera className="w-5 h-5 stroke-[1.5px]" />
            </div>
            <div>
              <span className="text-[9px] font-mono tracking-[0.25em] text-white/40 uppercase block leading-none font-semibold">
                EVENT PHOTO BOOTH
              </span>
              <span className="text-sm font-bold tracking-wider text-white leading-normal block mt-0.5">
                CINÉXPERIENCE
              </span>
            </div>
          </button>

          {/* REC Status & Admin Button */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/5">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
              <span className="text-[9px] font-mono font-bold tracking-widest text-white/60 uppercase">
                SET LIVE
              </span>
            </div>

            {currentScreen !== 'admin' && (
              <button
                onClick={() => setShowPasswordPrompt(true)}
                className="w-10 h-10 border border-white/10 bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:border-white/20 hover:bg-white/10 transition-all cursor-pointer"
                title="Pannello di Amministrazione"
              >
                <Settings className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>
      </header>

      {/* DYNAMIC VIEW CONTAINER */}
      <main className="flex-grow px-6 py-12 flex items-center justify-center">
        <AnimatePresence mode="wait">
          
          {/* SCREEN 1: SELEZIONE FILM SETTING */}
          {currentScreen === 'select' && (
            <motion.div
              key="select"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-7xl flex flex-col gap-10"
            >
              {/* Titoli Introduttivi */}
              <div className="text-center max-w-3xl mx-auto flex flex-col gap-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-white/5 border border-white/10 text-white/50 text-[10px] tracking-[0.2em] uppercase mx-auto">
                  <Sparkles className="w-3.5 h-3.5 text-white/60" />
                  <span>Fase 01 • Selezione</span>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extralight tracking-wider text-white uppercase leading-tight">
                  Scegli il tuo <span className="font-serif italic font-light lowercase">scenario</span>
                </h1>
                <p className="text-xs sm:text-sm text-white/50 leading-relaxed max-w-xl mx-auto uppercase tracking-wider">
                  Mettiti in posa davanti al Green Screen e verrai proiettato in una locandina cinematografica personalizzata
                </p>
              </div>

              {/* Slider Scenari */}
              <div className="relative">
                <div className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 z-10">
                  <button
                    type="button"
                    onClick={() => scrollSettingsSlider('left')}
                    className="w-11 h-11 border border-white/10 bg-[#0F1012]/90 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-white hover:border-white/25 hover:bg-white/10 transition-all cursor-pointer"
                    aria-label="Scorri scenari a sinistra"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                </div>

                <div
                  ref={settingsSliderRef}
                  className="flex gap-5 overflow-x-auto overscroll-x-contain snap-x snap-mandatory scroll-smooth pb-4 px-1"
                >
                  {MOVIE_SETTINGS.map((setting) => (
                    <div
                      key={setting.id}
                      className="snap-start shrink-0 w-[82vw] sm:w-[420px] lg:w-[390px]"
                    >
                      <SettingCard
                        setting={setting}
                        isSelected={selectedSetting?.id === setting.id}
                        onSelect={() => handleSelectSetting(setting)}
                      />
                    </div>
                  ))}
                </div>

                <div className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-10">
                  <button
                    type="button"
                    onClick={() => scrollSettingsSlider('right')}
                    className="w-11 h-11 border border-white/10 bg-[#0F1012]/90 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-white hover:border-white/25 hover:bg-white/10 transition-all cursor-pointer"
                    aria-label="Scorri scenari a destra"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* SCREEN 2: MODULO REGISTRAZIONE */}
          {currentScreen === 'form' && selectedSetting && (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <RegistrationForm
                selectedSetting={selectedSetting}
                onSubmit={handleSubmitForm}
                onBack={handleResetFlow}
                isSubmitting={isSubmitting}
              />
            </motion.div>
          )}

          {/* SCREEN 3: SCHERMATA SUCCESSO */}
          {currentScreen === 'success' && selectedSetting && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <ConfirmationScreen
                selectedSetting={selectedSetting}
                userEmail={latestEmail}
                onReset={handleResetFlow}
                autoResetTime={autoResetTime}
              />
            </motion.div>
          )}

          {/* SCREEN 4: PANNELLO AMMINISTRAZIONE */}
          {currentScreen === 'admin' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              <AdminPanel
                requests={requests}
                onUpdateStatus={handleUpdateStatus}
                onUpdateNotes={handleUpdateNotes}
                onDeleteRequest={handleDeleteRequest}
                onClearAllRequests={handleClearAllRequests}
                onSeedMockData={handleSeedMockData}
                autoResetTime={autoResetTime}
                onUpdateAutoResetTime={setAutoResetTime}
                automationUrl={automationUrl}
                onUpdateAutomationUrl={setAutomationUrl}
                notificationEmail={notificationEmail}
                onUpdateNotificationEmail={setNotificationEmail}
                onClose={handleResetFlow}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* FOOTER DELLA WEB APP - Semplice, pulito ed elegante */}
      <footer className="bg-[#0F1012] border-t border-white/5 py-8 px-6 text-center text-[11px] text-white/40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="uppercase tracking-wider">© 2026 CINÉXPERIENCE.</p>
          <p className="font-mono text-[9px] text-white/30 uppercase tracking-widest">
            Trattamento dati nel rispetto del GDPR • Local Sandbox
          </p>
        </div>
      </footer>

      {/* MODALE DI ACCESSO CON PASSWORD ADMIN */}
      {showPasswordPrompt && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.97, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.97, opacity: 0 }}
            className="w-full max-w-md bg-[#0F1012] border border-white/10 p-6 shadow-2xl relative rounded-none"
          >
            {/* Close button */}
            <button
              onClick={() => {
                setShowPasswordPrompt(false);
                setPasswordError('');
                setAdminPassword('');
              }}
              className="absolute top-4 right-4 p-1 text-white/40 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <form onSubmit={handleAdminAccess} className="flex flex-col gap-4 mt-2">
              <div className="flex items-center gap-2 text-white mb-1">
                <Lock className="w-4.5 h-4.5 text-white/70" />
                <h3 className="font-bold text-white text-base uppercase tracking-wider">Area Amministrativa</h3>
              </div>

              <p className="text-xs text-white/50 leading-relaxed font-light">
                Inserisci il codice di sicurezza per accedere al database delle richieste ed esportare i dati.
              </p>

              <div className="flex flex-col gap-1.5 mt-2">
                <label className="text-[10px] font-mono text-white/50 uppercase tracking-widest">
                  Codice Sicurezza Stand
                </label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => {
                    setAdminPassword(e.target.value);
                    if (passwordError) setPasswordError('');
                  }}
                  placeholder="Digita il codice..."
                  className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-white/30 font-mono tracking-widest rounded-none"
                  autoFocus
                />
              </div>

              {passwordError && (
                <div className="flex items-center gap-1.5 p-2.5 bg-red-500/5 border border-red-500/10 text-red-400 text-xs uppercase tracking-wider font-semibold">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-4 bg-white text-black font-bold text-xs uppercase tracking-[0.2em] mt-2 transition-all cursor-pointer hover:bg-white/90 active:scale-[0.99] rounded-none"
              >
                Sblocca Pannello
              </button>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
}
