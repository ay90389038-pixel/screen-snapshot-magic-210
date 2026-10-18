import { externalSupabase as supabase } from "./externalClient";

export type StudentNote = {
  id: string;
  user_id: string;
  title: string;
  subject: string;
  body: string;
  created_at: string;
};

export type PracticeAttempt = {
  id?: string;
  user_id: string;
  subject: string;
  chapter: string;
  total_questions: number;
  correct_answers: number;
};

// --- Notes API ---
export async function fetchStudentNotes(userId: string) {
  const { data, error } = await supabase
    .from("student_notes")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching notes:", error.message);
    return [];
  }
  return data as StudentNote[];
}

export async function createStudentNote(note: {
  user_id: string;
  title: string;
  subject: string;
  body: string;
}) {
  const { data, error } = await supabase
    .from("student_notes")
    .insert([note])
    .select()
    .single();

  if (error) throw error;
  return data as StudentNote;
}

export async function deleteStudentNote(noteId: string) {
  const { error } = await supabase
    .from("student_notes")
    .delete()
    .eq("id", noteId);

  if (error) throw error;
  return true;
}

// --- Practice Attempts & Metrics API ---
export async function logPracticeAttempt(attempt: PracticeAttempt) {
  const { data, error } = await supabase
    .from("practice_attempts")
    .insert([attempt])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function fetchStudentSummary(userId: string) {
  const { data, error } = await supabase
    .from("practice_attempts")
    .select("total_questions, correct_answers, accuracy_rate")
    .eq("user_id", userId);

  if (error || !data || data.length === 0) {
    return {
      totalSolved: 0,
      averageAccuracy: 0,
      totalTests: 0,
    };
  }

  const totalSolved = data.reduce((acc, row) => acc + (row.total_questions || 0), 0);
  const totalCorrect = data.reduce((acc, row) => acc + (row.correct_answers || 0), 0);
  const averageAccuracy = totalSolved > 0 ? Math.round((totalCorrect / totalSolved) * 100) : 0;

  return {
    totalSolved,
    averageAccuracy,
    totalTests: data.length,
  };
}
