import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Page } from "@/components/site";

export const Route = createFileRoute("/tutor")({
  head: () => ({
    meta: [
      { title: "AI Tutor — TOPIT" },
      { name: "description", content: "Education-focused AI tutor: explain simply, teach me, create quiz, check my answer." },
      { property: "og:title", content: "AI Tutor — TOPIT" },
      { property: "og:description", content: "Ask the TOPIT tutor to explain, quiz and revise any board topic." },
    ],
  }),
  component: Tutor,
});

const MODES = ["Explain Simply", "Explain in Detail", "Give Examples", "Teach Me", "Create Quiz", "Check My Answer", "Make Revision Notes", "Test Me"];

function reply(mode: string, topic: string) {
  const t = topic || "this topic";
  return `**${mode} · ${t}** (demo preview)\n\nThis is a sample response. Once the live tutor is connected, TOPIT will ${mode.toLowerCase()} for "${t}" using your board's syllabus and your weak areas.`;
}

function Tutor() {
  const [mode, setMode] = useState(MODES[0]);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<{ me: boolean; text: string }[]>([
    { me: false, text: "Hi Riya 👋 Pick a mode and ask me about any chapter — e.g. “Carbon Compounds”." },
  ]);
  const send = () => {
    if (!input.trim()) return;
    setMsgs((m) => [...m, { me: true, text: input }, { me: false, text: reply(mode, input) }]);
    setInput("");
  };

  return (
    <Page title="AI Tutor" sub="Your study companion for every board topic">
      <div className="glass mx-auto flex max-w-3xl flex-col rounded-3xl p-5">
        <div className="flex flex-wrap gap-2">
          {MODES.map((m) => (
            <button key={m} onClick={() => setMode(m)} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${mode === m ? "bg-brand text-on-brand" : "glass-soft"}`}>{m}</button>
          ))}
        </div>
        <div className="mt-5 flex min-h-80 flex-col gap-3">
          {msgs.map((m, i) => (
            <div key={i} className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-3 text-sm ${m.me ? "self-end bg-brand text-on-brand" : "self-start"}`}>{m.text.replace(/\*\*/g, "")}</div>
          ))}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); send(); }} className="mt-4 flex gap-2">
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={`${mode}: type a topic or question…`} className="glass-soft flex-1 rounded-full px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
          <button className="rounded-full bg-gradient-brand px-6 text-sm font-semibold text-on-brand">Send</button>
        </form>
      </div>
    </Page>
  );
}
