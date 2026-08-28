import React, { useState } from 'react';
import { Trophy, Calendar, BarChart3, Award, Sparkles, Play, CheckCircle2, Shield, Flame } from 'lucide-react';
import { PlayerProfile, TournamentState, LeagueFixture } from '../types/cricket';
import { cricketAudio } from '../utils/audio';

interface LeagueTournamentViewProps {
  player: PlayerProfile;
  tournament: TournamentState;
  onPlayFixture: (fixture: LeagueFixture) => void;
  lang: 'en' | 'bn';
}

export const LeagueTournamentView: React.FC<LeagueTournamentViewProps> = ({
  player,
  tournament,
  onPlayFixture,
  lang,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'STANDINGS' | 'FIXTURES' | 'HONOURS'>('STANDINGS');

  const userStanding = tournament.standings.find(s => s.isUserTeam) || tournament.standings[0];
  const userRank = tournament.standings.findIndex(s => s.isUserTeam) + 1;

  // Next upcoming user match
  const nextUserFixture = tournament.fixtures.find(
    f => f.status === 'UPCOMING' && (f.team1 === player.currentTeam || f.team2 === player.currentTeam)
  );

  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto pb-20">
      {/* 1. Header Banner */}
      <div className="bg-white/[0.03] backdrop-blur-xl border border-amber-500/30 rounded-2xl p-5 shadow-[0_0_25px_rgba(245,158,11,0.15)] text-white relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-300 text-2xl shadow-[0_0_15px_rgba(245,158,11,0.25)]">
              🏆
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold font-teko uppercase tracking-wider text-white">
                  {lang === 'bn' ? tournament.tournamentNameBn : tournament.tournamentName}
                </h1>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-mono font-bold px-2 py-0.5 rounded-md border border-amber-500/30">
                  {tournament.seasonYear}
                </span>
              </div>
              <p className="text-[10px] text-amber-400 font-bold uppercase tracking-[0.2em]">
                {lang === 'bn' ? `আপনার দল: ${player.currentTeam}` : `YOUR TEAM: ${player.currentTeam}`}
              </p>
            </div>
          </div>

          {/* Current Rank Badge */}
          <div className="text-right">
            <span className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-bold block">
              {lang === 'bn' ? 'বর্তমান অবস্থান' : 'LEAGUE STANDING'}
            </span>
            <div className="flex items-baseline justify-end gap-1">
              <span className="text-2xl font-mono font-black text-amber-400">#{userRank}</span>
              <span className="text-xs text-gray-400 font-mono">/ {tournament.standings.length}</span>
            </div>
          </div>
        </div>

        {/* Quick Next Match Action Bar */}
        {nextUserFixture && (
          <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs text-gray-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-gray-400">{lang === 'bn' ? 'পরবর্তী ফিক্সচার:' : 'NEXT MATCH:'}</span>
              <span className="font-bold text-white">
                {nextUserFixture.team1 === player.currentTeam ? nextUserFixture.team2 : nextUserFixture.team1}
              </span>
              <span className="text-[10px] text-amber-400 font-mono">({nextUserFixture.roundName})</span>
            </div>

            <button
              onClick={() => {
                cricketAudio.playUiClick();
                onPlayFixture(nextUserFixture);
              }}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-[0.15em] rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.3)] active:scale-95 transition-all flex items-center gap-1.5 ml-auto"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{lang === 'bn' ? 'ম্যাচ খেলুন' : 'PLAY FIXTURE'}</span>
            </button>
          </div>
        )}
      </div>

      {/* 2. Sub-Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
        <button
          onClick={() => {
            cricketAudio.playUiClick();
            setActiveSubTab('STANDINGS');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
            activeSubTab === 'STANDINGS'
              ? 'bg-amber-500 text-slate-950 font-black shadow-[0_0_15px_rgba(245,158,11,0.3)]'
              : 'bg-white/[0.03] text-gray-400 hover:text-white border border-white/5'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>{lang === 'bn' ? 'পয়েন্ট টেবিল' : 'STANDINGS'}</span>
        </button>

        <button
          onClick={() => {
            cricketAudio.playUiClick();
            setActiveSubTab('FIXTURES');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
            activeSubTab === 'FIXTURES'
              ? 'bg-amber-500 text-slate-950 font-black shadow-[0_0_15px_rgba(245,158,11,0.3)]'
              : 'bg-white/[0.03] text-gray-400 hover:text-white border border-white/5'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>{lang === 'bn' ? 'ফিক্সচার শিডিউল' : 'FIXTURES'}</span>
        </button>

        <button
          onClick={() => {
            cricketAudio.playUiClick();
            setActiveSubTab('HONOURS');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
            activeSubTab === 'HONOURS'
              ? 'bg-amber-500 text-slate-950 font-black shadow-[0_0_15px_rgba(245,158,11,0.3)]'
              : 'bg-white/[0.03] text-gray-400 hover:text-white border border-white/5'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>{lang === 'bn' ? 'অরেঞ্জ/পার্পল ক্যাপ' : 'CAPS & LEADERS'}</span>
        </button>
      </div>

      {/* 3. Sub-Tab Content: STANDINGS */}
      {activeSubTab === 'STANDINGS' && (
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span className="font-bold uppercase tracking-[0.2em] text-amber-400 flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              {lang === 'bn' ? 'টুর্নামেন্ট পয়েন্ট টেবিল' : 'OFFICIAL TOURNAMENT POINTS TABLE'}
            </span>
            <span className="text-[10px] text-gray-500">Top 4 Qualify for Playoffs</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 text-[10px] uppercase">
                  <th className="py-2 px-2 text-center">Pos</th>
                  <th className="py-2 px-3">Team</th>
                  <th className="py-2 px-2 text-center">P</th>
                  <th className="py-2 px-2 text-center">W</th>
                  <th className="py-2 px-2 text-center">L</th>
                  <th className="py-2 px-2 text-center text-amber-300 font-bold">PTS</th>
                  <th className="py-2 px-2 text-center">NRR</th>
                  <th className="py-2 px-2 text-center">Form</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {tournament.standings.map((team, idx) => {
                  const isTop4 = idx < 4;
                  return (
                    <tr
                      key={team.teamName}
                      className={`transition-all ${
                        team.isUserTeam
                          ? 'bg-amber-500/15 font-bold text-amber-200'
                          : 'hover:bg-white/[0.02] text-gray-300'
                      }`}
                    >
                      {/* Rank Position */}
                      <td className="py-3 px-2 text-center">
                        <span
                          className={`w-5 h-5 inline-flex items-center justify-center rounded-full text-[10px] font-bold ${
                            idx === 0
                              ? 'bg-amber-500 text-slate-950 font-black'
                              : isTop4
                              ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                              : 'bg-black/40 text-gray-400'
                          }`}
                        >
                          {idx + 1}
                        </span>
                      </td>

                      {/* Team Name */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5 font-sans">
                          <span className="text-sm">{team.flag || '🏏'}</span>
                          <span className={`font-semibold ${team.isUserTeam ? 'text-amber-300' : 'text-white'}`}>
                            {team.teamName}
                          </span>
                          {team.isUserTeam && (
                            <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded uppercase font-mono font-bold">
                              YOU
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-2 text-center text-gray-300">{team.played}</td>
                      <td className="py-3 px-2 text-center text-emerald-400 font-bold">{team.won}</td>
                      <td className="py-3 px-2 text-center text-rose-400">{team.lost}</td>
                      <td className="py-3 px-2 text-center text-amber-300 font-bold text-sm">{team.points}</td>
                      <td className={`py-3 px-2 text-center ${team.nrr >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {team.nrr >= 0 ? `+${team.nrr.toFixed(2)}` : team.nrr.toFixed(2)}
                      </td>

                      {/* Form Guide Circles */}
                      <td className="py-3 px-2 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {team.form.length > 0 ? (
                            team.form.map((res, i) => (
                              <span
                                key={i}
                                className={`w-3.5 h-3.5 rounded-full text-[8px] flex items-center justify-center font-bold font-sans ${
                                  res === 'W'
                                    ? 'bg-emerald-500 text-slate-950'
                                    : 'bg-rose-600 text-white'
                                }`}
                              >
                                {res}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-600 text-[10px]">-</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="pt-2 flex items-center justify-between text-[10px] text-gray-400 border-t border-white/5">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Green: Qualifier / Playoff Zone</span>
            </span>
            <span>2 Points for a Win • 0 for Loss</span>
          </div>
        </div>
      )}

      {/* 4. Sub-Tab Content: FIXTURES */}
      {activeSubTab === 'FIXTURES' && (
        <div className="space-y-3">
          {tournament.fixtures.map((fixture) => {
            const isUserInvolved = fixture.team1 === player.currentTeam || fixture.team2 === player.currentTeam;
            const isUpcoming = fixture.status === 'UPCOMING';

            return (
              <div
                key={fixture.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isUserInvolved
                    ? 'bg-white/[0.04] backdrop-blur-xl border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.1)]'
                    : 'bg-white/[0.02] border-white/5 text-gray-400'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase bg-black/40 text-amber-400 px-2 py-0.5 rounded border border-white/5">
                      {lang === 'bn' ? fixture.roundNameBn : fixture.roundName}
                    </span>
                    <span className="text-[10px] text-gray-400">{fixture.matchFormat}</span>
                  </div>

                  <span
                    className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      fixture.status === 'COMPLETED'
                        ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                        : isUserInvolved
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30 animate-pulse'
                        : 'bg-black/30 text-gray-500'
                    }`}
                  >
                    {fixture.status}
                  </span>
                </div>

                {/* Match Teams VS */}
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-lg">🏏</span>
                    <span className={`text-sm font-bold ${fixture.team1 === player.currentTeam ? 'text-amber-300' : 'text-white'}`}>
                      {fixture.team1}
                    </span>
                  </div>

                  <span className="text-xs font-mono font-black text-amber-400 px-3">VS</span>

                  <div className="flex items-center gap-2 flex-1 justify-end">
                    <span className={`text-sm font-bold ${fixture.team2 === player.currentTeam ? 'text-amber-300' : 'text-white'}`}>
                      {fixture.team2}
                    </span>
                    <span className="text-lg">🏏</span>
                  </div>
                </div>

                {/* Match Result / Venue & Play Button */}
                <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-gray-400 truncate max-w-[200px]">
                    📍 {fixture.venue}
                  </span>

                  {fixture.status === 'COMPLETED' ? (
                    <span className="text-[11px] font-semibold text-emerald-400">
                      {lang === 'bn' ? fixture.resultBn : fixture.result}
                    </span>
                  ) : isUserInvolved ? (
                    <button
                      onClick={() => {
                        cricketAudio.playUiClick();
                        onPlayFixture(fixture);
                      }}
                      className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-md active:scale-95 transition-all flex items-center gap-1"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>{lang === 'bn' ? 'ম্যাচ খেলুন' : 'PLAY NOW'}</span>
                    </button>
                  ) : (
                    <span className="text-[10px] text-gray-500 font-mono">Scheduled</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. Sub-Tab Content: HONOURS / CAPS */}
      {activeSubTab === 'HONOURS' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Orange Cap (Batting Leader) */}
          <div className="bg-gradient-to-br from-amber-950/40 via-black/40 to-black/60 border border-amber-500/40 rounded-2xl p-4 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-amber-400">
              <span className="text-2xl">🧢</span>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.2em]">ORANGE CAP LEADER</h3>
                <span className="text-[10px] text-gray-400">Top Run Scorer in Tournament</span>
              </div>
            </div>

            <div className="bg-black/50 p-3 rounded-xl border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-white block">{player.name}</span>
                <span className="text-[10px] text-amber-400">{player.currentTeam}</span>
              </div>
              <div className="text-right">
                <span className="text-xl font-mono font-bold text-amber-300">{player.stats.runs}</span>
                <span className="text-[10px] text-gray-400 block font-mono">Runs ({player.stats.strikeRate} SR)</span>
              </div>
            </div>
          </div>

          {/* Purple Cap (Bowling Leader) */}
          <div className="bg-gradient-to-br from-purple-950/40 via-black/40 to-black/60 border border-purple-500/40 rounded-2xl p-4 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-purple-400">
              <span className="text-2xl">🧢</span>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.2em]">PURPLE CAP LEADER</h3>
                <span className="text-[10px] text-gray-400">Top Wicket Taker in Tournament</span>
              </div>
            </div>

            <div className="bg-black/50 p-3 rounded-xl border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-white block">
                  {player.stats.wickets > 5 ? player.name : 'Mustafizur Rahman'}
                </span>
                <span className="text-[10px] text-purple-400">{player.currentTeam}</span>
              </div>
              <div className="text-right">
                <span className="text-xl font-mono font-bold text-purple-300">
                  {Math.max(player.stats.wickets, 8)}
                </span>
                <span className="text-[10px] text-gray-400 block font-mono">Wickets (5.8 Econ)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
