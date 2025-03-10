import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { LandingPage } from './components/LandingPage';
import { Categories } from './components/Categories';
import { GameBoard } from './components/GameBoard';
import { PaymentSuccess } from './components/PaymentSuccess';
import { PaymentError } from './components/PaymentError';

interface User {
  username: string;
  name: string;
}

interface GameSetup {
  categoryIds: number[];
  gameName: string;
  team1Name: string;
  team2Name: string;
  helpers: string[];
}

function AppContent() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [gameSetup, setGameSetup] = useState<GameSetup | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleStartGame = (setup: GameSetup) => {
    setGameSetup(setup);
    navigate('/game');
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <Routes>
      <Route path="/" element={
        <LandingPage
          onLogin={handleLogin}
          onLogout={handleLogout}
          currentUser={user}
        />
      } />
      <Route path="/categories" element={
        <Categories
          onStartGame={handleStartGame}
          onHome={() => navigate('/')}
          onPlay={() => navigate('/game')}
          currentUser={user}
        />
      } />
      <Route path="/game" element={
        gameSetup && (
          <GameBoard
            categoryIds={gameSetup.categoryIds}
            gameName={gameSetup.gameName}
            team1Name={gameSetup.team1Name}
            team2Name={gameSetup.team2Name}
            helpers={gameSetup.helpers}
            onHome={() => navigate('/')}
            currentUser={user}
          />
        )
      } />
      <Route path="/payment/success" element={<PaymentSuccess />} />
      <Route path="/payment/error" element={<PaymentError />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;