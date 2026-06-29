import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, Mail, Camera, Sparkles } from 'lucide-react';
import { MovieSetting } from '../types';

interface ConfirmationScreenProps {
  selectedSetting: MovieSetting;
  userEmail: string;
  onReset: () => void;
  autoResetTime?: number; // in seconds
}

export const ConfirmationScreen: React.FC<ConfirmationScreenProps> = ({
  selectedSetting,
  userEmail,
  onReset,
  autoResetTime = 12
}) => {
  const [timeLeft, setTimeLeft] = useState(autoResetTime);

  useEffect(() => {
    if (timeLeft <= 0) {
      onReset();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, onReset]);

  return (
    <div className="w-full max-w-2xl mx-auto bg-white/5 border border-white/10 p-8 md:p-12 shadow-2xl text-center relative overflow-hidden rounded-none">
      {/* Sleek light leak background decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-white/5 rounded-full filter blur-[70px] pointer-events-none -z-10" />

      {/* Decorative Sparkles */}
      <div className="absolute top-10 left-10 text-white/15 animate-pulse">
        <Sparkles className="w-6 h-6" />
      </div>
      <div className="absolute bottom-10 right-10 text-white/15 animate-pulse delay-75">
        <Sparkles className="w-5 h-5" />
      </div>

      <div className="flex flex-col items-center gap-6">
        {/* Large Minimal Success Indicator */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 180, damping: 15 }}
          className="w-16 h-16 border border-white/30 rounded-full flex items-center justify-center text-white bg-white/5"
        >
          <div className="h-6 w-6 rounded-full bg-white flex items-center justify-center">
            <div className="h-2.5 w-2.5 rounded-full bg-black" />
          </div>
        </motion.div>

        <div>
          <span className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-semibold block mb-1">
            Fase 03 • Completato
          </span>
          <h2 className="text-3xl font-light italic font-serif text-white tracking-wide">Dati registrati</h2>
          <p className="text-xs uppercase tracking-widest text-white/60 mt-1.5 font-light">
            Il set fotografico è pronto per te
          </p>
        </div>

        {/* Cinematic Backdrop Visual recap */}
        <div className="w-full max-w-md bg-black/40 border border-white/5 p-4 flex items-center gap-4 text-left rounded-none">
          <div className="w-16 h-16 overflow-hidden shrink-0 border border-white/10 bg-white/5 p-0.5">
            <img
              src={selectedSetting.imageUrl}
              alt={selectedSetting.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover filter brightness-90"
            />
          </div>
          <div>
            <span className="text-[9px] font-mono uppercase tracking-widest text-white/40">
              Sfondo Cinematografico
            </span>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">{selectedSetting.title}</h4>
            <p className="text-[11px] text-white/50 mt-1 flex items-center gap-1 font-light">
              <Camera className="w-3.5 h-3.5 opacity-70" />
              Sali sulla pedana con il Green Screen
            </p>
          </div>
        </div>

        {/* Email feedback info box */}
        <div className="bg-white/5 border border-white/10 p-5 w-full text-left rounded-none">
          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-none border border-white/10 bg-white/5 flex items-center justify-center text-white/60 shrink-0 mt-0.5">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-[10px] font-bold text-white/80 uppercase tracking-widest">Cosa succede ora?</h4>
              <p className="text-xs text-white/50 mt-1.5 leading-relaxed font-light">
                Il fotografo effettuerà lo scatto sulla pedana verde. La foto verrà elaborata posizionando lo sfondo cinematografico scelto e inviata direttamente all'indirizzo email: <span className="text-white font-medium underline">{userEmail}</span>.
              </p>
            </div>
          </div>
        </div>

        {/* Auto-reset Countdown bar */}
        <div className="w-full mt-2">
          <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2.5">
            Reset automatico per il prossimo utente tra <span className="text-white font-bold">{timeLeft} secondi</span>
          </p>
          <div className="w-full bg-white/5 h-1 rounded-none overflow-hidden border border-white/5">
            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: autoResetTime, ease: 'linear' }}
              className="bg-white h-full"
            />
          </div>
        </div>

        {/* Manual Reset button */}
        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 mt-2 py-3.5 px-6 border border-white/10 hover:border-white/25 bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-wider text-white transition-all cursor-pointer rounded-none"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Salta l'attesa
        </button>
      </div>
    </div>
  );
};

