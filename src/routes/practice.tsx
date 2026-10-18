import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Page, Chip } from "@/components/site";
import { useStudent } from "@/context/StudentContext";
import { logPracticeAttempt } from "@/integrations/supabase/api";

export const Route = createFileRoute("/practice")({
  head: () => ({
    meta: [
      { title: "Practice & Drills — TOPIT" },
      { name: "description", content: "Interactive board-aligned MCQs and chapter drills." },
    ],
  }),
  component: PracticePage,
});

type Question = {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
};

const PRACTICE_BANK: Record<string, Question[]> = {
  "Chemical Reactions": [
    {
      id: 1,
      question: "Which of the following is a displacement reaction?",
      options: [
        "2KClO₃ → 2KCl + 3O₂",
        "Zn + CuSO₄ → ZnSO₄ + Cu",
        "CaO + H₂O → Ca(OH)₂",
        "NaOH + HCl → NaCl + H₂O",
      ],
      correct: 1,
      explanation: "Zinc is more reactive than copper and displaces it from copper sulphate solution.",
    },
    {
      id: 2,
      question: "Rusting of iron is chemically known as:",
      options: [
        "Reduction reaction",
        "Hydrated ferric oxide formation",
        "Neutralisation",
        "Precipitation",
      ],
      correct: 1,
      explanation: "Rust is hydrated ferric oxide: Fe₂O₃ · xH₂O, formed via slow oxidation.",
    },
  ],
  "Acids, Bases & Salts": [
    {
      id: 3,
      question: "What is the pH value of pure water at 25°C?",
      options: ["0", "5.6", "7.0", "14"],
      correct: 2,
      explanation: "Pure neutral water at 25°C contains equal concentrations of H⁺ and OH⁻ ions (pH 7).",
    },
    {
      id: 4,
      question: "Which gas is evolved when zinc granules react with dilute sulphuric acid?",
      options: ["Oxygen", "Carbon dioxide", "Hydrogen", "Sulphur dioxide"],
      correct: 2,
      explanation: "Metals react with dilute acids to produce metal salts and hydrogen gas (H₂).",
    },
  ],
  "Life Processes": [
    {
      id: 5,
      question: "What is the structural and functional filtration unit of the human kidney?",
      options: ["Alveoli", "Nephron", "Neuron", "Villi"],
      correct: 1,
      explanation: "Each kidney contains roughly 1 to 1.2 million filtering units called nephrons.",
    },
    {
      id: 6,
      question: "During photosynthesis, oxygen is released through the breakdown of which molecule?",
      options: ["Carbon dioxide", "Glucose", "Water", "Chlorophyll"],
      correct: 2,
      explanation: "Photolysis of water (H₂O) releases electrons, protons, and oxygen molecules.",
    },
  ],
};

function PracticePage() {
  const { user, profile } = useStudent();
  const chapters = Object.keys(PRACTICE_BANK);
  const [selectedChapter, setSelectedChapter] = useState(chapters[0]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const questions = PRACTICE_BANK[selectedChapter] || [];
  const currentQ = questions[currentIdx];

  const handleSelectOption = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    setAnsweredCount((prev) => prev + 1);
    if (idx === currentQ.correct) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      finishDrill();
    }
  };

  const finishDrill = async () => {
    setSubmitted(true);
    if (user?.id) {
      setIsSaving(true);
      try {
        await logPracticeAttempt({
          user_id: user.id,
          subject: "Science",
          chapter: selectedChapter,
          total_questions: questions.length,
          correct_answers: score + (selectedOption === currentQ.correct ? 1 : 0),
        });
      } catch (err) {
        console.error("Failed to sync attempt to Supabase:", err);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleRestart = (ch: string) => {
    setSelectedChapter(ch);
    setCurrentIdx(0);
    setSelectedOption(null);
    setScore(0);
    setAnsweredCount(0);
    setSubmitted(false);
  };

  return (
    <Page
      title="Practice Drills"
      sub={`Focused chapter questions for Class ${profile?.class_grade || "10"} • Board Standard`}
    >
      <div className="mb-6 flex flex-wrap gap-2">
        {chapters.map((ch) => (
          <Chip
            key={ch}
            active={selectedChapter === ch}
            onClick={() => handleRestart(ch)}
          >
            {ch}
          </Chip>
        ))}
      </div>

      <div className="glass rounded-3xl p-6 sm:p-8">
        {!submitted ? (
          <div>
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-brand">
                  {selectedChapter}
                </span>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Question {currentIdx + 1} of {questions.length}
                </p>
              </div>
              <span className="font-mono text-xs font-semibold text-muted-foreground">
                Score: {score}/{questions.length}
              </span>
            </div>

            <div className="my-6">
              <h3 className="text-base sm:text-lg font-semibold text-foreground">
                {currentQ.question}
              </h3>

              <div className="mt-4 grid gap-3">
                {currentQ.options.map((opt, idx) => {
                  let buttonStyle = "border-border/60 hover:bg-card";
                  if (selectedOption !== null) {
                    if (idx === currentQ.correct) {
                      buttonStyle = "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold";
                    } else if (idx === selectedOption) {
                      buttonStyle = "border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400";
                    }
                  }

                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleSelectOption(idx)}
                      disabled={selectedOption !== null}
                      className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left text-sm transition ${buttonStyle}`}
                    >
                      <span>{opt}</span>
                      {selectedOption !== null && idx === currentQ.correct && (
                        <span className="text-emerald-600 font-bold">✓</span>
                      )}
                      {selectedOption === idx && idx !== currentQ.correct && (
                        <span className="text-rose-600 font-bold">✗</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {selectedOption !== null && (
                <div className="mt-4 rounded-2xl border border-border bg-card p-4 text-xs text-muted-foreground">
                  <strong className="text-foreground">Explanation: </strong>
                  {currentQ.explanation}
                </div>
              )}
            </div>

            {selectedOption !== null && (
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleNext}
                  className="rounded-full bg-gradient-brand px-6 py-2 text-xs font-semibold text-on-brand shadow hover:opacity-95 transition"
                >
                  {currentIdx + 1 === questions.length ? "Finish Drill" : "Next Question →"}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <span className="text-4xl">🎯</span>
            <h3 className="font-display text-2xl font-bold mt-3">Drill Completed</h3>
            <p className="text-sm text-muted-foreground mt-1">
              You scored <strong className="text-brand font-mono text-base">{score} / {questions.length}</strong> in {selectedChapter}.
            </p>

            <div className="mt-4 text-xs text-muted-foreground">
              {user ? (
                isSaving ? "Syncing results to your student profile..." : "✅ Progress synced to your Supabase account"
              ) : (
                "Sign in to log these attempts directly onto your Dashboard stats"
              )}
            </div>

            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => handleRestart(selectedChapter)}
                className="rounded-full bg-gradient-brand px-5 py-2 text-xs font-semibold text-on-brand shadow hover:opacity-90 transition"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </Page>
  );
}
