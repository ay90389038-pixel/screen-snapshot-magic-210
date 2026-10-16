import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type Ctx = { supabase: any; userId: string };

// Only signed-in users with the 'admin' role may change papers.
async function assertAdmin({ supabase, userId }: Ctx) {
  const { data, error } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (error || !data) throw new Error("This account is not an admin");
}

export const checkAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    return { isAdmin: !!data };
  });

type NewPaper = {
  standard: "10" | "12"; subject: string; year: string;
  paper_type: "Board Paper" | "SQP"; set_number: string; paper_url: string; solution_url: string;
};

const isUrl = (u: string) => /^https?:\/\/\S+$/i.test(u);

export const addPaper = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: NewPaper) => {
    if (!["10", "12"].includes(d.standard)) throw new Error("Invalid class");
    if (!["Board Paper", "SQP"].includes(d.paper_type)) throw new Error("Invalid type");
    if (!d.subject.trim() || d.subject.length > 100) throw new Error("Subject required");
    if (!/^\d{4}$/.test(d.year.trim())) throw new Error("Year must be 4 digits");
    if (!isUrl(d.paper_url.trim())) throw new Error("Paper URL must start with http(s)://");
    if (d.solution_url.trim() && !isUrl(d.solution_url.trim())) throw new Error("Solution URL invalid");
    return d;
  })
  .handler(async ({ data, context }) => {
    await assertAdmin(context as Ctx);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("cbse_pyqs").insert({
      standard: data.standard, subject: data.subject.trim(), year: data.year.trim(),
      paper_type: data.paper_type, set_number: data.set_number.trim() || null,
      paper_url: data.paper_url.trim(), solution_url: data.solution_url.trim() || null,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deletePaper = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ data, context }) => {
    await assertAdmin(context as Ctx);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("cbse_pyqs").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
