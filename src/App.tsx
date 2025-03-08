import { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { Categories } from './components/Categories';
import { GameBoard } from './components/GameBoard';

function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'categories' | 'game'>('landing');
  const [gameSetup, setGameSetup] = useState<{
    categoryIds: number[];
    gameName: string;
    team1Name: string;
    team2Name: string;
    helpers: string[];
  } | null>(null);

  const handleStartGame = (gameData: {
    categoryIds: number[];
    gameName: string;
    team1Name: string;
    team2Name: string;
    helpers: string[];
  }) => {
    setGameSetup(gameData);
    setCurrentPage('game');
  };

  const handleHome = () => {
    setCurrentPage('landing');
    setGameSetup(null);
  };

  return (
    <div>
      {currentPage === 'landing' && (
        <LandingPage
          onPlay={() => setCurrentPage('categories')}
          onLogin={() => console.log('Login clicked')}
          onRegister={() => console.log('Register clicked')}
        />
      )}
      {currentPage === 'categories' && (
        <Categories
          onStartGame={handleStartGame}
          onHome={handleHome}
        />
      )}
      {currentPage === 'game' && gameSetup && (
        <GameBoard
          categoryIds={gameSetup.categoryIds}
          gameName={gameSetup.gameName}
          team1Name={gameSetup.team1Name}
          team2Name={gameSetup.team2Name}
          helpers={gameSetup.helpers}
          onHome={handleHome}
        />
      )}
    </div>
  );
}

export default App;