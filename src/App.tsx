import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { LandingPage } from './components/LandingPage';
import { Categories } from './components/Categories';
import { GameBoard } from './components/GameBoard';
import { PaymentSuccess } from './components/PaymentSuccess';
import { PaymentError } from './components/PaymentError';
import { sendDiscordNotification } from './services/discord';
import { supabase } from './lib/supabase';

interface GameSetup {
  categoryIds: number[];
  gameName: string;
  team1Name: string;
  team2Name: string;
  helpers: string[];
}

function AppContent() {
  const [gameSetup, setGameSetup] = useState<GameSetup | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setIsAuthenticated(true);
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
    }
  };

  const handleGameSetup = (setup: GameSetup) => {
    setGameSetup(setup);
    navigate('/game');
  };

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route 
        path="/categories" 
        element={
          isAuthenticated ? (
            <Categories onGameSetup={handleGameSetup} />
          ) : (
            <LandingPage />
          )
        } 
      />
      <Route 
        path="/game" 
        element={
          isAuthenticated && gameSetup ? (
            <GameBoard gameSetup={gameSetup} />
          ) : (
            <LandingPage />
          )
        } 
      />
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