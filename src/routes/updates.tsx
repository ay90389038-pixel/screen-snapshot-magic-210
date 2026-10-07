import { createFileRoute } from "@tanstack/react-router";
import { UPDATES } from "@/lib/data";
import { Page } from "@/components/site";

export const Route = createFileRoute("/updates")({
  head: () => ({
    meta: [
      { title: "Board Updates — TOPIT" },
      { name: "description", content: "Board notifications, exam updates and syllabus changes with official sources." },
      { property: "og:title", content: "Board Updates — TOPIT" },
      { property: "og:description", content: "Stay current with official board notices and pattern changes." },
    ],
  }),
  component: Updates,
});

function Updates() {
  return (
    <Page title="Board Updates" sub="Always confirm details on the official board website linked with each notice.">
      <div className="grid gap-4">
        {UPDATES.map((u) => (
          <div key={u.title} className="glass rise flex flex-wrap items-center justify-between gap-4 rounded-3xl p-6">
            <div>
              <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">{u.board}</span>
              <p className="font-display mt-3 text-lg font-semibold">{u.title}</p>
            </div>
            <a href={u.source} target="_blank" rel="noreferrer" className="rounded-full bg-gradient-brand px-5 py-2 text-sm font-semibold text-on-brand">Official source ↗</a>
          </div>
        ))}
      </div>
    </Page>
  );
}
