import React from 'react';
import { 
  Play, 
  Flame, 
  Zap, 
  Award, 
  Coffee, 
  HeartHandshake, 
  TrendingUp, 
  Gavel, 
  Newspaper, 
  ChevronRight,
  ShieldCheck,
  Sparkles,
  MapPin,
  Clock
} from 'lucide-react';
import { PlayerProfile, MatchState } from '../types/cricket';
import { TIER_DETAILS } from '../utils/defaultData';
import { cricketAudio } from '../utils/audio';

interface DashboardViewProps {
  player: PlayerProfile;
  onUpdatePlayer: (updated: PlayerProfile) => void;
  onStartMatch: () => void;
  onOpenAuction: () => void;
  onOpenProfile: () => void;
  onGoToTraining: () => void;
  lang: 'en' | 'bn';
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  player,
  onUpdatePlayer,
  onStartMatch,
  onOpenAuction,
  onOpenProfile,
  onGoToTraining,
  lang,
}) => {
  const currentTierInfo = TIER_DETAILS[player.tier];

  // Quick Action: Drink Energy Boost
  const handleDrinkEnergy = () => {
    if (player.cash < 40) {
      alert(lang === 'bn' ? 'টাকা অপর্যাপ্ত ($৪০ প্রয়োজন)' : 'Need $40 for Energy Drink!');
      return;
    }
    cricketAudio.playUiClick();
    onUpdatePlayer({
      ...player,
      cash: player.cash - 40,
      energy: Math.min(100, player.energy + 25),
    });
  };

  // Quick Action: Rest & Sleep
  const handleRest = () => {
    cricketAudio.playUiClick();
    onUpdatePlayer({
      ...player,
      energy: Math.min(100, player.energy + 15),
      morale: Math.min(100, player.morale + 5),
    });
  };

  // Check if eligible for tier promotion
  const canPromoteToNextTier = () => {
    if (player.tier === 'GULLY_STREET' && player.stats.matches >= 3) return 'DISTRICT_U19';
    if (player.tier === 'DISTRICT_U19' && player.stats.matches >= 7) return 'DOMESTIC_FC';
    if (player.tier === 'DOMESTIC_FC' && player.stats.matches >= 12) return 'PREMIER_LEAGUE';
    if (player.tier === 'PREMIER_LEAGUE' && player.stats.matches >= 18) return 'INTERNATIONAL';
    return null;
  };

  const nextTier = canPromoteToNextTier();

  const handlePromoteTier = () => {
    if (!nextTier) return;
    if (nextTier === 'PREMIER_LEAGUE') {
      onOpenAuction();
      return;
    }

    cricketAudio.playFanfare();
    const nextTierDetails = TIER_DETAILS[nextTier];
    const newTeam = nextTierDetails.teams[0].name;

    onUpdatePlayer({
      ...player,
      tier: nextTier,
      currentTeam: newTeam,
      matchFee: nextTierDetails.matchFeeBase,
      fame: player.fame + 500,
      careerMilestones: [
        ...player.careerMilestones,
        `Promoted to ${nextTierDetails.name} playing for ${newTeam}!`,
      ],
    });
  };

  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto pb-20">
      {/* 1. Next Match Hero Quest Banner (Immersive Glowing Portal) */}
      <div className="relative bg-white/[0.03] backdrop-blur-xl border border-amber-500/30 rounded-2xl p-5 shadow-[0_0_25px_rgba(245,158,11,0.15)] overflow-hidden">
        {/* Subtle background glow effect */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-[9px] uppercase tracking-[0.2em] font-bold bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded-md border border-amber-500/30">
                {currentTierInfo.badge}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
                {player.currentTeam}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-amber-200/80 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Season 2026</span>
            </div>
          </div>

          <div className="space-y-1 mb-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold font-teko uppercase tracking-wider text-white leading-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
              {lang === 'bn' ? 'পরবর্তী হাই-ভোল্টেজ ম্যাচ' : 'Upcoming High-Octane Fixture'}
            </h1>
            <p className="text-xs text-gray-300 leading-relaxed max-w-lg">
              {lang === 'bn'
                ? 'স্টেডিয়ামের ফ্লাডলাইট জ্বলছে। হাজারো দর্শক আপনার ক্লাচ পারফর্ম্যান্সের অপেক্ষায়।'
                : 'The floodlights illuminate the pitch. Thousands in the arena await your masterclass.'}
            </p>
          </div>

          {/* Start Match CTA */}
          <button
            id="btn-start-next-match"
            onClick={() => {
              cricketAudio.playUiClick();
              onStartMatch();
            }}
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm uppercase tracking-[0.2em] rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.35)] flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            {lang === 'bn' ? 'ম্যাচ শুরু করুন' : 'PLAY MATCH NOW'}
          </button>
        </div>
      </div>

      {/* 2. Tier Promotion Banner if eligible */}
      {nextTier && (
        <div className="bg-gradient-to-r from-emerald-950/80 via-teal-950/80 to-slate-950 backdrop-blur-xl rounded-2xl p-4 border border-emerald-500/40 text-white shadow-[0_0_20px_rgba(16,185,129,0.2)] flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-emerald-300 text-[10px] font-bold uppercase tracking-[0.2em]">
              <Award className="w-3.5 h-3.5" />
              {lang === 'bn' ? 'পদোন্নতি আনলক হয়েছে!' : 'Career Tier Promotion Ready!'}
            </div>
            <h2 className="text-base font-bold font-teko tracking-wide text-white mt-0.5">
              {TIER_DETAILS[nextTier].name}
            </h2>
          </div>

          <button
            id="btn-promote-career-tier"
            onClick={handlePromoteTier}
            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-md active:scale-95 whitespace-nowrap"
          >
            {nextTier === 'PREMIER_LEAGUE' ? 'Enter Auction 🔨' : 'Accept Call-Up 🚀'}
          </button>
        </div>
      )}

      {/* 3. Core Attributes & Active Status (Immersive RPG Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Core Attributes Gauges */}
        <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl p-4 border border-white/10 shadow-xl">
          <h3 className="text-[10px] uppercase tracking-[0.2em] text-amber-500 font-bold mb-3 flex items-center justify-between">
            <span>{lang === 'bn' ? 'কোর অ্যাট্রিবিউটস' : 'CORE ATTRIBUTES'}</span>
            <span className="text-[9px] text-gray-500 font-mono">0-99</span>
          </h3>

          <div className="space-y-2.5">
            <div>
              <div className="flex justify-between items-end mb-1">
                <span className="text-xs text-gray-300">{lang === 'bn' ? 'টাইমিং' : 'Timing & Sweet-Spot'}</span>
                <span className="text-xs font-mono font-bold text-amber-400">{player.attributes.timing}</span>
              </div>
              <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)] rounded-full" style={{ width: `${player.attributes.timing}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-1">
                <span className="text-xs text-gray-300">{lang === 'bn' ? 'পাওয়ার ও সিক্স' : 'Boundary Power'}</span>
                <span className="text-xs font-mono font-bold text-rose-400">{player.attributes.power}</span>
              </div>
              <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)] rounded-full" style={{ width: `${player.attributes.power}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-1">
                <span className="text-xs text-gray-300">{lang === 'bn' ? 'প্লেসমেন্ট ও গ্যাপ' : 'Gap Placement'}</span>
                <span className="text-xs font-mono font-bold text-emerald-400">{player.attributes.shotPlacement}</span>
              </div>
              <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] rounded-full" style={{ width: `${player.attributes.shotPlacement}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-1">
                <span className="text-xs text-gray-300">{lang === 'bn' ? 'স্পিন রিডিং' : 'Spin Reading'}</span>
                <span className="text-xs font-mono font-bold text-cyan-400">{player.attributes.spinReading}</span>
              </div>
              <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)] rounded-full" style={{ width: `${player.attributes.spinReading}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Active Status & Physical Condition */}
        <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl p-4 border border-white/10 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-3">
              {lang === 'bn' ? 'এক্টিভ স্ট্যাটাস' : 'ACTIVE STATUS'}
            </h3>

            <div className="space-y-2">
              <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 p-2 rounded-xl">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                  <span className="text-xs text-emerald-200 font-medium">
                    {lang === 'bn' ? 'শারীরিক ফিটনেস' : 'Stamina Energy'}: {player.energy}%
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">READY</span>
              </div>

              <div className="flex items-center justify-between bg-blue-500/10 border border-blue-500/20 p-2 rounded-xl">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_6px_rgba(96,165,250,0.8)]" />
                  <span className="text-xs text-blue-200 font-medium">
                    {lang === 'bn' ? 'ম্যাচ ফর্ম' : 'Form Rating'}: {player.form}/100
                  </span>
                </div>
                <span className="text-[10px] font-mono text-blue-400 font-bold">
                  {player.form > 75 ? 'PEAK' : 'GOOD'}
                </span>
              </div>

              <div className="flex items-center justify-between bg-amber-500/10 border border-amber-500/20 p-2 rounded-xl">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
                  <span className="text-xs text-amber-200 font-medium">
                    {lang === 'bn' ? 'কোচ বিশ্বাস' : 'Coach Trust'}: {player.coachTrust}%
                  </span>
                </div>
                <span className="text-[10px] font-mono text-amber-400 font-bold">SECURE</span>
              </div>
            </div>
          </div>

          {/* Quick Recovery Actions */}
          <div className="flex gap-2 pt-3 border-t border-white/5">
            <button
              id="btn-drink-energy"
              onClick={handleDrinkEnergy}
              className="flex-1 py-2 bg-white/[0.04] hover:bg-white/[0.08] border border-amber-500/30 text-amber-300 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              <Coffee className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'এনার্জি ($৪০)' : 'Drink ($40)'}</span>
            </button>
            <button
              id="btn-rest-recovery"
              onClick={handleRest}
              className="flex-1 py-2 bg-white/[0.04] hover:bg-white/[0.08] border border-emerald-500/30 text-emerald-300 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'বিশ্রাম (ফ্রি)' : 'Rest (Free)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Journal / Daily Sports Tribune */}
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl">
        <h3 className="text-[10px] uppercase tracking-[0.2em] text-amber-500 font-bold mb-3 flex items-center gap-1.5">
          <Newspaper className="w-3.5 h-3.5" />
          <span>{lang === 'bn' ? 'দৈনিক স্পোর্টস ট্রিবিউন' : 'PRESS & HEADLINE JOURNAL'}</span>
        </h3>

        <div className="space-y-2">
          <div className="bg-black/40 p-3 rounded-xl border border-white/5 text-xs">
            <span className="text-[9px] uppercase tracking-wider text-amber-400 font-bold block mb-1">CRICBUZZ SCOUT LOG</span>
            <p className="text-gray-200 font-semibold leading-relaxed">
              {player.stats.runs > 50
                ? `"${player.name} in scintillating touch! Scouts predict national team call-up soon."`
                : `"${player.name} gearing up for high stakes clashes in ${currentTierInfo.name}."`}
            </p>
          </div>

          <div className="bg-black/40 p-3 rounded-xl border border-white/5 text-xs">
            <span className="text-[9px] uppercase tracking-wider text-cyan-400 font-bold block mb-1">TACTICAL INSIGHT</span>
            <p className="text-gray-300 leading-relaxed">
              {lang === 'bn'
                ? `কোচিং স্টাফ জানিয়েছেন: "${player.nickname}-এর টাইমিং ও আত্মবিশ্বাস বর্তমান স্কোয়াডের অন্যতম সেরা শক্তি।" `
                : `Coaching staff quotes: "${player.name}'s sweet-spot contact and nerve under pressure is top tier."`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

