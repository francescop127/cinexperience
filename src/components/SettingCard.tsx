import React from 'react';
import { motion } from 'motion/react';
import { MovieSetting } from '../types';
import { Film, HelpCircle } from 'lucide-react';

interface SettingCardProps {
  setting: MovieSetting;
  isSelected: boolean;
  onSelect: () => void;
}

export const SettingCard: React.FC<SettingCardProps> = ({ setting, isSelected, onSelect }) => {
  return (
    <motion.button
      id={`setting-card-${setting.id}`}
      whileHover={{ scale: 1.01, translateY: -2 }}
      whileTap={{ scale: 0.99 }}
      onClick={onSelect}
      className={`relative w-full text-left overflow-hidden border p-1 flex flex-col transition-all duration-300 group ${
        isSelected
          ? 'border-white/40 bg-white/10'
          : 'border-white/10 bg-white/5 hover:border-white/20'
      }`}
    >
      {/* Background Image Container */}
      <div className="relative h-44 w-full bg-[#161719] overflow-hidden flex items-center justify-center">
        <img
          src={setting.imageUrl}
          alt={setting.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover filter brightness-[0.65] group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F1012] via-[#0F1012]/10 to-transparent opacity-60" />

        {/* Cinematic Badge Overlay in Top Left */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1 px-2 py-0.5 bg-black/80 backdrop-blur-sm border border-white/10">
          <Film className="w-3 h-3 text-white/80" />
          <span className="text-[9px] font-mono tracking-widest text-white/90 uppercase">
            {setting.overlayLabel}
          </span>
        </div>
      </div>

      {/* Info Panel Bar */}
      <div className={`p-4 flex flex-col flex-1 justify-between gap-3 ${isSelected ? 'bg-white/5' : ''}`}>
        <div className="flex justify-between items-start gap-2">
          <div>
            <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-semibold block mb-0.5">
              {setting.genre}
            </span>
            <h3 className={`text-sm uppercase tracking-wider font-semibold transition-colors duration-250 ${
              isSelected ? 'text-white' : 'text-white/80 group-hover:text-white'
            }`}>
              {setting.title}
            </h3>
          </div>

          {/* Sleek Minimalist Selector Indicator */}
          <div className="pt-1.5 shrink-0">
            <div
              className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center transition-all duration-300 ${
                isSelected
                  ? 'border-white bg-white/10'
                  : 'border-white/20 text-transparent group-hover:border-white/40'
              }`}
            >
              {isSelected && (
                <div className="h-2 w-2 rounded-full bg-white" />
              )}
            </div>
          </div>
        </div>

        <p className="text-[11px] text-white/50 leading-relaxed font-light line-clamp-2">
          {setting.description}
        </p>

        {/* Dynamic pose hint */}
        <div className="pt-2 border-t border-white/5 flex items-start gap-1.5">
          <HelpCircle className="w-3 h-3 text-white/30 shrink-0 mt-0.5" />
          <p className="text-[10px] italic text-white/45">
            <span className="font-semibold text-white/60 not-italic uppercase tracking-wider text-[9px]">Posa:</span> {setting.promptHint}
          </p>
        </div>
      </div>
    </motion.button>
  );
};

