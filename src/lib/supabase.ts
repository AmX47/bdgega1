import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hlzpthhnjbyrjfwzfynd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhsenB0aGhuamJ5cmpmd3pmeW5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4NjczODIsImV4cCI6MjA1NTQ0MzM4Mn0.xrhOzfHYRnRU_VYhI36Bawx0vxXJqe6uKPDnipW6OBY';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: window.localStorage,
    storageKey: 'supabase.auth.token',
    autoRefreshToken: true,
  },
  headers: {
    'X-Client-Info': 'bdgeega@1.0.0',
  },
});
