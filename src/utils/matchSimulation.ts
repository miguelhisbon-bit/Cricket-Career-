import { 
  PlayerProfile, 
  ShotOption, 
  BowlingOption, 
  BallOutcome, 
  PitchCondition, 
  WeatherCondition,
  MatchFormat,
  MatchDifficulty
} from '../types/cricket';
import { generateCricketCommentary } from './commentary';

export const BATTING_SHOTS: ShotOption[] = [
  {
    id: 'shot_defense',
    name: 'Solid Front-Foot Defense',
    nameBn: 'নিখুঁত আত্মরক্ষামূলক ব্লক',
    direction: 0,
    shotType: 'DEFENSE',
    riskLevel: 'VERY_LOW',
    powerMultiplier: 0.1,
    sweetSpotWidth: 0.5,
  },
  {
    id: 'shot_cover_drive',
    name: 'Classic Cover Drive',
    nameBn: 'ক্ল্যাসিক কভার ড্রাইভ',
    direction: 60,
    shotType: 'DRIVE',
    riskLevel: 'LOW',
    powerMultiplier: 0.9,
    sweetSpotWidth: 0.35,
  },
  {
    id: 'shot_straight_drive',
    name: 'Glorious Straight Drive',
    nameBn: 'চোখ জুড়ানো সোজা ড্রাইভ',
    direction: 0,
    shotType: 'DRIVE',
    riskLevel: 'LOW',
    powerMultiplier: 0.95,
    sweetSpotWidth: 0.35,
  },
  {
    id: 'shot_pull',
    name: 'Ferocious Pull Shot',
    nameBn: 'বজ্রগতির পুল শট',
    direction: 250,
    shotType: 'PULL',
    riskLevel: 'MEDIUM',
    powerMultiplier: 1.1,
    sweetSpotWidth: 0.28,
  },
  {
    id: 'shot_cut',
    name: 'Late Cut / Square Cut',
    nameBn: 'লেট কাট / স্কয়ার কাট',
    direction: 110,
    shotType: 'CUT',
    riskLevel: 'MEDIUM',
    powerMultiplier: 0.85,
    sweetSpotWidth: 0.3,
  },
  {
    id: 'shot_sweep',
    name: 'Swept to Deep Midwicket',
    nameBn: 'ঝাঁপিয়ে সুইপ শট',
    direction: 230,
    shotType: 'SWEEP',
    riskLevel: 'MEDIUM',
    powerMultiplier: 0.95,
    sweetSpotWidth: 0.28,
  },
  {
    id: 'shot_lofted_six',
    name: 'Lofted Downtown Six',
    nameBn: 'লফটেড আকাশচুম্বী ছক্কা',
    direction: 15,
    shotType: 'LOFTED_SIX',
    riskLevel: 'HIGH',
    powerMultiplier: 1.4,
    sweetSpotWidth: 0.2,
  },
  {
    id: 'shot_helicopter',
    name: 'Signature Helicopter Shot',
    nameBn: 'স্বাক্ষরিত হেলিকপ্টার শট',
    direction: 300,
    shotType: 'HELICOPTER',
    riskLevel: 'HIGH',
    powerMultiplier: 1.5,
    sweetSpotWidth: 0.18,
  },
  {
    id: 'shot_ramp',
    name: 'Ramp / Dilscoop over Keeper',
    nameBn: 'দিলস্কুপ / র‍্যাম্প শট',
    direction: 175,
    shotType: 'RAMP_SCOOP',
    riskLevel: 'EXTREME',
    powerMultiplier: 1.25,
    sweetSpotWidth: 0.15,
  },
];

export const BOWLING_DELIVERIES: BowlingOption[] = [
  {
    id: 'bowl_good_length',
    name: 'Good Length Outswinger',
    nameBn: 'গুড লেন্থ আউটসুইংগার',
    length: 'GOOD_LENGTH',
    line: 'OFF_STUMP',
    variation: 'OUTSWINGER',
    speedKmh: 138,
    wicketChance: 0.18,
    riskOfRuns: 0.25,
  },
  {
    id: 'bowl_searing_yorker',
    name: 'Toe-Crushing Yorker',
    nameBn: 'পায়ের পাতা তাক করা নিখুঁত ইয়র্কার',
    length: 'YORKER',
    line: 'MIDDLE_LEG',
    variation: 'STANDARD',
    speedKmh: 145,
    wicketChance: 0.28,
    riskOfRuns: 0.15,
  },
  {
    id: 'bowl_nasty_bouncer',
    name: 'Helmet-Hunting Bouncer',
    nameBn: '১৫০ কিমি বাউন্সার',
    length: 'BOUNCER',
    line: 'MIDDLE_LEG',
    variation: 'STANDARD',
    speedKmh: 148,
    wicketChance: 0.22,
    riskOfRuns: 0.35,
  },
  {
    id: 'bowl_slower_knuckle',
    name: 'Deceptive Slower Knuckleball',
    nameBn: 'ধোঁকা দেওয়া স্লোয়ার নাকেল বল',
    length: 'FULL',
    line: 'OUTSIDE_OFF',
    variation: 'KNUCKLE_SLOWER',
    speedKmh: 114,
    wicketChance: 0.24,
    riskOfRuns: 0.22,
  },
  {
    id: 'bowl_mystery_spin',
    name: 'Sharp Turning Googly / Doosra',
    nameBn: 'রহস্যময় গুগলি / দুসরা',
    length: 'GOOD_LENGTH',
    line: 'OFF_STUMP',
    variation: 'GOOGLY',
    speedKmh: 92,
    wicketChance: 0.25,
    riskOfRuns: 0.2,
  },
];

export interface MomentumBonus {
  powerBoost: number;
  timingBoost: number;
  placementBoost: number;
  isSurgeActive: boolean;
}

export function resolveBattingDelivery(
  shot: ShotOption,
  bowlerBall: BowlingOption,
  timingScore: number, // 0.0 to 1.0 (from interactive timing slider / tap)
  player: PlayerProfile,
  pitch: PitchCondition,
  bowlerName: string = 'Starc',
  difficulty: MatchDifficulty = 'MEDIUM',
  momentumBonus?: MomentumBonus
): BallOutcome {
  const attrs = player.attributes;
  
  // Apply Momentum Stat Boosts if active
  const effPower = attrs.power + (momentumBonus?.powerBoost || 0);
  const effTiming = attrs.timing + (momentumBonus?.timingBoost || 0);
  const effPlacement = attrs.shotPlacement + (momentumBonus?.placementBoost || 0);

  // Calculate timing accuracy with difficulty & momentum surge scaling
  const centerDiff = Math.abs(timingScore - 0.5); // 0 is dead center (perfect)
  let timingQuality: 'PERFECT' | 'GOOD' | 'EARLY' | 'LATE' | 'MISTIMED';

  const surgeBonus = momentumBonus?.isSurgeActive ? 0.06 : 0;
  const perfectThreshold = (difficulty === 'EASY' ? 0.14 : difficulty === 'HARD' ? 0.045 : 0.075) + surgeBonus;
  const goodThreshold = (difficulty === 'EASY' ? 0.28 : difficulty === 'HARD' ? 0.12 : 0.18) + surgeBonus;

  if (centerDiff <= perfectThreshold) {
    timingQuality = 'PERFECT';
  } else if (centerDiff <= goodThreshold) {
    timingQuality = 'GOOD';
  } else if (timingScore < 0.32) {
    timingQuality = 'EARLY';
  } else if (timingScore > 0.68) {
    timingQuality = 'LATE';
  } else {
    timingQuality = 'MISTIMED';
  }

  // Factor in effective player attributes & difficulty modifiers
  const timingBonus = (effTiming - 50) / 100 + (difficulty === 'EASY' ? 0.15 : difficulty === 'HARD' ? -0.15 : 0);
  const powerBonus = (effPower - 50) / 100 + (difficulty === 'EASY' ? 0.12 : 0);
  const placementBonus = (effPlacement - 50) / 100;

  // Shot match with ball length & variation
  let shotSuitability = 1.0;
  if (bowlerBall.length === 'BOUNCER') {
    if (shot.shotType === 'PULL' || shot.shotType === 'RAMP_SCOOP') {
      shotSuitability = 1.35;
    } else if (shot.shotType === 'DRIVE') {
      shotSuitability = 0.35; // Very risky to drive a bouncer
    } else if (shot.shotType === 'DEFENSE') {
      shotSuitability = 0.9;
    }
  } else if (bowlerBall.length === 'YORKER') {
    if (shot.shotType === 'DEFENSE' || shot.shotType === 'HELICOPTER') {
      shotSuitability = 1.3;
    } else if (shot.shotType === 'PULL' || shot.shotType === 'CUT') {
      shotSuitability = 0.25; // Fatal to pull or cut a yorker
    }
  } else if (bowlerBall.length === 'GOOD_LENGTH') {
    if (shot.shotType === 'DEFENSE' || shot.shotType === 'DRIVE') {
      shotSuitability = 1.15;
    } else if (shot.shotType === 'RAMP_SCOOP') {
      shotSuitability = 0.5;
    }
  }

  // Pitch impact
  let pitchFactor = 1.0;
  if (pitch === 'GREEN_SEAM' && (bowlerBall.variation === 'OUTSWINGER' || bowlerBall.variation === 'INSWINGER')) {
    pitchFactor = 0.85;
  } else if (pitch === 'FLAT_ROAD') {
    pitchFactor = 1.15;
  } else if (pitch === 'DUSTY_TURN' && (bowlerBall.variation === 'GOOGLY' || bowlerBall.variation === 'DOOSRA')) {
    pitchFactor = 0.82;
  }

  // ============================================================
  // 1. DEFENSE SHOT HANDLING
  // ============================================================
  if (shot.shotType === 'DEFENSE') {
    const isWicket = (timingQuality === 'MISTIMED' || timingQuality === 'LATE') && (Math.random() < (difficulty === 'EASY' ? 0.02 : difficulty === 'HARD' ? 0.14 : 0.06));
    const wicketType = isWicket ? (bowlerBall.length === 'YORKER' ? 'BOWLED' : 'CAUGHT_BEHIND') : undefined;
    const runs = isWicket ? 0 : (Math.random() < 0.22 ? 1 : 0);
    const comm = generateCricketCommentary({ wicketType }, player.name, bowlerName, runs, isWicket, shot.name);

    return {
      runs,
      isWicket,
      wicketType,
      isExtra: false,
      commentary: comm.en,
      commentaryBn: comm.bn,
      shotQuality: timingQuality,
      distanceMetres: runs > 0 ? 16 : 3,
      shotDirection: shot.direction,
    };
  }

  // ============================================================
  // 2. ATTACKING / GROUND / LOFTED / POWER SHOT CALCULATION
  // ============================================================
  const timingAccuracyScore = Math.max(0, 1 - centerDiff * (difficulty === 'EASY' ? 1.6 : difficulty === 'HARD' ? 2.8 : 2.2));
  const executionScore = timingAccuracyScore * shotSuitability * pitchFactor + (timingBonus * 0.2) + (placementBonus * 0.2);

  let runs = 0;
  let isWicket = false;
  let wicketType: BallOutcome['wicketType'];
  let distanceMetres = 0;

  const isLoftedOrPowerShot = shot.shotType === 'LOFTED_SIX' || shot.shotType === 'HELICOPTER' || shot.shotType === 'RAMP_SCOOP' || shot.powerMultiplier >= 1.25;

  if (isLoftedOrPowerShot) {
    // ============================================================
    // LOFTED / POWER SHOTS (Can be 6, 4, 1, 2, or CAUGHT at boundary)
    // ============================================================
    if (timingQuality === 'PERFECT' && executionScore > 0.82) {
      // Clean Aerial Connection - Maximum SIX!
      runs = 6;
      distanceMetres = Math.round(82 + (effPower * 0.45) + Math.random() * 26);
    } else if (timingQuality === 'GOOD' && executionScore > 0.65) {
      // Good Lofted Strike
      const sixProb = 0.45 + (effPower / 250);
      if (Math.random() < sixProb) {
        runs = 6;
        distanceMetres = Math.round(76 + (effPower * 0.35) + Math.random() * 15);
      } else {
        runs = 4;
        distanceMetres = Math.round(65 + Math.random() * 10);
      }
    } else if (executionScore > 0.42) {
      // Aerial Mistimed / Skied in the air -> high risk of boundary catch
      const catchProb = difficulty === 'EASY' ? 0.22 : difficulty === 'HARD' ? 0.65 : 0.42;
      if (Math.random() < catchProb) {
        isWicket = true;
        wicketType = 'CAUGHT';
        distanceMetres = Math.round(52 + Math.random() * 16);
      } else {
        // Falls in gap for singles or double
        runs = Math.random() < 0.45 ? 2 : 1;
        distanceMetres = runs === 2 ? 42 : 28;
      }
    } else {
      // Sliced / Edge / Bowled
      isWicket = true;
      if (bowlerBall.length === 'YORKER') {
        wicketType = 'BOWLED';
      } else if (bowlerBall.line === 'OFF_STUMP') {
        wicketType = Math.random() < 0.6 ? 'CAUGHT_BEHIND' : 'LBW';
      } else {
        wicketType = 'CAUGHT';
      }
      runs = 0;
      distanceMetres = 12;
    }
  } else {
    // ============================================================
    // GROUND / TIMED SHOTS (Drives, Cuts, Pulls, Flicks, Sweeps)
    // STAYS ALONG THE CARPET: 4, 3, 2, 1, or 0 (NO UNREALISTIC SIXES)
    // ============================================================
    if (timingQuality === 'PERFECT') {
      // Crisp timing through the gap - Boundary 4!
      runs = 4;
      distanceMetres = Math.round(62 + Math.random() * 14);
    } else if (timingQuality === 'GOOD') {
      // Pierced gap or placed for running
      const fourProb = 0.48 + (effPlacement / 300);
      if (Math.random() < fourProb) {
        runs = 4;
        distanceMetres = Math.round(60 + Math.random() * 10);
      } else {
        runs = Math.random() < 0.55 ? 2 : 1;
        distanceMetres = runs === 2 ? 44 : 26;
      }
    } else if (timingQuality === 'EARLY' || timingQuality === 'LATE') {
      // Checked shot / Fielded inside the ring
      const dotProb = 0.5;
      if (Math.random() < dotProb) {
        runs = 0;
        distanceMetres = 10;
      } else {
        runs = 1;
        distanceMetres = 22;
      }
    } else {
      // Mistimed swing
      const wicketProb = difficulty === 'EASY' ? 0.08 : difficulty === 'HARD' ? 0.38 : 0.22;
      if (Math.random() < wicketProb) {
        isWicket = true;
        wicketType = bowlerBall.length === 'YORKER' ? 'BOWLED' : bowlerBall.line === 'OFF_STUMP' ? 'CAUGHT_BEHIND' : 'LBW';
        runs = 0;
        distanceMetres = 4;
      } else {
        runs = 0; // Solid dot ball
        distanceMetres = 6;
      }
    }
  }

  // Calculate wagon wheel coordinates
  const angleRad = ((shot.direction - 90 + (Math.random() * 16 - 8)) * Math.PI) / 180;
  const radius = Math.min(100, (distanceMetres / 110) * 100);
  const x = Math.round(50 + (radius / 2) * Math.cos(angleRad));
  const y = Math.round(50 + (radius / 2) * Math.sin(angleRad));

  const comm = generateCricketCommentary({ wicketType }, player.name, bowlerName, runs, isWicket, shot.name);

  return {
    runs,
    isWicket,
    wicketType,
    isExtra: false,
    commentary: comm.en,
    commentaryBn: comm.bn,
    shotQuality: timingQuality,
    distanceMetres,
    shotDirection: shot.direction,
  };
}

export function resolveBowlingDelivery(
  delivery: BowlingOption,
  player: PlayerProfile,
  pitch: PitchCondition,
  difficulty: MatchDifficulty = 'MEDIUM',
  momentumBonus?: MomentumBonus,
  aiBatsmanSkill: number = 65
): BallOutcome {
  const attrs = player.attributes;
  const accuracyBonus = (attrs.accuracy - 50) / 100 + (difficulty === 'EASY' ? 0.2 : difficulty === 'HARD' ? -0.15 : 0) + (momentumBonus?.isSurgeActive ? 0.15 : 0);
  const deceptionBonus = (attrs.deception - 50) / 100 + (momentumBonus?.isSurgeActive ? 0.12 : 0);
  const swingBonus = (attrs.swingOrTurn - 50) / 100 + (momentumBonus?.isSurgeActive ? 0.12 : 0);

  const bowlQuality = delivery.wicketChance + accuracyBonus * 0.25 + deceptionBonus * 0.15 + swingBonus * 0.15;
  const adjustedSkill = difficulty === 'EASY' ? aiBatsmanSkill - 15 : difficulty === 'HARD' ? aiBatsmanSkill + 12 : aiBatsmanSkill;
  const batsmanHandling = (adjustedSkill / 100) + (Math.random() * 0.4 - 0.2);

  if (bowlQuality > batsmanHandling + 0.10) {
    // Wicket!
    let wicketType: BallOutcome['wicketType'] = 'BOWLED';
    if (delivery.length === 'YORKER') wicketType = 'BOWLED';
    else if (delivery.length === 'BOUNCER') wicketType = 'CAUGHT';
    else if (delivery.variation === 'OUTSWINGER') wicketType = 'CAUGHT_BEHIND';
    else if (delivery.length === 'GOOD_LENGTH') wicketType = 'LBW';

    const comm = generateCricketCommentary({ wicketType }, 'Opposition Batter', player.name, 0, true);
    return {
      runs: 0,
      isWicket: true,
      wicketType,
      isExtra: false,
      commentary: comm.en,
      commentaryBn: comm.bn,
      shotQuality: 'PERFECT',
    };
  } else if (bowlQuality > batsmanHandling - 0.08) {
    // Dot ball / Play and miss
    const comm = generateCricketCommentary({}, 'Opposition Batter', player.name, 0, false);
    return {
      runs: 0,
      isWicket: false,
      isExtra: false,
      commentary: comm.en,
      commentaryBn: comm.bn,
      shotQuality: 'GOOD',
    };
  } else {
    // Conceded runs
    const rand = Math.random();
    let runs = 1;
    if (rand < 0.32) runs = 4;
    else if (rand < 0.55) runs = 2;
    else if (rand < 0.68) runs = 6;

    const comm = generateCricketCommentary({}, 'Opposition Batter', player.name, runs, false);
    return {
      runs,
      isWicket: false,
      isExtra: false,
      commentary: comm.en,
      commentaryBn: comm.bn,
      shotQuality: 'MISTIMED',
    };
  }
}
