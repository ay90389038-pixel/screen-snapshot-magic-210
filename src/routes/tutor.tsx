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

function Tutor() {
  const [mode, setMode] = useState<string>(MODES[0]!);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [msgs, setMsgs] = useState<{ me: boolean; text: string }[]>([
    { me: false, text: "Hi Riya 👋 Pick a mode and ask me about any chapter — e.g. “Carbon Compounds”." },
  ]);
  const send = async () => {
    if (!input.trim() || busy) return;
    const history = [...msgs.slice(1), { me: true, text: input }];
    setMsgs((m) => [...m, { me: true, text: input }, { me: false, text: "Thinking…" }]);
    setInput("");
    setBusy(true);
    const setLast = (text: string) => setMsgs((m) => [...m.slice(0, -1), { me: false, text }]);
    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ mode, messages: history.map((h) => ({ role: h.me ? "user" : "assistant", content: h.text })) }),
      });
      if (!res.ok || !res.body) {
        setLast(res.status === 429 ? "Too many requests — please wait a moment." : res.status === 402 ? "AI credits have run out." : "Sorry, something went wrong. Please try again.");
        return;
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let out = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        out += dec.decode(value, { stream: true });
        setLast(out);
      }
      if (!out) setLast("No answer received. Please try again.");
    } catch {
      setLast("Connection problem. Please try again.");
    } finally {
      setBusy(false);
    }
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
