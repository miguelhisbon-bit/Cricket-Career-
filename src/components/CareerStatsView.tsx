import React from 'react';
import { Trophy, Award, TrendingUp, Flame, Star, Shield, Target } from 'lucide-react';
import { PlayerProfile } from '../types/cricket';
import { TIER_DETAILS } from '../utils/defaultData';

interface CareerStatsViewProps {
  player: PlayerProfile;
  lang: 'en' | 'bn';
}

export const CareerStatsView: React.FC<CareerStatsViewProps> = ({ player, lang }) => {
  const stats = player.stats;
  const currentTierInfo = TIER_DETAILS[player.tier];

  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto pb-20">
      {/* 1. Header Banner & Legacy Rank */}
      <div className="bg-white/[0.03] backdrop-blur-xl border border-amber-500/30 rounded-2xl p-5 shadow-[0_0_25px_rgba(245,158,11,0.15)] text-white relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl p-2.5 bg-black/40 rounded-2xl border border-white/10 shadow-inner">
              {player.flag}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold font-teko uppercase tracking-wider text-white">
                  {player.name}
                </h1>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-mono font-bold px-2 py-0.5 rounded-md border border-amber-500/30">
                  #{player.jerseyNumber}
                </span>
              </div>
              <p className="text-[10px] text-amber-400 font-bold uppercase tracking-[0.2em]">
                {currentTierInfo.badge}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-bold block">Fan Following</span>
            <span className="text-base font-mono font-bold text-emerald-400">
              {player.fame.toLocaleString()} Fans
            </span>
          </div>
        </div>
      </div>

      {/* 2. Key Career Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-3 rounded-2xl shadow-xl">
          <span className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-bold block">Career Runs</span>
          <span className="text-2xl font-mono font-bold text-amber-300">{stats.runs}</span>
          <span className="text-[10px] text-gray-400 block mt-0.5 font-mono">{stats.innings} Innings</span>
        </div>

        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-3 rounded-2xl shadow-xl">
          <span className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-bold block">Batting Avg</span>
          <span className="text-2xl font-mono font-bold text-emerald-400">{stats.average || '0.00'}</span>
          <span className="text-[10px] text-gray-400 block mt-0.5 font-mono">SR: {stats.strikeRate}</span>
        </div>

        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-3 rounded-2xl shadow-xl">
          <span className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-bold block">High Score</span>
          <span className="text-2xl font-mono font-bold text-sky-400">
            {stats.highestScore}{stats.highestScoreNotOut ? '*' : ''}
          </span>
          <span className="text-[10px] text-gray-400 block mt-0.5 font-mono">50s: {stats.fifties} | 100s: {stats.hundreds}</span>
        </div>

        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-3 rounded-2xl shadow-xl">
          <span className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-bold block">Career Wickets</span>
          <span className="text-2xl font-mono font-bold text-rose-400">{stats.wickets}</span>
          <span className="text-[10px] text-gray-400 block mt-0.5 font-mono">Econ: {stats.economyRate || '0.00'}</span>
        </div>
      </div>

      {/* 3. Detailed Attribute Radar Gauges */}
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl">
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400 flex items-center gap-1.5 mb-3">
          <Star className="w-4 h-4 text-amber-400" />
          {lang === 'bn' ? 'প্লেয়ার স্কিল অ্যাট্রিবিউটস (০-৯৯)' : 'PLAYER SKILL MATRIX & ATTRIBUTES (0-99)'}
        </h2>

        <div className="grid grid-cols-2 gap-3 text-xs">
          {(
            [
              ['Timing & Sweet-Spot', player.attributes.timing, 'text-amber-400', 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]'],
              ['Boundary Power', player.attributes.power, 'text-rose-400', 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]'],
              ['Gap Placement', player.attributes.shotPlacement, 'text-emerald-400', 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]'],
              ['Spin Reading', player.attributes.spinReading, 'text-purple-400', 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]'],
              ['Pace Tolerance', player.attributes.paceTolerance, 'text-sky-400', 'bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.6)]'],
              ['Running Speed', player.attributes.runningSpeed, 'text-teal-400', 'bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.6)]'],
              ['Bowling Accuracy', player.attributes.accuracy, 'text-indigo-400', 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]'],
              ['Clutch Spirit', player.attributes.clutch, 'text-yellow-400', 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]'],
            ] as const
          ).map(([label, score, textColor, barColor]) => (
            <div key={label} className="bg-black/40 p-2.5 rounded-xl border border-white/5">
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-300 text-[11px] truncate">{label}</span>
                <span className={`font-mono font-bold ${textColor}`}>{score}</span>
              </div>
              <div className="w-full bg-gray-900 h-1.5 rounded-full overflow-hidden">
                <div style={{ width: `${score}%` }} className={`h-full rounded-full ${barColor}`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Trophy Cabinet & Milestones */}
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl">
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400 flex items-center gap-1.5 mb-3">
          <Trophy className="w-4 h-4 text-amber-400" />
          {lang === 'bn' ? 'ট্রফি ক্যাবিনেট ও ক্যারিয়ার মাইলফলক' : 'TROPHY CABINET & CAREER MILESTONES'}
        </h2>

        <div className="space-y-2">
          {/* POTM count */}
          <div className="flex items-center justify-between bg-black/40 p-2.5 rounded-xl border border-white/5 text-xs">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span className="text-gray-300 font-semibold">
                {lang === 'bn' ? 'ম্যাচসেরা (Player of the Match) পুরস্কার' : 'Player of the Match Medals'}
              </span>
            </div>
            <span className="font-mono font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              {stats.playerOfMatch}
            </span>
          </div>

          {/* Boundless Sixes & Fours */}
          <div className="flex items-center justify-between bg-black/40 p-2.5 rounded-xl border border-white/5 text-xs">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-400" />
              <span className="text-gray-300 font-semibold">
                {lang === 'bn' ? 'মোট বাউন্ডারি (৪ ও ৬)' : 'Total Career Boundaries'}
              </span>
            </div>
            <span className="font-mono font-bold text-gray-200">
              {stats.fours} Fours | {stats.sixes} Sixes
            </span>
          </div>

          {/* Milestone timeline logs */}
          <div className="pt-2">
            <span className="text-[9px] text-gray-400 uppercase font-bold tracking-[0.2em] block mb-1.5">
              {lang === 'bn' ? 'ক্যারিয়ার ইভেন্ট লগ' : 'CAREER TIMELINE HISTORY'}
            </span>
            <div className="space-y-1.5">
              {player.careerMilestones.map((m, idx) => (
                <div key={idx} className="text-xs text-gray-300 bg-black/30 px-3 py-2 rounded-xl border border-white/5 flex items-center gap-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{m}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
