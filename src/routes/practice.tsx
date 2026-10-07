import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { QUESTIONS } from "@/lib/data";
import { Chip, Page } from "@/components/site";

export const Route = createFileRoute("/practice")({
  head: () => ({
    meta: [
      { title: "Practice — TOPIT" },
      { name: "description", content: "Practice MCQs, assertion-reason, case-based and numericals with instant explanations." },
      { property: "og:title", content: "Practice — TOPIT" },
      { property: "og:description", content: "Board-style practice questions with difficulty filters." },
    ],
  }),
  component: Practice,
});

const DIFFS = ["All", "Easy", "Medium", "Hard"] as const;

function Practice() {
  const [diff, setDiff] = useState<(typeof DIFFS)[number]>("All");
  const list = useMemo(() => QUESTIONS.filter((q) => diff === "All" || q.difficulty === diff), [diff]);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState({ right: 0, done: 0 });
  const q = list[i];

  const choose = (k: number) => {
    if (picked !== null) return;
    setPicked(k);
    setScore((s) => ({ right: s.right + (k === q?.answer ? 1 : 0), done: s.done + 1 }));
  };
  const next = () => { setPicked(null); setI((i + 1) % list.length); };

  return (
    <Page title="Practice" sub={`Score: ${score.right}/${score.done} · Accuracy ${score.done ? Math.round((score.right / score.done) * 100) : 0}%`}>
      <div className="mb-5 flex flex-wrap gap-2">
        {DIFFS.map((d) => <Chip key={d} active={diff === d} onClick={() => { setDiff(d); setI(0); setPicked(null); }}>{d}</Chip>)}
      </div>
      {q ? (
        <div className="glass rise mx-auto max-w-3xl rounded-3xl p-7" key={q.id}>
          <div className="flex flex-wrap gap-2 text-xs font-semibold">
            <span className="rounded-full bg-brand/10 px-3 py-1 text-brand">{q.type}</span>
            <span className="rounded-full bg-sky/10 px-3 py-1 text-sky">{q.chapter}</span>
            <span className="rounded-full bg-amber/10 px-3 py-1 text-amber">{q.difficulty}</span>
            <span className="ml-auto text-muted-foreground">Q{i + 1} / {list.length}</span>
          </div>
          <p className="font-display mt-5 text-xl font-semibold">{q.q}</p>
          <div className="mt-5 grid gap-3">
            {q.options.map((o, k) => {
              const state = picked === null ? "glass-soft hover:bg-card" : k === q.answer ? "bg-mint/15 ring-2 ring-mint" : k === picked ? "bg-coral/15 ring-2 ring-coral" : "glass-soft opacity-60";
              return <button key={k} onClick={() => choose(k)} className={`rounded-2xl px-5 py-3 text-left text-sm font-medium transition ${state}`}>{String.fromCharCode(65 + k)}. {o}</button>;
            })}
          </div>
          {picked !== null && (
            <div className="mt-5 rounded-2xl bg-brand/5 p-4 text-sm">
              <p className="font-semibold">{picked === q.answer ? "✅ Correct!" : "❌ Not quite."}</p>
              <p className="mt-1 text-muted-foreground">{q.explain}</p>
              <button onClick={next} className="mt-4 rounded-full bg-gradient-brand px-5 py-2 text-sm font-semibold text-on-brand">Next question →</button>
            </div>
          )}
        </div>
      ) : <p className="text-muted-foreground">No questions for this filter.</p>}
    </Page>
  );
}
