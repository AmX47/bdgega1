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
    team1Players: number;
    team2Players: number;
  } | null>(null);

  const handleStartGame = (
    categoryIds: number[],
    gameName: string,
    team1Name: string,
    team2Name: string,
    team1Players: number,
    team2Players: number
  ) => {
    setGameSetup({ categoryIds, gameName, team1Name, team2Name, team1Players, team2Players });
    setCurrentPage('game');
  };

  const handleHome = () => {
    setCurrentPage('landing');
    setGameSetup(null);
  };

  return (
    <div className="min-h-screen bg-white">
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
          team1Players={gameSetup.team1Players}
          team2Players={gameSetup.team2Players}
          onHome={handleHome}
        />
      )}
    </div>
  );
}

export default App;