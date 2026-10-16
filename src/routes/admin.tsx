import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Page } from "@/components/site";
import { PaperReader, type ReaderPaper } from "@/components/PaperReader";
import { supabase } from "@/integrations/supabase/client";
import { addPaper, deletePaper, verifyAdmin } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Manage CBSE Papers | TOPIT" },
      { name: "description", content: "Private admin panel to add and remove CBSE question papers." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Admin — Manage CBSE Papers | TOPIT" },
      { property: "og:description", content: "Private admin panel for TOPIT papers." },
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
  const [pass, setPass] = useState("");
  const [ok, setOk] = useState(false);
  const [form, setForm] = useState(empty);
  const [rows, setRows] = useState<Row[]>([]);
  const [busy, setBusy] = useState(false);
  const [view, setView] = useState<ReaderPaper | null>(null);

  const load = useCallback(async () => {
    const { data } = await supabase.from("cbse_pyqs").select("*").order("created_at", { ascending: false });
    setRows((data as Row[]) ?? []);
  }, []);
  useEffect(() => { if (ok) load(); }, [ok, load]);

  const unlock = async (e: React.FormEvent) => {
    e.preventDefault();
    try { await verifyAdmin({ data: { pass } }); setOk(true); } catch { toast.error("Wrong passcode"); }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await addPaper({ data: { pass, ...form } });
      toast.success("Paper added");
      setForm(empty);
      load();
    } catch (err) { toast.error((err as Error).message); }
    setBusy(false);
  };

  const remove = async (r: Row) => {
    if (!confirm(`Delete Class ${r.standard} ${r.subject} ${r.year}?`)) return;
    try { await deletePaper({ data: { pass, id: r.id } }); toast.success("Paper deleted"); load(); }
    catch (err) { toast.error((err as Error).message); }
  };

  if (!ok) return (
    <Page title="Admin" sub="Enter the admin passcode to manage papers.">
      <form onSubmit={unlock} className="glass mx-auto flex max-w-sm flex-col gap-3 rounded-3xl p-6">
        <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="Passcode" className={field} autoFocus />
        <button className="bg-gradient-brand text-on-brand rounded-full px-5 py-2.5 text-sm font-semibold">Unlock</button>
      </form>
    </Page>
  );

  const set = (k: keyof typeof empty) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm({ ...form, [k]: e.target.value });

  return (
    <Page title="Admin — CBSE Papers" sub="Add new papers and remove old ones. Changes show on the Papers tab right away.">
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
