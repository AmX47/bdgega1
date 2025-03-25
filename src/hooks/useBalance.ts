import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useBalance = (userId: string | undefined) => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = async () => {
    if (!userId) {
      setBalance(0);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_games')
        .select('games_remaining')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // إنشاء سجل جديد للمستخدم
          const { error: insertError } = await supabase
            .from('user_games')
            .insert({
              user_id: userId,
              games_remaining: 0,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });

          if (insertError) {
            throw insertError;
          }
          setBalance(0);
        } else {
          throw error;
        }
      } else {
        setBalance(data?.games_remaining || 0);
      }
    } catch (err: any) {
      console.error('Error fetching balance:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();

    // الاستماع للتغييرات في الرصيد
    const subscription = supabase
      .channel('user_games_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_games',
          filter: `user_id=eq.${userId}`
        },
        () => {
          fetchBalance();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);

  return { balance, loading, error, refetch: fetchBalance };
};
