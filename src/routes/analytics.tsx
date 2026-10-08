import { createFileRoute } from "@tanstack/react-router";
import { Bar, Page, Stat } from "@/components/site";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analyse Performance — TOPIT" },
      { name: "description", content: "Test score trends, subject comparison, mistake patterns and study habits." },
      { property: "og:title", content: "Analyse Performance — TOPIT" },
      { property: "og:description", content: "See how your board exam scores are trending and where marks are lost." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Analytics,
});

const TREND = [{ t: "Test 1", s: 54 }, { t: "Test 2", s: 58 }, { t: "Test 3", s: 61 }, { t: "Test 4", s: 59 }, { t: "Test 5", s: 67 }, { t: "Test 6", s: 72 }, { t: "Test 7", s: 76 }];
const SUBJECTS = [{ n: "Mathematics", v: 78 }, { n: "Science", v: 69 }, { n: "Social Science", v: 74 }, { n: "English", v: 85 }];
const MISTAKES = [{ n: "Calculation errors", v: 38 }, { n: "Concept unclear", v: 27 }, { n: "Misread question", v: 20 }, { n: "Ran out of time", v: 15 }];
const WEEK = [{ d: "Mon", h: 2.5 }, { d: "Tue", h: 1.5 }, { d: "Wed", h: 3 }, { d: "Thu", h: 1 }, { d: "Fri", h: 2 }, { d: "Sat", h: 4 }, { d: "Sun", h: 0.5 }];

function Analytics() {
  const maxH = Math.max(...WEEK.map((w) => w.h));
  return (
    <Page title="Analyse performance" sub="Riya · CBSE Class 10 · last 30 days">
      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        <Stat label="Average score" value="64%" note="▲ 22% since Test 1" />
        <Stat label="Best test" value="76%" note="Test 7" />
        <Stat label="Avg time / question" value="48s" note="target 40s" tone="amber" />
        <Stat label="Predicted board score" value="78%" note="if trend holds" />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <div className="glass rounded-3xl p-7 lg:col-span-2">
          <h3 className="font-display text-lg font-semibold">Score trend</h3>
          <div className="mt-6 flex h-48 items-end gap-3">
            {TREND.map((x) => (
              <div key={x.t} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-xs font-semibold">{x.s}%</span>
                <div className="w-full rounded-t-xl bg-gradient-brand" style={{ height: `${x.s * 1.6}px` }} />
                <span className="text-[10px] text-muted-foreground">{x.t}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="glass rounded-3xl p-7">
          <h3 className="font-display text-lg font-semibold">Where marks are lost</h3>
          <div className="mt-5 space-y-4">
            {MISTAKES.map((m) => (
              <div key={m.n}>
                <div className="flex justify-between text-sm"><span>{m.n}</span><span className="text-muted-foreground">{m.v}%</span></div>
                <div className="mt-1"><Bar value={m.v * 2} tone="coral" /></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div className="glass rounded-3xl p-7">
          <h3 className="font-display text-lg font-semibold">Subject comparison</h3>
          <div className="mt-5 space-y-4">
            {SUBJECTS.map((s) => (
              <div key={s.n}>
                <div className="flex justify-between text-sm"><span>{s.n}</span><span className="text-muted-foreground">{s.v}%</span></div>
                <div className="mt-1"><Bar value={s.v} /></div>
              </div>
            ))}
          </div>
        </div>
        <div className="glass rounded-3xl p-7">
          <h3 className="font-display text-lg font-semibold">Study hours this week</h3>
          <div className="mt-6 flex h-40 items-end gap-3">
            {WEEK.map((w) => (
              <div key={w.d} className="flex flex-1 flex-col items-center gap-2">
                <div className="w-full rounded-t-xl bg-sky" style={{ height: `${(w.h / maxH) * 120}px` }} />
                <span className="text-[10px] text-muted-foreground">{w.d}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">Tip: Sunday and Thursday are your lightest days — add a 30-min revision slot.</p>
        </div>
      </div>
    </Page>
  );
}
