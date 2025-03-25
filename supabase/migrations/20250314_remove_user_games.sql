-- Drop user_games table
drop table if exists public.user_games;

-- Drop related policies
drop policy if exists "Users can view their own games" on public.user_games;
drop policy if exists "Users can update their own games" on public.user_games;
