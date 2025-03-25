import { questions } from '../data/questions';

interface Question {
  id: number;
  text: string;
  correctAnswer: string;
  points: number;
  buttonIndex: number;
  audio?: string;
  answerImage?: string;
}

interface Category {
  id: number;
  name: string;
  description: string;
  image: string;
  questions: Question[];
}

// Function to get random questions from a specific point level
const getRandomQuestionsForLevel = (pointLevel: number): Category[] => {
  // Filter categories that have questions with the specified point level
  const categoriesWithLevel = questions.filter(category => 
    category.questions.some(q => q.points === pointLevel)
  );

  // Randomly select 2 categories from the filtered list
  const shuffledCategories = [...categoriesWithLevel].sort(() => Math.random() - 0.5);
  return shuffledCategories.slice(0, 2);
};

// Function to get a random question from a category for a specific point level
const getRandomQuestionFromCategory = (category: Category, pointLevel: number): Question => {
  // Filter questions with the specified point level
  const questionsForLevel = category.questions.filter(q => q.points === pointLevel);
  
  // Randomly select a question (1% chance of repetition)
  const randomIndex = Math.floor(Math.random() * questionsForLevel.length);
  return questionsForLevel[randomIndex];
};

// Main function to get 6 categories (2 from each level) with random questions
export const getGameCategories = (): Category[] => {
  const levels = [300, 500, 700];
  let gameCategories: Category[] = [];

  levels.forEach(level => {
    const categoriesForLevel = getRandomQuestionsForLevel(level);
    gameCategories = [...gameCategories, ...categoriesForLevel];
  });

  // Shuffle the categories to mix up the levels
  return gameCategories.sort(() => Math.random() - 0.5);
};

// Function to get a new random question for a category and point level
export const getNewRandomQuestion = (categoryId: number, pointLevel: number): Question | null => {
  const category = questions.find(c => c.id === categoryId);
  if (!category) return null;

  return getRandomQuestionFromCategory(category, pointLevel);
};
