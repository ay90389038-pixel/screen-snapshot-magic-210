import React, { createContext, useContext, useEffect, useState } from 'react';
import { externalSupabase as supabase } from '@/integrations/supabase/externalClient';
import { User } from '@supabase/supabase-js';

export interface StudentProfile {
  id: string;
  full_name: string;
  board: string;
  class_grade: string;
  target_stream: string;
  total_study_minutes: number;
  questions_solved: number;
  tests_completed: number;
  overall_accuracy: number;
  weak_topics: string[];
  strong_topics: string[];
}

interface StudentContextType {
  user: User | null;
  profile: StudentProfile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  logStudySession: (subject: string, topic: string, durationMinutes: number) => Promise<void>;
  signOut: () => Promise<void>;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('student_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (!error && data) {
      setProfile(data as StudentProfile);
    }
  };

  const refreshProfile = async () => {
    if (user?.id) {
      await fetchProfile(user.id);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const logStudySession = async (subject: string, topic: string, durationMinutes: number) => {
    if (!user?.id || durationMinutes <= 0) return;

    // Log the session record
    await supabase.from('study_sessions').insert({
      student_id: user.id,
      subject,
      topic,
      duration_minutes: durationMinutes,
    });

    // Increment local and remote total study minutes
    const updatedMinutes = (profile?.total_study_minutes || 0) + durationMinutes;
    await supabase
      .from('student_profiles')
      .update({ total_study_minutes: updatedMinutes, updated_at: new Date().toISOString() })
      .eq('id', user.id);

    refreshProfile();
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  return (
    <StudentContext.Provider
      value={{
        user,
        profile,
        loading,
        refreshProfile,
        logStudySession,
        signOut,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

export const useStudent = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudent must be used within a StudentProvider');
  }
  return context;
};
