import { useState } from 'react';
import { Player } from '../types/cricket';

interface PlayerCreationProps {
  onCreate: (player: Player) => void;
}

export default function PlayerCreation({ onCreate }: PlayerCreationProps) {
  const [name, setName] = useState('');
  const [role, setRole] = useState<'batsman' | 'bowler' | 'allrounder' | 'wicketkeeper'>('batsman');
  const [team, setTeam] = useState('Mumbai Indians');

  const roles: Array<'batsman' | 'bowler' | 'allrounder' | 'wicketkeeper'> = ['batsman', 'bowler', 'allrounder', 'wicketkeeper'];
  const teams = ['Mumbai Indians', 'Chennai Super Kings', 'Royal Challengers', 'Kolkata Knight Riders', 'Delhi Capitals'];

  const handleCreate = () => {
    if (!name.trim()) {
      alert('Please enter your name!');
      return;
    }

    const newPlayer: Player = {
      id: Date.now().toString(),
      name,
      role,
      batting: role === 'bowler' ? 45 : 75,
      bowling: role === 'batsman' ? 45 : 75,
      fielding: 65,
      fitness: 80,
      age: 22,
      team,
      careerMatches: 0,
      careerRuns: 0,
      careerWickets: 0,
      money: 10000,
      equipment: {
        bat: 'Standard Bat',
        gloves: 'Basic Gloves',
        pads: 'Standard Pads',
        helmet: 'Standard Helmet',
      },
      createdAt: new Date(),
    };

    onCreate(newPlayer);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-4">
      <div className="bg-slate-800 rounded-lg p-8 max-w-md w-full space-y-6">
        <h1 className="text-3xl font-teko font-bold text-amber-400 text-center">🏏 Create Your Player</h1>

        {/* Name Input */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-300">Player Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Role Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-300">Player Role</label>
          <div className="grid grid-cols-2 gap-2">
            {roles.map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`p-2 rounded-lg font-semibold transition-all capitalize ${
                  role === r
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Team Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-300">Team</label>
          <select
            value={team}
            onChange={(e) => setTeam(e.target.value)}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
          >
            {teams.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Stats Preview */}
        <div className="bg-slate-700/50 rounded-lg p-4 space-y-2">
          <h3 className="font-semibold text-amber-400">Starting Stats</h3>
          <div className="text-sm space-y-1 text-slate-300">
            <p>⚾ Batting: {role === 'bowler' ? 45 : 75}</p>
            <p>🎯 Bowling: {role === 'batsman' ? 45 : 75}</p>
            <p>🏃 Fielding: 65</p>
            <p>💪 Fitness: 80</p>
          </div>
        </div>

        {/* Create Button */}
        <button
          onClick={handleCreate}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
        >
          ✅ Create Player
        </button>
      </div>
    </div>
  );
}
