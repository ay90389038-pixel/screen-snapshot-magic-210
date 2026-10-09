import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Chip, Page } from "@/components/site";

export const Route = createFileRoute("/lab")({
  head: () => ({
    meta: [
      { title: "Science Lab with LabXchange — TOPIT" },
      { name: "description", content: "Open LabXchange's free virtual labs, simulations, pathways and science library straight from TOPIT." },
      { property: "og:title", content: "Science Lab with LabXchange — TOPIT" },
      { property: "og:description", content: "Virtual labs, interactive simulations and learning pathways from LabXchange for Class 9–12 science." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Lab,
});

const LX = "https://www.labxchange.org";
const lib = (q: string) => `${LX}/library?q=${encodeURIComponent(q)}`;

const FEATURES = [
  { name: "Content Library", desc: "Thousands of free videos, simulations, readings and questions.", href: `${LX}/library` },
  { name: "Virtual Labs", desc: "Step-by-step lab simulations you can run in your browser.", href: lib("virtual lab") },
  { name: "Interactive Simulations", desc: "Play with models of circuits, cells, molecules and more.", href: lib("simulation") },
  { name: "Pathways", desc: "Guided sequences that take you through a topic in order.", href: lib("pathway") },
  { name: "Clusters & Courses", desc: "Bigger collections organised around a full subject area.", href: `${LX}/library/clusters` },
  { name: "Classes", desc: "Join a class your teacher created and get assignments.", href: `${LX}/personal/classes` },
  { name: "My Content", desc: "Save favourites and build your own learning pathways.", href: `${LX}/personal` },
  { name: "Sign in / Create account", desc: "Free account to save progress and join classes.", href: `${LX}/signin` },
];

const TOPICS: { subject: "Physics" | "Chemistry" | "Biology"; topic: string }[] = [
  { subject: "Physics", topic: "Ohm's law" },
  { subject: "Physics", topic: "Electric circuits" },
  { subject: "Physics", topic: "Refraction of light" },
  { subject: "Physics", topic: "Magnetic field" },
  { subject: "Chemistry", topic: "Chemical reactions" },
  { subject: "Chemistry", topic: "Acids and bases pH" },
  { subject: "Chemistry", topic: "Periodic table" },
  { subject: "Chemistry", topic: "Carbon compounds" },
  { subject: "Biology", topic: "Microscope cells" },
  { subject: "Biology", topic: "Photosynthesis" },
  { subject: "Biology", topic: "DNA" },
  { subject: "Biology", topic: "Heredity genetics" },
];

function Lab() {
  const [q, setQ] = useState("");
  const [subject, setSubject] = useState<"All" | "Physics" | "Chemistry" | "Biology">("All");
  const topics = useMemo(() => TOPICS.filter((t) => subject === "All" || t.subject === subject), [subject]);

  return (
    <Page title="Science Lab" sub="Powered by LabXchange — free virtual labs and simulations from Harvard's Amgen Foundation project. Opens in a new tab.">
      <form
        className="glass mb-8 flex flex-wrap gap-3 rounded-2xl p-4"
        onSubmit={(e) => { e.preventDefault(); if (q.trim()) window.open(lib(q.trim()), "_blank", "noopener"); }}
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search LabXchange — e.g. titration, lens, mitosis"
          className="min-w-0 flex-1 rounded-xl border border-border bg-background/60 px-4 py-2 text-sm outline-none"
        />
        <button className="rounded-xl bg-primary px-5 py-2 text-sm font-medium text-primary-foreground">Search</button>
      </form>

      <h2 className="mb-3 font-display text-2xl font-semibold">LabXchange features</h2>
      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f) => (
          <a key={f.name} href={f.href} target="_blank" rel="noopener noreferrer" className="glass rounded-2xl p-5 transition hover:-translate-y-0.5">
            <div className="font-semibold">{f.name} ↗</div>
            <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
          </a>
        ))}
      </div>

      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-2xl font-semibold">Board syllabus practicals</h2>
        <div className="flex gap-2">
          {(["All", "Physics", "Chemistry", "Biology"] as const).map((s) => (
            <button key={s} onClick={() => setSubject(s)} className={`rounded-full px-3 py-1 text-sm ${subject === s ? "bg-primary text-primary-foreground" : "glass-soft"}`}>{s}</button>
          ))}
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {topics.map((t) => (
          <a key={t.topic} href={lib(t.topic)} target="_blank" rel="noopener noreferrer" className="glass-soft flex items-center justify-between rounded-xl p-4">
            <span className="font-medium">{t.topic}</span>
            <Chip>{t.subject}</Chip>
          </a>
        ))}
      </div>
      <p className="mt-8 text-xs text-muted-foreground">LabXchange doesn't allow its labs to be shown inside other websites, so each link opens LabXchange directly.</p>
    </Page>
  );
}
