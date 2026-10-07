import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/practice", label: "Practice" },
  { to: "/pyqs", label: "PYQs" },
  { to: "/tutor", label: "AI Tutor" },
  { to: "/updates", label: "Board Updates" },
] as const;

export function Logo() {
  return <span className="font-display text-2xl font-semibold tracking-tight">TOP<span className="text-brand">IT</span></span>;
}

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-4 z-30 mx-auto max-w-6xl px-4">
      <nav className="glass flex items-center justify-between rounded-full px-5 py-3">
        <Link to="/"><Logo /></Link>
        <div className="hidden items-center gap-6 text-sm font-medium text-muted-foreground lg:flex">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} activeOptions={{ exact: true }} className="hover:text-ink" activeProps={{ className: "text-brand" }}>{n.label}</Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Link to="/dashboard" className="rounded-full bg-gradient-brand px-5 py-2 text-sm font-semibold text-on-brand shadow-lg shadow-brand/30">Start Preparing</Link>
          <button onClick={() => setOpen(!open)} className="rounded-full px-3 py-2 text-sm font-semibold lg:hidden" aria-label="Menu">☰</button>
        </div>
      </nav>
      {open && (
        <div className="glass mt-2 grid gap-1 rounded-3xl p-3 lg:hidden">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="rounded-xl px-4 py-2 text-sm font-medium hover:bg-accent">{n.label}</Link>
          ))}
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="relative z-10 mx-auto mt-10 max-w-6xl px-4 pb-10">
      <div className="glass flex flex-col items-center justify-between gap-4 rounded-3xl px-8 py-6 text-sm text-muted-foreground sm:flex-row">
        <Logo />
        <p>Prototype · all scores, questions and notices shown are demo data.</p>
        <span>© 2026 TOPIT Learning</span>
      </div>
    </footer>
  );
}

export function Page({ title, sub, children }: { title: string; sub?: string; children: ReactNode }) {
  return (
    <main className="relative z-10 mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl font-semibold tracking-tight">{title}</h1>
          {sub && <p className="mt-1 text-sm text-muted-foreground">{sub}</p>}
        </div>
        <DemoBadge />
      </div>
      {children}
    </main>
  );
}

export const DemoBadge = () => (
  <span className="glass-soft rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Demo data</span>
);

export function Chip({ active, tone = "brand", onClick, children }: { active?: boolean; tone?: "brand" | "brand2" | "sky"; onClick?: () => void; children: ReactNode }) {
  const on = { brand: "bg-brand shadow-brand/30", brand2: "bg-brand2 shadow-brand2/30", sky: "bg-sky shadow-sky/30" }[tone];
  return (
    <button onClick={onClick} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${active ? `${on} text-on-brand shadow-md` : "glass-soft hover:bg-card"}`}>{children}</button>
  );
}

export function Bar({ value, tone }: { value: number; tone?: "coral" | "amber" | "brand" }) {
  const t = tone ?? (value < 55 ? "coral" : value < 70 ? "amber" : "brand");
  const cls = { coral: ["bg-coral/10", "bg-coral"], amber: ["bg-amber/10", "bg-amber"], brand: ["bg-brand/10", "bg-gradient-brand"] }[t];
  return <div className={`h-3 rounded-full ${cls[0]}`}><div className={`h-3 rounded-full ${cls[1]} transition-all duration-700`} style={{ width: `${value}%` }} /></div>;
}

export function Stat({ label, value, note, tone = "mint" }: { label: string; value: string; note?: string; tone?: "mint" | "coral" | "amber" | "muted" }) {
  const c = { mint: "text-mint", coral: "text-coral", amber: "text-amber", muted: "text-muted-foreground" }[tone];
  return (
    <div className="glass rise rounded-3xl p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="font-display mt-2 text-3xl font-semibold">{value}</p>
      {note && <p className={`mt-1 text-xs ${c}`}>{note}</p>}
    </div>
  );
}
