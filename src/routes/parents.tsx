import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Page, Stat } from "@/components/site";

export const Route = createFileRoute("/parents")({
  head: () => ({
    meta: [
      { title: "Parental Control — TOPIT" },
      { name: "description", content: "Parents can set study limits, block distractions and get weekly progress reports." },
      { property: "og:title", content: "Parental Control — TOPIT" },
      { property: "og:description", content: "Keep track of your child's board exam preparation with TOPIT parental controls." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Parents,
});

const DEMO_PIN = "1234";
const ACTIVITY = [
  { when: "Today, 7:40 PM", what: "Completed Science quiz — 5/6 correct" },
  { when: "Today, 6:10 PM", what: "Asked AI Tutor about Carbon Compounds" },
  { when: "Yesterday", what: "Revised Light – Reflection notes (25 min)" },
  { when: "Yesterday", what: "Solved 12 PYQs from 2023" },
];

function Toggle({ label, desc, on, set }: { label: string; desc: string; on: boolean; set: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div><p className="text-sm font-semibold">{label}</p><p className="text-xs text-muted-foreground">{desc}</p></div>
      <button role="switch" aria-checked={on} aria-label={label} onClick={() => set(!on)} className={`relative h-6 w-11 shrink-0 rounded-full transition ${on ? "bg-brand" : "bg-muted"}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-card shadow transition-all ${on ? "left-5" : "left-0.5"}`} />
      </button>
    </div>
  );
}

function Parents() {
  const [pin, setPin] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [err, setErr] = useState(false);
  const [limit, setLimit] = useState(3);
  const [tutor, setTutor] = useState(true);
  const [report, setReport] = useState(true);
  const [bedtime, setBedtime] = useState(true);
  const [alerts, setAlerts] = useState(false);

  if (!unlocked) {
    return (
      <Page title="Parental control" sub="For parents and guardians">
        <form
          onSubmit={(e) => { e.preventDefault(); if (pin === DEMO_PIN) setUnlocked(true); else setErr(true); }}
          className="glass mx-auto max-w-sm rounded-3xl p-8 text-center"
        >
          <p className="text-4xl">🔒</p>
          <h3 className="font-display mt-3 text-xl font-semibold">Enter parent PIN</h3>
          <input value={pin} onChange={(e) => { setPin(e.target.value); setErr(false); }} type="password" inputMode="numeric" maxLength={4} aria-label="Parent PIN" className="glass-soft mt-5 w-full rounded-xl px-4 py-3 text-center text-lg tracking-[0.5em] outline-none focus:ring-2 focus:ring-ring" />
          {err && <p className="mt-2 text-xs text-coral">Wrong PIN, try again.</p>}
          <button className="mt-4 w-full rounded-xl bg-gradient-brand py-2.5 text-sm font-semibold text-on-brand">Unlock</button>
          <p className="mt-3 text-xs text-muted-foreground">Demo PIN: 1234</p>
        </form>
      </Page>
    );
  }

  return (
    <Page title="Parental control" sub="Monitoring Riya · CBSE Class 10">
      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        <Stat label="Studied today" value="2h 10m" note={`of ${limit}h limit`} tone="muted" />
        <Stat label="This week" value="14h" note="▲ 2h vs last week" />
        <Stat label="Accuracy" value="76%" note="▲ 3%" />
        <Stat label="Weak topics" value="2" note="Carbon, Light" tone="coral" />
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div className="glass rounded-3xl p-7">
          <h3 className="font-display text-lg font-semibold">Controls</h3>
          <div className="py-3">
            <div className="flex justify-between text-sm font-semibold"><span>Daily screen-time limit</span><span>{limit} h</span></div>
            <input type="range" min={1} max={6} value={limit} onChange={(e) => setLimit(Number(e.target.value))} aria-label="Daily limit" className="mt-2 w-full accent-[var(--color-brand)]" />
          </div>
          <div className="divide-y divide-border">
            <Toggle label="Allow AI Tutor" desc="Let your child chat with the AI tutor" on={tutor} set={setTutor} />
            <Toggle label="Bedtime lock" desc="Block the app from 10 PM to 6 AM" on={bedtime} set={setBedtime} />
            <Toggle label="Weekly progress report" desc="Summary of scores and study time every Sunday" on={report} set={setReport} />
            <Toggle label="Low-score alerts" desc="Notify me when a test score drops below 50%" on={alerts} set={setAlerts} />
          </div>
        </div>
        <div className="glass rounded-3xl p-7">
          <h3 className="font-display text-lg font-semibold">Recent activity</h3>
          <div className="mt-4 space-y-3">
            {ACTIVITY.map((a) => (
              <div key={a.what} className="glass-soft rounded-2xl p-4">
                <p className="text-sm font-medium">{a.what}</p>
                <p className="text-xs text-muted-foreground">{a.when}</p>
              </div>
            ))}
          </div>
          <button onClick={() => { setUnlocked(false); setPin(""); }} className="mt-5 w-full rounded-xl py-2 text-sm font-semibold glass-soft">Lock parent view</button>
        </div>
      </div>
    </Page>
  );
}
