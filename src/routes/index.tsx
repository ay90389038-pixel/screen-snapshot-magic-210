import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { BOARDS, CLASSES, SUBJECTS } from "@/lib/data";
import { Chip } from "@/components/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TOPIT — Prepare Smarter. Score Better." },
      { name: "description", content: "Complete Board Exam preparation ecosystem for Class 9–12: learn, practice, test, analyze and improve." },
      { property: "og:title", content: "TOPIT — Prepare Smarter. Score Better." },
      { property: "og:description", content: "Learn, practice, test, analyze and improve from one platform." },
    ],
  }),
  component: Index,
});

const FEATURES = [
  ["📘", "Learn", "Simple & detailed explanations, formulas, examples and mnemonics.", "brand"],
  ["✍️", "Practice", "MCQs, assertion-reason, case-based, numericals with difficulty filters.", "sky"],
  ["🗂️", "PYQs", "Previous year questions by chapter, topic, year, marks and frequency.", "mint"],
  ["⏱️", "Tests", "Quick, chapter, full-syllabus, PYQ and weak-topic timed tests.", "amber"],
  ["📈", "Analytics", "Accuracy, speed, time per question and mistake analysis.", "brand"],
  ["🔁", "Revision", "Auto-recommended topics: revise → practice → retest.", "sky"],
  ["🤖", "AI Tutor", "Explain simply, teach me, check my answer, test me.", "mint"],
  ["📢", "Board Intelligence", "Official notices, syllabus and pattern changes with sources.", "amber"],
] as const;

const CYCLE = ["Learn", "Practice", "Test", "Analyze", "Revise", "Retest", "Improve"];

function Index() {
  const [board, setBoard] = useState("CBSE");
  const [cls, setCls] = useState("10");
  const [subj, setSubj] = useState("Science");
  const subjects = SUBJECTS[cls] ?? [];

  return (
    <main className="relative z-10 mx-auto max-w-6xl px-4">
      <section className="grid items-center gap-12 py-16 md:grid-cols-2 md:py-24">
        <div className="rise">
          <span className="glass-soft inline-flex rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-brand">Board exam prep · Class 9–12</span>
          <h1 className="font-display mt-6 text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl">Prepare Smarter.<br /><span className="text-brand">Score Better.</span></h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-muted-foreground">Your complete Board Exam preparation ecosystem — learn, practice, test, analyze and improve from one platform.</p>
          <div className="mt-8">
            <Link to="/dashboard" className="inline-block rounded-full bg-gradient-brand px-7 py-3.5 text-sm font-semibold text-on-brand shadow-xl shadow-brand/30">Start Preparing</Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-2 text-xs font-semibold text-muted-foreground">
            {CYCLE.map((c, i) => (
              <span key={c} className="flex items-center gap-2">{c}{i < CYCLE.length - 1 && <span className="text-brand">→</span>}</span>
            ))}
          </div>
        </div>

        <div className="glass rise rounded-3xl p-6 md:p-8">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold">Find your track</h3>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Board · Class · Subject</span>
          </div>
          <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Board</p>
          <div className="mt-2 flex flex-wrap gap-2">{BOARDS.map((b) => <Chip key={b} active={board === b} onClick={() => setBoard(b)}>{b}</Chip>)}</div>
          <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Class</p>
          <div className="mt-2 flex flex-wrap gap-2">{CLASSES.map((c) => <Chip key={c} tone="brand2" active={cls === c} onClick={() => { setCls(c); setSubj(SUBJECTS[c]?.[0] ?? ""); }}>{c}</Chip>)}</div>
          <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Subject</p>
          <div className="mt-2 flex flex-wrap gap-2">{subjects.map((s) => <Chip key={s} tone="sky" active={subj === s} onClick={() => setSubj(s)}>{s}</Chip>)}</div>
          <Link to="/dashboard" search={{ board, cls, subject: subj }} className="mt-6 block rounded-2xl bg-gradient-brand py-3.5 text-center text-sm font-semibold text-on-brand shadow-xl shadow-brand/30">
            Build my {board} Class {cls} {subj} plan →
          </Link>
        </div>
      </section>

      <section className="glass rounded-3xl p-8 text-center md:p-12">
        <p className="font-display mx-auto max-w-3xl text-2xl leading-snug md:text-3xl">
          “Most platforms tell students what they <em>can</em> study. <span className="text-brand">TOPIT helps students understand what they should study next.</span>”
        </p>
        <p className="mx-auto mt-5 max-w-3xl text-xs font-semibold uppercase tracking-wider text-muted-foreground">Content + Questions + PYQs + Testing + Analytics + AI + Personalization + Revision + Board Intelligence</p>
      </section>

      <section className="py-16">
        <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">Everything You Need. One Platform.</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(([icon, t, d, tone]) => (
            <div key={t} className="glass rise rounded-3xl p-6 transition hover:-translate-y-1">
              <div className={`grid size-12 place-items-center rounded-2xl text-2xl ${{ brand: "bg-brand/10", sky: "bg-sky/10", mint: "bg-mint/10", amber: "bg-amber/10" }[tone]}`}>{icon}</div>
              <h3 className="font-display mt-5 text-xl font-semibold">{t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
