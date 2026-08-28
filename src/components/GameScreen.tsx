import { useState } from 'react';
import { Player } from '../types/cricket';
import { BarChart3, ShoppingCart, Target, Trophy } from 'lucide-react';

interface GameScreenProps {
  player: Player;
  onStartMatch: () => void;
  setPlayer: (player: Player) => void;
}

export default function GameScreen({ player, onStartMatch, setPlayer }: GameScreenProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'stats' | 'shop' | 'training'>('home');

  const handleTraining = (stat: keyof Omit<Player, 'id' | 'name' | 'role' | 'age' | 'team' | 'careerMatches' | 'careerRuns' | 'careerWickets' | 'money' | 'equipment' | 'createdAt'>) => {
    if (player.money >= 1000) {
      const updated = {
        ...player,
        [stat]: Math.min(100, player[stat as any] + 5),
        money: player.money - 1000,
      };
      setPlayer(updated);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-amber-500/30 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-teko font-bold text-amber-400">{player.name}</h1>
            <p className="text-slate-400">{player.team} • {player.role}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-emerald-400">💰 ${player.money}</p>
            <p className="text-slate-400">Matches: {player.careerMatches}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-4">
        {/* Tabs */}
        <div className="flex gap-4 mb-6 flex-wrap">
          {['home', 'stats', 'training', 'shop'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-2 rounded-lg font-semibold transition-all capitalize ${
                activeTab === tab
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {tab === 'home' && '🏠'}
              {tab === 'stats' && <BarChart3 className="inline mr-2" size={16} />}
              {tab === 'training' && '💪'}
              {tab === 'shop' && <ShoppingCart size={16} className="inline mr-2" />}
              {tab}
            </button>
          ))}
        </div>

        {/* HOME TAB */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Batting" value={player.batting} icon="⚾" />
              <StatCard label="Bowling" value={player.bowling} icon="🎯" />
              <StatCard label="Fielding" value={player.fielding} icon="🏃" />
              <StatCard label="Fitness" value={player.fitness} icon="💪" />
            </div>

            {/* Match Button */}
            <div className="bg-gradient-to-r from-emerald-900 to-teal-900 border border-emerald-500/50 rounded-lg p-8 text-center">
              <h2 className="text-2xl font-teko font-bold mb-4">🏏 Ready for a Match?</h2>
              <button
                onClick={onStartMatch}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-4 px-12 rounded-lg text-xl font-teko transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-emerald-500/50"
              >
                ▶ START MATCH
              </button>
            </div>
          </div>
        )}

        {/* STATS TAB */}
        {activeTab === 'stats' && (
          <div className="bg-slate-800 rounded-lg p-6 space-y-4">
            <h2 className="text-2xl font-teko font-bold text-amber-400">📊 Career Statistics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <p className="text-slate-400 text-sm">Matches Played</p>
                <p className="text-2xl font-bold text-emerald-400">{player.careerMatches}</p>
              </div>
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <p className="text-slate-400 text-sm">Total Runs</p>
                <p className="text-2xl font-bold text-emerald-400">{player.careerRuns}</p>
              </div>
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <p className="text-slate-400 text-sm">Wickets</p>
                <p className="text-2xl font-bold text-emerald-400">{player.careerWickets}</p>
              </div>
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <p className="text-slate-400 text-sm">Age</p>
                <p className="text-2xl font-bold text-emerald-400">{player.age}</p>
              </div>
            </div>
          </div>
        )}

        {/* TRAINING TAB */}
        {activeTab === 'training' && (
          <div className="grid gap-4">
            <h2 className="text-2xl font-teko font-bold text-amber-400 mb-2">💪 Training Camp</h2>
            {(['batting', 'bowling', 'fielding', 'fitness'] as const).map((skill) => (
              <div key={skill} className="bg-slate-800 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold capitalize">{skill}</span>
                  <span className="text-emerald-400 font-bold">{player[skill]}/100</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2 mb-4">
                  <div
                    className="bg-emerald-500 h-2 rounded-full transition-all"
                    style={{ width: `${player[skill]}%` }}
                  />
                </div>
                <button
                  onClick={() => handleTraining(skill)}
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 rounded-lg transition-all disabled:opacity-50"
                  disabled={player.money < 1000}
                >
                  {player.money >= 1000 ? '💰 Train - $1000' : '❌ Need $1000'}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* SHOP TAB */}
        {activeTab === 'shop' && (
          <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-2xl font-teko font-bold text-amber-400 mb-6">🛒 Equipment Shop</h2>
            <div className="grid gap-4">
              <div className="bg-slate-700/50 p-4 rounded-lg border border-amber-500/30">
                <p className="font-semibold">🏏 {player.equipment.bat}</p>
                <p className="text-slate-400 text-sm">Your current bat</p>
              </div>
              <div className="bg-slate-700/50 p-4 rounded-lg border border-amber-500/30">
                <p className="font-semibold">🧤 {player.equipment.gloves}</p>
                <p className="text-slate-400 text-sm">Your current gloves</p>
              </div>
              <p className="text-slate-400 text-center text-sm mt-4">More equipment coming soon! 🔜</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: number; icon: string }) {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 text-center">
      <p className="text-2xl mb-2">{icon}</p>
      <p className="text-slate-400 text-sm">{label}</p>
      <p className="text-2xl font-bold text-emerald-400">{value}</p>
      <div className="w-full bg-slate-700 rounded-full h-1 mt-2">
        <div
          className="bg-emerald-500 h-1 rounded-full"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
