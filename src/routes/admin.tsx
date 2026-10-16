import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Page } from "@/components/site";
import { PaperReader, type ReaderPaper } from "@/components/PaperReader";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "TOPIT Admin Portal" },
      { name: "description", content: "Private TOPIT admin panel to add and remove CBSE question papers." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "TOPIT Admin Portal" },
      { property: "og:description", content: "Private TOPIT admin portal for CBSE papers." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Admin,
});

type Row = { id: string; standard: string; subject: string; year: string; paper_type: string; set_number: string | null; paper_url: string; solution_url: string | null };
const empty = { standard: "10" as "10" | "12", subject: "", year: "", paper_type: "Board Paper" as "Board Paper" | "SQP", set_number: "", paper_url: "", solution_url: "" };
const field = "glass-soft w-full rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring";

function Admin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [ready, setReady] = useState(false);
  const [signing, setSigning] = useState(false);
  const [form, setForm] = useState(empty);
  const [rows, setRows] = useState<Row[]>([]);
  const [busy, setBusy] = useState(false);
  const [view, setView] = useState<ReaderPaper | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setUser(data.session?.user ?? null); setReady(true); });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  const load = useCallback(async () => {
    const { data } = await supabase.from("cbse_pyqs").select("*").order("created_at", { ascending: false });
    setRows((data as Row[]) ?? []);
  }, []);
  useEffect(() => { if (user) load(); }, [user, load]);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSigning(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setSigning(false);
    if (error) toast.error(error.message || "Invalid credentials");
    else { setPassword(""); toast.success("Signed in"); }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.from("cbse_pyqs").insert({
      standard: form.standard, subject: form.subject.trim(), year: form.year.trim(), paper_type: form.paper_type,
      set_number: form.set_number.trim() || null, paper_url: form.paper_url.trim(), solution_url: form.solution_url.trim() || null,
    });
    setBusy(false);
    if (error) { toast.error(error.message.includes("row-level security") ? "Your account doesn't have admin rights." : error.message); return; }
    toast.success("Paper added");
    setForm(empty);
    load();
  };

  const remove = async (r: Row) => {
    if (!confirm(`Delete Class ${r.standard} ${r.subject} ${r.year}?`)) return;
    const { error, count } = await supabase.from("cbse_pyqs").delete({ count: "exact" }).eq("id", r.id);
    if (error) { toast.error(error.message); return; }
    if (!count) { toast.error("Your account doesn't have admin rights."); return; }
    toast.success("Paper deleted");
    load();
  };

  if (!ready) return <Page title="TOPIT Admin Access" sub="Checking your session…"><div /></Page>;

  if (!user) return (
    <Page title="TOPIT Admin Access" sub="Sign in with your admin account to manage papers.">
      <form onSubmit={signIn} className="glass mx-auto flex max-w-sm flex-col gap-3 rounded-3xl p-6">
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className={field} autoFocus />
        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className={field} />
        <button disabled={signing} className="bg-gradient-brand text-on-brand rounded-full px-5 py-2.5 text-sm font-semibold disabled:opacity-50">{signing ? "Signing in…" : "Sign In"}</button>
      </form>
    </Page>
  );

  const set = (k: keyof typeof empty) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm({ ...form, [k]: e.target.value });

  return (
    <Page title="TOPIT Admin Portal" sub="Add new papers and remove old ones. Changes show on the Papers tab right away.">
      <div className="mb-4 flex items-center justify-end gap-3 text-sm">
        <span className="text-muted-foreground">{user.email}</span>
        <button onClick={() => supabase.auth.signOut()} className="glass-soft rounded-full px-4 py-1.5 font-semibold">Log Out</button>
      </div>
      <form onSubmit={submit} className="glass mb-8 grid gap-4 rounded-3xl p-6 sm:grid-cols-2">
        <h2 className="font-display text-xl font-semibold sm:col-span-2">Add New Paper</h2>
        <label className="text-sm font-semibold">Class<select value={form.standard} onChange={set("standard")} className={`${field} mt-1`}><option value="10">10</option><option value="12">12</option></select></label>
        <label className="text-sm font-semibold">Subject<input required value={form.subject} onChange={set("subject")} placeholder="e.g. Mathematics Standard" className={`${field} mt-1`} /></label>
        <label className="text-sm font-semibold">Year<input required value={form.year} onChange={set("year")} placeholder="e.g. 2025" inputMode="numeric" className={`${field} mt-1`} /></label>
        <label className="text-sm font-semibold">Paper Type<select value={form.paper_type} onChange={set("paper_type")} className={`${field} mt-1`}><option value="Board Paper">Board Exam Paper</option><option value="SQP">Sample Paper (SQP)</option></select></label>
        <label className="text-sm font-semibold">Set / Code<input value={form.set_number} onChange={set("set_number")} placeholder="e.g. Set 1, 30/1/1" className={`${field} mt-1`} /></label>
        <label className="text-sm font-semibold">Question Paper URL<input required type="url" value={form.paper_url} onChange={set("paper_url")} placeholder="https://drive.google.com/file/d/.../preview" className={`${field} mt-1`} /></label>
        <label className="text-sm font-semibold sm:col-span-2">Marking Scheme / Solution URL (optional)<input type="url" value={form.solution_url} onChange={set("solution_url")} placeholder="https://..." className={`${field} mt-1`} /></label>
        <button disabled={busy} className="bg-gradient-brand text-on-brand rounded-full px-6 py-2.5 text-sm font-semibold disabled:opacity-50 sm:col-span-2 sm:justify-self-start">{busy ? "Adding…" : "Add Paper"}</button>
      </form>

      <div className="glass overflow-x-auto rounded-3xl p-6">
        <h2 className="font-display mb-4 text-xl font-semibold">Manage Existing Papers ({rows.length})</h2>
        <table className="w-full text-left text-sm">
          <thead className="text-muted-foreground"><tr><th className="py-2">Class</th><th>Subject</th><th>Year</th><th>Set</th><th>Type</th><th className="text-right">Actions</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-border">
                <td className="py-2.5">{r.standard}</td><td>{r.subject}</td><td>{r.year}</td><td>{r.set_number ?? "—"}</td>
                <td>{r.paper_type === "SQP" ? "Sample Paper" : "Board Paper"}</td>
                <td className="space-x-2 text-right whitespace-nowrap">
                  <button onClick={() => setView({ standard: r.standard, subject: r.subject, year: r.year, set: r.set_number ?? undefined, paperUrl: r.paper_url, solutionUrl: r.solution_url ?? undefined })} className="glass-soft rounded-full px-3 py-1 text-xs font-semibold">View</button>
                  <button onClick={() => remove(r)} className="rounded-full bg-destructive px-3 py-1 text-xs font-semibold text-destructive-foreground">Delete</button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={6} className="py-4 text-muted-foreground">No papers yet.</td></tr>}
          </tbody>
        </table>
      </div>
      {view && <PaperReader paper={view} onClose={() => setView(null)} />}
    </Page>
  );
}
