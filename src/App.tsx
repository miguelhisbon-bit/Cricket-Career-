/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  PlayerProfile, 
  MatchState, 
  PressQuestion, 
  MatchFormat, 
  PitchCondition, 
  WeatherCondition,
  TournamentState,
  LeagueFixture
} from './types/cricket';
import { getStartingXIForTeam } from './utils/teamRosters';
import { loadSavedPlayer, savePlayerState, TIER_DETAILS, COUNTRIES } from './utils/defaultData';
import { loadSavedTournament, saveTournamentState, recordMatchInTournament } from './utils/tournamentGenerator';
import { generateDynamicPressQuestions } from './utils/storylines';
import { cricketAudio } from './utils/audio';

import { MobileHeader } from './components/MobileHeader';
import { BottomNav, NavTab } from './components/BottomNav';
import { DashboardView } from './components/DashboardView';
import { MatchEngine } from './components/MatchEngine';
import { LeagueTournamentView } from './components/LeagueTournamentView';
import { TrainingCamp } from './components/TrainingCamp';
import { EquipmentShop } from './components/EquipmentShop';
import { LockerRoomEvents } from './components/LockerRoomEvents';
import { CareerStatsView } from './components/CareerStatsView';
import { PlayerCreationModal } from './components/PlayerCreationModal';
import { PressConferenceModal } from './components/PressConferenceModal';
import { AuctionDraftModal } from './components/AuctionDraftModal';
import { CloudSyncModal } from './components/CloudSyncModal';

export default function App() {
  const [player, setPlayer] = useState<PlayerProfile>(() => loadSavedPlayer());
  const [tournament, setTournament] = useState<TournamentState>(() => loadSavedTournament(player));
  const [activeTab, setActiveTab] = useState<NavTab>('DASHBOARD');
  const [lang, setLang] = useState<'en' | 'bn'>('en');
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Modals
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isAuctionModalOpen, setIsAuctionModalOpen] = useState<boolean>(false);
  const [isPressConferenceOpen, setIsPressConferenceOpen] = useState<boolean>(false);
  const [isCloudSyncOpen, setIsCloudSyncOpen] = useState<boolean>(false);
  const [pressQuestions, setPressQuestions] = useState<PressQuestion[]>([]);

  // Active Match State
  const [matchState, setMatchState] = useState<MatchState | null>(null);

  // Save on changes
  useEffect(() => {
    savePlayerState(player);
  }, [player]);

  useEffect(() => {
    saveTournamentState(tournament);
  }, [tournament]);

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'en' ? 'bn' : 'en'));
  };

  const toggleAudioMute = () => {
    const muted = cricketAudio.toggleMute();
    setIsMuted(muted);
  };

  // Start a new match based on current tier or fixture
  const handleStartNewMatch = (opponentName?: string, formatOverride?: MatchFormat) => {
    const tierInfo = TIER_DETAILS[player.tier];
    const oppTeams = tierInfo.teams.filter((t) => t.name !== player.currentTeam);
    const oppTeam = opponentName 
      ? { name: opponentName, strength: 80 }
      : (oppTeams[Math.floor(Math.random() * oppTeams.length)] || { name: 'Opposition XI', strength: 75 });

    const formats: MatchFormat[] = player.tier === 'GULLY_STREET' ? ['T5_STREET', 'T10_BLAST'] : ['T20_CUP', 'ODI_50'];
    const selectedFormat = formatOverride || formats[Math.floor(Math.random() * formats.length)];
    const totalOvers = selectedFormat === 'T5_STREET' ? 5 : selectedFormat === 'T10_BLAST' ? 10 : 20;

    const pitches: PitchCondition[] = ['FLAT_ROAD', 'GREEN_SEAM', 'DUSTY_TURN', 'DAMP_SLOW'];
    const weathers: WeatherCondition[] = ['SUNNY', 'OVERCAST', 'DEW_NIGHT', 'WINDY'];

    const targetRuns = Math.round(totalOvers * (7.5 + Math.random() * 3));
    const userLineup = getStartingXIForTeam(player.currentTeam, player);
    const oppLineup = getStartingXIForTeam(oppTeam.name);
    const initialOppBowler = oppLineup.find(p => p.role === 'BOWLER' || p.role === 'ALL_ROUNDER')?.name || 'Lead Bowler';
    const nonStrikerPlayer = userLineup.find(p => !p.isUser)?.name || 'Opening Partner';

    const newMatch: MatchState = {
      id: `match_${Date.now()}`,
      title: `${player.currentTeam} vs ${oppTeam.name}`,
      format: selectedFormat,
      totalOvers,
      pitch: pitches[Math.floor(Math.random() * pitches.length)],
      weather: weathers[Math.floor(Math.random() * weathers.length)],
      userTeam: player.currentTeam,
      oppTeam: oppTeam.name,
      difficulty: 'MEDIUM',
      userTeamLineup: userLineup,
      oppTeamLineup: oppLineup,
      innings: 2,
      userBattingFirst: false,
      runs: 0,
      wickets: 0,
      balls: 0,
      target: targetRuns,
      userRuns: 0,
      userBalls: 0,
      userFours: 0,
      userSixes: 0,
      userIsOut: false,
      userOversBowled: 0,
      userBowlingRuns: 0,
      userBowlingWickets: 0,
      userMaidens: 0,
      currentBowler: initialOppBowler,
      currentBowlerIndex: 0,
      nonStriker: nonStrikerPlayer,
      partnershipRuns: 0,
      currentOverRuns: 0,
      currentOverWickets: 0,
      ballHistory: [],
      wagonWheel: [],
      isMatchFinished: false,
      userEarnedCash: 0,
      userEarnedFame: 0,
    };

    setMatchState(newMatch);
    setActiveTab('MATCH');
  };

  // Start match from specific tournament fixture
  const handlePlayFixture = (fixture: LeagueFixture) => {
    const oppTeam = fixture.team1 === player.currentTeam ? fixture.team2 : fixture.team1;
    handleStartNewMatch(oppTeam, fixture.matchFormat);
  };

  // Match Finish Handler
  const handleFinishMatch = (updatedPlayer: PlayerProfile, finalMatch: MatchState) => {
    setPlayer(updatedPlayer);
    setMatchState(finalMatch);

    // Update Tournament Standings and Fixture Results
    const isUserWin = finalMatch.matchResult?.includes(finalMatch.userTeam) ?? false;
    const oppRuns = finalMatch.target ? finalMatch.target - (isUserWin ? 1 : 0) : 145;

    const updatedTournament = recordMatchInTournament(
      tournament,
      finalMatch.userTeam,
      finalMatch.oppTeam,
      isUserWin,
      finalMatch.runs,
      oppRuns,
      finalMatch.totalOvers
    );
    setTournament(updatedTournament);

    // Generate Dynamic Press Conference questions
    const questions = generateDynamicPressQuestions(
      finalMatch.userRuns,
      finalMatch.userBalls,
      finalMatch.userBowlingWickets,
      isUserWin,
      finalMatch.userRuns >= 100,
      finalMatch.userRuns === 0 && finalMatch.userBalls > 0
    );

    setPressQuestions(questions);
    setTimeout(() => {
      setIsPressConferenceOpen(true);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#050508] text-slate-100 flex flex-col antialiased relative overflow-x-hidden selection:bg-amber-500 selection:text-slate-950">
      {/* Immersive Theme Radial Glow Background */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_25%,_#1a1a2e_0%,_#050508_100%)] opacity-80 pointer-events-none z-0" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-500/5 blur-[120px] pointer-events-none z-0" />

      {/* Main Container */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Mobile Top Header */}
        <MobileHeader
          player={player}
          lang={lang}
          onToggleLang={toggleLanguage}
          isMuted={isMuted}
          onToggleMute={toggleAudioMute}
          onOpenProfileModal={() => setIsProfileModalOpen(true)}
          onOpenCloudSync={() => setIsCloudSyncOpen(true)}
        />

        {/* Main Content Area */}
        <main className={`flex-1 w-full mx-auto ${activeTab === 'MATCH' && matchState ? 'max-w-5xl p-1 sm:p-2.5 h-[calc(100vh-60px)] sm:h-[calc(100vh-70px)]' : 'max-w-2xl p-3.5 sm:p-4'}`}>
          {activeTab === 'DASHBOARD' && (
            <DashboardView
              player={player}
              onUpdatePlayer={setPlayer}
              onStartMatch={() => handleStartNewMatch()}
              onOpenAuction={() => setIsAuctionModalOpen(true)}
              onOpenProfile={() => setIsProfileModalOpen(true)}
              onGoToTraining={() => setActiveTab('TRAINING')}
              lang={lang}
            />
          )}

          {activeTab === 'LEAGUE' && (
            <LeagueTournamentView
              player={player}
              tournament={tournament}
              onUpdateTournament={setTournament}
              onPlayFixture={handlePlayFixture}
              lang={lang}
            />
          )}

          {activeTab === 'MATCH' && (
            matchState ? (
              <MatchEngine
                player={player}
                matchState={matchState}
                onUpdateMatch={setMatchState}
                onFinishMatch={handleFinishMatch}
                lang={lang}
              />
            ) : (
              <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center space-y-4 my-auto shadow-2xl">
                <span className="text-4xl">🏏</span>
                <h2 className="text-xl font-bold font-teko uppercase text-white tracking-wider">
                  {lang === 'bn' ? 'কোনো লাইভ ম্যাচ চলছে না' : 'No Match Currently in Progress'}
                </h2>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  {lang === 'bn' 
                    ? 'আপনার পরবর্তী লিগ বা টুর্নামেন্ট ফিক্সচার ম্যাচ শুরু করতে নিচের বাটনে চাপুন।' 
                    : 'Select a fixture from the League schedule or start a quick match now.'}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                  <button
                    onClick={() => handleStartNewMatch()}
                    className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-[0.2em] rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.3)] active:scale-95 transition-all"
                  >
                    {lang === 'bn' ? 'নতুন ম্যাচ শুরু করুন' : 'Start Match Now'}
                  </button>
                  <button
                    onClick={() => setActiveTab('LEAGUE')}
                    className="w-full sm:w-auto px-6 py-3 bg-white/[0.05] hover:bg-white/[0.1] text-amber-300 font-bold text-xs uppercase tracking-[0.2em] rounded-xl border border-amber-500/30 active:scale-95 transition-all"
                  >
                    {lang === 'bn' ? 'ফিক্সচার দেখুন' : 'View League Fixtures'}
                  </button>
                </div>
              </div>
            )
          )}

          {activeTab === 'TRAINING' && (
            <TrainingCamp
              player={player}
              onUpdatePlayer={setPlayer}
              lang={lang}
            />
          )}

          {activeTab === 'SHOP' && (
            <EquipmentShop
              player={player}
              onUpdatePlayer={setPlayer}
              lang={lang}
            />
          )}

          {activeTab === 'STORY' && (
            <LockerRoomEvents
              player={player}
              onUpdatePlayer={setPlayer}
              lang={lang}
            />
          )}

          {activeTab === 'STATS' && (
            <CareerStatsView
              player={player}
              lang={lang}
            />
          )}
        </main>

        {/* Floating Bottom Navigation */}
        <BottomNav
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          lang={lang}
          hasActiveMatch={matchState !== null && !matchState.isMatchFinished}
        />

        {/* Modals */}
        <PlayerCreationModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          currentPlayer={player}
          onSavePlayer={setPlayer}
          lang={lang}
        />

        <PressConferenceModal
          isOpen={isPressConferenceOpen}
          onClose={() => setIsPressConferenceOpen(false)}
          questions={pressQuestions}
          player={player}
          onUpdatePlayer={setPlayer}
          lang={lang}
        />

        <AuctionDraftModal
          isOpen={isAuctionModalOpen}
          onClose={() => setIsAuctionModalOpen(false)}
          player={player}
          onCompleteAuction={(updated) => setPlayer(updated)}
          lang={lang}
        />

        {/* Cloud Save & Restore Sync Modal */}
        <CloudSyncModal
          isOpen={isCloudSyncOpen}
          onClose={() => setIsCloudSyncOpen(false)}
          currentPlayer={player}
          currentTournament={tournament}
          onRestoreSave={(restoredPlayer, restoredTournament) => {
            setPlayer(restoredPlayer);
            if (restoredTournament) {
              setTournament(restoredTournament);
            }
          }}
          lang={lang}
        />
      </div>
    </div>
  );
}
