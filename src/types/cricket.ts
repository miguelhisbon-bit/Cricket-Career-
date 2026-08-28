export type GameState = 'menu' | 'create' | 'main' | 'match' | 'stats' | 'shop';

export interface Player {
  id: string;
  name: string;
  role: 'batsman' | 'bowler' | 'allrounder' | 'wicketkeeper';
  batting: number; // 0-100
  bowling: number; // 0-100
  fielding: number; // 0-100
  fitness: number; // 0-100
  age: number;
  team: string;
  careerMatches: number;
  careerRuns: number;
  careerWickets: number;
  money: number;
  equipment: Equipment;
  createdAt: Date;
}

export interface Equipment {
  bat: string;
  gloves: string;
  pads: string;
  helmet: string;
}

export interface Match {
  id: string;
  format: 'T5' | 'T10' | 'T20' | 'ODI';
  opponent: string;
  venue: string;
  tossWon: boolean;
  batFirst: boolean;
}

export interface Statistics {
  matches: number;
  runs: number;
  wickets: number;
  average: number;
  strikeRate: number;
}
