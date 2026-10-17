import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PaperReader } from "@/components/PaperReader";
import { CBSE_PAPERS, SUBJECTS_BY_CLASS, YEARS, type CbsePaper } from "@/data/cbsePapers";
import { Page, Chip } from "@/components/site";
import { externalSupabase as supabase } from "@/integrations/external/client";

export const Route = createFileRoute("/papers")({
  head: () => ({
    meta: [
      { title: "CBSE PYQ & Sample Papers — TOPIT" },
      { name: "description", content: "CBSE Class 10 and 12 board exam papers, sample papers and marking schemes with an in-app reader." },
      { property: "og:title", content: "CBSE PYQ & Sample Papers — TOPIT" },
      { property: "og:description", content: "Read CBSE board papers and official sample papers with marking schemes, without leaving TOPIT." },
    ],
  }),
  component: Papers,
});

type View = { paper: CbsePaper; mode: "paper" | "solution" };

function Papers() {
  const [std, setStd] = useState<"10" | "12">("10");
  const [subject, setSubject] = useState("All");
  const [year, setYear] = useState("All");
  const [type, setType] = useState<"Board Paper" | "SQP">("Board Paper");
  const [q, setQ] = useState("");
  const [view, setView] = useState<View | null>(null);
  const [papers, setPapers] = useState<CbsePaper[] | null>(null);

  useEffect(() => {
    supabase.from("cbse_pyqs").select("*").then(({ data, error }) => {
      if (error || !data) { setPapers(CBSE_PAPERS); return; }
      setPapers(data.map((r) => ({
        id: r.id, standard: r.standard as "10" | "12", subject: r.subject, year: r.year,
        type: (r.paper_type === "SQP" ? "SQP" : "Board Paper") as CbsePaper["type"],
        set: r.set_number ?? undefined, paperUrl: r.paper_url, solutionUrl: r.solution_url ?? undefined,
      })));
    });
  }, []);

  const rows = (papers ?? []).filter((p) =>
    p.standard === std && p.type === type &&
    (subject === "All" || p.subject === subject) &&
    (year === "All" || p.year === year) &&
    `${p.subject} ${p.set ?? ""} ${p.year}`.toLowerCase().includes(q.toLowerCase()),
  ).sort((a, b) => b.year.localeCompare(a.year));
  const sel = "glass-soft rounded-full px-4 py-2 text-sm font-semibold outline-none";
  const btn = "rounded-full px-4 py-2 text-xs font-semibold transition";

  return (
    <Page title="CBSE Board Exam PYQ & Sample Papers" sub="Read papers and marking schemes right here — no leaving the site. Links are sample data; check the official CBSE site before relying on them.">
      <div className="glass mb-5 grid gap-3 rounded-3xl p-4">
        <div className="flex flex-wrap gap-2">
          <Chip active={std === "10"} onClick={() => { setStd("10"); setSubject("All"); }}>Class 10</Chip>
          <Chip active={std === "12"} onClick={() => { setStd("12"); setSubject("All"); }}>Class 12</Chip>
          <span className="mx-2 hidden w-px bg-border sm:block" />
          <Chip tone="sky" active={type === "Board Paper"} onClick={() => setType("Board Paper")}>Board Exam Papers</Chip>
          <Chip tone="sky" active={type === "SQP"} onClick={() => setType("SQP")}>Official Sample Papers (SQP & MS)</Chip>
        </div>
        <div className="flex flex-wrap gap-3">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by set or keyword, e.g. Set 2" className="glass-soft min-w-60 flex-1 rounded-full px-5 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
          <select value={subject} onChange={(e) => setSubject(e.target.value)} className={sel}>
            <option>All</option>
            {SUBJECTS_BY_CLASS[std].map((s) => <option key={s}>{s}</option>)}
          </select>
          <select value={year} onChange={(e) => setYear(e.target.value)} className={sel}>
            <option>All</option>
            {YEARS.map((y) => <option key={y}>{y}</option>)}
          </select>
        </div>
      </div>

      <p className="mb-3 text-sm text-muted-foreground">{rows.length} documents</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((p) => (
          <div key={p.id} className="glass rise flex flex-col rounded-3xl p-5">
            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              <span className="rounded-full bg-brand/10 px-3 py-1 text-brand">{p.standard}th</span>
              <span className="rounded-full bg-amber/10 px-3 py-1 text-amber">{p.year}</span>
              <span className="rounded-full bg-sky/10 px-3 py-1 text-sky">{p.type === "SQP" ? "Sample Paper" : "Board Paper"}</span>
            </div>
            <h3 className="font-display mt-3 text-lg font-semibold">{p.subject}</h3>
            <p className="text-sm text-muted-foreground">{p.set ?? `Session ${Number(p.year) - 1}–${p.year.slice(2)}`}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button onClick={() => setView({ paper: p, mode: "paper" })} className={`${btn} bg-gradient-brand text-on-brand`}>View Paper</button>
              <button disabled={!p.solutionUrl} onClick={() => setView({ paper: p, mode: "solution" })} className={`${btn} glass-soft hover:bg-card disabled:opacity-40`}>{p.solutionUrl ? "Marking Scheme / Solution" : "No solution yet"}</button>
              <a href={p.paperUrl} target="_blank" rel="noopener noreferrer" download className={`${btn} glass-soft hover:bg-card`}>Download PDF</a>
            </div>
          </div>
        ))}
        {rows.length === 0 && <p className="text-muted-foreground">No matching papers.</p>}
      </div>

      {view && <PaperReader paper={view.paper} initial={view.mode} onClose={() => setView(null)} />}
    </Page>
  );
}

