import { Trophy, Zap } from 'lucide-react';

interface GameMenuProps {
  onStart: () => void;
}

export default function GameMenu({ onStart }: GameMenuProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-4">
      <div className="text-center space-y-8 max-w-2xl">
        {/* Logo/Title */}
        <div className="space-y-4">
          <h1 className="text-6xl font-teko font-bold text-amber-400 drop-shadow-lg">
            🏏 REAL CRICKET
          </h1>
          <h2 className="text-3xl font-teko text-emerald-400">CAREER RPG</h2>
        </div>

        {/* Description */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-amber-500/30 rounded-lg p-6 space-y-3">
          <p className="text-lg text-slate-200">
            Create your cricket legend and dominate the game!
          </p>
          <div className="flex gap-4 justify-center text-sm text-slate-300">
            <span className="flex items-center gap-1"><Trophy size={16} /> Strategic Matches</span>
            <span className="flex items-center gap-1"><Zap size={16} /> Career Growth</span>
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={onStart}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-4 px-12 rounded-lg text-2xl font-teko transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-emerald-500/50"
        >
          ▶ START GAME
        </button>

        {/* Features */}
        <div className="grid grid-cols-2 gap-4 mt-8">
          <FeatureCard icon="⚾" title="Match Simulation" />
          <FeatureCard icon="📊" title="Career Stats" />
          <FeatureCard icon="🎖️" title="Tournaments" />
          <FeatureCard icon="🛒" title="Equipment Shop" />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="bg-slate-700/50 border border-slate-600 rounded p-4 hover:border-emerald-500/50 transition-colors">
      <div className="text-2xl mb-2">{icon}</div>
      <p className="text-sm font-semibold text-slate-200">{title}</p>
    </div>
  );
}
