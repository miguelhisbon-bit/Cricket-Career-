import { PlayerProfile, TournamentState, LeagueTeamStanding, LeagueFixture, CareerTier } from '../types/cricket';
import { TIER_DETAILS } from './defaultData';

const TOURNAMENT_STORAGE_KEY = 'REAL_CRICKET_TOURNAMENT_V1';

export function initializeTournamentForTier(player: PlayerProfile): TournamentState {
  const tier = player.tier;
  const tierInfo = TIER_DETAILS[tier];
  const allTeams = [...tierInfo.teams];

  // Ensure user team is present in standings
  const hasUserTeam = allTeams.some(t => t.name === player.currentTeam);
  if (!hasUserTeam) {
    allTeams.unshift({ name: player.currentTeam, city: 'Dhaka', strength: 70 });
  }

  // Initialize Standings Table
  const standings: LeagueTeamStanding[] = allTeams.map((team, idx) => ({
    teamName: team.name,
    city: team.city,
    played: 0,
    won: 0,
    lost: 0,
    tied: 0,
    points: 0,
    nrr: 0.00,
    form: [],
    isUserTeam: team.name === player.currentTeam,
    flag: tier === 'INTERNATIONAL' ? '🌐' : '🏏',
  }));

  // Generate Fixtures (Round Robin + Semi/Final)
  const fixtures: LeagueFixture[] = [];
  let matchIdCounter = 1;
  const venues = [
    'Sher-e-Bangla Stadium, Mirpur',
    'ZAC Stadium, Chattogram',
    'Sylhet International Stadium',
    'Melbourne Cricket Ground',
    'Wankhede Stadium, Mumbai',
    'Lord\'s Cricket Ground, London',
  ];

  // Generate round-robin pairings
  const teamNames = allTeams.map(t => t.name);
  let roundNumber = 1;

  for (let i = 0; i < teamNames.length; i++) {
    for (let j = i + 1; j < teamNames.length; j++) {
      const t1 = teamNames[i];
      const t2 = teamNames[j];
      const isUserInvolved = t1 === player.currentTeam || t2 === player.currentTeam;
      const venue = venues[(matchIdCounter - 1) % venues.length];

      fixtures.push({
        id: `fix_${tier}_${matchIdCounter++}`,
        roundName: `Round ${roundNumber}`,
        roundNameBn: `রাউন্ড ${roundNumber}`,
        roundNumber,
        team1: t1,
        team2: t2,
        venue,
        status: 'UPCOMING',
        userMatch: isUserInvolved,
        matchFormat: tier === 'GULLY_STREET' ? 'T5_STREET' : 'T20_CUP',
      });
      roundNumber++;
    }
  }

  // Add Grand Final Fixture
  fixtures.push({
    id: `fix_${tier}_final`,
    roundName: 'Grand Final 🏆',
    roundNameBn: 'গ্র্যান্ড ফাইনাল ট্রফি 🏆',
    roundNumber: roundNumber,
    team1: allTeams[0].name,
    team2: allTeams[1]?.name || allTeams[0].name,
    venue: 'Sher-e-Bangla National Cricket Stadium (Finals Arena)',
    status: 'UPCOMING',
    userMatch: true,
    matchFormat: 'T20_CUP',
  });

  const tournamentName = tierInfo.name;
  const tournamentNameBn = tierInfo.nameBn;

  const state: TournamentState = {
    id: `tour_${tier}_${Date.now()}`,
    tier,
    tournamentName,
    tournamentNameBn,
    seasonYear: 2026,
    standings,
    fixtures,
    currentRound: 1,
    isCompleted: false,
    userTeamRank: 1,
  };

  saveTournamentState(state);
  return state;
}

export function loadSavedTournament(player: PlayerProfile): TournamentState {
  try {
    const raw = localStorage.getItem(TOURNAMENT_STORAGE_KEY);
    if (raw) {
      const parsed: TournamentState = JSON.parse(raw);
      if (parsed.tier === player.tier) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load tournament', e);
  }
  return initializeTournamentForTier(player);
}

export function saveTournamentState(state: TournamentState) {
  try {
    localStorage.setItem(TOURNAMENT_STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save tournament', e);
  }
}

// After a user match finishes, update tournament standings and simulate AI vs AI matches
export function recordMatchInTournament(
  tournament: TournamentState,
  userTeam: string,
  oppTeam: string,
  userWon: boolean,
  userRuns: number,
  oppRuns: number,
  userOvers: number
): TournamentState {
  const updatedStandings = [...tournament.standings];
  
  // 1. Update User team & Opponent team in standings
  const userTeamIndex = updatedStandings.findIndex(t => t.teamName === userTeam);
  const oppTeamIndex = updatedStandings.findIndex(t => t.teamName === oppTeam);

  if (userTeamIndex >= 0) {
    const u = updatedStandings[userTeamIndex];
    u.played += 1;
    if (userWon) {
      u.won += 1;
      u.points += 2;
      u.form = ['W', ...u.form.slice(0, 4)];
    } else {
      u.lost += 1;
      u.form = ['L', ...u.form.slice(0, 4)];
    }
    // Net Run Rate calculation
    const runDiff = (userRuns - oppRuns) / Math.max(1, userOvers);
    u.nrr = Number((u.nrr + runDiff * 0.2).toFixed(2));
  }

  if (oppTeamIndex >= 0) {
    const o = updatedStandings[oppTeamIndex];
    o.played += 1;
    if (!userWon) {
      o.won += 1;
      o.points += 2;
      o.form = ['W', ...o.form.slice(0, 4)];
    } else {
      o.lost += 1;
      o.form = ['L', ...o.form.slice(0, 4)];
    }
    const runDiff = (oppRuns - userRuns) / Math.max(1, userOvers);
    o.nrr = Number((o.nrr + runDiff * 0.2).toFixed(2));
  }

  // 2. Mark current user fixture as completed
  const updatedFixtures = tournament.fixtures.map(f => {
    if ((f.team1 === userTeam && f.team2 === oppTeam) || (f.team1 === oppTeam && f.team2 === userTeam)) {
      if (f.status !== 'COMPLETED') {
        const winner = userWon ? userTeam : oppTeam;
        return {
          ...f,
          status: 'COMPLETED' as const,
          result: `${winner} won by ${userWon ? 'Runs/Wickets' : 'Opposition Margin'}`,
          resultBn: `${winner} বিজয়ী হয়েছে`,
        };
      }
    }
    return f;
  });

  // 3. Simulate other AI fixtures in the same round
  updatedFixtures.forEach(f => {
    if (f.status === 'UPCOMING' && !f.userMatch && f.roundNumber <= tournament.currentRound) {
      const aiWinner = Math.random() > 0.5 ? f.team1 : f.team2;
      const aiLoser = aiWinner === f.team1 ? f.team2 : f.team1;
      f.status = 'COMPLETED';
      f.result = `${aiWinner} won by ${Math.floor(Math.random() * 25 + 5)} runs`;
      f.resultBn = `${aiWinner} বিজয়ী হয়েছে`;

      // Update standings for AI teams
      const wIdx = updatedStandings.findIndex(t => t.teamName === aiWinner);
      const lIdx = updatedStandings.findIndex(t => t.teamName === aiLoser);
      if (wIdx >= 0) {
        updatedStandings[wIdx].played += 1;
        updatedStandings[wIdx].won += 1;
        updatedStandings[wIdx].points += 2;
        updatedStandings[wIdx].form = ['W', ...updatedStandings[wIdx].form.slice(0, 4)];
        updatedStandings[wIdx].nrr = Number((updatedStandings[wIdx].nrr + (Math.random() * 0.6)).toFixed(2));
      }
      if (lIdx >= 0) {
        updatedStandings[lIdx].played += 1;
        updatedStandings[lIdx].lost += 1;
        updatedStandings[lIdx].form = ['L', ...updatedStandings[lIdx].form.slice(0, 4)];
        updatedStandings[lIdx].nrr = Number((updatedStandings[lIdx].nrr - (Math.random() * 0.5)).toFixed(2));
      }
    }
  });

  // Sort Standings: Points DESC, then NRR DESC, then Won DESC
  updatedStandings.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.nrr !== a.nrr) return b.nrr - a.nrr;
    return b.won - a.won;
  });

  const userRank = updatedStandings.findIndex(t => t.teamName === userTeam) + 1;

  const nextRound = tournament.currentRound + 1;
  const isFinished = nextRound > tournament.fixtures.length;

  const finalState: TournamentState = {
    ...tournament,
    standings: updatedStandings,
    fixtures: updatedFixtures,
    currentRound: nextRound,
    isCompleted: isFinished,
    championTeam: isFinished ? updatedStandings[0]?.teamName : undefined,
    userTeamRank: userRank,
  };

  saveTournamentState(finalState);
  return finalState;
}
