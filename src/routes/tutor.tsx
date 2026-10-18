import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Page, Chip } from "@/components/site";
import { useStudent } from "@/context/StudentContext";

export const Route = createFileRoute("/tutor")({
  head: () => ({
    meta: [
      { title: "AI Tutor — TOPIT" },
      { name: "description", content: "Board exam concept explanations, doubts, and revision coaching." },
    ],
  }),
  component: TutorPage,
});

type TutorMode =
  | "Explain Simply"
  | "Explain in Detail"
  | "Give Examples"
  | "Teach Me"
  | "Create Quiz"
  | "Check My Answer"
  | "Make Revision Notes";

type Message = {
  id: string;
  sender: "tutor" | "student";
  text: string;
  mode?: TutorMode;
  time: string;
};

const MODES: TutorMode[] = [
  "Explain Simply",
  "Explain in Detail",
  "Give Examples",
  "Teach Me",
  "Create Quiz",
  "Check My Answer",
  "Make Revision Notes",
];

// Contextual fallback response generator tailored for board exam topics
function generateTutorResponse(prompt: string, mode: TutorMode, grade: string): string {
  const query = prompt.toLowerCase();

  if (query.includes("carbon") || query.includes("covalent")) {
    switch (mode) {
      case "Explain Simply":
        return `Carbon has 4 electrons in its outer shell (tetravalent). Instead of gaining or losing 4 electrons—which requires too much energy—it shares electrons with other atoms to form sturdy covalent bonds. That ability to link with other carbons is called catenation!`;
      case "Create Quiz":
        return `Here is a quick Class ${grade} Board check on Carbon:\n1. Why can carbon neither form C⁴⁺ nor C⁴⁻ ions easily?\n2. What is the structural formula of Ethyne?\n3. Name the gas evolved when ethanol reacts with sodium metal.`;
      case "Make Revision Notes":
        return `Key Revision Notes: Carbon Compounds\n• Tetravalency: Valency of 4; forms 4 single covalent bonds.\n• Catenation: Unique ability to form long carbon chains & rings.\n• Saturated vs Unsaturated: Alkanes (single bond, CnH2n+2) vs Alkenes/Alkynes (double/triple bonds).\n• Saponification: Alkaline hydrolysis of esters producing soap and alcohol.`;
      default:
        return `In Class ${grade} Chemistry, Carbon's chemistry centers around covalent bonding, catenation, and isomerism. Which specific reaction or functional group would you like to explore?`;
    }
  }

  if (query.includes("light") || query.includes("reflection") || query.includes("mirror")) {
    switch (mode) {
      case "Explain Simply":
        return `When light bounces off a polished surface, the angle it hits (angle of incidence) always matches the angle it bounces off (angle of reflection). For spherical concave mirrors, objects placed far away create inverted real images, but when placed very close, they form enlarged virtual images.`;
      case "Create Quiz":
        return `Here are 2 rapid-fire mirror questions:\n1. What is the focal length of a plane mirror?\n2. A ray passing through the centre of curvature (C) reflects back along the same path. Why?`;
      default:
        return `Mirror Formula: 1/f = 1/v + 1/u. Remember the Cartesian sign convention: distances in front of the mirror (against incident light) are always negative!`;
    }
  }

  if (query.includes("kidney") || query.includes("life processes") || query.includes("nephron")) {
    return `In Life Processes, the nephron acts as the biological filtration unit. Glomerular filtration pushes nitrogenous waste and glucose out of the blood, followed by selective tubular reabsorption of essentials like glucose, amino acids, and water before urine enters the collecting duct.`;
  }

  // General standard response
  return `Under the "${mode}" format for Class ${grade}:\n\nRegarding "${prompt}":\n• Focus on exact CBSE/board terminology and definitions.\n• Identify the underlying principle or equation.\n• Practice writing answers in clear, numbered points with labeled diagrams to maximize exam marks.`;
}

function TutorPage() {
  const { user, profile } = useStudent();
  const classGrade = profile?.class_grade || "10";
  const studentName = profile?.full_name || (user ? "Student" : "there");

  const [activeMode, setActiveMode] = useState<TutorMode>("Explain Simply");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      sender: "tutor",
      text: `Hi ${studentName}! 👋 Pick an explanation mode above and ask me about any chapter or question (e.g. "Carbon Compounds", "Mirror Formula", or "Photosynthesis").`,
      time: "Just now",
    },
  ]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const studentMsg: Message = {
      id: String(Date.now()),
      sender: "student",
      text: userText,
      mode: activeMode,
      time: now,
    };

    const tutorReply: Message = {
      id: String(Date.now() + 1),
      sender: "tutor",
      text: generateTutorResponse(userText, activeMode, classGrade),
      mode: activeMode,
      time: now,
    };

    setMessages((prev) => [...prev, studentMsg, tutorReply]);
    setInput("");
  };

  return (
    <Page
      title="AI Tutor"
      sub="Your personalized exam preparation study companion and doubt-solver"
    >
      <div className="glass rounded-3xl p-6 sm:p-8 max-w-4xl mx-auto flex flex-col h-[700px]">
        {/* Mode selector pills */}
        <div className="flex flex-wrap gap-2 pb-4 border-b border-border/40">
          {MODES.map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setActiveMode(mode)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                activeMode === mode
                  ? "bg-brand text-on-brand shadow-sm"
                  : "glass-soft text-muted-foreground hover:text-foreground"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* Chat message feed */}
        <div className="flex-1 overflow-y-auto py-5 space-y-4 pr-1">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${
                m.sender === "student" ? "items-end" : "items-start"
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1 px-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {m.sender === "student" ? "You" : "TOPIT Tutor"}
                </span>
                {m.mode && m.sender === "student" && (
                  <span className="text-[10px] text-brand">[{m.mode}]</span>
                )}
              </div>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm whitespace-pre-line leading-relaxed ${
                  m.sender === "student"
                    ? "bg-gradient-brand text-on-brand shadow-sm rounded-br-none"
                    : "glass border border-border/60 text-foreground rounded-bl-none"
                }`}
              >
                {m.text}
              </div>
              <span className="text-[10px] text-muted-foreground mt-1 px-1">
                {m.time}
              </span>
            </div>
          ))}
        </div>

        {/* Input prompt bar */}
        <form onSubmit={handleSend} className="pt-4 border-t border-border/40 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`${activeMode}: type a chapter topic or question...`}
            className="glass-soft flex-1 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="rounded-2xl bg-gradient-brand px-6 py-3 text-sm font-semibold text-on-brand shadow hover:opacity-90 disabled:opacity-50 transition"
          >
            Send
          </button>
        </form>
      </div>
    </Page>
  );
}
