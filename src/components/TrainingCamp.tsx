import React, { useState } from 'react';
import { Dumbbell, Target, Eye, Zap, Flame, Award, CheckCircle, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PlayerProfile } from '../types/cricket';
import { cricketAudio } from '../utils/audio';

interface TrainingCampProps {
  player: PlayerProfile;
  onUpdatePlayer: (updated: PlayerProfile) => void;
  lang: 'en' | 'bn';
}

export const TrainingCamp: React.FC<TrainingCampProps> = ({
  player,
  onUpdatePlayer,
  lang,
}) => {
  const [activeDrill, setActiveDrill] = useState<'NONE' | 'BATTING_NETS' | 'BOWLING_TARGET' | 'FITNESS_GYM' | 'TACTICAL_VIDEO'>('NONE');
  const [drillScore, setDrillScore] = useState<number>(0);
  const [drillRounds, setDrillRounds] = useState<number>(0);
  const [drillCompleted, setDrillCompleted] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>('');

  // Start a specific drill
  const handleStartDrill = (drillType: typeof activeDrill) => {
    if (player.energy < 15) {
      alert(lang === 'bn' ? 'আপনার শক্তি খুব কম (কমপক্ষে ১৫% এনার্জি প্রয়োজন)। বিশ্রাম নিন।' : 'Energy too low! Rest or buy energy drinks first.');
      return;
    }
    cricketAudio.playUiClick();
    setActiveDrill(drillType);
    setDrillScore(0);
    setDrillRounds(0);
    setDrillCompleted(false);
    setFeedback('');
  };

  // Batting Net Timing Drill Action
  const handleBattingNetHit = () => {
    cricketAudio.playBatHit('PERFECT');
    const newScore = drillScore + 1;
    const nextRounds = drillRounds + 1;
    setDrillScore(newScore);
    setDrillRounds(nextRounds);

    if (nextRounds >= 5) {
      finishDrill('BATTING', newScore);
    } else {
      setFeedback(lang === 'bn' ? 'দারুণ টাইমিং! ব্যাটের মাঝখানে লেগেছে।' : 'Pure sweet-spot connection! Keep going!');
    }
  };

  // Bowling Target Cone Hit
  const handleBowlingTarget = (hitSuccess: boolean) => {
    if (hitSuccess) {
      cricketAudio.playWicketSound();
      setDrillScore((prev) => prev + 1);
      setFeedback(lang === 'bn' ? 'সরাসরি স্ট্যাম্পে আঘাত!' : 'Direct hit on target stump!');
    } else {
      cricketAudio.playUiClick();
      setFeedback(lang === 'bn' ? 'সামান্য বাইরে গেল, আবার চেষ্টা করুন।' : 'Just missed the off-stump channel.');
    }

    const nextRounds = drillRounds + 1;
    setDrillRounds(nextRounds);

    if (nextRounds >= 5) {
      finishDrill('BOWLING', drillScore + (hitSuccess ? 1 : 0));
    }
  };

  const finishDrill = (type: 'BATTING' | 'BOWLING' | 'GYM' | 'VIDEO', score: number) => {
    cricketAudio.playFanfare();
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    setDrillCompleted(true);

    const updated = { ...player };
    updated.energy = Math.max(0, updated.energy - 15);

    if (type === 'BATTING') {
      updated.attributes.timing = Math.min(99, updated.attributes.timing + 1);
      updated.attributes.power = Math.min(99, updated.attributes.power + 1);
      updated.form = Math.min(99, updated.form + 5);
    } else if (type === 'BOWLING') {
      updated.attributes.accuracy = Math.min(99, updated.attributes.accuracy + 1);
      updated.attributes.deception = Math.min(99, updated.attributes.deception + 1);
      updated.form = Math.min(99, updated.form + 5);
    } else if (type === 'GYM') {
      updated.attributes.stamina = Math.min(99, updated.attributes.stamina + 2);
      updated.attributes.runningSpeed = Math.min(99, updated.attributes.runningSpeed + 1);
    } else if (type === 'VIDEO') {
      updated.attributes.spinReading = Math.min(99, updated.attributes.spinReading + 2);
      updated.attributes.paceTolerance = Math.min(99, updated.attributes.paceTolerance + 1);
    }

    onUpdatePlayer(updated);
  };

  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto pb-20">
      {/* Header Banner */}
      <div className="bg-white/[0.03] backdrop-blur-xl border border-amber-500/30 rounded-2xl p-4 shadow-[0_0_25px_rgba(245,158,11,0.15)] text-white relative overflow-hidden">
        <div className="flex items-center gap-2 mb-1">
          <Dumbbell className="w-5 h-5 text-amber-400" />
          <h1 className="text-xl sm:text-2xl font-bold font-teko uppercase tracking-wider">
            {lang === 'bn' ? 'ক্রিকেট ট্রেনিং একাডেমি ও নেট প্র্যাকটিস' : 'HIGH PERFORMANCE NETS & TRAINING ACADEMY'}
          </h1>
        </div>
        <p className="text-xs text-gray-300 leading-relaxed">
          {lang === 'bn'
            ? 'নেটে নিয়মিত ঘাম ঝরিয়ে টাইমিং, পেস ও স্ট্যামিনা বাড়িয়ে নিন। প্রতিটি ড্রিল আপনার অ্যাট্রিবিউট উন্নত করে।'
            : 'Sharpen your skills in the nets. Complete interactive drills to permanently upgrade your core attributes.'}
        </p>
      </div>

      {/* Interactive Drill Stage */}
      {activeDrill !== 'NONE' ? (
        <div className="bg-white/[0.03] backdrop-blur-xl border border-amber-500/40 rounded-2xl p-5 shadow-2xl text-center space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-amber-400">
              {activeDrill.replace('_', ' ')}
            </span>
            <span className="text-xs text-gray-400 font-mono">
              Round {drillRounds}/5 • Score: {drillScore}
            </span>
          </div>

          {!drillCompleted ? (
            <div className="py-6 space-y-4">
              {activeDrill === 'BATTING_NETS' && (
                <div className="space-y-4">
                  <div className="text-4xl animate-bounce">🏏</div>
                  <h2 className="text-sm font-bold text-white tracking-wide">
                    {lang === 'bn' ? 'সুইট-স্পট টাইমিং হিট করুন!' : 'Fast Reaction Net Batting!'}
                  </h2>
                  <p className="text-xs text-gray-400">
                    {lang === 'bn' ? 'বোলিং মেশিন থেকে আসা বলটিতে নিখুঁত ড্রাইভ মারুন!' : 'Bowling machine fires 140km/h seam delivery!'}
                  </p>
                  <button
                    id="btn-batting-drill-hit"
                    onClick={handleBattingNetHit}
                    className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.3)] active:scale-95 text-xs uppercase tracking-[0.2em]"
                  >
                    {lang === 'bn' ? 'শট হিট করুন!' : 'DRIVE SHOT NOW!'}
                  </button>
                </div>
              )}

              {activeDrill === 'BOWLING_TARGET' && (
                <div className="space-y-4">
                  <div className="text-4xl animate-pulse">🎯</div>
                  <h2 className="text-sm font-bold text-white tracking-wide">
                    {lang === 'bn' ? 'অফ-স্ট্যাম্প চ্যানেলে বল ফেলুন!' : 'Target Single Stump Accuracy!'}
                  </h2>
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => handleBowlingTarget(true)}
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs active:scale-95 shadow-md uppercase tracking-wider"
                    >
                      {lang === 'bn' ? '🎯 পারফেক্ট লেন্থ' : '🎯 Off-Stump Channel'}
                    </button>
                    <button
                      onClick={() => handleBowlingTarget(false)}
                      className="px-4 py-2.5 bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-gray-300 font-bold rounded-xl text-xs active:scale-95 uppercase tracking-wider"
                    >
                      {lang === 'bn' ? 'ওয়াইড / শর্ট' : 'Wide / Short'}
                    </button>
                  </div>
                </div>
              )}

              {feedback && (
                <p className="text-xs font-bold text-amber-300 animate-pulse">{feedback}</p>
              )}
            </div>
          ) : (
            /* Drill Complete Celebration */
            <div className="py-4 space-y-3">
              <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto animate-bounce drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
              <h2 className="text-lg font-bold text-white uppercase tracking-wider">
                {lang === 'bn' ? 'ড্রিল সফলভাবে সম্পন্ন!' : 'Drill Completed Successfully!'}
              </h2>
              <p className="text-xs text-emerald-300">
                {lang === 'bn' ? '+১ অ্যাট্রিবিউট পয়েন্ট যোগ হয়েছে এবং ফর্ম বৃদ্ধি পেয়েছে!' : 'Attributes upgraded & form gained!'}
              </p>
              <button
                onClick={() => setActiveDrill('NONE')}
                className="px-5 py-2 bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
              >
                {lang === 'bn' ? 'একাডেমিতে ফিরুন' : 'Back to Academy'}
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Drill Selection Cards */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Batting Nets */}
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-amber-500/40 rounded-2xl p-4 flex flex-col justify-between transition-all shadow-xl group">
            <div>
              <div className="flex items-center gap-2 text-amber-400 mb-1.5">
                <Flame className="w-4 h-4" />
                <h2 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                  {lang === 'bn' ? 'ব্যাটিং নেট টাইমিং ড্রিল' : 'Batting Nets Sweet-Spot Drill'}
                </h2>
              </div>
              <p className="text-xs text-gray-400 mb-3 leading-relaxed">
                {lang === 'bn' ? 'পাওয়ার হিটিং ও টাইমিং উন্নত করতে মেশিন বল ড্রিল।' : 'Face rapid automated deliveries to boost Timing & Power.'}
              </p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <span className="text-[11px] text-amber-300 font-mono">+1 Timing, +1 Power</span>
              <button
                id="btn-start-batting-drill"
                onClick={() => handleStartDrill('BATTING_NETS')}
                className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 text-xs font-bold uppercase tracking-wider rounded-lg transition-all active:scale-95 shadow-[0_0_10px_rgba(245,158,11,0.2)]"
              >
                {lang === 'bn' ? 'ড্রিল শুরু (-15⚡)' : 'Start Drill (-15⚡)'}
              </button>
            </div>
          </div>

          {/* Bowling Accuracy */}
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-emerald-500/40 rounded-2xl p-4 flex flex-col justify-between transition-all shadow-xl group">
            <div>
              <div className="flex items-center gap-2 text-emerald-400 mb-1.5">
                <Target className="w-4 h-4" />
                <h2 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {lang === 'bn' ? 'বোলিং টার্গেট কোন ড্রিল' : 'Target Cone Accuracy Drill'}
                </h2>
              </div>
              <p className="text-xs text-gray-400 mb-3 leading-relaxed">
                {lang === 'bn' ? 'একুরেসি ও সুইং নিয়ন্ত্রণে নিখুঁত লেন্থ ড্রিল।' : 'Hit the single-stump channel to boost Accuracy & Variations.'}
              </p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <span className="text-[11px] text-emerald-300 font-mono">+1 Accuracy, +1 Deception</span>
              <button
                id="btn-start-bowling-drill"
                onClick={() => handleStartDrill('BOWLING_TARGET')}
                className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 text-slate-950 text-xs font-bold uppercase tracking-wider rounded-lg transition-all active:scale-95 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
              >
                {lang === 'bn' ? 'ড্রিল শুরু (-15⚡)' : 'Start Drill (-15⚡)'}
              </button>
            </div>
          </div>

          {/* Gym Conditioning */}
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-sky-500/40 rounded-2xl p-4 flex flex-col justify-between transition-all shadow-xl group">
            <div>
              <div className="flex items-center gap-2 text-sky-400 mb-1.5">
                <Dumbbell className="w-4 h-4" />
                <h2 className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors">
                  {lang === 'bn' ? 'হাই-ইন্টেনসিটি জিম কার্ডিও' : 'High Intensity Gym Cardio'}
                </h2>
              </div>
              <p className="text-xs text-gray-400 mb-3 leading-relaxed">
                {lang === 'bn' ? 'ম্যাচে দীর্ঘক্ষণ খেলার স্ট্যামিনা ও দৌড়ানোর গতি বাড়ান।' : 'Leg strength, sprint sprints and endurance conditioning.'}
              </p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <span className="text-[11px] text-sky-300 font-mono">+2 Stamina, +1 Speed</span>
              <button
                onClick={() => {
                  cricketAudio.playUiClick();
                  finishDrill('GYM', 5);
                }}
                className="px-3 py-1.5 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 text-slate-950 text-xs font-bold uppercase tracking-wider rounded-lg transition-all active:scale-95 shadow-[0_0_10px_rgba(14,165,233,0.2)]"
              >
                {lang === 'bn' ? 'ওয়ার্কআউট (-15⚡)' : 'Workout (-15⚡)'}
              </button>
            </div>
          </div>

          {/* Tactical Video Analysis */}
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-purple-500/40 rounded-2xl p-4 flex flex-col justify-between transition-all shadow-xl group">
            <div>
              <div className="flex items-center gap-2 text-purple-400 mb-1.5">
                <Eye className="w-4 h-4" />
                <h2 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                  {lang === 'bn' ? 'ভিডিও ট্যাকটিক্যাল অ্যানালাইসিস' : 'Tactical Video Analytics'}
                </h2>
              </div>
              <p className="text-xs text-gray-400 mb-3 leading-relaxed">
                {lang === 'bn' ? 'স্পিন রিলিজ পয়েন্ট ও শর্ট বাউন্সার সনাক্তকরণ কৌশল।' : 'Decipher mystery spin wrist angles and 150km/h short pitch angles.'}
              </p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <span className="text-[11px] text-purple-300 font-mono">+2 Spin Reading</span>
              <button
                onClick={() => {
                  cricketAudio.playUiClick();
                  finishDrill('VIDEO', 5);
                }}
                className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 text-slate-950 text-xs font-bold uppercase tracking-wider rounded-lg transition-all active:scale-95 shadow-[0_0_10px_rgba(168,85,247,0.2)]"
              >
                {lang === 'bn' ? 'অ্যানালাইসিস (-15⚡)' : 'Analyze (-15⚡)'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
