import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hlzpthhnjbyrjfwzfynd.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhsenB0aGhuamJ5cmpmd3pmeW5kIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTg2NzM4MiwiZXhwIjoyMDU1NDQzMzgyfQ.LrLkYJgQh0vfymynsJ3RYySDMtZcpp80E8LJRBNikDs'
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
