import { useState, useEffect } from 'react';
import { GameState, Player, Match } from './types/cricket';
import GameMenu from './components/GameMenu';
import PlayerCreation from './components/PlayerCreation';
import GameScreen from './components/GameScreen';
import { initializeGame } from './utils/gameEngine';

function App() {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [player, setPlayer] = useState<Player | null>(null);
  const [currentMatch, setCurrentMatch] = useState<Match | null>(null);

  useEffect(() => {
    // Load saved game
    const saved = localStorage.getItem('cricketCareerSave');
    if (saved) {
      const data = JSON.parse(saved);
      setPlayer(data.player);
      if (data.gameState) setGameState(data.gameState);
    }
  }, []);

  const handleCreatePlayer = (newPlayer: Player) => {
    setPlayer(newPlayer);
    setGameState('main');
    localStorage.setItem('cricketCareerSave', JSON.stringify({ player: newPlayer, gameState: 'main' }));
  };

  const handleStartMatch = () => {
    if (!player) return;
    const match = initializeGame(player);
    setCurrentMatch(match);
    setGameState('match');
  };

  const handleMatchComplete = (updatedPlayer: Player) => {
    setPlayer(updatedPlayer);
    setCurrentMatch(null);
    setGameState('main');
    localStorage.setItem('cricketCareerSave', JSON.stringify({ player: updatedPlayer, gameState: 'main' }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
      {gameState === 'menu' && !player && <GameMenu onStart={() => setGameState('create')} />}
      {gameState === 'create' && <PlayerCreation onCreate={handleCreatePlayer} />}
      {gameState === 'main' && player && (
        <GameScreen player={player} onStartMatch={handleStartMatch} setPlayer={setPlayer} />
      )}
      {gameState === 'match' && currentMatch && player && (
        <MatchSimulation match={currentMatch} player={player} onComplete={handleMatchComplete} />
      )}
    </div>
  );
}

function MatchSimulation({ match, player, onComplete }: any) {
  const [innings, setInnings] = useState(0);
  const [ballCount, setBallCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const handlePlayBall = () => {
    const random = Math.random();
    let runs = 0;
    let wicket = false;

    if (random < 0.05) {
      wicket = true; // 5% chance of wicket
    } else if (random < 0.15) {
      runs = 0; // 10% dot ball
    } else if (random < 0.35) {
      runs = 1; // 20% single
    } else if (random < 0.50) {
      runs = 2; // 15% double
    } else if (random < 0.65) {
      runs = 3; // 15% triple
    } else if (random < 0.85) {
      runs = 4; // 20% four
    } else {
      runs = 6; // 15% six
    }

    if (wicket) {
      const newInnings = innings + 1;
      if (newInnings >= 2) {
        finishMatch();
      } else {
        setInnings(newInnings);
        setBallCount(0);
      }
    } else {
      const newBalls = ballCount + 1;
      if (newBalls >= 120) { // 20 overs
        const newInnings = innings + 1;
        if (newInnings >= 2) {
          finishMatch();
        } else {
          setInnings(newInnings);
          setBallCount(0);
        }
      } else {
        setBallCount(newBalls);
      }
    }
  };

  const finishMatch = () => {
    setIsComplete(true);
    const updatedPlayer = { ...player, careerMatches: player.careerMatches + 1 };
    setTimeout(() => onComplete(updatedPlayer), 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-emerald-900 to-slate-900 p-4">
      <div className="bg-slate-800 rounded-lg p-8 max-w-2xl w-full text-center">
        <h1 className="text-4xl font-teko mb-4">🏏 MATCH SIMULATION</h1>
        <p className="text-xl mb-4">Overs: {Math.floor(ballCount / 6)}.{ballCount % 6}</p>
        <p className="text-2xl font-bold mb-6 text-amber-400">Innings: {innings + 1}/2</p>
        
        {!isComplete ? (
          <button
            onClick={handlePlayBall}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-4 px-8 rounded-lg text-xl transition-all duration-200 transform hover:scale-105"
          >
            🎯 PLAY BALL
          </button>
        ) : (
          <div className="text-3xl font-bold text-green-400">✅ MATCH COMPLETE!</div>
        )}
      </div>
    </div>
  );
}

export default App;
