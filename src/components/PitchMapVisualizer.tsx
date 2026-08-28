import React, { useState } from 'react';
import { PitchMapBall } from '../types/cricket';
import { Target, Filter, Zap, Activity, Info } from 'lucide-react';

interface PitchMapVisualizerProps {
  balls: PitchMapBall[];
  isUserBowling?: boolean;
  bowlerName?: string;
  lang: 'en' | 'bn';
  title?: string;
}

export const PitchMapVisualizer: React.FC<PitchMapVisualizerProps> = ({
  balls = [],
  isUserBowling = false,
  bowlerName,
  lang,
  title,
}) => {
  const [filterBowler, setFilterBowler] = useState<'ALL' | 'USER' | 'OPP'>('ALL');
  const [filterLength, setFilterLength] = useState<string>('ALL');
  const [selectedBall, setSelectedBall] = useState<PitchMapBall | null>(null);

  // Filter balls
  const filteredBalls = balls.filter((b) => {
    if (filterBowler === 'USER' && !b.isUserBowler) return false;
    if (filterBowler === 'OPP' && b.isUserBowler) return false;
    if (filterLength !== 'ALL' && b.length !== filterLength) return false;
    return true;
  });

  // Length zones coordinates (Y axis in SVG: 0 top / bowler end, 360 bottom / batting crease)
  // Pitch dimensions in SVG:
  // Width: 200 (x from 40 to 160 is the main pitch corridor, 100 is center)
  // Height: 360 (y from 30 to 330 is pitch length)
  const pitchZones = [
    { id: 'BOUNCER', label: 'Bouncer', labelBn: 'বাউন্সার', y: 35, h: 55, color: 'rgba(239, 68, 68, 0.15)', stroke: '#ef4444' },
    { id: 'SHORT', label: 'Short', labelBn: 'শর্ট', y: 90, h: 65, color: 'rgba(249, 115, 22, 0.15)', stroke: '#f97316' },
    { id: 'GOOD_LENGTH', label: 'Good Length', labelBn: 'গুড লেংথ', y: 155, h: 75, color: 'rgba(16, 185, 129, 0.18)', stroke: '#10b981' },
    { id: 'FULL', label: 'Full', labelBn: 'ফুল', y: 230, h: 60, color: 'rgba(59, 130, 246, 0.15)', stroke: '#3b82f6' },
    { id: 'YORKER', label: 'Yorker / Blockhole', labelBn: 'ইয়র্কার / ব্লকহোল', y: 290, h: 45, color: 'rgba(168, 85, 247, 0.18)', stroke: '#a855f7' },
  ];

  // Helper to map PitchMapBall (pitchX: -1 to +1, pitchY: 0 to 1) to SVG coords
  // pitchY: 0.0 is yorker/crease (y=310), 1.0 is bouncer (y=60)
  const getSvgCoordinates = (ball: PitchMapBall) => {
    // X center is 100. Spread width is 55px (from x=45 to x=155)
    const svgX = 100 + ball.pitchX * 48;
    // Y: 0 -> 310 (Batting crease), 1.0 -> 60 (Bowler short pitch)
    const svgY = 310 - ball.pitchY * 250;
    return { x: svgX, y: svgY };
  };

  // Ball outcome dot coloring
  const getBallColor = (ball: PitchMapBall) => {
    if (ball.isWicket) return '#ef4444'; // Red for wicket
    if (ball.runs >= 6) return '#a855f7'; // Purple for 6
    if (ball.runs === 4) return '#3b82f6'; // Blue for 4
    if (ball.runs === 0) return '#10b981'; // Green for dot
    return '#f59e0b'; // Amber for 1-3 runs
  };

  // Length breakdown statistics
  const stats = {
    total: filteredBalls.length,
    dots: filteredBalls.filter((b) => b.runs === 0 && !b.isWicket).length,
    wickets: filteredBalls.filter((b) => b.isWicket).length,
    boundaries: filteredBalls.filter((b) => b.runs >= 4).length,
    avgSpeed: filteredBalls.length > 0 
      ? Math.round(filteredBalls.reduce((acc, b) => acc + b.speedKmh, 0) / filteredBalls.length)
      : 0,
  };

  return (
    <div className="bg-slate-950/95 border border-amber-500/30 rounded-3xl p-4 sm:p-5 shadow-2xl backdrop-blur-2xl text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <span>{title || (lang === 'bn' ? 'পিচ ম্যাপ ও লেন্থ ট্র্যাকার' : 'Pitch Map & Line-Length Radar')}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                {filteredBalls.length} BALLS
              </span>
            </h3>
            <p className="text-xs text-gray-400">
              {lang === 'bn' 
                ? 'বোলারের প্রতিটি বলের ল্যান্ডিং স্পট, বাউন্স জোন এবং গতি বিশ্লেষণ' 
                : 'Real-time pitch impact coordinates, trajectory and length analysis'}
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-black/40 p-1 rounded-2xl border border-white/10">
          <button
            onClick={() => setFilterBowler('ALL')}
            className={`px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase transition-all ${
              filterBowler === 'ALL' ? 'bg-amber-500 text-slate-950 font-black' : 'text-gray-400 hover:text-white'
            }`}
          >
            {lang === 'bn' ? 'সকল বল' : 'All'}
          </button>
          <button
            onClick={() => setFilterBowler('USER')}
            className={`px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase transition-all ${
              filterBowler === 'USER' ? 'bg-amber-500 text-slate-950 font-black' : 'text-gray-400 hover:text-white'
            }`}
          >
            {lang === 'bn' ? 'আমার বোলিং' : 'My Bowler'}
          </button>
          <button
            onClick={() => setFilterBowler('OPP')}
            className={`px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase transition-all ${
              filterBowler === 'OPP' ? 'bg-amber-500 text-slate-950 font-black' : 'text-gray-400 hover:text-white'
            }`}
          >
            {lang === 'bn' ? 'বিপক্ষ বোলিং' : 'Opposition'}
          </button>
        </div>
      </div>

      {/* Main Pitch Map Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mt-4 items-center">
        {/* SVG Pitch Canvas (5 cols on desktop) */}
        <div className="md:col-span-6 flex flex-col items-center justify-center relative">
          <div className="relative w-full max-w-[280px] bg-gradient-to-b from-amber-950/20 via-slate-900/60 to-amber-950/30 rounded-2xl p-3 border border-amber-500/20 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
            {/* Top Bowler Label */}
            <div className="text-center pb-1 text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">
              ▲ BOWLER END ▲
            </div>

            <svg viewBox="0 0 200 360" className="w-full h-auto select-none overflow-visible">
              <defs>
                {/* Grass & Pitch texture gradients */}
                <linearGradient id="pitchStripGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#785338" stopOpacity="0.85" />
                  <stop offset="20%" stopColor="#9c724e" stopOpacity="0.95" />
                  <stop offset="50%" stopColor="#b38760" stopOpacity="1" />
                  <stop offset="80%" stopColor="#9c724e" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#785338" stopOpacity="0.85" />
                </linearGradient>

                <filter id="ballGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#ffffff" floodOpacity="0.6" />
                </filter>
              </defs>

              {/* Pitch 22-yard turf base */}
              <rect x="45" y="20" width="110" height="320" rx="4" fill="url(#pitchStripGrad)" stroke="#5c3a21" strokeWidth="1.5" />

              {/* Length Zone Color Overlays */}
              {pitchZones.map((zone) => (
                <g key={zone.id}>
                  <rect
                    x="46"
                    y={zone.y}
                    width="108"
                    height={zone.h}
                    fill={zone.color}
                    stroke={zone.stroke}
                    strokeWidth="0.75"
                    strokeDasharray="3,3"
                    className="transition-opacity hover:opacity-100 opacity-80 cursor-pointer"
                    onClick={() => setFilterLength(filterLength === zone.id ? 'ALL' : zone.id)}
                  />
                  <text
                    x="50"
                    y={zone.y + 12}
                    fill={zone.stroke}
                    fontSize="7"
                    fontWeight="bold"
                    fontFamily="monospace"
                    letterSpacing="0.5"
                  >
                    {zone.label.toUpperCase()}
                  </text>
                </g>
              ))}

              {/* Bowling Crease (Top) */}
              <line x1="30" y1="35" x2="170" y2="35" stroke="#ffffff" strokeWidth="1.5" opacity="0.8" />
              {/* Return Creases Top */}
              <line x1="45" y1="20" x2="45" y2="45" stroke="#ffffff" strokeWidth="1" opacity="0.6" />
              <line x1="155" y1="20" x2="155" y2="45" stroke="#ffffff" strokeWidth="1" opacity="0.6" />

              {/* Bowler Stumps */}
              <rect x="96" y="32" width="2.5" height="4" fill="#fde047" rx="0.5" />
              <rect x="99" y="32" width="2.5" height="4" fill="#fde047" rx="0.5" />
              <rect x="102" y="32" width="2.5" height="4" fill="#fde047" rx="0.5" />

              {/* Center Line / Pitch Axis */}
              <line x1="100.2" y1="35" x2="100.2" y2="325" stroke="#ffffff" strokeWidth="0.5" strokeDasharray="4,4" opacity="0.4" />
              {/* Stumps Alignment Guides (Off, Middle, Leg) */}
              <line x1="88" y1="35" x2="88" y2="325" stroke="#ffffff" strokeWidth="0.3" strokeDasharray="2,6" opacity="0.25" />
              <line x1="112" y1="35" x2="112" y2="325" stroke="#ffffff" strokeWidth="0.3" strokeDasharray="2,6" opacity="0.25" />

              {/* Popping Crease / Batting Crease (Bottom) */}
              <line x1="30" y1="310" x2="170" y2="310" stroke="#ffffff" strokeWidth="2" opacity="0.95" />
              {/* Batting Stumps Crease */}
              <line x1="40" y1="325" x2="160" y2="325" stroke="#ffffff" strokeWidth="1.2" opacity="0.75" />
              {/* Return Creases Bottom */}
              <line x1="45" y1="300" x2="45" y2="335" stroke="#ffffff" strokeWidth="1" opacity="0.6" />
              <line x1="155" y1="300" x2="155" y2="335" stroke="#ffffff" strokeWidth="1" opacity="0.6" />

              {/* Batting Stumps (Off, Middle, Leg) */}
              <rect x="95" y="323" width="3" height="5" fill="#fde047" rx="0.5" />
              <rect x="99" y="323" width="3" height="5" fill="#fde047" rx="0.5" />
              <rect x="103" y="323" width="3" height="5" fill="#fde047" rx="0.5" />
              <line x1="94" y1="323" x2="107" y2="323" stroke="#f59e0b" strokeWidth="1" />

              {/* Batsman Marker Guide */}
              <circle cx="85" cy="305" r="4" fill="#38bdf8" fillOpacity="0.4" stroke="#38bdf8" strokeWidth="1" />
              <text x="76" y="303" fill="#38bdf8" fontSize="5.5" fontWeight="bold">RHB</text>

              {/* Render Pitch Map Ball Landing Dots */}
              {filteredBalls.map((b, idx) => {
                const { x, y } = getSvgCoordinates(b);
                const isSelected = selectedBall?.id === b.id;
                const dotColor = getBallColor(b);

                return (
                  <g
                    key={b.id || idx}
                    className="cursor-pointer transition-transform hover:scale-125"
                    onClick={() => setSelectedBall(b)}
                  >
                    {/* Ring highlight if selected */}
                    {isSelected && (
                      <circle
                        cx={x}
                        cy={y}
                        r="8"
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                        className="animate-ping opacity-75"
                      />
                    )}
                    {/* Ripple shockwave */}
                    <circle
                      cx={x}
                      cy={y}
                      r="5.5"
                      fill={dotColor}
                      fillOpacity="0.25"
                      stroke={dotColor}
                      strokeWidth="0.8"
                    />
                    {/* Solid Core Dot */}
                    <circle
                      cx={x}
                      cy={y}
                      r="3.5"
                      fill={dotColor}
                      stroke="#ffffff"
                      strokeWidth="1"
                      filter="url(#ballGlow)"
                    />
                    {/* Number inside dot */}
                    <text
                      x={x}
                      y={y + 1.2}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#000000"
                      fontSize="3.8"
                      fontWeight="900"
                      fontFamily="sans-serif"
                    >
                      {b.runs > 0 ? (b.runs === 4 ? '4' : b.runs === 6 ? '6' : `${b.runs}`) : b.isWicket ? 'W' : '•'}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Bottom Batsman Crease Label */}
            <div className="text-center pt-1 text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest">
              ▼ BATSMAN CREASE ▼
            </div>
          </div>

          {/* Quick Color Legend */}
          <div className="flex items-center justify-center flex-wrap gap-2.5 mt-3 text-[10px] text-gray-300 font-bold">
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_6px_#ef4444]" />
              <span>{lang === 'bn' ? 'উইকেট' : 'Wicket'}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_6px_#a855f7]" />
              <span>{lang === 'bn' ? 'ছক্কা (৬)' : 'Six (6)'}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_6px_#3b82f6]" />
              <span>{lang === 'bn' ? 'চার (৪)' : 'Four (4)'}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>{lang === 'bn' ? 'রানস (১-৩)' : 'Runs (1-3)'}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>{lang === 'bn' ? 'ডট বল' : 'Dot'}</span>
            </div>
          </div>
        </div>

        {/* Analytics & Inspector Dashboard (6 cols on desktop) */}
        <div className="md:col-span-6 flex flex-col gap-3">
          {/* Key Metrics Bento */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-2.5 text-center">
              <div className="text-[10px] text-gray-400 uppercase font-bold">{lang === 'bn' ? 'মোট বল' : 'Total Balls'}</div>
              <div className="text-xl font-black text-amber-400 font-mono">{stats.total}</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-2.5 text-center">
              <div className="text-[10px] text-gray-400 uppercase font-bold">{lang === 'bn' ? 'ডট পারসেন্ট' : 'Dot %'}</div>
              <div className="text-xl font-black text-emerald-400 font-mono">
                {stats.total > 0 ? Math.round((stats.dots / stats.total) * 100) : 0}%
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-2.5 text-center">
              <div className="text-[10px] text-gray-400 uppercase font-bold">{lang === 'bn' ? 'উইকেট' : 'Wickets'}</div>
              <div className="text-xl font-black text-red-400 font-mono">{stats.wickets}</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-2.5 text-center">
              <div className="text-[10px] text-gray-400 uppercase font-bold">{lang === 'bn' ? 'গড় গতি' : 'Avg Speed'}</div>
              <div className="text-xl font-black text-cyan-400 font-mono">{stats.avgSpeed} <span className="text-[10px]">kph</span></div>
            </div>
          </div>

          {/* Detailed Selected Ball Telemetry Card */}
          <div className="bg-gradient-to-br from-slate-900 to-black border border-amber-500/30 rounded-2xl p-3.5 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 uppercase">
                <Activity className="w-4 h-4 text-amber-400" />
                <span>{lang === 'bn' ? 'বল টেলিমেট্রি স্পেকস' : 'Delivery Telemetry Inspector'}</span>
              </div>
              {selectedBall ? (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 font-black">
                  BALL #{selectedBall.ballNumber}
                </span>
              ) : (
                <span className="text-[10px] text-gray-500">
                  {lang === 'bn' ? 'যে কোনো বল ট্যাপ করুন' : 'Tap any ball dot on pitch'}
                </span>
              )}
            </div>

            {selectedBall ? (
              <div className="space-y-2 mt-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">{lang === 'bn' ? 'বোলার:' : 'Bowler:'}</span>
                  <span className="font-bold text-white">{selectedBall.bowlerName} ({selectedBall.isUserBowler ? 'User' : 'AI'})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">{lang === 'bn' ? 'লেন্থ ও লাইন:' : 'Length & Line:'}</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {selectedBall.length.replace('_', ' ')} • {selectedBall.line.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">{lang === 'bn' ? 'গতি:' : 'Release Speed:'}</span>
                  <span className="font-mono font-bold text-cyan-300">{selectedBall.speedKmh} km/h</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">{lang === 'bn' ? 'ফলাফল:' : 'Outcome:'}</span>
                  <span className={`font-black ${selectedBall.isWicket ? 'text-red-400' : selectedBall.runs >= 4 ? 'text-purple-400' : 'text-amber-400'}`}>
                    {selectedBall.isWicket ? `WICKET (${selectedBall.wicketType || 'Out'})` : `${selectedBall.runs} Runs`}
                  </span>
                </div>
                {selectedBall.shotType && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">{lang === 'bn' ? 'শট ধরন:' : 'Shot Played:'}</span>
                    <span className="font-bold text-gray-200">{selectedBall.shotType}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-4 text-center text-gray-400 text-xs">
                <Info className="w-5 h-5 text-gray-500 mx-auto mb-1.5" />
                <p>{lang === 'bn' ? 'পিচ ম্যাপের যে কোনো পয়েন্টে ক্লিক করে বলের নিখুঁত ডেটা দেখুন।' : 'Click on any ball impact marker on the pitch map above to inspect speed, length, and wicket telemetry.'}</p>
              </div>
            )}
          </div>

          {/* Length Frequency Breakdown Bars */}
          <div className="bg-black/40 border border-white/10 rounded-2xl p-3 space-y-1.5">
            <div className="text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1">
              {lang === 'bn' ? 'লেন্থ ডিস্ট্রিবিউশন' : 'Length Zone Distribution'}
            </div>

            {pitchZones.map((zone) => {
              const count = filteredBalls.filter((b) => b.length === zone.id).length;
              const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;

              return (
                <div
                  key={zone.id}
                  onClick={() => setFilterLength(filterLength === zone.id ? 'ALL' : zone.id)}
                  className={`flex items-center gap-2 p-1 rounded-xl cursor-pointer transition-all ${
                    filterLength === zone.id ? 'bg-white/10 border border-amber-500/40' : 'hover:bg-white/5'
                  }`}
                >
                  <span className="w-20 text-[10px] font-bold text-gray-300 truncate">
                    {zone.label}
                  </span>
                  <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${pct}%`, backgroundColor: zone.stroke }}
                      className="h-full rounded-full transition-all duration-500"
                    />
                  </div>
                  <span className="w-10 text-right text-[10px] font-mono font-bold text-gray-400">
                    {count} ({pct}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
