import React, { useState } from 'react';
import { PitchCondition, WeatherCondition } from '../types/cricket';
import { Sun, Cloud, Moon, Wind, Droplets, Sparkles, Compass, AlertCircle, Eye, Info, X } from 'lucide-react';

interface WeatherAtmosphereOverlayProps {
  pitch: PitchCondition;
  weather: WeatherCondition;
  isNightMode?: boolean;
  lang?: 'en' | 'bn';
}

export const WeatherAtmosphereOverlay: React.FC<WeatherAtmosphereOverlayProps> = ({
  pitch,
  weather,
  isNightMode = false,
  lang = 'en',
}) => {
  const [showTacticalReport, setShowTacticalReport] = useState<boolean>(false);

  // Pitch Data Descriptions
  const pitchInfo: Record<PitchCondition, {
    title: string;
    titleBn: string;
    icon: string;
    color: string;
    borderColor: string;
    bgGradient: string;
    swingEffect: string;
    turnEffect: string;
    bounceEffect: string;
    advice: string;
    adviceBn: string;
  }> = {
    GREEN_SEAM: {
      title: 'Green Seam Wicket',
      titleBn: 'সবুজ সিমিং উইকেট',
      icon: '🌿',
      color: 'text-emerald-400',
      borderColor: 'border-emerald-500/40',
      bgGradient: 'from-emerald-950/70 via-slate-950/80 to-slate-950/90',
      swingEffect: '+18% Lateral Seam & Outswing',
      turnEffect: 'Low Spin Grip',
      bounceEffect: 'Lively, variable carry off the deck',
      advice: 'Play close to the body, wait for the ball, and leave outside off-stump deliveries.',
      adviceBn: 'শরীরের কাছাকাছি বল খেলুন, সুইংয়ের জন্য অপেক্ষা করুন এবং বাইরের বল ছেড়ে দিন।',
    },
    DUSTY_TURN: {
      title: 'Dusty Turning Deck',
      titleBn: 'শুষ্ক টার্নিং স্পিন উইকেট',
      icon: '🏜️',
      color: 'text-amber-400',
      borderColor: 'border-amber-500/40',
      bgGradient: 'from-amber-950/70 via-slate-950/80 to-slate-950/90',
      swingEffect: 'Minimal Seam Movement',
      turnEffect: '+25% Sharp Break & Variable Bounce',
      bounceEffect: 'Low, puffing dust upon bounce',
      advice: 'Use soft hands for defensive nudges and step down the pitch to smother spin.',
      adviceBn: 'হালকা হাতে খেলুন অথবা এগিয়ে গিয়ে স্পিনারের টার্ন নষ্ট করে ড্রাইভ মারুন।',
    },
    FLAT_ROAD: {
      title: 'Highway Flat Track',
      titleBn: 'ফ্ল্যাট ব্যাটিং স্বর্গ',
      icon: '⚡',
      color: 'text-yellow-300',
      borderColor: 'border-yellow-500/40',
      bgGradient: 'from-yellow-950/60 via-slate-950/80 to-slate-950/90',
      swingEffect: 'Negligible Swing',
      turnEffect: 'Minimal Spin',
      bounceEffect: 'True, predictable batting bounce (+15% Power)',
      advice: 'Ideal for boundary hitting! Unleash lofted drives and powerful pulls.',
      adviceBn: 'বাউন্ডারি মারার সেরা উইকেট! বড় শট ও পাওয়ার হিটিংয়ের সুবিধা নিন।',
    },
    DAMP_SLOW: {
      title: 'Damp Sticky Track',
      titleBn: 'ভেজা ও স্লো উইকেট',
      icon: '💧',
      color: 'text-cyan-400',
      borderColor: 'border-cyan-500/40',
      bgGradient: 'from-cyan-950/70 via-slate-950/80 to-slate-950/90',
      swingEffect: 'High Swing in initial overs',
      turnEffect: 'Grips spongy surface',
      bounceEffect: 'Sluggish, slow pace off pitch (-10% Pace)',
      advice: 'Time your shots patiently; rushing into drives will lead to mistimed edges.',
      adviceBn: 'ধৈর্য ধরে টাইমিং করুন, তাড়াহুড়ো করলে বল ব্যাটের কোণায় লেগে ক্যাচ হতে পারে।',
    },
  };

  const weatherInfo: Record<WeatherCondition, {
    title: string;
    titleBn: string;
    icon: string;
    color: string;
    windVector: string;
    airDensity: string;
    dewRisk: string;
    tacticalNote: string;
  }> = {
    SUNNY: {
      title: 'Crisp Sunshine',
      titleBn: 'উজ্জ্বল রোদ ও পরিষ্কার আকাশ',
      icon: '☀️',
      color: 'text-amber-400',
      windVector: '6 km/h Breeze',
      airDensity: 'Light & Dry',
      dewRisk: '0% None',
      tacticalNote: 'Optimum visibility and fast outfield tracking.',
    },
    OVERCAST: {
      title: 'Heavy Cloud Cover',
      titleBn: 'মেঘলা আকাশ ও আর্দ্র বাতাস',
      icon: '☁️',
      color: 'text-slate-300',
      windVector: '14 km/h Lateral Gusts',
      airDensity: 'Dense & Humid (Heavy Swing)',
      dewRisk: '5% Low',
      tacticalNote: 'Heavy cloud cover keeps ball swinging in the air both ways.',
    },
    DEW_NIGHT: {
      title: 'Night Lights & Dew',
      titleBn: 'ফ্লাডলাইট ও শিশিরভেজা আউটফিল্ড',
      icon: '🌙',
      color: 'text-indigo-300',
      windVector: '8 km/h Calm',
      airDensity: 'Cool & Moist',
      dewRisk: '75% High Dew (Wet Ball)',
      tacticalNote: 'Slippery seam makes fast bowling difficult; batting becomes easier in second half.',
    },
    WINDY: {
      title: 'Cross-Wind Gusts',
      titleBn: 'দমকা বাতাস ও ক্রস-উইন্ড',
      icon: '💨',
      color: 'text-sky-300',
      windVector: '24 km/h North-West Gusts',
      airDensity: 'Breezy & Turbulent',
      dewRisk: '0% None',
      tacticalNote: 'Cross-winds carry pull and hook shots over the boundary rope!',
    },
  };

  const pData = pitchInfo[pitch] || pitchInfo.FLAT_ROAD;
  const wData = weatherInfo[weather] || weatherInfo.SUNNY;

  return (
    <>
      {/* ======================================================== */}
      {/* 1. VISUAL ATMOSPHERE SVG / CSS GRADIENT OVERLAYS */}
      {/* ======================================================== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 select-none">
        {/* SUNNY WEATHER SUN FLARE & AMBIENT GLOW */}
        {weather === 'SUNNY' && (
          <div className="absolute top-0 right-0 w-72 h-72 pointer-events-none opacity-40">
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-400/30 via-yellow-500/10 to-transparent blur-2xl" />
            <svg className="w-full h-full text-amber-300/20" viewBox="0 0 200 200">
              <circle cx="180" cy="20" r="40" fill="url(#sunGlow)" />
              <line x1="180" y1="20" x2="60" y2="120" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 8" opacity="0.6" />
              <line x1="180" y1="20" x2="110" y2="170" stroke="currentColor" strokeWidth="1.2" strokeDasharray="4 6" opacity="0.4" />
              <defs>
                <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                  <stop offset="60%" stopColor="#fbbf24" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
                </radialGradient>
              </defs>
            </svg>
          </div>
        )}

        {/* OVERCAST CLOUD DRIFT OVERLAY */}
        {weather === 'OVERCAST' && (
          <div className="absolute top-0 inset-x-0 h-44 bg-gradient-to-b from-slate-900/60 via-slate-800/20 to-transparent pointer-events-none">
            {/* Animated cloud SVGs */}
            <svg className="absolute top-0 left-0 w-full h-32 opacity-25" preserveAspectRatio="none" viewBox="0 0 800 120">
              <path
                d="M 0 30 Q 150 0 300 25 Q 450 50 600 20 Q 720 0 800 35 L 800 0 L 0 0 Z"
                fill="#94a3b8"
              />
              <path
                d="M 0 50 Q 200 10 400 45 Q 600 70 800 40 L 800 0 L 0 0 Z"
                fill="#64748b"
                opacity="0.5"
              />
            </svg>
            <div className="absolute top-1 left-4 flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest text-slate-300/60 font-bold">
              <Cloud className="w-3 h-3 text-slate-400" />
              <span>Overcast Seam Atmosphere</span>
            </div>
          </div>
        )}

        {/* DEW NIGHT FLOODLIGHT BEAMS OVERLAY */}
        {(weather === 'DEW_NIGHT' || isNightMode) && (
          <div className="absolute inset-0 pointer-events-none">
            {/* 4 Corner Floodlight Cones */}
            <div className="absolute -top-10 -left-10 w-64 h-64 bg-[radial-gradient(ellipse_at_top_left,_rgba(255,255,255,0.18)_0%,_rgba(56,189,248,0.06)_40%,_transparent_75%)] blur-lg" />
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.18)_0%,_rgba(56,189,248,0.06)_40%,_transparent_75%)] blur-lg" />
            
            {/* Glistening Dewdrop particles in lower arena */}
            <div className="absolute bottom-6 inset-x-8 flex justify-around opacity-30">
              <Sparkles className="w-3 h-3 text-cyan-300 animate-pulse" />
              <Sparkles className="w-2.5 h-2.5 text-blue-200 animate-pulse delay-300" />
              <Sparkles className="w-3.5 h-3.5 text-cyan-200 animate-pulse delay-700" />
              <Sparkles className="w-2.5 h-2.5 text-sky-300 animate-pulse delay-500" />
            </div>
          </div>
        )}

        {/* WINDY CROSS-GUST STREAMLINES */}
        {weather === 'WINDY' && (
          <div className="absolute inset-0 pointer-events-none opacity-30">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <line x1="-10%" y1="20%" x2="110%" y2="28%" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="30 40" className="animate-[dash_8s_linear_infinite]" />
              <line x1="-10%" y1="45%" x2="110%" y2="52%" stroke="#7dd3fc" strokeWidth="1.2" strokeDasharray="20 35" className="animate-[dash_6s_linear_infinite]" />
              <line x1="-10%" y1="70%" x2="110%" y2="76%" stroke="#bae6fd" strokeWidth="1.0" strokeDasharray="25 45" className="animate-[dash_10s_linear_infinite]" />
            </svg>
          </div>
        )}

        {/* PITCH TEXTURE SPECIAL HIGHLIGHT OVERLAY (GREEN SEAM / DUST PARTICLES) */}
        {pitch === 'GREEN_SEAM' && (
          <div className="absolute bottom-2 left-3 flex items-center gap-1.5 bg-emerald-950/70 backdrop-blur-md px-2 py-0.5 rounded-lg border border-emerald-500/30 text-[9px] font-mono text-emerald-300">
            <span>🌿</span>
            <span>LIVE SEAM MOISTURE</span>
          </div>
        )}
        {pitch === 'DUSTY_TURN' && (
          <div className="absolute bottom-2 left-3 flex items-center gap-1.5 bg-amber-950/70 backdrop-blur-md px-2 py-0.5 rounded-lg border border-amber-500/30 text-[9px] font-mono text-amber-300">
            <span>🏜️</span>
            <span>DUST CRACKS & TURN</span>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 2. DYNAMIC PITCH & WEATHER INTERACTIVE HUD BADGE */}
      {/* ======================================================== */}
      <div className="relative z-20 flex items-center gap-1.5 pointer-events-auto">
        <button
          onClick={() => setShowTacticalReport(true)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-black/75 backdrop-blur-md border ${pData.borderColor} shadow-lg hover:bg-black/90 active:scale-95 transition-all text-left group`}
          title="Click to view pitch and weather conditions report"
        >
          <span className="text-xs">{pData.icon}</span>
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className={`text-[10px] font-black uppercase tracking-wider ${pData.color}`}>
                {pitch.replace('_', ' ')}
              </span>
              <span className="text-[9px] text-gray-400">•</span>
              <span className="text-[9px] font-mono text-gray-300 font-bold">
                {wData.icon} {weather}
              </span>
            </div>
          </div>
          <Info className="w-3 h-3 text-gray-400 group-hover:text-amber-400 transition-colors ml-0.5" />
        </button>
      </div>

      {/* ======================================================== */}
      {/* 3. TACTICAL PITCH & WEATHER CONDITIONS DIALOG MODAL */}
      {/* ======================================================== */}
      {showTacticalReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md pointer-events-auto animate-in fade-in duration-200">
          <div className="relative max-w-md w-full bg-gradient-to-b from-slate-900 to-slate-950 border border-white/15 rounded-3xl p-5 sm:p-6 shadow-2xl overflow-hidden">
            {/* Atmosphere Header Gradient */}
            <div className={`absolute top-0 inset-x-0 h-2 bg-gradient-to-r ${pitch === 'GREEN_SEAM' ? 'from-emerald-500 to-teal-400' : pitch === 'DUSTY_TURN' ? 'from-amber-500 to-orange-500' : pitch === 'DAMP_SLOW' ? 'from-cyan-500 to-blue-500' : 'from-yellow-400 to-amber-500'}`} />

            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-lg">
                  {pData.icon}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-teko uppercase tracking-wider">
                    {lang === 'bn' ? 'পিচ ও আবহাওয়া রিপোর্ট' : 'Match Pitch & Weather Report'}
                  </h3>
                  <span className="text-[10px] text-gray-400 font-mono">
                    Surface Dynamics & Wind Vector
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowTacticalReport(false)}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Pitch Condition Section */}
            <div className="mt-4 space-y-3">
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    {pData.icon} {lang === 'bn' ? pData.titleBn : pData.title}
                  </span>
                  <span className="text-[9px] font-mono px-2 py-0.5 bg-amber-500/10 text-amber-300 rounded-md border border-amber-500/20">
                    22 YARDS
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono mb-2.5">
                  <div className="bg-black/40 p-2 rounded-xl border border-white/5">
                    <span className="text-gray-400 block text-[8px] uppercase">Seam / Swing</span>
                    <span className="text-emerald-400 font-bold">{pData.swingEffect}</span>
                  </div>
                  <div className="bg-black/40 p-2 rounded-xl border border-white/5">
                    <span className="text-gray-400 block text-[8px] uppercase">Spin / Grip</span>
                    <span className="text-amber-400 font-bold">{pData.turnEffect}</span>
                  </div>
                  <div className="bg-black/40 p-2 rounded-xl border border-white/5">
                    <span className="text-gray-400 block text-[8px] uppercase">Bounce Carry</span>
                    <span className="text-cyan-400 font-bold">{pData.bounceEffect}</span>
                  </div>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed italic bg-white/[0.02] p-2 rounded-xl border border-white/5">
                  💡 {lang === 'bn' ? pData.adviceBn : pData.advice}
                </p>
              </div>

              {/* Weather Condition Section */}
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                    {wData.icon} {lang === 'bn' ? wData.titleBn : wData.title}
                  </span>
                  <span className="text-[9px] font-mono text-gray-400">
                    {wData.windVector}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                  <div className="bg-black/40 p-2 rounded-xl border border-white/5 flex items-center justify-between">
                    <span className="text-gray-400">Air Density:</span>
                    <span className="text-white font-bold">{wData.airDensity}</span>
                  </div>
                  <div className="bg-black/40 p-2 rounded-xl border border-white/5 flex items-center justify-between">
                    <span className="text-gray-400">Dew Factor:</span>
                    <span className="text-amber-300 font-bold">{wData.dewRisk}</span>
                  </div>
                </div>

                <p className="text-xs text-gray-300 mt-2 italic">
                  🎯 {wData.tacticalNote}
                </p>
              </div>
            </div>

            <div className="mt-5">
              <button
                onClick={() => setShowTacticalReport(false)}
                className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-widest rounded-xl transition-all active:scale-95 shadow-lg"
              >
                {lang === 'bn' ? 'ম্যাচে ফিরে যান' : 'RETURN TO MATCH 🏏'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
