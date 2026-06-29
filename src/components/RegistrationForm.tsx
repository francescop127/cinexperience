import React, { useState } from 'react';
import { MovieSetting } from '../types';
import { Mail, User, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';

interface RegistrationFormProps {
  selectedSetting: MovieSetting;
  onSubmit: (formData: { firstName: string; lastName: string; email: string }) => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  selectedSetting,
  onSubmit,
  onBack,
  isSubmitting
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = (): boolean => {
    const tempErrors: { [key: string]: string } = {};
    if (!firstName.trim()) tempErrors.firstName = 'Il nome è obbligatorio';
    if (!lastName.trim()) tempErrors.lastName = 'Il cognome è obbligatorio';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      tempErrors.email = 'L\'email è obbligatoria';
    } else if (!emailRegex.test(email)) {
      tempErrors.email = 'Inserisci un indirizzo email valido';
    }
    
    if (!privacyAccepted) {
      tempErrors.privacy = 'Devi accettare l\'informativa sulla privacy per procedere';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({ firstName, lastName, email });
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
      {/* Recapitolo Setting Selezionato - Column 1 */}
      <div className="md:col-span-5 bg-white/5 border border-white/10 p-6 flex flex-col gap-5 rounded-none">
        <div>
          <span className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-semibold block mb-1">
            Scenario Selezionato
          </span>
          <h3 className="text-xl font-light italic font-serif text-white">{selectedSetting.title}</h3>
        </div>
        
        <div className="relative overflow-hidden aspect-video border border-white/10 p-0.5 bg-white/5">
          <img
            src={selectedSetting.imageUrl}
            alt={selectedSetting.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover filter brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F1012] via-transparent to-transparent opacity-80" />
          <div className="absolute bottom-2 left-2">
            <span className="text-[9px] font-mono tracking-widest bg-white text-black px-2 py-0.5 uppercase font-bold">
              {selectedSetting.overlayLabel}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono tracking-wider text-white/40 uppercase">Genere Cinematico</span>
          <span className="text-xs text-white/80 font-medium">{selectedSetting.genre}</span>
          <p className="text-[11px] text-white/50 mt-1 leading-relaxed font-light">
            {selectedSetting.description}
          </p>
        </div>

        <div className="bg-black/40 p-4 border border-white/5 rounded-none">
          <p className="text-[9px] font-mono text-white/60 uppercase tracking-widest mb-1.5 font-bold">
            CONSIGLIO DI POSA DEL REGISTA:
          </p>
          <p className="text-xs text-white/80 italic font-light leading-relaxed">
            "{selectedSetting.promptHint}"
          </p>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="flex items-center justify-center gap-2 mt-2 py-3 px-4 border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-wider text-white/80 hover:text-white transition-all cursor-pointer rounded-none"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Cambia scenario
        </button>
      </div>

      {/* Modulo di Registrazione - Column 2 */}
      <form
        onSubmit={handleSubmit}
        className="md:col-span-7 bg-white/5 border border-white/10 p-8 flex flex-col gap-6 rounded-none"
      >
        <div>
          <span className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-semibold">Fase 02</span>
          <h2 className="text-2xl font-light text-white uppercase tracking-wider mt-1">Registrazione</h2>
          <p className="text-xs text-white/40 mt-1 uppercase tracking-wider">
            Inserisci i tuoi dati per ricevere il fotomontaggio finito via email
          </p>
        </div>

        {/* Input Nome e Cognome affiancati */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="firstName" className="text-[10px] uppercase tracking-widest text-white/50 ml-1">
              Nome <span className="text-white/30">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                id="firstName"
                placeholder="Nome"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  if (errors.firstName) {
                    setErrors((prev) => ({ ...prev, firstName: '' }));
                  }
                }}
                className={`block w-full bg-white/10 border-none px-4 py-4 focus:ring-1 outline-none placeholder:text-white/20 text-sm transition-all rounded-none ${
                  errors.firstName ? 'ring-1 ring-red-500/80' : 'focus:ring-white/40'
                }`}
              />
            </div>
            {errors.firstName && (
              <p className="text-[10px] text-red-400 font-semibold mt-0.5 uppercase tracking-wider">{errors.firstName}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="lastName" className="text-[10px] uppercase tracking-widest text-white/50 ml-1">
              Cognome <span className="text-white/30">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                id="lastName"
                placeholder="Cognome"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  if (errors.lastName) {
                    setErrors((prev) => ({ ...prev, lastName: '' }));
                  }
                }}
                className={`block w-full bg-white/10 border-none px-4 py-4 focus:ring-1 outline-none placeholder:text-white/20 text-sm transition-all rounded-none ${
                  errors.lastName ? 'ring-1 ring-red-500/80' : 'focus:ring-white/40'
                }`}
              />
            </div>
            {errors.lastName && (
              <p className="text-[10px] text-red-400 font-semibold mt-0.5 uppercase tracking-wider">{errors.lastName}</p>
            )}
          </div>
        </div>

        {/* Input Email */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-[10px] uppercase tracking-widest text-white/50 ml-1">
            Indirizzo Email <span className="text-white/30">*</span>
          </label>
          <div className="relative">
            <input
              type="email"
              id="email"
              placeholder="nome@esempio.it"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) {
                  setErrors((prev) => ({ ...prev, email: '' }));
                }
              }}
              className={`block w-full bg-white/10 border-none px-4 py-4 focus:ring-1 outline-none placeholder:text-white/20 text-sm transition-all rounded-none ${
                errors.email ? 'ring-1 ring-red-500/80' : 'focus:ring-white/40'
              }`}
            />
          </div>
          {errors.email && (
            <p className="text-[10px] text-red-400 font-semibold mt-0.5 uppercase tracking-wider">{errors.email}</p>
          )}
        </div>

        {/* Privacy e Trattamento Dati in Box Sleek */}
        <div className={`p-4 border transition-all rounded-none ${
          errors.privacy 
            ? 'bg-red-500/5 border-red-500/30' 
            : 'bg-black/20 border-white/10'
        }`}>
          <div className="flex items-start gap-3">
            <div className="flex items-center h-5 mt-0.5">
              <input
                id="privacy"
                type="checkbox"
                checked={privacyAccepted}
                onChange={(e) => {
                  setPrivacyAccepted(e.target.checked);
                  if (errors.privacy && e.target.checked) {
                    setErrors((prev) => ({ ...prev, privacy: '' }));
                  }
                }}
                className="w-4.5 h-4.5 bg-white/10 border-white/20 accent-white rounded-none cursor-pointer"
              />
            </div>
            <div className="text-[11px] leading-relaxed text-white/60">
              <label htmlFor="privacy" className="font-semibold text-white/90 cursor-pointer select-none uppercase tracking-wider text-[10px]">
                Informativa sulla Privacy <span className="text-white/40">*</span>
              </label>
              <p className="text-white/50 mt-1 leading-relaxed font-light">
                Acconsento al trattamento dei miei dati personali per l'elaborazione dell'immagine composita in green screen e l'invio del file digitale completato via email ai sensi del GDPR. I dati non saranno ceduti a terzi.
              </p>
            </div>
          </div>
          {errors.privacy && (
            <div className="flex items-center gap-1.5 mt-2 text-red-400 text-[10px] font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
              <span>{errors.privacy}</span>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="mt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-white text-black py-5 text-sm font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 rounded-none cursor-pointer ${
              isSubmitting
                ? 'bg-white/70 text-black/70 cursor-wait'
                : 'hover:bg-white/90 active:scale-[0.99]'
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span>Salvataggio in corso...</span>
              </div>
            ) : (
              <>
                <span>Inizia lo scatto</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5px]" />
              </>
            )}
          </button>
          <p className="text-[10px] text-center text-white/30 mt-3 uppercase tracking-widest font-mono">
            Tempo stimato: 45 secondi
          </p>
        </div>
      </form>
    </div>
  );
};

