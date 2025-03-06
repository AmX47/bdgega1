export interface Category {
  id: number;
  name: string;
  icon: string;
  image: string;
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  points: number;
  options: string[];
  correctAnswer: number;
}

export interface Team {
  id: string;
  name: string;
  score: number;
  helpOptions: {
    callFriend: boolean;
    doublePoints: boolean;
    blockOpponent: boolean;
  };
}

export interface GameState {
  gameName: string;
  teams: Team[];
  currentTeam: number;
  selectedCategories: number[];
  answeredQuestions: Set<string>;
}