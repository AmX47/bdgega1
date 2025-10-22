import { supabase } from './supabase';
import { questions as trialQuestions } from '../data/questions';
import { premiumQuestions } from '../data/premiumQuestions';

interface GameStats {
  remaining_games: number;
  total_games_played: number;
  used_question_ids: number[];
}

export async function getUserGameStats(): Promise<GameStats | null> {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return null;

  const { data, error } = await supabase
    .from('user_game_stats')
    .select('*')
    .eq('user_id', user.user.id)
    .single();

  if (error) {
    console.error('Error fetching game stats:', error);
    return null;
  }

  return data;
}

export async function canCreateGame(): Promise<boolean> {
  const stats = await getUserGameStats();
  if (!stats) return false;
  
  // Allow playing if it's their first game (trial) or if they have remaining games
  return stats.total_games_played === 0 || stats.remaining_games > 0;
}

export async function getGameQuestions(categoryIds: number[]) {
  const stats = await getUserGameStats();
  if (!stats) throw new Error('User stats not found');

  // For first-time players or when no remaining games, return trial questions
  if (stats.total_games_played === 0 || stats.remaining_games === 0) {
    return trialQuestions
      .filter(category => categoryIds.includes(category.id))
      .map(category => ({
        ...category,
        questions: category.questions.map(q => ({ ...q, isTrialQuestion: true }))
      }));
  }

  // For players with remaining games, return premium questions
  // excluding previously used questions
  return premiumQuestions
    .filter(category => categoryIds.includes(category.id))
    .map(category => ({
      ...category,
      questions: category.questions.filter(q => 
        !stats.used_question_ids.includes(q.id)
      )
    }));
}

export async function completeGame(questionIds: number[]) {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not found');

  const { error } = await supabase.rpc('complete_game', {
    user_id: user.user.id,
    question_ids: JSON.stringify(questionIds)
  });

  if (error) throw error;
}

export async function addGames(amount: number) {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not found');

  const { error } = await supabase
    .from('user_game_stats')
    .update({ 
      remaining_games: supabase.raw(`remaining_games + ${amount}`)
    })
    .eq('user_id', user.user.id);

  if (error) throw error;
}

export async function redeemGameCode(code: string): Promise<{ success: boolean; message: string }> {
  // Validate the code
  if (code !== 'AmX') {
    return { success: false, message: 'كود غير صالح' };
  }

  try {
    await addGames(1); // Add one game for valid code
    return { success: true, message: 'تم إضافة لعبة بنجاح' };
  } catch (error) {
    console.error('Error redeeming code:', error);
    return { success: false, message: 'حدث خطأ أثناء إضافة اللعبة' };
  }
}
