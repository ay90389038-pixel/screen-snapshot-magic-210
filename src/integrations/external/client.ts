// Client for the user's external TOPIT Supabase project (papers + admin only).
// The app's main backend stays on Lovable Cloud; this client talks only to the
// external project's public tables (cbse_pyqs) and its auth for the admin panel.
import { createClient } from "@supabase/supabase-js";

const EXTERNAL_URL = "https://aokzwkjczihattuhyzbg.supabase.co";
const EXTERNAL_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFva3p3a2pjemloYXR0dWh5emJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIxMzIzNzIsImV4cCI6MjEwNzcwODM3Mn0.U0k6chKu97L9z9CTMZuTDdZKr-yDbxSzt7dogKL8KIk";

export type ExternalPaperRow = {
  id: string;
  standard: string;
  subject: string;
  year: string;
  paper_type: string;
  set_number: string | null;
  paper_url: string;
  solution_url: string | null;
  created_at?: string;
};

export const externalSupabase = createClient(EXTERNAL_URL, EXTERNAL_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: "topit-external-admin-auth",
  },
});
