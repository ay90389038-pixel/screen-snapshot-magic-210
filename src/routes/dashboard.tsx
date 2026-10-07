import { createFileRoute, Link } from "@tanstack/react-router";
import { chaptersFor } from "@/lib/data";
import { Bar, Page, Stat } from "@/components/site";

type Search = { board?: string; cls?: string; subject?: string };

export const Route = createFileRoute("/dashboard")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    board: typeof s.board === "string" ? s.board : undefined,
    cls: typeof s.cls === "string" ? s.cls : undefined,
    subject: typeof s.subject === "string" ? s.subject : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Dashboard — TOPIT" },
      { name: "description", content: "Your preparation %, accuracy, weak topics and what to study next." },
      { property: "og:title", content: "Dashboard — TOPIT" },
      { property: "og:description", content: "Track board exam preparation and get personalised next steps." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { board = "CBSE", cls = "10", subject = "Science" } = Route.useSearch();
  const chapters = chaptersFor(subject);
  const sorted = [...chapters].sort((a, b) => a.acc - b.acc);
  const weak = sorted.slice(0, 2);
  const strong = sorted.slice(-2).reverse();

  return (
    <Page title="Your dashboard" sub={`Riya · ${board} Class ${cls} · ${subject}`}>
      <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-6">
        <Stat label="Preparation" value="68%" note="▲ 9% this week" />
        <Stat label="Accuracy" value="76%" note="▲ 3%" />
        <Stat label="Study time" value="14h" note="this week" tone="muted" />
        <Stat label="Solved" value="1,240" note="questions" tone="muted" />
        <Stat label="Tests" value="18" note="completed" tone="muted" />
        <Stat label="Weak topics" value={String(weak.length)} note="need drills" tone="coral" />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <div className="glass rounded-3xl p-7 lg:col-span-2">
          <h3 className="font-display text-lg font-semibold">Chapter accuracy</h3>
          <p className="mt-1 text-xs text-muted-foreground">Correct-answer rate · last 30 days</p>
          <div className="mt-6 space-y-5">
            {chapters.map((c) => (
              <div key={c.name}>
                <div className="flex justify-between text-sm font-medium"><span>{c.name}</span><span className="text-muted-foreground">{c.acc}%</span></div>
                <div className="mt-2"><Bar value={c.acc} /></div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-2 text-xs">
            {strong.map((s) => <span key={s.name} className="rounded-full bg-mint/10 px-3 py-1 font-semibold text-mint">Strong: {s.name}</span>)}
          </div>
        </div>

        <div className="glass rounded-3xl p-7">
          <h3 className="font-display text-lg font-semibold">What to study next</h3>
          <p className="mt-1 text-xs text-muted-foreground">Prioritised by impact on your score</p>
          <div className="mt-5 space-y-3">
            {weak.map((w, i) => (
              <div key={w.name} className="glass-soft rounded-2xl p-4">
                <p className="text-sm font-semibold">{i === 0 ? "⚠️" : "📌"} {w.name}</p>
                <p className="text-xs text-muted-foreground">Accuracy {w.acc}% · Revise → Practice → Retest</p>
                <Link to="/practice" className={`mt-3 block rounded-xl py-2 text-center text-xs font-semibold text-on-brand ${i === 0 ? "bg-coral" : "bg-amber"}`}>Start focused drill →</Link>
              </div>
            ))}
            <div className="glass-soft rounded-2xl p-4">
              <p className="text-sm font-semibold">✅ {strong[0].name} quick revision</p>
              <p className="text-xs text-muted-foreground">Lock in {strong[0].acc}%</p>
              <Link to="/pyqs" className="mt-3 block rounded-xl bg-mint py-2 text-center text-xs font-semibold text-on-brand">Review PYQs →</Link>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}
