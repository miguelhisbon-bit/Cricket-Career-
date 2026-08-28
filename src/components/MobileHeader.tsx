import React from 'react';
import { Volume2, VolumeX, Globe, Zap, DollarSign, Award, Flame, User, Cloud } from 'lucide-react';
import { PlayerProfile } from '../types/cricket';
import { cricketAudio } from '../utils/audio';

interface MobileHeaderProps {
  player: PlayerProfile;
  lang: 'en' | 'bn';
  onToggleLang: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenProfileModal?: () => void;
  onOpenCloudSync?: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  player,
  lang,
  onToggleLang,
  isMuted,
  onToggleMute,
  onOpenProfileModal,
  onOpenCloudSync,
}) => {
  // Calculate Overall Level
  const attrValues = Object.values(player.attributes) as number[];
  const totalAttrs = attrValues.reduce((acc, curr) => acc + (typeof curr === 'number' ? curr : 0), 0);
  const overallLvl = Math.round(totalAttrs / Math.max(1, attrValues.length));

  return (
    <header className="sticky top-0 z-30 bg-[#050508]/85 backdrop-blur-xl border-b border-white/10 px-3.5 py-3">
      <div className="flex items-center justify-between gap-2 max-w-2xl mx-auto">
        {/* Player Profile Quick RPG Card */}
        <button
          id="btn-header-profile"
          onClick={() => {
            cricketAudio.playUiClick();
            onOpenProfileModal?.();
          }}
          className="flex items-center gap-3 bg-white/[0.04] hover:bg-white/[0.08] px-2.5 py-1.5 rounded-2xl border border-white/10 transition-all text-left group shadow-lg"
        >
          {/* Avatar with RPG glowing ring */}
          <div className="relative">
            <div className="w-10 h-10 rounded-full border-2 border-amber-500/50 p-0.5 shadow-[0_0_12px_rgba(245,158,11,0.35)] flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-950 text-base font-bold">
              {player.flag}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 text-[9px] font-black px-1 py-0.2 rounded font-mono leading-none shadow-sm">
              L{overallLvl}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors tracking-tight">
                {player.nickname || player.name}
              </span>
              <span className="text-[10px] text-amber-400 font-mono font-bold">#{player.jerseyNumber}</span>
            </div>

            {/* Mini Health / Stamina dual bars */}
            <div className="flex items-center gap-1.5 mt-1">
              {/* Energy Bar */}
              <div className="h-1.5 w-14 bg-gray-900 rounded-full overflow-hidden border border-white/5" title={`Energy: ${player.energy}%`}>
                <div 
                  className="h-full bg-gradient-to-r from-red-600 to-amber-500 rounded-full transition-all shadow-[0_0_6px_rgba(245,158,11,0.5)]" 
                  style={{ width: `${Math.max(5, player.energy)}%` }}
                />
              </div>

              {/* Form Bar */}
              <div className="h-1.5 w-10 bg-gray-900 rounded-full overflow-hidden border border-white/5" title={`Form: ${player.form}/100`}>
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full transition-all shadow-[0_0_6px_rgba(56,189,248,0.5)]" 
                  style={{ width: `${Math.max(5, player.form)}%` }}
                />
              </div>
            </div>
          </div>
        </button>

        {/* Currency & Level Info */}
        <div className="flex items-center gap-2">
          {/* Gold / Cash Display */}
          <div 
            className="flex flex-col items-end bg-white/[0.03] border border-amber-500/25 px-2.5 py-1 rounded-xl shadow-[0_0_10px_rgba(245,158,11,0.15)]"
            title={lang === 'bn' ? `ব্যালেন্স: $${player.cash.toLocaleString()}` : `Cash: $${player.cash.toLocaleString()}`}
          >
            <span className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-bold">
              {lang === 'bn' ? 'ক্যাশ' : 'GOLD'}
            </span>
            <span className="text-xs sm:text-sm font-mono font-bold text-amber-400 leading-tight">
              ${player.cash >= 1000000 ? `${(player.cash / 1000000).toFixed(2)}M` : player.cash >= 1000 ? `${(player.cash / 1000).toFixed(1)}K` : player.cash.toLocaleString()}
            </span>
          </div>

          {/* Audio, Sync & Lang Toggles */}
          <div className="flex items-center gap-1">
            {onOpenCloudSync && (
              <button
                id="btn-header-cloud-sync"
                onClick={() => {
                  cricketAudio.playUiClick();
                  onOpenCloudSync();
                }}
                className="px-2 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 hover:text-cyan-200 text-[11px] font-bold transition-all flex items-center gap-1 shadow-[0_0_10px_rgba(6,182,212,0.15)]"
                title={lang === 'bn' ? 'ক্লাউড সেভ / সিঙ্ক' : 'Cloud Save & Sync'}
              >
                <Cloud className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">{lang === 'bn' ? 'সিঙ্ক' : 'SYNC'}</span>
              </button>
            )}

            <button
              id="btn-toggle-audio"
              onClick={() => {
                cricketAudio.playUiClick();
                onToggleMute();
              }}
              className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-slate-300 hover:text-white transition-colors"
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
            </button>

            <button
              id="btn-toggle-lang"
              onClick={() => {
                cricketAudio.playUiClick();
                onToggleLang();
              }}
              className="px-2 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-slate-200 text-[11px] font-bold transition-colors flex items-center gap-1"
              title="Toggle English / বাংলা"
            >
              <Globe className="w-3 h-3 text-amber-400" />
              <span>{lang === 'en' ? 'EN' : 'বাং'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

