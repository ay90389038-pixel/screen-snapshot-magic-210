import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Chip, Page } from "@/components/site";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Notes — TOPIT" },
      { name: "description", content: "Chapter-wise revision notes and your own personal study notes." },
      { property: "og:title", content: "Notes — TOPIT" },
      { property: "og:description", content: "Quick revision notes for every board chapter, plus your own notes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Notes,
});

const CHAPTER_NOTES = [
  { chapter: "Carbon Compounds", points: ["Carbon forms covalent bonds (tetravalency).", "Alkanes CnH2n+2, alkenes CnH2n, alkynes CnH2n-2.", "Homologous series differ by –CH₂–.", "Ethanol + ethanoic acid → ester (esterification)."] },
  { chapter: "Acids, Bases & Salts", points: ["pH < 7 acidic, 7 neutral, > 7 basic.", "Acid + base → salt + water (neutralisation).", "Tooth decay starts below pH 5.5.", "Baking soda: NaHCO₃; washing soda: Na₂CO₃·10H₂O."] },
  { chapter: "Light – Reflection", points: ["Mirror formula: 1/v + 1/u = 1/f.", "R = 2f.", "Magnification m = –v/u.", "Object at C → real, inverted, same-size image at C."] },
  { chapter: "Life Processes", points: ["Nephron is the filtering unit of kidney.", "Photosynthesis: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂.", "Aerobic respiration releases more energy than anaerobic."] },
];

type MyNote = { id: number; title: string; body: string };
const KEY = "topit-my-notes";

function Notes() {
  const [tab, setTab] = useState<"chapter" | "mine">("chapter");
  const [mine, setMine] = useState<MyNote[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    try { setMine(JSON.parse(localStorage.getItem(KEY) ?? "[]")); } catch { /* ignore */ }
  }, []);
  const save = (n: MyNote[]) => { setMine(n); localStorage.setItem(KEY, JSON.stringify(n)); };

  return (
    <Page title="Notes" sub="Quick revision notes and your own study notes">
      <div className="mb-6 flex gap-2">
        <Chip active={tab === "chapter"} onClick={() => setTab("chapter")}>Chapter notes</Chip>
        <Chip active={tab === "mine"} tone="brand2" onClick={() => setTab("mine")}>My notes ({mine.length})</Chip>
      </div>

      {tab === "chapter" ? (
        <div className="grid gap-5 md:grid-cols-2">
          {CHAPTER_NOTES.map((c) => (
            <div key={c.chapter} className="glass rise rounded-3xl p-6">
              <h3 className="font-display text-lg font-semibold">{c.chapter}</h3>
              <ul className="mt-3 space-y-2 text-sm">
                {c.points.map((p) => <li key={p} className="flex gap-2"><span className="text-brand">•</span>{p}</li>)}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-3">
          <form
            onSubmit={(e) => { e.preventDefault(); if (!title.trim()) return; save([{ id: Date.now(), title, body }, ...mine]); setTitle(""); setBody(""); }}
            className="glass rounded-3xl p-6"
          >
            <h3 className="font-display text-lg font-semibold">New note</h3>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="glass-soft mt-4 w-full rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
            <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write your note…" rows={6} className="glass-soft mt-3 w-full rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
            <button className="mt-3 w-full rounded-xl bg-gradient-brand py-2 text-sm font-semibold text-on-brand">Save note</button>
            <p className="mt-2 text-xs text-muted-foreground">Saved on this device only.</p>
          </form>
          <div className="grid gap-4 lg:col-span-2 md:grid-cols-2">
            {mine.length === 0 && <p className="text-sm text-muted-foreground">No notes yet — write your first one.</p>}
            {mine.map((n) => (
              <div key={n.id} className="glass rounded-3xl p-5">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold">{n.title}</h4>
                  <button onClick={() => save(mine.filter((m) => m.id !== n.id))} className="text-xs text-coral">Delete</button>
                </div>
                <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">{n.body}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </Page>
  );
}
