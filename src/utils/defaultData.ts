import { PlayerProfile, CareerTier } from '../types/cricket';

export interface CountryInfo {
  name: string;
  nameBn: string;
  code: string;
  flag: string;
  rank: number;
}

export const COUNTRIES: CountryInfo[] = [
  { name: 'Bangladesh', nameBn: 'বাংলাদেশ', code: 'BD', flag: '🇧🇩', rank: 7 },
  { name: 'India', nameBn: 'ভারত', code: 'IN', flag: '🇮🇳', rank: 1 },
  { name: 'Pakistan', nameBn: 'পাকিস্তান', code: 'PK', flag: '🇵🇰', rank: 4 },
  { name: 'Australia', nameBn: 'অস্ট্রেলিয়া', code: 'AU', flag: '🇦🇺', rank: 2 },
  { name: 'England', nameBn: 'ইংল্যান্ড', code: 'ENG', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rank: 3 },
  { name: 'South Africa', nameBn: 'দক্ষিণ আফ্রিকা', code: 'SA', flag: '🇿🇦', rank: 5 },
  { name: 'New Zealand', nameBn: 'নিউজিল্যান্ড', code: 'NZ', flag: '🇳🇿', rank: 6 },
  { name: 'Sri Lanka', nameBn: 'শ্রীলঙ্কা', code: 'SL', flag: '🇱🇰', rank: 8 },
  { name: 'West Indies', nameBn: 'ওয়েস্ট ইন্ডিজ', code: 'WI', flag: '🌴', rank: 9 },
  { name: 'Afghanistan', nameBn: 'আফগানিস্তান', code: 'AFG', flag: '🇦🇫', rank: 10 },
];

export const TIER_DETAILS: Record<CareerTier, {
  name: string;
  nameBn: string;
  badge: string;
  minMatches: number;
  matchFeeBase: number;
  description: string;
  teams: { name: string; city: string; strength: number }[];
}> = {
  GULLY_STREET: {
    name: 'Street & Gully Tape-Ball League',
    nameBn: 'গলি ও স্ট্রিট ক্রিকেট টুর্নামেন্ট',
    badge: '🏏 Street Hero',
    minMatches: 5,
    matchFeeBase: 50,
    description: 'Local raw talent battles on narrow alleyways and school grounds with taped tennis balls.',
    teams: [
      { name: 'Mirpur Thunder 11', city: 'Dhaka', strength: 52 },
      { name: 'Old Town Titans', city: 'Dhaka', strength: 55 },
      { name: 'Agrabad Street Boys', city: 'Chittagong', strength: 50 },
      { name: 'Zindabazar Strikers', city: 'Sylhet', strength: 53 },
    ],
  },
  DISTRICT_U19: {
    name: 'District & Under-19 Championship',
    nameBn: 'জেলা ও অনূর্ধ্ব-১৯ টুর্নামেন্ট',
    badge: '🏆 Academy Prodigy',
    minMatches: 10,
    matchFeeBase: 250,
    description: 'Leather ball cricket on turf wickets under the eyes of state selectors and scouts.',
    teams: [
      { name: 'Dhaka Colts U-19', city: 'Dhaka', strength: 65 },
      { name: 'Chittagong District Academy', city: 'Chittagong', strength: 64 },
      { name: 'Rajshahi Youth XI', city: 'Rajshahi', strength: 66 },
      { name: 'Khulna Young Stars', city: 'Khulna', strength: 63 },
    ],
  },
  DOMESTIC_FC: {
    name: 'National First-Class League',
    nameBn: 'জাতীয় ঘরোয়া ফার্স্ট ক্লাস ট্রফি',
    badge: '🎖️ First-Class Pro',
    minMatches: 15,
    matchFeeBase: 1200,
    description: 'Rigorous 4-day red-ball matches and National One Day Cup alongside seasoned veterans.',
    teams: [
      { name: 'Dhaka Division Platoon', city: 'Dhaka', strength: 76 },
      { name: 'Sylhet Division Strikers', city: 'Sylhet', strength: 74 },
      { name: 'Rajshahi Division Kings', city: 'Rajshahi', strength: 75 },
      { name: 'Rangpur Division Riders', city: 'Rangpur', strength: 77 },
    ],
  },
  PREMIER_LEAGUE: {
    name: 'Mega T20 Premier League Franchise',
    nameBn: 'মেগা টি-টোয়েন্টি ফ্র্যাঞ্চাইজি লিগ',
    badge: '⭐ T20 Franchise Star',
    minMatches: 20,
    matchFeeBase: 5000,
    description: 'High octane stadium floodlights, DJ music, massive broadcast audience and global superstar teammates.',
    teams: [
      { name: 'Dhaka Dynamites', city: 'Dhaka', strength: 86 },
      { name: 'Chattogram Challengers', city: 'Chittagong', strength: 85 },
      { name: 'Comilla Victorians', city: 'Comilla', strength: 88 },
      { name: 'Fortune Barishal', city: 'Barishal', strength: 84 },
      { name: 'Sylhet Sixers', city: 'Sylhet', strength: 83 },
    ],
  },
  INTERNATIONAL: {
    name: 'National Team & World Cup Glory',
    nameBn: 'আন্তর্জাতিক ক্রিকেট ও বিশ্বকাপ',
    badge: '👑 International Legend',
    minMatches: 999,
    matchFeeBase: 15000,
    description: 'Representing your country in front of 80,000 roaring fans in the World Cup and Test Championship.',
    teams: [
      { name: 'Australia National Team', city: 'Melbourne', strength: 93 },
      { name: 'India National Team', city: 'Mumbai', strength: 94 },
      { name: 'England National Team', city: 'London', strength: 91 },
      { name: 'Pakistan National Team', city: 'Lahore', strength: 90 },
      { name: 'South Africa National Team', city: 'Cape Town', strength: 89 },
      { name: 'New Zealand National Team', city: 'Auckland', strength: 88 },
    ],
  },
};

export const INITIAL_PLAYER: PlayerProfile = {
  id: 'player_user_1',
  name: 'Tanvir Hossain',
  nickname: 'The Tiger',
  country: 'Bangladesh',
  countryCode: 'BD',
  flag: '🇧🇩',
  avatar: '🏏',
  age: 18,
  jerseyNumber: 77,
  role: 'BATSMAN',
  battingStyle: 'RIGHT_HAND',
  bowlingStyle: 'RIGHT_ARM_MEDIUM',
  tier: 'GULLY_STREET',
  currentTeam: 'Mirpur Thunder 11',
  nationalTeam: 'Bangladesh',
  
  energy: 100,
  form: 75,
  morale: 80,
  fame: 120,
  coachTrust: 60,
  
  cash: 300,
  matchFee: 50,
  sponsorValue: 0,
  
  equippedBat: 'bat_kashmir',
  equippedShoes: 'default_boots',
  trainerHired: null,
  
  attributes: {
    timing: 62,
    power: 65,
    shotPlacement: 58,
    spinReading: 55,
    paceTolerance: 54,
    runningSpeed: 64,
    
    bowlingPace: 50,
    accuracy: 52,
    swingOrTurn: 48,
    deception: 45,
    
    stamina: 70,
    clutch: 60,
    fielding: 60,
  },
  
  stats: {
    matches: 0,
    innings: 0,
    runs: 0,
    highestScore: 0,
    highestScoreNotOut: false,
    notOuts: 0,
    average: 0,
    strikeRate: 0,
    fifties: 0,
    hundreds: 0,
    fours: 0,
    sixes: 0,
    ballsFaced: 0,
    
    oversBowled: 0,
    maidens: 0,
    runsConceded: 0,
    wickets: 0,
    bestBowlingWickets: 0,
    bestBowlingRuns: 0,
    bowlingAverage: 0,
    economyRate: 0,
    fiveWicketHauls: 0,
    
    catches: 0,
    runOuts: 0,
    playerOfMatch: 0,
    trophiesWon: [],
  },
  careerMilestones: ['Started career in Street Tape-Ball League'],
};

const STORAGE_KEY = 'REAL_CRICKET_CAREER_V1';

export function loadSavedPlayer(): PlayerProfile {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Failed to load saved player', err);
  }
  return INITIAL_PLAYER;
}

export function savePlayerState(player: PlayerProfile) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(player));
  } catch (err) {
    console.error('Failed to save player', err);
  }
}
