-- Create user_game_stats table
create table if not exists public.user_game_stats (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users not null,
    remaining_games integer default 1,
    total_games_played integer default 0,
    used_question_ids jsonb default '[]',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id)
);

-- Enable RLS
alter table public.user_game_stats enable row level security;

-- Create policies
create policy "Users can view their own game stats"
    on public.user_game_stats for select
    using (auth.uid() = user_id);

create policy "Users can update their own game stats"
    on public.user_game_stats for update
    using (auth.uid() = user_id);

-- Create function to initialize user game stats
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.user_game_stats (user_id, remaining_games)
    values (new.id, 1);
    return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user registration
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();

-- Create function to update games after completion
create or replace function public.complete_game(user_id uuid, question_ids jsonb)
returns void as $$
begin
    update public.user_game_stats
    set 
        remaining_games = case 
            when total_games_played = 0 then 0  -- First game completed
            else remaining_games - 1
        end,
        total_games_played = total_games_played + 1,
        used_question_ids = used_question_ids || question_ids,
        updated_at = now()
    where user_id = user_id;
end;
$$ language plpgsql security definer;

-- Create function to add games
create or replace function public.add_games(user_id uuid, amount integer)
returns void as $$
begin
    update public.user_game_stats
    set 
        remaining_games = remaining_games + amount,
        updated_at = now()
    where user_id = user_id;
end;
$$ language plpgsql security definer;
