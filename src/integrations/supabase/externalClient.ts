import { createClient } from '@supabase/supabase-js';

const TOPIT_SUPABASE_URL = 'https://aokzwkjczihattuhyzbg.supabase.co';
const TOPIT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFva3p3a2pjemloYXR0dWh5emJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIxMzIzNzIsImV4cCI6MjEwNzcwODM3Mn0.U0k6chKu97L9z9CTMZuTDdZKr-yDbxSzt7dogKL8KIk';

export const externalSupabase = createClient(
  TOPIT_SUPABASE_URL,
  TOPIT_SUPABASE_ANON_KEY
);
