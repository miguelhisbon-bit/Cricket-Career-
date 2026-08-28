export type PlayerRole = 'BATSMAN' | 'BOWLER' | 'ALL_ROUNDER' | 'WICKET_KEEPER_BATSMAN';
export type BattingStyle = 'RIGHT_HAND' | 'LEFT_HAND';
export type BowlingStyle = 'RIGHT_ARM_FAST' | 'LEFT_ARM_FAST' | 'RIGHT_ARM_MEDIUM' | 'OFF_SPIN' | 'LEG_SPIN' | 'LEFT_ARM_ORTHODOX';

export type CareerTier = 
  | 'GULLY_STREET'      // Neighborhood tape-ball & street tournament
  | 'DISTRICT_U19'       // District & Under-19 State Championship
  | 'DOMESTIC_FC'       // First-class Trophy & National League
  | 'PREMIER_LEAGUE'    // Mega Franchise T20 Tournament (BPL/IPL/PSL/BBL style)
  | 'INTERNATIONAL';    // National Team (World Cups, Test Mace, Asia Cup)

export interface PlayerAttributes {
  timing: number;        // 30-99: sweet-spot contact chance
  power: number;         // 30-99: boundary distance & six hitting
  shotPlacement: number; // 30-99: finding field gaps
  spinReading: number;   // 30-99: handling turning balls & googlies
  paceTolerance: number; // 30-99: handling 145km/h+ bouncers
  runningSpeed: number;  // 30-99: quick singles, turning 1s into 2s
  
  // Bowling Attributes
  bowlingPace: number;   // 30-99: speed/spin sharpness
  accuracy: number;      // 30-99: hitting line and length
  swingOrTurn: number;   // 30-99: lateral movement in air/off pitch
  deception: number;     // 30-99: slower balls, yorkers, googlies
  
  // Mental & Fitness
  stamina: number;       // 30-99: fatigue resistance in long matches
  clutch: number;        // 30-99: performance under pressure / last over
  fielding: number;      // 30-99: direct hits, catching percentage
}

export interface PlayerStats {
  matches: number;
  innings: number;
  runs: number;
  highestScore: number;
  highestScoreNotOut: boolean;
  notOuts: number;
  average: number;
  strikeRate: number;
  fifties: number;
  hundreds: number;
  fours: number;
  sixes: number;
  ballsFaced: number;
  
  // Bowling
  oversBowled: number;
  maidens: number;
  runsConceded: number;
  wickets: number;
  bestBowlingWickets: number;
  bestBowlingRuns: number;
  bowlingAverage: number;
  economyRate: number;
  fiveWicketHauls: number;
  
  // Fielding
  catches: number;
  runOuts: number;
  
  // Accolades
  playerOfMatch: number;
  trophiesWon: string[];
}

export interface PlayerProfile {
  id: string;
  name: string;
  nickname: string;
  country: string;
  countryCode: string; // 'BD', 'IN', 'PK', 'AU', 'ENG', 'SA', 'WI', 'NZ'
  flag: string;
  avatar: string;
  age: number;
  jerseyNumber: number;
  role: PlayerRole;
  battingStyle: BattingStyle;
  bowlingStyle: BowlingStyle;
  tier: CareerTier;
  currentTeam: string;
  nationalTeam: string;
  
  // Dynamic Condition
  energy: number;      // 0-100
  form: number;        // 0-100 (determines confidence boost)
  morale: number;      // 0-100 (team spirit)
  fame: number;        // 0-100000+ (Fan following)
  coachTrust: number;  // 0-100 (affects selection & batting position)
  
  // Finances
  cash: number;        // In currency
  matchFee: number;
  sponsorValue: number;
  
  // Bat & Equipment equipped
  equippedBat: string;
  equippedShoes: string;
  trainerHired: string | null;
  
  attributes: PlayerAttributes;
  stats: PlayerStats;
  careerMilestones: string[];
}

export interface ShopItem {
  id: string;
  name: string;
  category: 'BAT' | 'GEAR' | 'STAFF' | 'LIFESTYLE';
  price: number;
  description: string;
  icon: string;
  boost: Partial<PlayerAttributes & { energy: number; form: number; fame: number; morale: number; cash: number }>;
  owned: boolean;
}

export type PitchCondition = 'FLAT_ROAD' | 'GREEN_SEAM' | 'DUSTY_TURN' | 'DAMP_SLOW';
export type WeatherCondition = 'SUNNY' | 'OVERCAST' | 'DEW_NIGHT' | 'WINDY';
export type MatchFormat = 'T5_STREET' | 'T10_BLAST' | 'T20_CUP' | 'ODI_50' | 'SUPER_OVER';

export interface ShotOption {
  id: string;
  name: string;
  nameBn: string;
  direction: number; // 0 to 360 degrees (0 = straight, 90 = point, 180 = fine leg, 270 = square leg)
  shotType: 'DEFENSE' | 'DRIVE' | 'PULL' | 'CUT' | 'SWEEP' | 'LOFTED_SIX' | 'RAMP_SCOOP' | 'HELICOPTER';
  riskLevel: 'VERY_LOW' | 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';
  powerMultiplier: number;
  sweetSpotWidth: number; // timing window ease (0.1 to 0.5)
}

export interface BowlingOption {
  id: string;
  name: string;
  nameBn: string;
  length: 'YORKER' | 'FULL' | 'GOOD_LENGTH' | 'SHORT' | 'BOUNCER';
  line: 'OUTSIDE_OFF' | 'OFF_STUMP' | 'MIDDLE_LEG' | 'WIDE_OUTSIDE_OFF';
  variation: 'STANDARD' | 'OUTSWINGER' | 'INSWINGER' | 'KNUCKLE_SLOWER' | 'GOOGLY' | 'DOOSRA' | 'CARROM_BALL';
  speedKmh: number;
  wicketChance: number;
  riskOfRuns: number;
}

export interface PitchMapBall {
  id: string;
  ballNumber: number;
  bowlerName: string;
  isUserBowler: boolean;
  length: 'YORKER' | 'FULL' | 'GOOD_LENGTH' | 'SHORT' | 'BOUNCER';
  line: 'WIDE_OFF' | 'OUTSIDE_OFF' | 'OFF_STUMP' | 'MIDDLE_STUMP' | 'LEG_STUMP' | 'WIDE_LEG';
  pitchX: number; // -1.0 (wide outside off) to +1.0 (wide down leg)
  pitchY: number; // 0.0 (yorker/crease) to 1.0 (short/bouncer)
  speedKmh: number;
  runs: number;
  isWicket: boolean;
  wicketType?: string;
  shotType?: string;
  innings: 1 | 2;
}

export interface BallOutcome {
  runs: number;
  isWicket: boolean;
  wicketType?: 'BOWLED' | 'CAUGHT' | 'LBW' | 'RUN_OUT' | 'STUMPED' | 'CAUGHT_BEHIND';
  isExtra: boolean;
  extraType?: 'WIDE' | 'NO_BALL' | 'BYE' | 'LEG_BYE';
  commentary: string;
  commentaryBn: string;
  shotDirection?: number;
  distanceMetres?: number;
  shotQuality: 'EARLY' | 'LATE' | 'MISTIMED' | 'GOOD' | 'PERFECT';
  fielderLocation?: string;
  pitchMapBall?: PitchMapBall;
}

export type MatchDifficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface PlayingXIPlayer {
  id: string;
  name: string;
  nameBn?: string;
  role: PlayerRole;
  isCaptain?: boolean;
  isViceCaptain?: boolean;
  isWicketKeeper?: boolean;
  isUser?: boolean;
  battingStyle: BattingStyle;
  bowlingStyle: BowlingStyle;
  rating: number;
  jerseyNumber: number;
  // In-match batting state
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  isOut: boolean;
  dismissalInfo?: string;
  // In-match bowling state
  oversBowled: number;
  runsConceded: number;
  wickets: number;
  maidens: number;
}

export interface TeamSquad {
  teamName: string;
  shortName: string;
  city: string;
  flag: string;
  primaryColor: string;
  secondaryColor: string;
  lineup: PlayingXIPlayer[];
}

export interface MatchState {
  id: string;
  title: string;
  format: MatchFormat;
  totalOvers: number;
  pitch: PitchCondition;
  weather: WeatherCondition;
  userTeam: string;
  oppTeam: string;
  difficulty?: MatchDifficulty;
  
  innings: 1 | 2;
  userBattingFirst: boolean;
  
  // Squads / Starting 11
  userTeamLineup?: PlayingXIPlayer[];
  oppTeamLineup?: PlayingXIPlayer[];
  
  // Score state
  runs: number;
  wickets: number;
  balls: number; // balls in current innings
  target: number | null; // null if 1st innings
  
  // User specific player live match score
  userRuns: number;
  userBalls: number;
  userFours: number;
  userSixes: number;
  userIsOut: boolean;
  userDismissal?: string;
  
  // User bowling live match figures
  userOversBowled: number;
  userBowlingRuns: number;
  userBowlingWickets: number;
  userMaidens: number;
  
  // Non-striker and active bowler
  currentBowler: string;
  currentBowlerIndex?: number;
  nonStriker: string;
  partnershipRuns: number;
  
  // Over Tracking & Bowling Change Alerts
  currentOverRuns?: number;
  currentOverWickets?: number;
  lastOverSummary?: string;

  // Momentum Meter & Stats Boost (0 to 100)
  momentum?: number;
  isMomentumSurgeActive?: boolean;
  momentumSurgeBallsLeft?: number;
  
  // Ball history
  ballHistory: BallOutcome[];
  pitchMap?: PitchMapBall[];
  wagonWheel: { x: number; y: number; runs: number; shotType: string }[];
  isMatchFinished: boolean;
  matchResult?: string;
  matchResultBn?: string;
  playerOfMatchName?: string;
  userEarnedCash: number;
  userEarnedFame: number;
}

export interface StoryChoice {
  id: string;
  text: string;
  textBn: string;
  outcomeText: string;
  outcomeTextBn: string;
  impact: {
    energy?: number;
    morale?: number;
    coachTrust?: number;
    fame?: number;
    cash?: number;
    form?: number;
  };
}

export interface StoryEvent {
  id: string;
  title: string;
  titleBn: string;
  category: 'DRESSING_ROOM' | 'MEDIA' | 'PERSONAL' | 'OPPONENT_SLEDGE' | 'SPONSOR';
  description: string;
  descriptionBn: string;
  speaker?: string;
  speakerRole?: string;
  choices: StoryChoice[];
}

export interface PressQuestion {
  id: string;
  journalist: string;
  mediaOutlet: string;
  question: string;
  questionBn: string;
  context: 'VICTORY' | 'DEFEAT' | 'BIG_SCORE' | 'DUCK_FAILURE' | 'CONTROVERSY';
  answers: {
    text: string;
    textBn: string;
    tone: 'HUMBLE' | 'CONFIDENT' | 'AGGRESSIVE' | 'TACTICAL';
    coachImpact: number;
    fanImpact: number;
    moraleImpact: number;
  }[];
}

export interface LeagueTeamStanding {
  teamName: string;
  city: string;
  played: number;
  won: number;
  lost: number;
  tied: number;
  points: number;
  nrr: number; // Net Run Rate e.g. +1.42
  form: ('W' | 'L' | 'D')[];
  isUserTeam: boolean;
  flag?: string;
}

export interface LeagueFixture {
  id: string;
  roundName: string;
  roundNameBn: string;
  roundNumber: number;
  team1: string;
  team2: string;
  venue: string;
  status: 'UPCOMING' | 'COMPLETED' | 'LIVE';
  result?: string;
  resultBn?: string;
  userMatch: boolean;
  matchFormat: MatchFormat;
}

export interface TournamentState {
  id: string;
  tier: CareerTier;
  tournamentName: string;
  tournamentNameBn: string;
  seasonYear: number;
  standings: LeagueTeamStanding[];
  fixtures: LeagueFixture[];
  currentRound: number;
  isCompleted: boolean;
  championTeam?: string;
  userTeamRank?: number;
}

export interface DRSReviewData {
  isOpen: boolean;
  type: 'LBW' | 'CAUGHT_BEHIND';
  pitching: 'IN_LINE' | 'OUTSIDE_LEG' | 'OUTSIDE_OFF';
  impact: 'IN_LINE' | 'OUTSIDE';
  wickets: 'HITTING' | 'MISSING' | 'UMPIRES_CALL';
  snickoSpike: boolean;
  originalDecision: 'OUT' | 'NOT_OUT';
  finalDecision: 'OUT' | 'NOT_OUT';
  ballSpeedKmh: number;
}

