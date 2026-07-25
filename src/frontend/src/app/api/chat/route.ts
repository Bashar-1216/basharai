import { NextResponse } from "next/server";
import { db } from "@/lib/db";

const SYSTEM_PROMPT = `
You are the official AI Assistant for Bashar Almuntaser (بشار المنتصر), an elite AI Engineer based in Yemen, targeting high-impact AI Engineering and Production AI Systems roles in Saudi Arabia & GCC.

Key Bio & Profile:
- Role: AI Engineer · Production AI Systems · LLMs · RAG · AI Agents · Computer Vision
- Location: Yemen (Open to relocation to Saudi Arabia / GCC)
- Focus: Building production-grade bilingual (Arabic & English) AI platforms for enterprise & GCC organizations.

Key Featured Projects:
1. GEO Platform (Generative Engine Optimization):
   - 8-stage asynchronous AI analysis pipeline running across GPT-4, Claude, Gemini, and Perplexity using Python worker architecture + Redis.
   - Engineered bilingual entity resolution engine with trigram indexing.
2. SAPA Product Analyzer (Smart Amazon Product Analyzer):
   - 5-indicator scoring engine combining LightGBM demand forecasting with hybrid BERT + LLaMA-3 NLP pipeline for review toxicity detection.
   - 8-container microservices compose stack on Linux servers.
3. RAG Enterprise Assistant:
   - High-throughput RAG search engine with pgvector hybrid search and LLM-as-a-Judge telemetry evaluation.

Behavior:
- Respond in the language of the user query (Arabic if Arabic, English if English).
- Be professional, concise, enthusiastic about engineering impact, and accurate.
- If asked about contacting Bashar, guide them to use the Contact page or email almuntaserbashar@gmail.com.
`;

export async function POST(req: Request) {
  try {
    const { message, locale = "en" } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // 1. Fetch relevant projects & experience context from DB to enrich answer
    let contextSnippet = "";
    try {
      const projects = await db.project.findMany({ take: 4 });
      const experiences = await db.experience.findMany({ take: 3 });

      contextSnippet = `
Projects Context:
${projects.map((p) => `- ${p.title} (${p.category}): ${p.descriptionEn}`).join("\n")}

Experience Context:
${experiences.map((e) => `- ${e.role} at ${e.company} (${e.period}): ${e.descriptionEn}`).join("\n")}
      `.trim();
    } catch (dbErr) {
      console.warn("DB context fetch fallback:", dbErr);
    }

    const fullPrompt = `${SYSTEM_PROMPT}\n\n${contextSnippet}\n\nUser Question (${locale}): ${message}`;

    // 2. Call LLM Service (Groq or Gemini API)
    const groqKey = process.env.GROQ_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;

    if (groqKey) {
      const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${groqKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: SYSTEM_PROMPT + "\n\n" + contextSnippet },
            { role: "user", content: message },
          ],
          temperature: 0.7,
        }),
      });

      if (groqRes.ok) {
        const data = await groqRes.json();
        const reply = data.choices?.[0]?.message?.content || "I am glad to assist you with Bashar's portfolio.";
        return NextResponse.json({ response: reply, text: reply });
      }
    }

    if (geminiKey) {
      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: fullPrompt }],
              },
            ],
          }),
        }
      );

      if (geminiRes.ok) {
        const data = await geminiRes.json();
        const reply =
          data.candidates?.[0]?.content?.parts?.[0]?.text ||
          "I am glad to assist you with Bashar's portfolio.";
        return NextResponse.json({ response: reply, text: reply });
      }
    }

    // 3. Static fallback response if no AI keys available
    const fallbackReply = locale === "ar"
      ? "أهلاً بك! أنا المساعد الذكي لبشار المنتصر. بشار مهندس ذكاء اصطناعي متخصص في بناء أنظمة النماذج اللغوية (LLMs)، وRAG، والوكلاء الأذكياء (AI Agents)، والرؤية الحاسوبية. يمكنك استكشاف مشاريع الخبرة في الموقع أو التواصل عبر صفحة التواصل!"
      : "Welcome! I am Bashar Almuntaser's AI Assistant. Bashar is an AI Engineer specializing in LLMs, RAG pipelines, AI Agents, and Computer Vision. Feel free to explore his projects or contact him directly!";

    return NextResponse.json({ response: fallbackReply, text: fallbackReply });
  } catch (error: any) {
    console.error("Vercel Chat API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process chat request" },
      { status: 500 }
    );
  }
}
