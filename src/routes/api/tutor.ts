import { createFileRoute } from "@tanstack/react-router";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { streamText } from "ai";

type Msg = { role: "user" | "assistant"; content: string };

export const Route = createFileRoute("/api/tutor")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("AI is not configured.", { status: 500 });
        const { mode, messages } = (await request.json()) as { mode: string; messages: Msg[] };
        const provider = createOpenAICompatible({
          name: "lovable",
          baseURL: "https://ai.gateway.lovable.dev/v1",
          headers: { "Lovable-API-Key": key, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
        });
        const result = streamText({
          model: provider("google/gemini-3.8-flash"),
          maxRetries: 0,
          abortSignal: request.signal,
          system: `You are TOPIT, a friendly AI tutor for Indian school students (Classes 9-12, CBSE/ICSE/State boards). Current mode: "${String(mode).slice(0, 40)}". Follow that mode: e.g. Explain Simply = short plain words; Create Quiz/Test Me = numbered questions with options, answers at the end; Check My Answer = grade and correct; Make Revision Notes = crisp bullet points. Stay on school topics. Use plain text and simple bullets, no markdown headings.`,
          messages: (messages ?? []).slice(-20).map((m) => ({ role: m.role, content: String(m.content).slice(0, 4000) })),
        });
        return result.toTextStreamResponse();
      },
    },
  },
});
