import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Chip, Page } from "@/components/site";
import { useStudent } from "@/context/StudentContext";
import {
  fetchStudentNotes,
  createStudentNote,
  deleteStudentNote,
  type StudentNote,
} from "@/integrations/supabase/api";

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
  {
    chapter: "Carbon & its Compounds",
    subject: "Science",
    points: [
      "Carbon forms covalent bonds via tetravalency and catenation.",
      "Hydrocarbon series: Alkanes CnH2n+2, Alkenes CnH2n, Alkynes CnH2n-2.",
      "Homologous series members share identical chemical properties and differ by a –CH₂– unit.",
      "Esterification: Carboxylic acid + alcohol in presence of acid catalyst yields sweet-smelling ester.",
    ],
  },
  {
    chapter: "Acids, Bases & Salts",
    subject: "Science",
    points: [
      "pH scale: < 7 acidic, 7 neutral, > 7 alkaline/basic.",
      "Neutralisation reaction: Acid + base → salt + water.",
      "Tooth enamel decay accelerates below pH 5.5.",
      "Common chemicals: Baking soda (NaHCO₃), Bleaching powder (CaOCl₂), Washing soda (Na₂CO₃·10H₂O).",
    ],
  },
  {
    chapter: "Light – Reflection & Refraction",
    subject: "Science",
    points: [
      "Mirror formula: 1/v + 1/u = 1/f; Lens formula: 1/v - 1/u = 1/f.",
      "Radius of curvature R = 2f.",
      "Magnification: m = -v/u (mirrors), m = +v/u (lenses).",
      "Object positioned at centre of curvature (C) yields a real, inverted, same-sized image at C.",
    ],
  },
  {
    chapter: "Life Processes",
    subject: "Science",
    points: [
      "Functional filtration unit of kidneys is the Nephron.",
      "Photosynthesis equation: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂ (under chlorophyll and sunlight).",
      "Aerobic cellular respiration yields significantly higher ATP than anaerobic pathway (fermentation).",
      "Bile juice secreted by liver creates an alkaline medium and emulsifies fats.",
    ],
  },
  {
    chapter: "Real Numbers & Polynomials",
    subject: "Mathematics",
    points: [
      "Fundamental Theorem of Arithmetic: Every composite number factors uniquely into primes.",
      "If α and β are roots of ax² + bx + c = 0: α + β = -b/a, αβ = c/a.",
      "Discriminant D = b² - 4ac determines nature of roots (D > 0 real/distinct, D = 0 equal, D < 0 no real roots).",
    ],
  },
  {
    chapter: "Nationalism in India",
    subject: "Social Science",
    points: [
      "Rowlatt Act (1919) authorised indefinite detention without trial, triggering the Rowlatt Satyagraha.",
      "Jallianwala Bagh incident occurred on 13 April 1919 during Baisakhi.",
      "Non-Cooperation Movement launched in 1920; halted in 1922 following the Chauri Chaura incident.",
      "Dandi Salt March (12 March – 6 April 1930) marked launch of Civil Disobedience Movement.",
    ],
  },
];

type LocalNote = {
  id: string;
  user_id?: string;
  title: string;
  subject: string;
  body: string;
  created_at: string;
};

const LOCAL_STORAGE_KEY = "topit-my-notes";

function Notes() {
  const { user, profile } = useStudent();
  const [tab, setTab] = useState<"chapter" | "mine">("chapter");
  const [mine, setMine] = useState<LocalNote[]>([]);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("Science");
  const [body, setBody] = useState("");
  const [filterSubject, setFilterSubject] = useState<string>("All");
  const [loadingNotes, setLoadingNotes] = useState(false);

  // Load notes: from Supabase if user is logged in, otherwise from localStorage
  useEffect(() => {
    async function loadNotes() {
      if (user?.id) {
        setLoadingNotes(true);
        try {
          const remoteNotes = await fetchStudentNotes(user.id);
          setMine(remoteNotes);
        } catch (err) {
          console.error("Failed to load notes from Supabase:", err);
        } finally {
          setLoadingNotes(false);
        }
      } else {
        try {
          const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (stored) {
            setMine(JSON.parse(stored));
          }
        } catch {
          // ignore parsing error
        }
      }
    }

    loadNotes();
  }, [user?.id]);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    if (user?.id) {
      try {
        const created = await createStudentNote({
          user_id: user.id,
          title: title.trim(),
          subject,
          body: body.trim(),
        });
        setMine((prev) => [created, ...prev]);
        setTitle("");
        setBody("");
      } catch (err) {
        console.error("Failed to save note to Supabase:", err);
      }
    } else {
      const localNew: LocalNote = {
        id: String(Date.now()),
        title: title.trim(),
        subject,
        body: body.trim(),
        created_at: new Date().toISOString(),
      };
      const updated = [localNew, ...mine];
      setMine(updated);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      setTitle("");
      setBody("");
    }
  };

  const handleDelete = async (id: string) => {
    if (user?.id) {
      try {
        await deleteStudentNote(id);
        setMine((prev) => prev.filter((m) => m.id !== id));
      } catch (err) {
        console.error("Failed to delete note from Supabase:", err);
      }
    } else {
      const updated = mine.filter((m) => m.id !== id);
      setMine(updated);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    }
  };

  const visibleChapterNotes =
    filterSubject === "All"
      ? CHAPTER_NOTES
      : CHAPTER_NOTES.filter((c) => c.subject === filterSubject);

  const studentName = profile?.full_name || (user ? "Student" : null);

  return (
    <Page
      title="Notes"
      sub={
        studentName
          ? `Revision notes tailored for ${studentName} • Class ${profile?.class_grade || "10"}`
          : "Quick revision notes and your personal study notebook"
      }
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <Chip active={tab === "chapter"} onClick={() => setTab("chapter")}>
            Chapter revision
          </Chip>
          <Chip active={tab === "mine"} tone="brand2" onClick={() => setTab("mine")}>
            My notes ({mine.length})
          </Chip>
        </div>

        {tab === "chapter" && (
          <div className="flex gap-2">
            {["All", "Science", "Mathematics", "Social Science"].map((subj) => (
              <button
                key={subj}
                type="button"
                onClick={() => setFilterSubject(subj)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                  filterSubject === subj
                    ? "bg-brand text-on-brand shadow-sm"
                    : "glass-soft text-muted-foreground hover:text-foreground"
                }`}
              >
                {subj}
              </button>
            ))}
          </div>
        )}
      </div>

      {tab === "chapter" ? (
        <div className="grid gap-5 md:grid-cols-2">
          {visibleChapterNotes.map((c) => (
            <div key={c.chapter} className="glass rise rounded-3xl p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold">{c.chapter}</h3>
                <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-[11px] font-semibold text-brand">
                  {c.subject}
                </span>
              </div>
              <ul className="mt-4 space-y-2 text-sm">
                {c.points.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-muted-foreground">
                    <span className="text-brand font-bold">•</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-3">
          <form onSubmit={handleAddNote} className="glass rounded-3xl p-6">
            <h3 className="font-display text-lg font-semibold">New Note</h3>

            <div className="mt-4 flex gap-2">
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="glass-soft rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="Science">Science</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Social Science">Social Science</option>
                <option value="English">English</option>
              </select>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Topic / Title"
                className="glass-soft flex-1 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Jot key formulas, exam pointers, or reminders..."
              rows={6}
              className="glass-soft mt-3 w-full rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />

            <button
              type="submit"
              className="mt-3 w-full rounded-xl bg-gradient-brand py-2 text-sm font-semibold text-on-brand shadow transition hover:opacity-95"
            >
              Save Note
            </button>
            <p className="mt-2 text-center text-[11px] text-muted-foreground">
              {user ? "☁️ Synced to your Supabase account" : "💾 Saved locally on this browser"}
            </p>
          </form>

          <div className="grid gap-4 lg:col-span-2 md:grid-cols-2">
            {loadingNotes ? (
              <div className="glass flex items-center justify-center rounded-3xl p-8 text-center md:col-span-2">
                <p className="text-sm text-muted-foreground">Loading your notes...</p>
              </div>
            ) : mine.length === 0 ? (
              <div className="glass flex flex-col items-center justify-center rounded-3xl p-8 text-center md:col-span-2">
                <p className="font-medium text-foreground">No personal notes yet</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Save formulas and quick revision points here to access them on any device.
                </p>
              </div>
            ) : (
              mine.map((n) => (
                <div key={n.id} className="glass rise rounded-3xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="rounded-full bg-brand2/10 px-2 py-0.5 text-[10px] font-semibold text-brand2">
                          {n.subject}
                        </span>
                        <h4 className="mt-1 font-semibold text-foreground">{n.title}</h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDelete(n.id)}
                        className="text-xs text-coral hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                    <p className="mt-3 whitespace-pre-line text-sm text-muted-foreground">
                      {n.body}
                    </p>
                  </div>
                  <div className="mt-4 border-t border-border/40 pt-2 text-right">
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(n.created_at).toLocaleDateString("en-IN", {
