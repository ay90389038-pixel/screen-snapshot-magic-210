import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Chip, Page } from "@/components/site";

export const Route = createFileRoute("/lab")({
  head: () => ({
    meta: [
      { title: "Practical Lab — TOPIT" },
      { name: "description", content: "Interactive science practicals: circuits, pH tests and microscope work — step through the lab activity and record observations." },
      { property: "og:title", content: "Practical Lab — TOPIT" },
      { property: "og:description", content: "Try physics, chemistry and biology practicals with interactive simulations and an observation log." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Lab,
});

type Experiment = {
  id: string;
  subject: "Physics" | "Chemistry" | "Biology";
  name: string;
  board: string;
  aim: string;
  materials: string[];
  steps: string[];
};

const EXPERIMENTS: Experiment[] = [
  {
    id: "ohm",
    subject: "Physics",
    name: "Ohm's Law — Resistance of a Wire",
    board: "CBSE Class 10",
    aim: "Determine the relationship between current (I) and potential difference (V) across a resistance.",
    materials: ["Battery (1.5 V cells)", "Ammeter", "Voltmeter", "Nichrome wire", "Rheostat", "Connecting wires", "Plug key"],
    steps: [
      "Connect the nichrome wire in series with the battery, ammeter and plug key.",
      "Connect the voltmeter in parallel across the wire.",
      "Close the key and note the ammeter and voltmeter readings.",
      "Adjust the rheostat and record 3–4 sets of readings.",
      "Calculate V/I for each set — it should stay constant (that's R).",
    ],
  },
  {
    id: "ph",
    subject: "Chemistry",
    name: "Testing pH with Universal Indicator",
    board: "CBSE Class 10",
    aim: "Measure the pH of common solutions and classify them as acidic, neutral or basic.",
    materials: ["Test tubes", "Universal indicator", "Lemon juice", "Baking soda solution", "Soap solution", "Dilute HCl", "Distilled water"],
    steps: [
      "Take ~5 mL of the chosen solution in a test tube.",
      "Add 2–3 drops of universal indicator.",
      "Compare the colour against the pH chart.",
      "Record the pH and classify the solution.",
      "Rinse the test tube before testing the next solution.",
    ],
  },
  {
    id: "mix",
    subject: "Chemistry",
    name: "Mix & React — Combine Two Substances",
    board: "CBSE Class 10",
    aim: "Combine any two substances and predict the reaction, equation and observation.",
    materials: ["Virtual beaker", "Substance shelf (elements & compounds)", "Safety goggles (always!)"],
    steps: [
      "Pick the first substance from the shelf.",
      "Pick a second substance to add to the beaker.",
      "Watch the reaction and note the observation.",
      "Balance the chemical equation shown.",
      "Classify the reaction type (combination, displacement, etc.).",
    ],
  },
  {
    id: "micro",
    subject: "Biology",
    name: "Onion Peel Cell under the Microscope",
    board: "CBSE Class 10",
    aim: "Prepare a temporary mount of onion peel and observe the structure of plant cells.",
    materials: ["Onion", "Forceps", "Scalpel", "Glycerine", "Safranin stain", "Coverslip", "Needle"],
    steps: [
      "Peel the thin transparent epidermis from an onion scale leaf.",
      "Place the peel in a drop of water on a slide.",
      "Add 1–2 drops of safranin stain and wait a minute.",
      "Lower a coverslip gently with a needle to avoid air bubbles.",
      "Focus under low power, then switch to high power and observe the cell wall, nucleus and vacuole.",
    ],
  },
];

const SOLUTIONS = [
  { name: "Dilute HCl", ph: 1, colour: "#d32f2f" },
  { name: "Lemon juice", ph: 3, colour: "#f57c00" },
  { name: "Distilled water", ph: 7, colour: "#4caf50" },
  { name: "Baking soda solution", ph: 9, colour: "#3f51b5" },
  { name: "Soap solution", ph: 10, colour: "#1a237e" },
];

const FOCUS_LABELS = [
  "Way too blurry — adjust the coarse focus.",
  "Still blurry — a little more.",
  "Getting closer… cells are appearing.",
  "Almost there — fine focus now.",
  "In focus! You can see the cell wall, nucleus and vacuole.",
];

const SUBSTANCES = [
  { id: "na", name: "Sodium (Na)", kind: "Metal" },
  { id: "cl2", name: "Chlorine (Cl₂)", kind: "Non-metal" },
  { id: "h2", name: "Hydrogen (H₂)", kind: "Non-metal" },
  { id: "o2", name: "Oxygen (O₂)", kind: "Non-metal" },
  { id: "fe", name: "Iron (Fe)", kind: "Metal" },
  { id: "s", name: "Sulphur (S)", kind: "Non-metal" },
  { id: "mg", name: "Magnesium (Mg)", kind: "Metal" },
  { id: "c", name: "Carbon (C)", kind: "Non-metal" },
  { id: "zn", name: "Zinc (Zn)", kind: "Metal" },
  { id: "hcl", name: "Dilute HCl", kind: "Acid" },
  { id: "cuso4", name: "Copper sulphate (CuSO₄)", kind: "Salt solution" },
  { id: "cao", name: "Quicklime (CaO)", kind: "Metal oxide" },
  { id: "h2o", name: "Water (H₂O)", kind: "Compound" },
] as const;

type Reaction = { equation: string; observation: string; type: string; energy: string; colour: string };

const REACTIONS: Record<string, Reaction> = {
  "cl2|na": { equation: "2Na + Cl₂ → 2NaCl", observation: "Sodium burns with a bright yellow flame; white crystals of common salt form.", type: "Combination", energy: "Exothermic", colour: "#facc15" },
  "h2|o2": { equation: "2H₂ + O₂ → 2H₂O", observation: "A loud 'pop' — hydrogen burns explosively and water vapour condenses.", type: "Combination", energy: "Highly exothermic", colour: "#60a5fa" },
  "fe|s": { equation: "Fe + S → FeS", observation: "The mixture glows red-hot on heating; grey-black iron(II) sulphide forms.", type: "Combination", energy: "Exothermic", colour: "#78716c" },
  "mg|o2": { equation: "2Mg + O₂ → 2MgO", observation: "Magnesium burns with a dazzling white flame, leaving white magnesium oxide ash.", type: "Combination (also oxidation)", energy: "Exothermic", colour: "#e7e5e4" },
  "c|o2": { equation: "C + O₂ → CO₂", observation: "Carbon glows and burns; the gas produced turns limewater milky.", type: "Combination (combustion)", energy: "Exothermic", colour: "#a3a3a3" },
  "hcl|zn": { equation: "Zn + 2HCl → ZnCl₂ + H₂↑", observation: "Brisk effervescence — hydrogen gas bubbles off; the gas burns with a pop.", type: "Displacement", energy: "Exothermic", colour: "#bae6fd" },
  "cuso4|fe": { equation: "Fe + CuSO₄ → FeSO₄ + Cu", observation: "The blue solution turns pale green; a brown copper coating deposits on the iron.", type: "Displacement", energy: "Exothermic", colour: "#4ade80" },
  "cao|h2o": { equation: "CaO + H₂O → Ca(OH)₂", observation: "The beaker gets very hot — quicklime slakes into slaked lime with hissing.", type: "Combination", energy: "Highly exothermic", colour: "#f5f5f4" },
  "h2o|na": { equation: "2Na + 2H₂O → 2NaOH + H₂↑", observation: "Sodium darts on the water surface, melts into a ball and may catch fire.", type: "Displacement", energy: "Highly exothermic", colour: "#fdba74" },
  "h2o|c": { equation: "C + H₂O → CO + H₂ (at high temp)", observation: "Red-hot carbon reacts with steam to form water gas.", type: "Displacement", energy: "Endothermic", colour: "#d6d3d1" },
};

function MixSim() {
  const [a, setA] = useState<string | null>(null);
  const [b, setB] = useState<string | null>(null);
  const key = a && b ? [a, b].sort().join("|") : null;
  const rxn = key ? REACTIONS[key] : undefined;
  const both = a !== null && b !== null && a !== b;
  const nameA = SUBSTANCES.find((s) => s.id === a)?.name;
  const nameB = SUBSTANCES.find((s) => s.id === b)?.name;
  return (
    <div className="glass-soft rounded-2xl p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pick two substances to combine</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {SUBSTANCES.map((s) => (
          <Chip key={s.id} active={a === s.id || b === s.id} tone="sky" onClick={() => {
            if (a === s.id) setA(null);
            else if (b === s.id) setB(null);
            else if (a === null) setA(s.id);
            else setB(s.id);
          }}>{s.name}</Chip>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-4">
        <div className="flex h-28 w-20 items-end justify-center rounded-b-full rounded-t-sm border-2 border-border transition-colors" style={{ background: both && rxn ? rxn.colour : "transparent" }}>
          <span className="mb-2 rounded-full bg-white/85 px-2 py-0.5 text-[10px] font-bold text-neutral-900">
            {both ? (rxn ? "Reacted!" : "No reaction") : "Beaker"}
          </span>
        </div>
        <div className="min-w-56 flex-1">
          {both ? (
            rxn ? (
              <>
                <p className="font-display text-xl font-semibold">{rxn.equation}</p>
                <p className="mt-2 text-sm text-muted-foreground">{rxn.observation}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                  <span className="glass-soft rounded-full px-3 py-1">Type: {rxn.type}</span>
                  <span className="glass-soft rounded-full px-3 py-1">{rxn.energy}</span>
                </div>
              </>
            ) : (
              <>
                <p className="font-display text-xl font-semibold">{nameA} + {nameB}</p>
                <p className="mt-2 text-sm text-muted-foreground">No reaction under normal conditions — these two don't combine without special conditions (catalyst, high temperature, electrolysis).</p>
              </>
            )
          ) : (
            <p className="text-sm text-muted-foreground">Select {a === null ? "a first" : "a second"} substance from the shelf above. Try Sodium + Chlorine, or Zinc + Dilute HCl!</p>
          )}
        </div>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">⚠️ Simulation only — many of these reactions are dangerous in real life. Never try them outside a supervised school lab.</p>
    </div>
  );
}

type Obs = { id: number; exp: string; text: string };
const KEY = "topit-lab-log";

function OhmSim() {
  const [v, setV] = useState(3);
  const [r, setR] = useState(6);
  const i = v / r;
  return (
    <div className="glass-soft rounded-2xl p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Voltage (V)</label>
          <input type="range" min={1} max={12} step={1} value={v} onChange={(e) => setV(+e.target.value)} className="mt-2 block w-48 accent-[var(--brand)]" />
          <p className="mt-1 font-display text-lg">{v} V</p>
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Resistance (Ω)</label>
          <input type="range" min={1} max={12} step={1} value={r} onChange={(e) => setR(+e.target.value)} className="mt-2 block w-48 accent-[var(--brand)]" />
          <p className="mt-1 font-display text-lg">{r} Ω</p>
        </div>
        <div className="rounded-2xl bg-card px-6 py-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ammeter reading</p>
          <p className="font-display text-3xl font-semibold">{i.toFixed(2)} A</p>
          <p className="mt-1 text-xs text-muted-foreground">V/I = {(v / r).toFixed(2)} Ω — constant R confirms Ohm's law</p>
        </div>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">Doubling V doubles I (when R is fixed) — current is directly proportional to potential difference.</p>
    </div>
  );
}

function PhSim() {
  const [pick, setPick] = useState(SOLUTIONS[2]!);
  const cls = pick.ph < 7 ? "Acidic" : pick.ph === 7 ? "Neutral" : "Basic";
  return (
    <div className="glass-soft rounded-2xl p-5">
      <div className="flex flex-wrap gap-2">
        {SOLUTIONS.map((s) => (
          <Chip key={s.name} active={pick.name === s.name} tone="sky" onClick={() => setPick(s)}>{s.name}</Chip>
        ))}
      </div>
      <div className="mt-5 flex items-center gap-5">
        <div className="flex h-24 w-16 items-end justify-center rounded-b-full rounded-t-sm border-2 border-border" style={{ background: pick.colour }}>
          <span className="mb-2 rounded-full bg-white/85 px-2 py-0.5 text-xs font-bold text-neutral-900">pH {pick.ph}</span>
        </div>
        <div>
          <p className="font-display text-xl font-semibold">{pick.name}</p>
          <p className="mt-1 text-sm text-muted-foreground">Universal indicator turns <span className="inline-block h-3 w-3 rounded-full align-middle" style={{ background: pick.colour }} /> → solution is <span className="font-semibold">{cls}</span>.</p>
        </div>
      </div>
      <div className="mt-5 flex overflow-hidden rounded-full">
        {Array.from({ length: 13 }, (_, i) => i).map((i) => (
          <div key={i} className="flex-1 py-1 text-center text-[10px] font-semibold text-white" style={{ background: SOLUTIONS.find((s) => s.ph === i)?.colour ?? "#4caf50" }}>{i}</div>
        ))}
      </div>
    </div>
  );
}

function MicroSim() {
  const [focus, setFocus] = useState(0);
  const blur = Math.abs(4 - focus) * 2.2;
  const inFocus = focus === 4;
  return (
    <div className="glass-soft rounded-2xl p-5">
      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Fine focus</label>
      <input type="range" min={0} max={4} step={1} value={focus} onChange={(e) => setFocus(+e.target.value)} className="mt-2 block w-full accent-[var(--brand)]" />
      <div className="mt-4 overflow-hidden rounded-2xl bg-[#f7f3ea]" style={{ padding: blur * 4 }}>
        <div style={{ filter: `blur(${blur}px)`, transition: "filter 300ms" }}>
          <svg viewBox="0 0 300 160" className="w-full">
            {[...Array(12)].map((_, row) =>
              [...Array(7)].map((_, col) => (
                <rect key={`${row}-${col}`} x={col * 43 + (row % 2 ? 8 : 0)} y={row * 14} width={38} height={12} rx={3} fill="none" stroke="#b45309" strokeWidth="1.4" />
              ))
            )}
            <circle cx="150" cy="80" r="6" fill="#92400e" />
            <circle cx="150" cy="80" r="8" fill="none" stroke="#92400e" strokeWidth="1" />
            {inFocus && (
              <>
                <line x1="156" y1="80" x2="230" y2="60" stroke="#7c2d12" strokeWidth="1" />
                <text x="233" y="62" fontSize="9" fill="#7c2d12">Nucleus</text>
                <line x1="60" y1="20" x2="20" y2="10" stroke="#7c2d12" strokeWidth="1" />
                <text x="4" y="8" fontSize="9" fill="#7c2d12">Cell wall</text>
                <line x1="200" y1="120" x2="250" y2="135" stroke="#7c2d12" strokeWidth="1" />
                <text x="253" y="138" fontSize="9" fill="#7c2d12">Vacuole</text>
              </>
            )}
          </svg>
        </div>
      </div>
      <p className={`mt-3 text-sm ${inFocus ? "font-semibold text-mint" : "text-muted-foreground"}`}>{FOCUS_LABELS[focus]}</p>
    </div>
  );
}

function Lab() {
  const [active, setActive] = useState<Experiment | null>(null);
  const [done, setDone] = useState<string[]>([]);
  const [log, setLog] = useState<Obs[]>([]);
  const [note, setNote] = useState("");

  useEffect(() => {
    try {
      setDone(JSON.parse(localStorage.getItem("topit-lab-done") ?? "[]"));
      setLog(JSON.parse(localStorage.getItem(KEY) ?? "[]"));
    } catch { /* ignore */ }
  }, []);

  const markDone = (id: string) => {
    const next = done.includes(id) ? done : [...done, id];
    setDone(next);
    localStorage.setItem("topit-lab-done", JSON.stringify(next));
  };

  const addNote = (exp: string) => {
    if (!note.trim()) return;
    const next = [{ id: Date.now(), exp, text: note.trim() }, ...log];
    setLog(next);
    localStorage.setItem(KEY, JSON.stringify(next));
    setNote("");
  };

  return (
    <Page title="Practical Lab" sub="Interactive science practicals — try each activity and record what you observe">
      {active === null ? (
        <div className="grid gap-5 md:grid-cols-3">
          {EXPERIMENTS.map((e) => (
            <button key={e.id} onClick={() => setActive(e)} className="glass rise rounded-3xl p-6 text-left">
              <div className="flex items-center justify-between">
                <span className="glass-soft rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider">{e.subject}</span>
                {done.includes(e.id) && <span className="text-xs font-semibold text-mint">✓ Completed</span>}
              </div>
              <h3 className="font-display mt-4 text-lg font-semibold">{e.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{e.aim}</p>
              <p className="mt-4 text-xs font-semibold text-brand">Open activity →</p>
            </button>
          ))}
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="glass rounded-3xl p-6">
            <button onClick={() => setActive(null)} className="text-sm font-semibold text-brand">← All experiments</button>
            <span className="glass-soft mt-4 inline-block rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider">{active.subject} · {active.board}</span>
            <h3 className="font-display mt-3 text-xl font-semibold">{active.name}</h3>
            <p className="mt-2 text-sm text-muted-foreground"><span className="font-semibold text-ink">Aim:</span> {active.aim}</p>
            <h4 className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Materials</h4>
            <ul className="mt-2 space-y-1 text-sm">
              {active.materials.map((m) => <li key={m} className="flex gap-2"><span className="text-brand">•</span>{m}</li>)}
            </ul>
            <h4 className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Procedure</h4>
            <ol className="mt-2 space-y-2 text-sm">
              {active.steps.map((s, i) => <li key={s} className="flex gap-2"><span className="font-semibold text-brand">{i + 1}.</span>{s}</li>)}
            </ol>
            <button onClick={() => markDone(active.id)} className="mt-5 w-full rounded-xl bg-gradient-brand py-2 text-sm font-semibold text-on-brand">
              {done.includes(active.id) ? "✓ Marked complete" : "Mark as complete"}
            </button>
          </div>
          <div className="grid gap-5 lg:col-span-2">
            {active.id === "ohm" && <OhmSim />}
            {active.id === "ph" && <PhSim />}
            {active.id === "micro" && <MicroSim />}
            {active.id === "mix" && <MixSim />}
            <div className="glass rounded-3xl p-6">
              <h4 className="font-display text-lg font-semibold">My observation</h4>
              <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="Write what you observed…" className="glass-soft mt-3 w-full rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
              <button onClick={() => addNote(active.name)} className="mt-3 rounded-xl bg-gradient-brand px-5 py-2 text-sm font-semibold text-on-brand">Save observation</button>
              <div className="mt-5 space-y-3">
                {log.filter((o) => o.exp === active.name).map((o) => (
                  <div key={o.id} className="glass-soft rounded-2xl p-4 text-sm">
                    <p className="text-xs text-muted-foreground">{new Date(o.id).toLocaleString()}</p>
                    <p className="mt-1">{o.text}</p>
                  </div>
                ))}
              </div>
            </div>
            {log.length > 0 && (
              <div className="glass rounded-3xl p-6">
                <h4 className="font-display text-lg font-semibold">All observations ({log.length})</h4>
                <div className="mt-3 space-y-2 text-sm">
                  {log.map((o) => (
                    <div key={o.id} className="flex items-start justify-between gap-3">
                      <p><span className="font-semibold">{o.exp.split(" — ")[0]}:</span> {o.text}</p>
                      <button onClick={() => { const next = log.filter((x) => x.id !== o.id); setLog(next); localStorage.setItem(KEY, JSON.stringify(next)); }} className="shrink-0 text-xs text-coral">Delete</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </Page>
  );
}
