import React from 'react';
import { Home, Play, Dumbbell, ShoppingBag, MessageSquareQuote, Trophy, Calendar } from 'lucide-react';
import { cricketAudio } from '../utils/audio';

export type NavTab = 'DASHBOARD' | 'MATCH' | 'LEAGUE' | 'TRAINING' | 'SHOP' | 'STORY' | 'STATS';

interface BottomNavProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  lang: 'en' | 'bn';
  hasActiveMatch?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  lang,
  hasActiveMatch = false,
}) => {
  const tabs: { id: NavTab; labelEn: string; labelBn: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'DASHBOARD', labelEn: 'Hub', labelBn: 'হোম', icon: Home },
    { id: 'LEAGUE', labelEn: 'League', labelBn: 'লিগ', icon: Trophy },
    { id: 'MATCH', labelEn: 'Match', labelBn: 'ম্যাচ', icon: Play },
    { id: 'TRAINING', labelEn: 'Nets', labelBn: 'ট্রেনিং', icon: Dumbbell },
    { id: 'SHOP', labelEn: 'Arsenal', labelBn: 'শপ', icon: ShoppingBag },
    { id: 'STORY', labelEn: 'Locker', labelBn: 'ড্রেসিংরুম', icon: MessageSquareQuote },
    { id: 'STATS', labelEn: 'Legacy', labelBn: 'রেকর্ড', icon: Calendar },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#050508]/92 backdrop-blur-2xl border-t border-white/10 px-1 py-1 max-w-lg mx-auto sm:max-w-2xl shadow-[0_-10px_25px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isMatchLive = tab.id === 'MATCH' && hasActiveMatch;

          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id.toLowerCase()}`}
              onClick={() => {
                cricketAudio.playUiClick();
                onSelectTab(tab.id);
              }}
              className={`relative flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all group ${
                isActive
                  ? 'text-amber-400 font-bold'
                  : 'text-gray-400 hover:text-white font-medium opacity-60 hover:opacity-100'
              }`}
            >
              {isMatchLive && (
                <span className="absolute -top-0.5 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
              )}
              {isMatchLive && (
                <span className="absolute -top-0.5 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full" />
              )}

              <div className="relative flex flex-col items-center">
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 ${isActive ? 'scale-110 text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'group-hover:scale-105'}`} />
                {isActive && (
                  <div className="w-3.5 h-[2px] bg-amber-500 mt-1 rounded-full shadow-[0_0_6px_rgba(245,158,11,0.8)]" />
                )}
              </div>

              <span className={`text-[8.5px] sm:text-[9px] uppercase tracking-[0.1em] mt-0.5 whitespace-nowrap ${isActive ? 'text-amber-400' : 'text-gray-400'}`}>
                {lang === 'bn' ? tab.labelBn : tab.labelEn}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
