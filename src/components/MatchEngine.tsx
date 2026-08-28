import React, { useState, useEffect, useRef } from 'react';
import { 
  Trophy, 
  Flame, 
  Target, 
  Zap, 
  ChevronRight, 
  ShieldAlert, 
  RotateCcw,
  Sparkles,
  Award,
  CircleDot,
  FastForward,
  Compass,
  Sliders,
  Shield,
  Activity,
  CheckCircle2,
  Pause,
  Play,
  Volume2,
  VolumeX,
  Radio,
  BarChart2,
  ListOrdered,
  Layers,
  X,
  Users,
  Swords,
  ChevronDown,
  Gauge,
  Eye,
  EyeOff,
  ArrowLeftRight,
  Minimize2,
  Maximize2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  PlayerProfile, 
  MatchState, 
  ShotOption, 
  BowlingOption, 
  BallOutcome, 
  PitchCondition, 
  WeatherCondition, 
  DRSReviewData,
  MatchDifficulty,
  PlayingXIPlayer
} from '../types/cricket';
import { 
  BATTING_SHOTS, 
  BOWLING_DELIVERIES, 
  resolveBattingDelivery, 
  resolveBowlingDelivery,
  MomentumBonus 
} from '../utils/matchSimulation';
import { getStartingXIForTeam } from '../utils/teamRosters';
import { cricketAudio } from '../utils/audio';
import { Cricket3DStadium, CameraViewMode } from './Cricket3DStadium';
import { DRSReviewModal } from './DRSReviewModal';
import { WeatherAtmosphereOverlay } from './WeatherAtmosphereOverlay';

interface MatchEngineProps {
  player: PlayerProfile;
  matchState: MatchState;
  onUpdateMatch: (match: MatchState) => void;
  onFinishMatch: (updatedPlayer: PlayerProfile, finalMatch: MatchState) => void;
  lang: 'en' | 'bn';
  onExitToHub?: () => void;
}

type ShotArchetype = 'LOFTED' | 'GROUND' | 'DEFENSE' | 'ADVANCE' | 'SPECIAL';
type FootworkType = 'FRONT_FOOT' | 'BACK_FOOT';

interface DirectionZone {
  id: string;
  name: string;
  nameBn: string;
  angle: number; // degrees
  label: string;
  shortLabel: string;
}

const DIRECTION_ZONES: DirectionZone[] = [
  { id: 'STRAIGHT', name: 'Straight / Long-On', nameBn: 'সোজা ড্রাইভ', angle: 0, label: '⬆️ Straight', shortLabel: 'STR' },
  { id: 'COVER', name: 'Cover / Extra-Cover', nameBn: 'কভার ড্রাইভ', angle: 60, label: '↗️ Cover', shortLabel: 'COV' },
  { id: 'POINT', name: 'Point / Third-Man', nameBn: 'পয়েন্ট / কাট', angle: 110, label: '➡️ Point', shortLabel: 'PNT' },
  { id: 'FINE_LEG', name: 'Fine Leg / Ramp', nameBn: 'ফাইন লেগ / স্কুপ', angle: 175, label: '↘️ Fine-Leg', shortLabel: 'LEG' },
  { id: 'SQUARE_LEG', name: 'Square Leg / Pull', nameBn: 'স্কয়ার লেগ', angle: 250, label: '⬅️ Sq. Leg', shortLabel: 'SQL' },
  { id: 'MID_WICKET', name: 'Deep Mid-Wicket', nameBn: 'মিড-উইকেট', angle: 290, label: '↙️ Mid-Wkt', shortLabel: 'MID' },
  { id: 'LONG_OFF', name: 'Long-Off Loft', nameBn: 'লং-অফ লফটেড', angle: 330, label: '↖️ Long-Off', shortLabel: 'OFF' },
];

export const MatchEngine: React.FC<MatchEngineProps> = ({
  player,
  matchState,
  onUpdateMatch,
  onFinishMatch,
  lang,
  onExitToHub,
}) => {
  const matchContainerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const handleToggleFullscreen = () => {
    if (!matchContainerRef.current) return;
    if (!document.fullscreenElement) {
      matchContainerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  // Calculate current momentum tier & dynamic stat boost
  const getMomentumBonus = (momentum: number, isSurge: boolean): MomentumBonus => {
    if (isSurge || momentum >= 100) {
      return {
        powerBoost: 18,
        timingBoost: 16,
        placementBoost: 14,
        isSurgeActive: true,
      };
    } else if (momentum >= 60) {
      return {
        powerBoost: 10,
        timingBoost: 8,
        placementBoost: 6,
        isSurgeActive: false,
      };
    } else if (momentum >= 30) {
      return {
        powerBoost: 4,
        timingBoost: 3,
        placementBoost: 2,
        isSurgeActive: false,
      };
    }
    return {
      powerBoost: 0,
      timingBoost: 0,
      placementBoost: 0,
      isSurgeActive: false,
    };
  };
  // Real Cricket Controls State
  const [controlDockSide, setControlDockSide] = useState<'RIGHT' | 'LEFT'>('RIGHT');
  const [isControlsCollapsed, setIsControlsCollapsed] = useState<boolean>(false);
  const [selectedDirection, setSelectedDirection] = useState<DirectionZone>(DIRECTION_ZONES[1]); // Cover default
  const [shotArchetype, setShotArchetype] = useState<ShotArchetype>('GROUND');
  const [footwork, setFootwork] = useState<FootworkType>('FRONT_FOOT');
  const [isAutoAssistTiming, setIsAutoAssistTiming] = useState<boolean>(true); // Easy 1-Tap Play

  // Bowling Controls State
  const [selectedBowling, setSelectedBowling] = useState<BowlingOption>(BOWLING_DELIVERIES[0]);
  const [bowlingLength, setBowlingLength] = useState<'YORKER' | 'FULL' | 'GOOD_LENGTH' | 'SHORT' | 'BOUNCER'>('GOOD_LENGTH');
  const [bowlingLine, setBowlingLine] = useState<'OUTSIDE_OFF' | 'OFF_STUMP' | 'MIDDLE_LEG'>('OFF_STUMP');
  const [fieldPreset, setFieldPreset] = useState<'ATTACKING' | 'BALANCED' | 'DEFENSIVE'>('BALANCED');

  const [isBowlingMode, setIsBowlingMode] = useState<boolean>(player.role === 'BOWLER');
  const [cameraMode, setCameraMode] = useState<CameraViewMode>('BROADCAST');

  // Pause Menu State
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [pauseMenuTab, setPauseMenuTab] = useState<'SCORECARD' | 'ROSTER' | 'WAGON' | 'COMMENTARY' | 'CONDITIONS'>('SCORECARD');
  const [rosterTeamView, setRosterTeamView] = useState<'USER' | 'OPP'>('USER');

  // Interactive Timing Meter state
  const [timingPosition, setTimingPosition] = useState<number>(0.5);
  const [isTimingActive, setIsTimingActive] = useState<boolean>(true);
  const timingDirectionRef = useRef<'UP' | 'DOWN'>('UP');
  const animFrameRef = useRef<number | null>(null);

  // Last ball animation outcome & DRS
  const [lastOutcome, setLastOutcome] = useState<BallOutcome | null>(null);
  const [isAnimatingDelivery, setIsAnimatingDelivery] = useState<boolean>(false);
  const [drsData, setDrsData] = useState<DRSReviewData | null>(null);

  // Milestone Celebrations State
  const [hasCelebrated50, setHasCelebrated50] = useState<boolean>(matchState.userRuns >= 50);
  const [hasCelebrated100, setHasCelebrated100] = useState<boolean>(matchState.userRuns >= 100);
  const [milestoneCelebration, setMilestoneCelebration] = useState<{
    type: '50' | '100';
    title: string;
    sub: string;
  } | null>(null);

  // Over Completion & Bowling Change Alert State
  const [activeOverAlert, setActiveOverAlert] = useState<string | null>(null);
  const [bowlingChangeModal, setBowlingChangeModal] = useState<{
    overNumber: number;
    newBowler: PlayingXIPlayer;
    runsInOver: number;
    wicketsInOver: number;
  } | null>(null);

  // Initialize Starting 11 Lineups & Difficulty if not yet populated
  useEffect(() => {
    let needsUpdate = false;
    let userSquad = matchState.userTeamLineup;
    let oppSquad = matchState.oppTeamLineup;
    let diff = matchState.difficulty || 'MEDIUM';
    let currentBowler = matchState.currentBowler;
    let nonStriker = matchState.nonStriker;

    if (!userSquad || userSquad.length === 0) {
      userSquad = getStartingXIForTeam(matchState.userTeam, player);
      needsUpdate = true;
    }
    if (!oppSquad || oppSquad.length === 0) {
      oppSquad = getStartingXIForTeam(matchState.oppTeam);
      needsUpdate = true;
    }
    if (!currentBowler) {
      // Pick leading bowler from opposition squad
      const oppBowlers = oppSquad.filter(p => p.role === 'BOWLER' || p.role === 'ALL_ROUNDER');
      currentBowler = oppBowlers[0]?.name || 'M. Starc';
      needsUpdate = true;
    }
    if (!nonStriker) {
      const partner = userSquad.find(p => !p.isUser);
      nonStriker = partner?.name || 'Opening Partner';
      needsUpdate = true;
    }

    if (needsUpdate) {
      onUpdateMatch({
        ...matchState,
        userTeamLineup: userSquad,
        oppTeamLineup: oppSquad,
        difficulty: diff,
        currentBowler,
        nonStriker,
        currentOverRuns: matchState.currentOverRuns ?? 0,
        currentOverWickets: matchState.currentOverWickets ?? 0,
      });
    }
  }, []);

  // Timing Meter rhythmic animation loop
  useEffect(() => {
    if (matchState.isMatchFinished || !isTimingActive || isAutoAssistTiming || isPaused) return;

    let pos = timingPosition;
    const speed = 0.038 + (100 - player.attributes.timing) * 0.00015;

    const animateTiming = () => {
      if (timingDirectionRef.current === 'UP') {
        pos += speed;
        if (pos >= 1.0) {
          pos = 1.0;
          timingDirectionRef.current = 'DOWN';
        }
      } else {
        pos -= speed;
        if (pos <= 0.0) {
          pos = 0.0;
          timingDirectionRef.current = 'UP';
        }
      }
      setTimingPosition(pos);
      animFrameRef.current = requestAnimationFrame(animateTiming);
    };

    animFrameRef.current = requestAnimationFrame(animateTiming);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [matchState.isMatchFinished, isTimingActive, isAutoAssistTiming, isPaused, player.attributes.timing]);

  // Compute matched ShotOption from Direction & Archetype
  const getCalculatedShot = (): ShotOption => {
    let powerMult = 1.0;
    let sweetSpot = 0.35;
    let risk: 'VERY_LOW' | 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME' = 'MEDIUM';
    let shotTypeStr: ShotOption['shotType'] = 'DRIVE';

    if (shotArchetype === 'DEFENSE') {
      powerMult = 0.2;
      sweetSpot = 0.55;
      risk = 'VERY_LOW';
      shotTypeStr = 'DEFENSE';
    } else if (shotArchetype === 'LOFTED') {
      powerMult = 1.45;
      sweetSpot = 0.22;
      risk = 'HIGH';
      shotTypeStr = 'LOFTED_SIX';
    } else if (shotArchetype === 'ADVANCE') {
      powerMult = 1.35;
      sweetSpot = 0.25;
      risk = 'HIGH';
      shotTypeStr = 'LOFTED_SIX';
    } else if (shotArchetype === 'SPECIAL') {
      powerMult = 1.5;
      sweetSpot = 0.18;
      risk = 'EXTREME';
      shotTypeStr = selectedDirection.id === 'FINE_LEG' ? 'RAMP_SCOOP' : 'HELICOPTER';
    } else {
      // GROUND
      powerMult = 0.95;
      sweetSpot = 0.38;
      risk = 'LOW';
      if (selectedDirection.id === 'POINT') shotTypeStr = 'CUT';
      else if (selectedDirection.id === 'SQUARE_LEG') shotTypeStr = 'PULL';
      else if (selectedDirection.id === 'FINE_LEG') shotTypeStr = 'SWEEP';
      else shotTypeStr = 'DRIVE';
    }

    return {
      id: `shot_${selectedDirection.id}_${shotArchetype}`,
      name: `${shotArchetype} to ${selectedDirection.name}`,
      nameBn: `${selectedDirection.nameBn} (${shotArchetype})`,
      direction: selectedDirection.angle,
      shotType: shotTypeStr,
      riskLevel: risk,
      powerMultiplier: powerMult,
      sweetSpotWidth: sweetSpot,
    };
  };

  // Change Match Difficulty
  const handleSetDifficulty = (diff: MatchDifficulty) => {
    cricketAudio.playUiClick();
    onUpdateMatch({
      ...matchState,
      difficulty: diff,
    });
  };

  // Execute Batting Shot in real-time
  const handlePlayShot = () => {
    if (isAnimatingDelivery || matchState.isMatchFinished || matchState.userIsOut || isPaused) return;

    setIsAnimatingDelivery(true);
    const activeShot = getCalculatedShot();

    // Auto-assist vs Pro timing score
    const timingScore = isAutoAssistTiming 
      ? 0.46 + (player.attributes.timing / 100) * 0.08 + (Math.random() * 0.04 - 0.02)
      : timingPosition;

    const momentumBonus = getMomentumBonus(
      matchState.momentum || 0,
      matchState.isMomentumSurgeActive || false
    );

    const outcome = resolveBattingDelivery(
      activeShot,
      BOWLING_DELIVERIES[Math.floor(Math.random() * BOWLING_DELIVERIES.length)],
      timingScore,
      player,
      matchState.pitch,
      matchState.currentBowler,
      matchState.difficulty || 'MEDIUM',
      momentumBonus
    );

    // Audio & Feedback
    if (outcome.isWicket) {
      cricketAudio.playWicketSound();
      if (Math.random() > 0.65 && (outcome.wicketType === 'LBW' || outcome.wicketType === 'CAUGHT_BEHIND')) {
        setTimeout(() => {
          setDrsData({
            isOpen: true,
            type: outcome.wicketType as 'LBW' | 'CAUGHT_BEHIND',
            pitching: 'IN_LINE',
            impact: 'IN_LINE',
            wickets: 'HITTING',
            snickoSpike: outcome.wicketType === 'CAUGHT_BEHIND',
            originalDecision: 'OUT',
            finalDecision: 'OUT',
            ballSpeedKmh: Math.floor(138 + Math.random() * 12),
          });
        }, 1000);
      }
    } else if (outcome.runs === 6) {
      cricketAudio.playBatHit('PERFECT');
      setTimeout(() => cricketAudio.playCrowdCheer('MAXIMUM_SIX'), 180);
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    } else if (outcome.runs === 4) {
      cricketAudio.playBatHit('PERFECT');
      setTimeout(() => cricketAudio.playCrowdCheer('BOUNDARY_FOUR'), 180);
    } else if (outcome.runs > 0) {
      cricketAudio.playBatHit(outcome.shotQuality === 'GOOD' ? 'GOOD' : 'MISTIMED');
    } else {
      cricketAudio.playBatHit('DEFENSE');
    }

    setLastOutcome(outcome);

    setTimeout(() => {
      applyBallOutcomeToMatch(outcome, false);
      setIsAnimatingDelivery(false);
    }, 650);
  };

  // Execute Bowling Delivery
  const handleBowlDelivery = () => {
    if (isAnimatingDelivery || matchState.isMatchFinished || isPaused) return;

    setIsAnimatingDelivery(true);
    const customBowling: BowlingOption = {
      ...selectedBowling,
      length: bowlingLength,
      line: bowlingLine,
    };

    const momentumBonus = getMomentumBonus(
      matchState.momentum || 0,
      matchState.isMomentumSurgeActive || false
    );

    const outcome = resolveBowlingDelivery(
      customBowling, 
      player, 
      matchState.pitch, 
      matchState.difficulty || 'MEDIUM',
      momentumBonus
    );

    if (outcome.isWicket) {
      cricketAudio.playWicketSound();
      setTimeout(() => cricketAudio.playCrowdCheer('BOUNDARY_FOUR'), 250);
    } else if (outcome.runs === 0) {
      cricketAudio.playAppealSound();
    } else {
      cricketAudio.playBatHit('GOOD');
    }

    setLastOutcome(outcome);

    setTimeout(() => {
      applyBallOutcomeToMatch(outcome, true);
      setIsAnimatingDelivery(false);
    }, 650);
  };

  // Fast Sim Remaining Balls
  const handleQuickSimRemaining = () => {
    if (matchState.isMatchFinished) return;
    cricketAudio.playUiClick();
    setIsPaused(false);

    let currentMatch = { ...matchState };
    const maxBalls = matchState.totalOvers * 6;

    while (currentMatch.balls < maxBalls && !currentMatch.isMatchFinished) {
      const outcome = isBowlingMode
        ? resolveBowlingDelivery(selectedBowling, player, currentMatch.pitch, currentMatch.difficulty || 'MEDIUM')
        : resolveBattingDelivery(
            getCalculatedShot(),
            BOWLING_DELIVERIES[Math.floor(Math.random() * BOWLING_DELIVERIES.length)],
            0.48,
            player,
            currentMatch.pitch,
            currentMatch.currentBowler,
            currentMatch.difficulty || 'MEDIUM'
          );

      const nextBalls = currentMatch.balls + 1;
      const nextRuns = currentMatch.runs + outcome.runs;
      const nextWickets = currentMatch.wickets + (outcome.isWicket ? 1 : 0);

      let isOut = currentMatch.userIsOut;
      let userRuns = currentMatch.userRuns;
      let userBalls = currentMatch.userBalls;
      let userFours = currentMatch.userFours;
      let userSixes = currentMatch.userSixes;
      let userWickets = currentMatch.userBowlingWickets;
      let userRunsConceded = currentMatch.userBowlingRuns;
      let userOvers = currentMatch.userOversBowled;

      if (!isBowlingMode && !isOut) {
        userBalls += 1;
        userRuns += outcome.runs;
        if (outcome.runs === 4) userFours += 1;
        if (outcome.runs === 6) userSixes += 1;
        if (outcome.isWicket) isOut = true;
      }

      if (isBowlingMode) {
        if (outcome.isWicket) userWickets += 1;
        userRunsConceded += outcome.runs;
        userOvers += 0.1;
      }

      let isFinished = false;
      let matchResult = '';
      let matchResultBn = '';

      if (currentMatch.target && nextRuns >= currentMatch.target) {
        isFinished = true;
        matchResult = `${currentMatch.userTeam} won by ${10 - nextWickets} wickets!`;
        matchResultBn = `${currentMatch.userTeam} ${10 - nextWickets} উইকেটে জয়লাভ করেছে!`;
      } else if (nextWickets >= 10 || nextBalls >= maxBalls) {
        isFinished = true;
        if (currentMatch.target) {
          matchResult = `${currentMatch.oppTeam} won by ${currentMatch.target - nextRuns - 1} runs!`;
          matchResultBn = `${currentMatch.oppTeam} ${currentMatch.target - nextRuns - 1} রানে জয়লাভ করেছে!`;
        } else {
          matchResult = `Innings finished. Total: ${nextRuns}/${nextWickets}`;
          matchResultBn = `ইনিংস শেষ। মোট রান: ${nextRuns}/${nextWickets}`;
        }
      }

      currentMatch = {
        ...currentMatch,
        balls: nextBalls,
        runs: nextRuns,
        wickets: nextWickets,
        userRuns,
        userBalls,
        userFours,
        userSixes,
        userIsOut: isOut,
        userBowlingWickets: userWickets,
        userBowlingRuns: userRunsConceded,
        userOversBowled: Number(userOvers.toFixed(1)),
        isMatchFinished: isFinished,
        matchResult,
        matchResultBn,
      };

      if (isFinished) break;
    }

    onUpdateMatch(currentMatch);
    if (currentMatch.isMatchFinished) {
      finalizeMatchRewards(currentMatch);
    }
  };

  const applyBallOutcomeToMatch = (outcome: BallOutcome, wasBowling: boolean) => {
    const nextBalls = matchState.balls + 1;
    const nextRuns = matchState.runs + outcome.runs;
    const nextWickets = matchState.wickets + (outcome.isWicket ? 1 : 0);
    const maxBalls = matchState.totalOvers * 6;

    let userRuns = matchState.userRuns;
    let userBalls = matchState.userBalls;
    let userFours = matchState.userFours;
    let userSixes = matchState.userSixes;
    let userIsOut = matchState.userIsOut;
    let userDismissal = matchState.userDismissal;

    let userWickets = matchState.userBowlingWickets;
    let userBowlingRuns = matchState.userBowlingRuns;
    let userOvers = matchState.userOversBowled;

    let currentOverRuns = (matchState.currentOverRuns ?? 0) + outcome.runs;
    let currentOverWickets = (matchState.currentOverWickets ?? 0) + (outcome.isWicket ? 1 : 0);

    if (!wasBowling && !userIsOut) {
      userBalls += 1;
      userRuns += outcome.runs;
      if (outcome.runs === 4) userFours += 1;
      if (outcome.runs === 6) userSixes += 1;
      if (outcome.isWicket) {
        userIsOut = true;
        userDismissal = outcome.wicketType || 'CAUGHT';
      }
    }

    if (wasBowling) {
      if (outcome.isWicket) userWickets += 1;
      userBowlingRuns += outcome.runs;
      userOvers += 0.1;
    }

    // ==========================================
    // MOMENTUM METER SYSTEM & SURGE LOGIC
    // ==========================================
    let currentMomentum = matchState.momentum ?? 0;
    let isSurgeActive = matchState.isMomentumSurgeActive ?? false;
    let surgeBallsLeft = matchState.momentumSurgeBallsLeft ?? 0;

    if (isSurgeActive) {
      surgeBallsLeft = Math.max(0, surgeBallsLeft - 1);
      if (surgeBallsLeft <= 0) {
        isSurgeActive = false;
        currentMomentum = 40; // baseline flow state after surge
      }
    } else {
      if (!wasBowling) {
        if (outcome.runs === 6) {
          currentMomentum += 28;
        } else if (outcome.runs === 4) {
          currentMomentum += 18;
        } else if (outcome.runs >= 2) {
          currentMomentum += 10;
        } else if (outcome.runs === 1) {
          currentMomentum += 5;
        } else if (outcome.runs === 0 && (!outcome.distanceMetres || outcome.distanceMetres <= 6)) {
          currentMomentum += 3;
        } else if (outcome.runs === 0 && outcome.shotQuality === 'MISTIMED') {
          currentMomentum = Math.max(0, currentMomentum - 8);
        }
        if (outcome.isWicket) {
          currentMomentum = 0;
        }
      } else {
        if (outcome.isWicket) {
          currentMomentum += 35;
        } else if (outcome.runs === 0) {
          currentMomentum += 12;
        } else if (outcome.runs === 1 || outcome.runs === 2) {
          currentMomentum += 2;
        } else if (outcome.runs === 4) {
          currentMomentum = Math.max(0, currentMomentum - 12);
        } else if (outcome.runs === 6) {
          currentMomentum = Math.max(0, currentMomentum - 20);
        }
      }

      currentMomentum = Math.min(100, Math.max(0, currentMomentum));

      if (currentMomentum >= 100) {
        isSurgeActive = true;
        surgeBallsLeft = 6;
        cricketAudio.playFanfare();
        confetti({ particleCount: 65, spread: 80, origin: { y: 0.55 } });
      }
    }

    // ==========================================
    // MILESTONE CELEBRATIONS (50 & 100 RUNS)
    // ==========================================
    if (!wasBowling) {
      if (userRuns >= 50 && !hasCelebrated50) {
        setHasCelebrated50(true);
        setMilestoneCelebration({
          type: '50',
          title: lang === 'bn' ? '🎉 অনবদ্য অর্ধশতক (৫০ রান)!' : '🎉 SENSATIONAL HALF-CENTURY (50 RUNS)!',
          sub: lang === 'bn' 
            ? `${player.name} মাত্র ${userBalls} বলে গর্জন তুলে ৫০ রান পূর্ণ করলেন!` 
            : `${player.name} raises the bat to the roaring crowd for a masterclass 50 off ${userBalls} balls!`
        });
        cricketAudio.playCrowdCheer('MAXIMUM_SIX');
        confetti({ particleCount: 75, spread: 80, origin: { y: 0.5 } });
      } else if (userRuns >= 100 && !hasCelebrated100) {
        setHasCelebrated100(true);
        setMilestoneCelebration({
          type: '100',
          title: lang === 'bn' ? '👑 ঐতিহাসিক শতক (১০০ রান)!' : '👑 HISTORIC CENTURY (100 RUNS)!',
          sub: lang === 'bn'
            ? `${player.name} মাত্র ${userBalls} বলে অমর সেঞ্চুরি রচনা করলেন!`
            : `${player.name} reaches an unforgettable century off ${userBalls} deliveries in front of a standing ovation!`
        });
        cricketAudio.playCrowdCheer('VICTORY');
        cricketAudio.playFanfare();
        confetti({ particleCount: 120, spread: 100, origin: { y: 0.4 } });
      }
    }

    // ==========================================
    // AUTOMATIC BOWLING CHANGE AT END OF OVER
    // ==========================================
    let nextBowler = matchState.currentBowler;
    let nextOverIndex = matchState.currentBowlerIndex ?? 0;
    let lastOverSummary = matchState.lastOverSummary;

    if (nextBalls > 0 && nextBalls % 6 === 0 && nextBalls < maxBalls && nextWickets < 10) {
      const completedOverNum = nextBalls / 6;
      lastOverSummary = `Over ${completedOverNum}: ${currentOverRuns} runs, ${currentOverWickets} wkts`;

      // Select next bowler from opponent squad
      const oppLineup = matchState.oppTeamLineup || getStartingXIForTeam(matchState.oppTeam);
      const eligibleBowlers = oppLineup.filter(p => p.role === 'BOWLER' || p.role === 'ALL_ROUNDER');
      
      if (eligibleBowlers.length > 0) {
        // Rotate to different bowler from the previous over
        nextOverIndex = (nextOverIndex + 1) % eligibleBowlers.length;
        const selected = eligibleBowlers[nextOverIndex];
        nextBowler = selected.name;

        setActiveOverAlert(`OVER ${completedOverNum} DONE • BOWLER CHANGE: ${selected.name}`);
        setBowlingChangeModal({
          overNumber: completedOverNum,
          newBowler: selected,
          runsInOver: currentOverRuns,
          wicketsInOver: currentOverWickets,
        });
      }

      // Reset over counter
      currentOverRuns = 0;
      currentOverWickets = 0;
    }

    const newWagon = [...matchState.wagonWheel];
    if (outcome.shotDirection !== undefined) {
      const rad = ((outcome.shotDirection - 90) * Math.PI) / 180;
      const r = Math.min(48, ((outcome.distanceMetres || 40) / 100) * 48);
      newWagon.push({
        x: 50 + r * Math.cos(rad),
        y: 50 + r * Math.sin(rad),
        runs: outcome.runs,
        shotType: getCalculatedShot().name,
      });
    }

    let isMatchFinished = false;
    let matchResult = '';
    let matchResultBn = '';

    if (matchState.target && nextRuns >= matchState.target) {
      isMatchFinished = true;
      matchResult = `${matchState.userTeam} clinched victory by ${10 - nextWickets} wickets!`;
      matchResultBn = `${matchState.userTeam} ${10 - nextWickets} উইকেটে জয়লাভ করেছে!`;
    } else if (nextWickets >= 10 || nextBalls >= maxBalls) {
      isMatchFinished = true;
      if (matchState.target) {
        const diff = matchState.target - nextRuns - 1;
        matchResult = diff === 0 ? 'Match Tied!' : `${matchState.oppTeam} won by ${diff} runs!`;
        matchResultBn = diff === 0 ? 'ম্যাচ টাই হয়েছে!' : `${matchState.oppTeam} ${diff} রানে জয়ী হয়েছে!`;
      } else {
        matchResult = `Innings Complete: ${nextRuns}/${nextWickets}`;
        matchResultBn = `ইনিংস সমাপ্ত: ${nextRuns}/${nextWickets}`;
      }
    }

    const updatedMatch: MatchState = {
      ...matchState,
      balls: nextBalls,
      runs: nextRuns,
      wickets: nextWickets,
      userRuns,
      userBalls,
      userFours,
      userSixes,
      userIsOut,
      userDismissal,
      userBowlingWickets: userWickets,
      userBowlingRuns,
      userOversBowled: Number(userOvers.toFixed(1)),
      ballHistory: [outcome, ...matchState.ballHistory.slice(0, 19)],
      wagonWheel: newWagon,
      currentBowler: nextBowler,
      currentBowlerIndex: nextOverIndex,
      currentOverRuns,
      currentOverWickets,
      lastOverSummary,
      momentum: currentMomentum,
      isMomentumSurgeActive: isSurgeActive,
      momentumSurgeBallsLeft: surgeBallsLeft,
      isMatchFinished,
      matchResult,
      matchResultBn,
    };

    onUpdateMatch(updatedMatch);

    if (isMatchFinished) {
      finalizeMatchRewards(updatedMatch);
    }
  };

  const finalizeMatchRewards = (finalMatch: MatchState) => {
    cricketAudio.playCrowdCheer('VICTORY');
    cricketAudio.playFanfare();
    confetti({ particleCount: 80, spread: 90, origin: { y: 0.5 } });

    const isWin = finalMatch.matchResult?.includes(finalMatch.userTeam);
    const wonPotm = finalMatch.userRuns >= 45 || finalMatch.userBowlingWickets >= 3;

    const earnedCash = (finalMatch.userRuns * 25) + (finalMatch.userBowlingWickets * 150) + (isWin ? 200 : 50) + player.matchFee;
    const earnedFame = (finalMatch.userRuns * 8) + (finalMatch.userBowlingWickets * 50) + (wonPotm ? 300 : 50);

    const stats = player.stats;
    const nextMatches = stats.matches + 1;
    const nextInnings = stats.innings + (finalMatch.userBalls > 0 ? 1 : 0);
    const nextRuns = stats.runs + finalMatch.userRuns;
    const nextBalls = stats.ballsFaced + finalMatch.userBalls;
    const nextNotOuts = stats.notOuts + (finalMatch.userIsOut ? 0 : 1);
    const nextFours = stats.fours + finalMatch.userFours;
    const nextSixes = stats.sixes + finalMatch.userSixes;
    const next50s = stats.fifties + (finalMatch.userRuns >= 50 && finalMatch.userRuns < 100 ? 1 : 0);
    const next100s = stats.hundreds + (finalMatch.userRuns >= 100 ? 1 : 0);
    const highestScore = Math.max(stats.highestScore, finalMatch.userRuns);

    const nextWickets = stats.wickets + finalMatch.userBowlingWickets;
    const nextRunsConceded = stats.runsConceded + finalMatch.userBowlingRuns;
    const nextOvers = stats.oversBowled + Math.ceil(finalMatch.userOversBowled);

    const updatedPlayer: PlayerProfile = {
      ...player,
      cash: player.cash + earnedCash,
      fame: player.fame + earnedFame,
      energy: Math.max(10, player.energy - 18),
      form: Math.min(99, Math.max(30, player.form + (finalMatch.userRuns >= 30 || finalMatch.userBowlingWickets >= 2 ? 10 : -5))),
      coachTrust: Math.min(99, player.coachTrust + (finalMatch.userRuns >= 20 || isWin ? 8 : -2)),
      stats: {
        ...stats,
        matches: nextMatches,
        innings: nextInnings,
        runs: nextRuns,
        highestScore,
        highestScoreNotOut: finalMatch.userRuns >= stats.highestScore ? !finalMatch.userIsOut : stats.highestScoreNotOut,
        notOuts: nextNotOuts,
        average: nextInnings - nextNotOuts > 0 ? Number((nextRuns / (nextInnings - nextNotOuts)).toFixed(2)) : nextRuns,
        strikeRate: nextBalls > 0 ? Number(((nextRuns / nextBalls) * 100).toFixed(2)) : 0,
        fifties: next50s,
        hundreds: next100s,
        fours: nextFours,
        sixes: nextSixes,
        ballsFaced: nextBalls,
        wickets: nextWickets,
        oversBowled: nextOvers,
        runsConceded: nextRunsConceded,
        bowlingAverage: nextWickets > 0 ? Number((nextRunsConceded / nextWickets).toFixed(2)) : 0,
        economyRate: nextOvers > 0 ? Number((nextRunsConceded / nextOvers).toFixed(2)) : 0,
        playerOfMatch: stats.playerOfMatch + (wonPotm ? 1 : 0),
      },
    };

    onFinishMatch(updatedPlayer, {
      ...finalMatch,
      playerOfMatchName: wonPotm ? player.name : 'Star Performer',
      userEarnedCash: earnedCash,
      userEarnedFame: earnedFame,
    });
  };

  const oversCompleted = Math.floor(matchState.balls / 6);
  const ballsInCurrentOver = matchState.balls % 6;
  const currentRunRate = matchState.balls > 0 ? ((matchState.runs / matchState.balls) * 6).toFixed(2) : '0.00';
  const remainingBalls = (matchState.totalOvers * 6) - matchState.balls;
  const requiredRuns = matchState.target ? matchState.target - matchState.runs : null;
  const requiredRunRate = requiredRuns && remainingBalls > 0 ? ((requiredRuns / remainingBalls) * 6).toFixed(2) : null;
  const isPowerplay = oversCompleted < (matchState.totalOvers <= 5 ? 2 : 6);

  const activeRoster = rosterTeamView === 'USER'
    ? (matchState.userTeamLineup || getStartingXIForTeam(matchState.userTeam, player))
    : (matchState.oppTeamLineup || getStartingXIForTeam(matchState.oppTeam));

  return (
    <div 
      ref={matchContainerRef}
      className={`relative w-full h-full ${isFullscreen ? 'fixed inset-0 z-50 rounded-none min-h-screen' : 'min-h-[580px] sm:min-h-[640px] rounded-3xl'} flex flex-col justify-between overflow-hidden bg-slate-950 border border-amber-500/20 shadow-2xl select-none`}
    >
      {/* ========================================================= */}
      {/* 1. FULL-SCREEN 3D STADIUM CANVAS + DYNAMIC WEATHER OVERLAYS */}
      {/* ========================================================= */}
      <div className="absolute inset-0 z-0">
        <Cricket3DStadium
          player={player}
          lastOutcome={lastOutcome}
          isAnimating={isAnimatingDelivery}
          selectedShot={getCalculatedShot()}
          selectedBowling={selectedBowling}
          isBowlingMode={isBowlingMode}
          userTeam={matchState.userTeam}
          oppTeam={matchState.oppTeam}
          lang={lang}
          cameraMode={cameraMode}
          onCameraChange={setCameraMode}
          matchState={matchState}
          activeMilestone={milestoneCelebration ? milestoneCelebration.title : null}
          activeOverAlert={activeOverAlert}
          isFullscreen={isFullscreen}
          onToggleFullscreen={handleToggleFullscreen}
        />

        {/* Dynamic Pitch and Weather Atmosphere Overlay */}
        <WeatherAtmosphereOverlay
          pitch={matchState.pitch}
          weather={matchState.weather}
          isNightMode={matchState.weather === 'DEW_NIGHT'}
          lang={lang}
        />
      </div>

      {/* ========================================================= */}
      {/* 2. TOP BROADCAST SCOREBOARD & DIFFICULTY / PAUSE HUD */}
      {/* ========================================================= */}
      <div className="relative z-20 p-3 sm:p-4 space-y-2 pointer-events-none">
        {/* Main TV Broadcast Score Bar */}
        <div className="bg-black/80 backdrop-blur-xl border border-white/15 rounded-2xl p-2.5 sm:p-3 shadow-2xl flex items-center justify-between pointer-events-auto">
          {/* Left: Teams, Score & Overs */}
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-bold uppercase tracking-wider text-amber-300 bg-amber-500/20 px-1.5 py-0.5 rounded border border-amber-500/30">
                  {matchState.format.replace('_', ' ')}
                </span>
                {isPowerplay && (
                  <span className="text-[8px] font-black uppercase tracking-wider text-rose-300 bg-rose-500/25 px-1.5 py-0.5 rounded border border-rose-500/40 animate-pulse flex items-center gap-1">
                    <Flame className="w-2.5 h-2.5" /> PP
                  </span>
                )}
                <span className="text-[8px] font-bold uppercase tracking-wider text-cyan-300 bg-cyan-500/20 px-1.5 py-0.5 rounded border border-cyan-500/30">
                  {matchState.difficulty || 'MEDIUM'}
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-xl sm:text-2xl font-black font-teko uppercase tracking-wide text-white">
                  {matchState.userTeam}
                </span>
                <span className="text-2xl sm:text-3xl font-black font-teko text-amber-400">
                  {matchState.runs}/{matchState.wickets}
                </span>
                <span className="text-xs font-mono text-gray-300 font-bold">
                  ({oversCompleted}.{ballsInCurrentOver}/{matchState.totalOvers} ov)
                </span>
              </div>
            </div>
          </div>

          {/* Center Target / RRR info */}
          {matchState.target ? (
            <div className="hidden sm:block text-center px-3 border-x border-white/10">
              <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold block">TARGET: {matchState.target}</span>
              <span className="text-xs font-mono font-bold text-amber-300">
                Need {requiredRuns} off {remainingBalls}b (RRR: {requiredRunRate})
              </span>
            </div>
          ) : (
            <div className="hidden sm:block text-center px-3 border-x border-white/10">
              <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold block">1ST INNINGS</span>
              <span className="text-xs font-mono font-bold text-cyan-300">
                CRR: {currentRunRate} • Proj: {Math.round(Number(currentRunRate) * matchState.totalOvers)}
              </span>
            </div>
          )}

          {/* Right: Quick Difficulty selector + Pause Menu Button */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center bg-white/5 border border-white/10 rounded-xl p-0.5">
              {(['EASY', 'MEDIUM', 'HARD'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => handleSetDifficulty(lvl)}
                  className={`px-2 py-1 rounded-lg text-[9px] font-bold uppercase transition-all ${
                    (matchState.difficulty || 'MEDIUM') === lvl
                      ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  title={`${lvl} Mode`}
                >
                  {lvl === 'EASY' ? '😊 Easy' : lvl === 'MEDIUM' ? '⚡ Pro' : '🔥 Legend'}
                </button>
              ))}
            </div>

            <button
              id="btn-match-pause"
              onClick={() => {
                cricketAudio.playUiClick();
                setIsPaused(true);
              }}
              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 px-3.5 py-2 rounded-xl font-black text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(245,158,11,0.4)] active:scale-95 transition-all"
            >
              <Pause className="w-4 h-4 fill-slate-950" />
              <span>{lang === 'bn' ? 'মেনু / পজ' : 'PAUSE'}</span>
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* DYNAMIC MOMENTUM METER & STAT BOOST DISPLAY HUD */}
        {/* ========================================================= */}
        <div className="bg-black/80 backdrop-blur-xl border border-white/15 rounded-2xl p-2 sm:p-2.5 shadow-2xl flex flex-col gap-1.5 pointer-events-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`p-1 rounded-lg ${(matchState.isMomentumSurgeActive || (matchState.momentum ?? 0) >= 100) ? 'bg-amber-500/20 text-amber-400' : 'bg-white/5 text-cyan-400'}`}>
                <Flame className={`w-3.5 h-3.5 ${(matchState.isMomentumSurgeActive || (matchState.momentum ?? 0) >= 100) ? 'animate-bounce fill-amber-400' : ''}`} />
              </div>
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-gray-200">
                {lang === 'bn' ? 'মোমেন্টাম মিটার' : 'MOMENTUM METER'}
              </span>
              {matchState.isMomentumSurgeActive && (
                <span className="bg-gradient-to-r from-amber-500 to-rose-600 text-slate-950 font-black text-[8.5px] px-2 py-0.5 rounded-full uppercase tracking-widest animate-pulse shadow-[0_0_12px_rgba(245,158,11,0.6)]">
                  SURGE: {matchState.momentumSurgeBallsLeft ?? 6} BALLS LEFT
                </span>
              )}
            </div>

            {/* Current Tier & Stat Boost badge */}
            <div className="flex items-center gap-1 text-[9.5px] sm:text-[10px] font-mono font-bold">
              {(matchState.isMomentumSurgeActive || (matchState.momentum ?? 0) >= 100) ? (
                <span className="text-amber-300 font-black flex items-center gap-1 bg-amber-500/20 px-2 py-0.5 rounded-lg border border-amber-400/40 shadow-[0_0_10px_rgba(245,158,11,0.3)]">
                  🔥 ON FIRE: +18 PWR / +16 TIMING / +14 PLACEMENT
                </span>
              ) : (matchState.momentum ?? 0) >= 60 ? (
                <span className="text-orange-300 font-bold bg-orange-500/20 px-2 py-0.5 rounded-lg border border-orange-500/30">
                  ⚡ HIGH FLOW: +10 PWR / +8 TIMING / +6 PLACE
                </span>
              ) : (matchState.momentum ?? 0) >= 30 ? (
                <span className="text-cyan-300 font-medium bg-cyan-500/10 px-2 py-0.5 rounded-lg border border-cyan-500/20">
                  ✨ IN RHYTHM: +4 PWR / +3 TIMING
                </span>
              ) : (
                <span className="text-gray-400">
                  ❄️ BUILDING FLOW ({matchState.momentum ?? 0}%)
                </span>
              )}
            </div>
          </div>

          {/* Visual Momentum Energy Fill Bar */}
          <div className="relative h-2 sm:h-2.5 bg-gray-950/80 rounded-full overflow-hidden border border-white/10 p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                matchState.isMomentumSurgeActive || (matchState.momentum ?? 0) >= 100
                  ? 'bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 shadow-[0_0_15px_rgba(245,158,11,0.9)] animate-pulse'
                  : (matchState.momentum ?? 0) >= 60
                  ? 'bg-gradient-to-r from-cyan-400 via-amber-400 to-orange-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                  : 'bg-gradient-to-r from-cyan-600 to-cyan-400'
              }`}
              style={{ width: `${Math.min(100, Math.max(4, matchState.momentum ?? 0))}%` }}
            />
          </div>
        </div>

        {/* Batsman Striker + Bowler Broadcast Ribbon */}
        <div className="bg-black/70 backdrop-blur-md rounded-xl p-2 border border-white/10 flex items-center justify-between text-xs pointer-events-auto">
          <div className="flex items-center gap-2">
            <span className="text-base">{player.flag}</span>
            <div>
              <span className="font-bold text-amber-300 flex items-center gap-1 text-[11px] sm:text-xs">
                {player.name} {!matchState.userIsOut && <span className="text-emerald-400">🏏*</span>}
              </span>
              <span className="text-[10px] text-gray-300 font-mono">
                {matchState.userRuns} ({matchState.userBalls}b) • 4s:{matchState.userFours} | 6s:{matchState.userSixes}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[9px] text-gray-400 font-bold uppercase block">ACTIVE BOWLER</span>
            <span className="text-[11px] font-mono text-cyan-300 font-bold flex items-center justify-end gap-1">
              <Zap className="w-3 h-3 text-cyan-400 animate-pulse" />
              {matchState.currentBowler}
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. LIVE COMMENTARY SNIPPET (TV TOAST) */}
      {/* ========================================================= */}
      <div className="relative z-20 px-3 sm:px-4 pointer-events-none">
        <div className="bg-black/70 backdrop-blur-md border border-white/10 rounded-2xl px-3 py-2 max-w-lg mx-auto pointer-events-auto flex items-center gap-2">
          <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse shrink-0" />
          <p className="text-xs text-gray-200 italic line-clamp-1">
            {matchState.ballHistory.length > 0
              ? (lang === 'bn' ? matchState.ballHistory[0].commentaryBn : matchState.ballHistory[0].commentary)
              : (lang === 'bn' ? 'বোলার রান-আপ শুরু করছেন...' : 'Bowler marks their run-up...')}
          </p>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4. ERGONOMIC FLOATING SIDE DOCK CONTROLS (UNOBSTRUCTED VIEW) */}
      {/* ========================================================= */}
      {!matchState.isMatchFinished && !isPaused && (
        <div className="relative z-20 pointer-events-none mt-auto">
          {/* Collapsed Minimal Quick Trigger Bar */}
          {isControlsCollapsed ? (
            <div className={`p-3 pointer-events-auto flex items-center gap-2 ${controlDockSide === 'LEFT' ? 'justify-start' : 'justify-end'}`}>
              <button
                onClick={() => {
                  cricketAudio.playUiClick();
                  setIsControlsCollapsed(false);
                }}
                className="bg-black/80 hover:bg-black backdrop-blur-xl border border-amber-500/40 px-3 py-2.5 rounded-2xl text-amber-300 font-bold text-xs uppercase flex items-center gap-1.5 shadow-2xl active:scale-95 transition-all"
                title="Expand Full Controls"
              >
                <Eye className="w-4 h-4 text-amber-400" />
                <span>{lang === 'bn' ? 'কন্ট্রোল প্যানেল' : 'CONTROLS'}</span>
              </button>

              <button
                id={isBowlingMode ? 'btn-bowl-ball-mini' : 'btn-hit-shot-mini'}
                onClick={isBowlingMode ? handleBowlDelivery : handlePlayShot}
                disabled={isAnimatingDelivery || matchState.userIsOut}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.6)] active:scale-95 transition-all disabled:opacity-50"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>
                  {matchState.userIsOut
                    ? 'OUT'
                    : isBowlingMode
                    ? 'BOWL'
                    : `HIT ${selectedDirection.shortLabel}`}
                </span>
              </button>
            </div>
          ) : (
            /* Full Floating Ergonomic Side Dock */
            <div className={`p-2.5 sm:p-4 flex ${controlDockSide === 'LEFT' ? 'justify-start' : 'justify-end'} pointer-events-auto`}>
              <div className="w-full max-w-[320px] sm:max-w-[340px] bg-slate-950/75 hover:bg-slate-950/90 backdrop-blur-2xl border border-amber-500/35 rounded-3xl p-3 shadow-[0_0_35px_rgba(0,0,0,0.85)] flex flex-col gap-2 transition-all">
                
                {/* Dock Quick Tools & Switch Side Header */}
                <div className="flex items-center justify-between pb-1.5 border-b border-white/10 text-[10px]">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        cricketAudio.playUiClick();
                        setControlDockSide(prev => prev === 'RIGHT' ? 'LEFT' : 'RIGHT');
                      }}
                      className="px-2 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-amber-400 border border-white/10 flex items-center gap-1 transition-all"
                      title={lang === 'bn' ? 'কন্ট্রোল ডক বাম/ডান পরিবর্তন করুন' : 'Switch Dock to Left/Right side'}
                    >
                      <ArrowLeftRight className="w-3 h-3 text-amber-400" />
                      <span>{controlDockSide === 'RIGHT' ? 'Dock Left' : 'Dock Right'}</span>
                    </button>

                    {(player.role === 'ALL_ROUNDER' || player.role === 'BOWLER') && (
                      <button
                        onClick={() => {
                          cricketAudio.playUiClick();
                          setIsBowlingMode(!isBowlingMode);
                        }}
                        className="px-2 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold uppercase transition-all"
                      >
                        {isBowlingMode ? '🏏 Bat' : '⚡ Bowl'}
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    {!isBowlingMode && (
                      <button
                        onClick={() => {
                          cricketAudio.playUiClick();
                          setIsAutoAssistTiming(!isAutoAssistTiming);
                        }}
                        className={`px-2 py-1 rounded-xl font-mono font-bold uppercase border transition-all ${
                          isAutoAssistTiming 
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                            : 'bg-white/5 text-gray-400 border-white/10'
                        }`}
                        title="Toggle Auto Timing Assist"
                      >
                        {isAutoAssistTiming ? '⚡ AUTO' : '🎯 PRO'}
                      </button>
                    )}

                    <button
                      onClick={() => {
                        cricketAudio.playUiClick();
                        setIsControlsCollapsed(true);
                      }}
                      className="p-1 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5 transition-all"
                      title={lang === 'bn' ? 'কন্ট্রোল মিনিমাইজ করুন (ফুল ভিউ)' : 'Minimize Controls for Full 3D View'}
                    >
                      <EyeOff className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Footwork & Elevation Selector */}
                {!isBowlingMode ? (
                  <>
                    {/* Shot Elevation Archetype Tabs */}
                    <div className="grid grid-cols-5 gap-1">
                      {(
                        [
                          ['GROUND', '🎯 Ground'],
                          ['LOFTED', '🚀 Loft'],
                          ['DEFENSE', '🛡️ Defend'],
                          ['ADVANCE', '🏃 Step'],
                          ['SPECIAL', '🔥 Special'],
                        ] as const
                      ).map(([arch, label]) => (
                        <button
                          key={arch}
                          onClick={() => {
                            cricketAudio.playUiClick();
                            setShotArchetype(arch);
                          }}
                          className={`py-1.5 px-0.5 rounded-xl text-[9.5px] font-bold uppercase transition-all border text-center ${
                            shotArchetype === arch
                              ? 'bg-amber-500 text-slate-950 font-black border-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.4)] scale-102'
                              : 'bg-white/5 text-gray-300 border-white/5 hover:bg-white/10'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>

                    {/* Footwork Pill Switch */}
                    <div className="flex items-center gap-1 bg-white/[0.03] p-1 rounded-xl border border-white/5">
                      <button
                        onClick={() => {
                          cricketAudio.playUiClick();
                          setFootwork('FRONT_FOOT');
                        }}
                        className={`flex-1 py-1 rounded-lg text-[9px] font-bold uppercase transition-all text-center ${
                          footwork === 'FRONT_FOOT' ? 'bg-amber-500 text-slate-950 font-black' : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        Front Foot
                      </button>
                      <button
                        onClick={() => {
                          cricketAudio.playUiClick();
                          setFootwork('BACK_FOOT');
                        }}
                        className={`flex-1 py-1 rounded-lg text-[9px] font-bold uppercase transition-all text-center ${
                          footwork === 'BACK_FOOT' ? 'bg-amber-500 text-slate-950 font-black' : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        Back Foot
                      </button>
                    </div>

                    {/* Compact 8-Direction Quick Select Pad */}
                    <div className="grid grid-cols-4 gap-1 bg-white/[0.04] p-1.5 rounded-2xl border border-white/5">
                      {DIRECTION_ZONES.map((zone) => {
                        const isSelected = selectedDirection.id === zone.id;
                        return (
                          <button
                            key={zone.id}
                            onClick={() => {
                              cricketAudio.playUiClick();
                              setSelectedDirection(zone);
                            }}
                            className={`py-1 rounded-xl text-[9px] font-bold uppercase transition-all text-center ${
                              isSelected
                                ? 'bg-amber-500 text-slate-950 font-black shadow-[0_0_8px_rgba(245,158,11,0.4)]'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                            title={zone.name}
                          >
                            {zone.shortLabel}
                          </button>
                        );
                      })}
                    </div>

                    {/* Pro Timing Gauge */}
                    {!isAutoAssistTiming && (
                      <div className="relative h-4 bg-gray-900 rounded-full overflow-hidden border border-white/10">
                        <div className="absolute inset-y-0 left-1/3 right-1/3 bg-emerald-500/40 border-x border-emerald-400 flex items-center justify-center">
                          <span className="text-[7px] font-bold text-emerald-300 uppercase tracking-widest">
                            SWEET SPOT
                          </span>
                        </div>
                        <div
                          style={{ left: `${timingPosition * 100}%` }}
                          className="absolute top-0 bottom-0 w-2.5 bg-amber-400 border-2 border-white rounded-full shadow-[0_0_10px_rgba(245,158,11,0.8)] transform -translate-x-1/2"
                        />
                      </div>
                    )}
                  </>
                ) : (
                  /* Bowling Variation Controls */
                  <div className="space-y-1.5">
                    <div className="grid grid-cols-3 gap-1">
                      {(['YORKER', 'FULL', 'GOOD_LENGTH', 'SHORT', 'BOUNCER'] as const).map((len) => (
                        <button
                          key={len}
                          onClick={() => setBowlingLength(len)}
                          className={`px-1.5 py-1 rounded-lg text-[8.5px] font-bold uppercase border transition-all text-center ${
                            bowlingLength === len ? 'bg-amber-500 text-slate-950 font-black border-amber-400' : 'bg-white/5 text-gray-400 border-white/5'
                          }`}
                        >
                          {len.replace('_', ' ')}
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-1">
                      {BOWLING_DELIVERIES.slice(0, 4).map((del) => (
                        <button
                          key={del.id}
                          onClick={() => setSelectedBowling(del)}
                          className={`px-2 py-1.5 rounded-xl text-[9px] font-bold border transition-all text-left ${
                            selectedBowling.id === del.id
                              ? 'bg-amber-500 text-slate-950 font-black border-amber-400'
                              : 'bg-white/5 text-gray-300 border-white/5'
                          }`}
                        >
                          {del.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Big Ergonomic Execution Button */}
                <button
                  id={isBowlingMode ? 'btn-bowl-ball' : 'btn-hit-shot'}
                  onClick={isBowlingMode ? handleBowlDelivery : handlePlayShot}
                  disabled={isAnimatingDelivery || matchState.userIsOut}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(245,158,11,0.5)] transition-all active:scale-95 disabled:opacity-50"
                >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>
                    {matchState.userIsOut
                      ? (lang === 'bn' ? 'আউট! সিমুলেট করুন' : 'OUT! FAST SIM')
                      : isBowlingMode
                      ? (lang === 'bn' ? 'বল ডেলিভারি করুন' : 'RELEASE DELIVERY')
                      : (lang === 'bn' ? `${selectedDirection.nameBn} শট` : `HIT ${selectedDirection.shortLabel} ${shotArchetype}`)}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. CELEBRATORY MILESTONE ANIMATION (50 / 100 RUNS) */}
      {/* ========================================================= */}
      {milestoneCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md pointer-events-auto animate-in fade-in zoom-in duration-300">
          <div className="relative max-w-md w-full bg-gradient-to-b from-amber-500/20 via-slate-950 to-slate-950 border-2 border-amber-400 rounded-3xl p-6 shadow-[0_0_60px_rgba(245,158,11,0.8)] text-center overflow-hidden">
            {/* Glowing Backdrop Ray */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-400/30 rounded-full blur-3xl pointer-events-none" />

            <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-3xl shadow-[0_0_25px_rgba(245,158,11,0.6)] animate-bounce">
              {milestoneCelebration.type === '100' ? '👑' : '🎉'}
            </div>

            <h2 className="mt-4 text-2xl sm:text-3xl font-black font-teko uppercase tracking-wider text-amber-300 drop-shadow-[0_0_15px_rgba(245,158,11,0.8)]">
              {milestoneCelebration.title}
            </h2>

            <p className="mt-2 text-sm text-gray-200 leading-relaxed font-sans">
              {milestoneCelebration.sub}
            </p>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={() => setMilestoneCelebration(null)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all"
              >
                {lang === 'bn' ? 'ধন্যবাদ / খেলা চালিয়ে যান' : 'CONTINUE BATTING 🏏'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5.5 BOWLING CHANGE ALERT MODAL (END OF OVER) */}
      {/* ========================================================= */}
      {bowlingChangeModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm pointer-events-auto animate-in fade-in duration-200">
          <div className="relative max-w-sm w-full bg-slate-950 border border-cyan-500/40 rounded-3xl p-5 shadow-[0_0_40px_rgba(6,182,212,0.4)] text-center">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-2xl text-cyan-300">
              🔄
            </div>

            <span className="mt-2 inline-block text-[10px] font-mono uppercase font-bold text-cyan-400 tracking-widest bg-cyan-500/10 px-2 py-0.5 rounded-md">
              END OF OVER {bowlingChangeModal.overNumber}.0
            </span>

            <h3 className="mt-2 text-xl font-bold font-teko uppercase tracking-wider text-white">
              {lang === 'bn' ? 'বোলিং পরিবর্তন' : 'NEW BOWLER INTRODUCED'}
            </h3>

            <div className="mt-3 bg-white/5 border border-white/10 rounded-2xl p-3 text-left flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center font-black text-cyan-300 text-sm">
                #{bowlingChangeModal.newBowler.jerseyNumber}
              </div>
              <div className="flex-1">
                <div className="font-bold text-white text-sm">{bowlingChangeModal.newBowler.name}</div>
                <div className="text-[10px] text-gray-300">
                  {bowlingChangeModal.newBowler.bowlingStyle || 'Right-arm Fast'} • Rating: <span className="text-amber-400 font-bold">{bowlingChangeModal.newBowler.rating}</span>
                </div>
              </div>
            </div>

            <div className="mt-2 text-[11px] font-mono text-gray-400">
              Over Summary: <span className="text-amber-300 font-bold">{bowlingChangeModal.runsInOver} Runs</span>, <span className="text-rose-400 font-bold">{bowlingChangeModal.wicketsInOver} Wkts</span>
            </div>

            <button
              onClick={() => setBowlingChangeModal(null)}
              className="mt-4 w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all active:scale-95 shadow-md"
            >
              {lang === 'bn' ? 'পরবর্তী ওভার শুরু করুন' : 'START OVER'}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. DEDICATED IN-MATCH PAUSE & ROSTER SCORECARD MODAL */}
      {/* ========================================================= */}
      {isPaused && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-2xl flex items-center justify-center p-4">
          <div className="bg-[#0b0f19] border border-amber-500/40 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.25)] text-white">
            {/* Pause Menu Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 font-black text-sm">
                  ⏸️
                </div>
                <div>
                  <h2 className="text-lg font-bold font-teko uppercase tracking-wider text-white">
                    {lang === 'bn' ? 'ম্যাচ পজ ও স্ট্যাটস হাব' : 'MATCH PAUSE & ANALYTICS HUB'}
                  </h2>
                  <span className="text-[10px] text-amber-400 font-mono font-bold uppercase">
                    {matchState.userTeam} vs {matchState.oppTeam} • {matchState.runs}/{matchState.wickets} ({oversCompleted}.{ballsInCurrentOver} ov)
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  cricketAudio.playUiClick();
                  setIsPaused(false);
                }}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sub-Tabs */}
            <div className="flex items-center gap-1 p-2 bg-black/40 border-b border-white/10 overflow-x-auto">
              {(
                [
                  ['SCORECARD', '📊 Scorecard', 'স্কোরকার্ড'],
                  ['ROSTER', '👥 Starting 11', 'প্লেয়িং ১১ স্কোয়াড'],
                  ['WAGON', '🎯 Wagon Wheel', 'ওয়াগন হুইল'],
                  ['COMMENTARY', '🎙️ Commentary', 'ধারাভাষ্য'],
                  ['CONDITIONS', '🌦️ Pitch & Weather', 'কন্ডিশন'],
                ] as const
              ).map(([tab, labelEn, labelBn]) => (
                <button
                  key={tab}
                  onClick={() => {
                    cricketAudio.playUiClick();
                    setPauseMenuTab(tab);
                  }}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    pauseMenuTab === tab
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {lang === 'bn' ? labelBn : labelEn}
                </button>
              ))}
            </div>

            {/* Modal Body Content */}
            <div className="p-4 overflow-y-auto flex-1 space-y-4 text-xs">
              {/* TAB 1: SCORECARD */}
              {pauseMenuTab === 'SCORECARD' && (
                <div className="space-y-3">
                  <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-3">
                    <h3 className="font-bold text-amber-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                      <span>{matchState.userTeam} Batting Scorecard</span>
                      <span className="text-[10px] font-mono text-gray-400">{matchState.runs}/{matchState.wickets} ({oversCompleted}.{ballsInCurrentOver} ov)</span>
                    </h3>
                    <div className="space-y-1.5 font-mono text-gray-300">
                      <div className="flex justify-between py-1.5 px-2 bg-amber-500/10 border border-amber-500/20 rounded-xl font-bold text-white">
                        <span className="flex items-center gap-1.5">
                          <span>{player.name}</span>
                          {!matchState.userIsOut ? <span className="text-emerald-400">🏏* (Not Out)</span> : <span className="text-rose-400 text-[10px]">b {matchState.currentBowler}</span>}
                        </span>
                        <span>{matchState.userRuns} ({matchState.userBalls}b) - 4s:{matchState.userFours} 6s:{matchState.userSixes} SR:{matchState.userBalls > 0 ? ((matchState.userRuns / matchState.userBalls) * 100).toFixed(1) : '0.0'}</span>
                      </div>
                      <div className="flex justify-between py-1 px-2 border-b border-white/5 text-gray-400">
                        <span>{matchState.nonStriker} *</span>
                        <span>24 (18b) - 4s:3 6s:0</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-3">
                    <h3 className="font-bold text-cyan-300 uppercase tracking-wider mb-2">Opposition Bowling Figures</h3>
                    <div className="space-y-1.5 font-mono text-gray-300">
                      <div className="flex justify-between py-1.5 px-2 bg-cyan-500/10 border border-cyan-500/20 rounded-xl font-bold text-white">
                        <span>{matchState.currentBowler} (Active)</span>
                        <span>{oversCompleted}.{ballsInCurrentOver} ov • {matchState.runs} runs • {matchState.wickets} wkt</span>
                      </div>
                      {matchState.lastOverSummary && (
                        <div className="text-[10px] text-gray-400 italic px-2">
                          Recent: {matchState.lastOverSummary}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Difficulty & Gameplay Options in Pause */}
                  <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-3">
                    <h3 className="font-bold text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Gauge className="w-3.5 h-3.5" />
                      <span>{lang === 'bn' ? 'খেলার জটিলতা পরিবর্তন' : 'MATCH DIFFICULTY SETTING'}</span>
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                      {(['EASY', 'MEDIUM', 'HARD'] as const).map((lvl) => (
                        <button
                          key={lvl}
                          onClick={() => handleSetDifficulty(lvl)}
                          className={`p-2 rounded-xl text-xs font-bold border transition-all text-center ${
                            (matchState.difficulty || 'MEDIUM') === lvl
                              ? 'bg-amber-500 text-slate-950 font-black border-amber-400 shadow-md'
                              : 'bg-white/5 text-gray-300 border-white/5 hover:bg-white/10'
                          }`}
                        >
                          <div>{lvl === 'EASY' ? '😊 Easy' : lvl === 'MEDIUM' ? '⚡ Medium' : '🔥 Hard'}</div>
                          <div className="text-[9px] opacity-75 font-normal mt-0.5">
                            {lvl === 'EASY' ? 'Forgiving Sweetspot' : lvl === 'MEDIUM' ? 'Standard Pro' : 'Lethal Bowlers'}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: STARTING 11 ROSTER */}
              {pauseMenuTab === 'ROSTER' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setRosterTeamView('USER')}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                          rosterTeamView === 'USER'
                            ? 'bg-amber-500 text-slate-950 font-black'
                            : 'bg-white/5 text-gray-400 hover:text-white'
                        }`}
                      >
                        {matchState.userTeam} (11)
                      </button>
                      <button
                        onClick={() => setRosterTeamView('OPP')}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                          rosterTeamView === 'OPP'
                            ? 'bg-cyan-500 text-slate-950 font-black'
                            : 'bg-white/5 text-gray-400 hover:text-white'
                        }`}
                      >
                        {matchState.oppTeam} (11)
                      </button>
                    </div>
                    <span className="text-[10px] text-gray-400 font-mono">Official Starting XI</span>
                  </div>

                  <div className="divide-y divide-white/5 bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden">
                    {activeRoster.map((playerItem, idx) => (
                      <div
                        key={playerItem.id}
                        className={`p-2.5 flex items-center justify-between transition-colors ${
                          playerItem.isUser ? 'bg-amber-500/15 text-amber-200' : 'hover:bg-white/[0.03]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-mono font-bold text-gray-400">
                            {idx + 1}
                          </span>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-white text-xs">{playerItem.name}</span>
                              {playerItem.isCaptain && (
                                <span className="text-[8px] bg-amber-500 text-slate-950 font-black px-1 rounded">C</span>
                              )}
                              {playerItem.isWicketKeeper && (
                                <span className="text-[8px] bg-cyan-500 text-slate-950 font-black px-1 rounded">WK</span>
                              )}
                              {playerItem.isUser && (
                                <span className="text-[8px] bg-emerald-500 text-slate-950 font-black px-1 rounded">YOU</span>
                              )}
                            </div>
                            <div className="text-[10px] text-gray-400">
                              {playerItem.role} • {playerItem.battingStyle || 'Right Hand'}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-[9px] uppercase tracking-wider text-gray-400 block">Rating</span>
                          <span className="font-mono font-black text-amber-400 text-sm">
                            {playerItem.rating}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: WAGON WHEEL */}
              {pauseMenuTab === 'WAGON' && (
                <div className="flex flex-col items-center justify-center p-2">
                  <div className="relative w-56 h-56 bg-emerald-950/30 rounded-full border border-emerald-500/40 flex items-center justify-center overflow-hidden shadow-inner">
                    <div className="w-36 h-36 border border-dashed border-emerald-400/30 rounded-full" />
                    <div className="w-4 h-14 bg-amber-800/40 rounded-sm" />

                    {matchState.wagonWheel.map((shot, idx) => (
                      <div
                        key={idx}
                        style={{ left: `${shot.x}%`, top: `${shot.y}%` }}
                        className={`absolute w-2.5 h-2.5 rounded-full transform -translate-x-1/2 -translate-y-1/2 ${
                          shot.runs === 6 ? 'bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]' : shot.runs === 4 ? 'bg-emerald-400' : 'bg-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono mt-2">
                    {matchState.wagonWheel.length} shots recorded this innings
                  </span>
                </div>
              )}

              {/* TAB 4: COMMENTARY */}
              {pauseMenuTab === 'COMMENTARY' && (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {matchState.ballHistory.map((b, idx) => (
                    <div key={idx} className="bg-white/[0.02] p-2.5 rounded-xl border border-white/5 flex items-start gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                        b.runs === 6 ? 'bg-amber-500 text-slate-950' : b.runs === 4 ? 'bg-emerald-500 text-slate-950' : b.isWicket ? 'bg-rose-500 text-white' : 'bg-white/10 text-gray-300'
                      }`}>
                        {b.isWicket ? 'W' : `${b.runs}r`}
                      </span>
                      <p className="text-gray-300 text-xs italic">{lang === 'bn' ? b.commentaryBn : b.commentary}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 5: CONDITIONS */}
              {pauseMenuTab === 'CONDITIONS' && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/[0.03] p-3 rounded-xl border border-white/5">
                    <span className="text-gray-400 text-[10px] uppercase font-bold block">Pitch Surface</span>
                    <span className="text-amber-300 font-bold text-sm">{matchState.pitch.replace('_', ' ')}</span>
                  </div>
                  <div className="bg-white/[0.03] p-3 rounded-xl border border-white/5">
                    <span className="text-gray-400 text-[10px] uppercase font-bold block">Weather</span>
                    <span className="text-amber-300 font-bold text-sm">{matchState.weather}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions: Resume, Fast Sim, Quit */}
            <div className="p-4 border-t border-white/10 bg-white/[0.02] flex flex-wrap items-center justify-between gap-2">
              <button
                onClick={handleQuickSimRemaining}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-amber-300 font-bold border border-amber-500/30 active:scale-95 transition-all text-xs"
              >
                <FastForward className="w-4 h-4" />
                <span>{lang === 'bn' ? 'কুইক সিম সম্পূর্ণ ম্যাচ' : 'Fast Sim Match'}</span>
              </button>

              <button
                onClick={() => {
                  cricketAudio.playUiClick();
                  setIsPaused(false);
                }}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black uppercase tracking-wider active:scale-95 transition-all text-xs shadow-lg"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>{lang === 'bn' ? 'খেলা চালিয়ে যান' : 'RESUME MATCH'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 7. DRS REVIEW MODAL (WHEN TRIGGERED) */}
      {/* ========================================================= */}
      {drsData && (
        <DRSReviewModal
          drsData={drsData}
          onCompleteReview={() => setDrsData(null)}
          lang={lang}
        />
      )}
    </div>
  );
};

