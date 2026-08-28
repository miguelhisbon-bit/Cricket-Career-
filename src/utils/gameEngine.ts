import { Player, Match } from '../types/cricket';

export function initializeGame(player: Player): Match {
  const formats: Array<'T5' | 'T10' | 'T20' | 'ODI'> = ['T5', 'T10', 'T20', 'ODI'];
  const opponents = ['India', 'Australia', 'Pakistan', 'West Indies', 'South Africa', 'England'];
  const venues = [
    'Cricket Ground',
    'M.A. Chidambaram Stadium',
    'Arun Jaitley Stadium',
    'Eden Gardens',
    'Narendra Modi Stadium',
  ];

  return {
    id: Date.now().toString(),
    format: formats[Math.floor(Math.random() * formats.length)],
    opponent: opponents[Math.floor(Math.random() * opponents.length)],
    venue: venues[Math.floor(Math.random() * venues.length)],
    tossWon: Math.random() > 0.5,
    batFirst: Math.random() > 0.5,
  };
}

export function simulateBall(player: Player): { runs: number; wicket: boolean } {
  const random = Math.random();
  let runs = 0;
  let wicket = false;
  const skill = player.role === 'batsman' ? player.batting : player.bowling;
  const skillFactor = skill / 100;

  // Adjust probabilities based on player skill
  if (random < 0.05 * (1 - skillFactor * 0.7)) {
    wicket = true;
  } else if (random < 0.15 * (1 - skillFactor * 0.3)) {
    runs = 0;
  } else if (random < 0.35) {
    runs = 1;
  } else if (random < 0.50) {
    runs = 2;
  } else if (random < 0.65) {
    runs = 3;
  } else if (random < 0.85) {
    runs = 4;
  } else {
    runs = 6;
  }

  return { runs, wicket };
}
