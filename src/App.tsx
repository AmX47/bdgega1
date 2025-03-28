import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { LandingPage } from './components/LandingPage';
import { Categories } from './components/Categories';
import { GameBoard } from './components/GameBoard';
import { PaymentSuccess } from './components/PaymentSuccess';
import { PaymentError } from './components/PaymentError';
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
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setCurrentUser(session.user);
      } else {
        setCurrentUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setCurrentUser(session.user);
      }
    } catch (error) {
      setCurrentUser(null);
    }
  };

  const handleGameSetup = (setup: GameSetup) => {
    setGameSetup(setup);
    navigate('/game');
  };

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <LandingPage 
            currentUser={currentUser}
          />
        } 
      />
      <Route 
        path="/categories" 
        element={
          <Categories 
            onGameSetup={handleGameSetup} 
            onHome={() => navigate('/')} 
            currentUser={currentUser}
          />
        } 
      />
      <Route 
        path="/game" 
        element={
          gameSetup ? (
            <GameBoard 
              gameSetup={gameSetup}
              currentUser={currentUser}
            />
          ) : (
            <LandingPage 
              currentUser={currentUser}
            />
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