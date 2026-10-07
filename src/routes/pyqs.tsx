import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PYQS } from "@/lib/data";
import { Page } from "@/components/site";

export const Route = createFileRoute("/pyqs")({
  head: () => ({
    meta: [
      { title: "PYQ Intelligence — TOPIT" },
      { name: "description", content: "Previous year questions organised by chapter, topic, year, marks and historical frequency." },
      { property: "og:title", content: "PYQ Intelligence — TOPIT" },
      { property: "og:description", content: "Search previous year board questions and see how often concepts were tested." },
    ],
  }),
  component: Pyqs,
});

function Pyqs() {
  const [query, setQuery] = useState("");
  const [year, setYear] = useState("All");
  const [marks, setMarks] = useState("All");
  const years = ["All", ...Array.from(new Set(PYQS.map((p) => String(p.year))))];
  const rows = PYQS.filter((p) =>
    (year === "All" || String(p.year) === year) &&
    (marks === "All" || String(p.marks) === marks) &&
    `${p.chapter} ${p.topic} ${p.q}`.toLowerCase().includes(query.toLowerCase()),
  );
  const sel = "glass-soft rounded-full px-4 py-2 text-sm font-semibold outline-none";

  return (
    <Page title="PYQ Intelligence" sub="Historical frequency shows past patterns only — it never guarantees a question will appear.">
      <div className="glass mb-5 flex flex-wrap gap-3 rounded-3xl p-4">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search a topic, e.g. Carbon Compounds" className="glass-soft min-w-60 flex-1 rounded-full px-5 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
        <select value={year} onChange={(e) => setYear(e.target.value)} className={sel}>{years.map((y) => <option key={y}>{y}</option>)}</select>
        <select value={marks} onChange={(e) => setMarks(e.target.value)} className={sel}>{["All", "1", "2", "3", "5"].map((m) => <option key={m}>{m}</option>)}</select>
      </div>
      <div className="grid gap-4">
        {rows.map((p, i) => (
          <div key={i} className="glass rise rounded-3xl p-6">
            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              <span className="rounded-full bg-brand/10 px-3 py-1 text-brand">{p.year}</span>
              <span className="rounded-full bg-sky/10 px-3 py-1 text-sky">{p.chapter} · {p.topic}</span>
              <span className="rounded-full bg-amber/10 px-3 py-1 text-amber">{p.marks} marks · {p.type}</span>
              <span className="ml-auto text-muted-foreground">Concept asked in {p.freq} of last 10 papers (demo)</span>
            </div>
            <p className="mt-3 font-medium">{p.q}</p>
          </div>
        ))}
        {rows.length === 0 && <p className="text-muted-foreground">No matching questions.</p>}
      </div>
    </Page>
  );
}
