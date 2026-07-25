import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { topic, style = "technical", locale = "en" } = await req.json();

    const groqKey = process.env.GROQ_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;

    const prompt = `
Write an engaging, technical LinkedIn post for an AI Engineer audience about: "${topic || "Building Production RAG Systems with pgvector and LLMs"}".
Tone: ${style}.
Language: ${locale === "ar" ? "Arabic" : "English"}.
Include key engineering insights, code architecture hints, bullet points, and relevant hashtags (#AIEngineering #LLM #RAG #MachineLearning).
`;

    if (groqKey) {
      const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${groqKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
        }),
      });

      if (groqRes.ok) {
        const data = await groqRes.json();
        return NextResponse.json({ postContent: data.choices?.[0]?.message?.content || "" });
      }
    }

    if (geminiKey) {
      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        }
      );

      if (geminiRes.ok) {
        const data = await geminiRes.json();
        return NextResponse.json({
          postContent: data.candidates?.[0]?.content?.parts?.[0]?.text || "",
        });
      }
    }

    return NextResponse.json({
      postContent: `🚀 ${topic || "Building Production AI Systems"}\n\nKey takeaways from engineering high-availability LLM pipelines:\n- High-throughput RAG search with pgvector trigram indexing\n- Asynchronous AI analysis queues with Redis\n- Robust bilingual entity resolution\n\n#AIEngineering #MachineLearning #LLM #SoftwareArchitecture`,
    });
  } catch (error: any) {
    console.error("Vercel LinkedIn generation API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
