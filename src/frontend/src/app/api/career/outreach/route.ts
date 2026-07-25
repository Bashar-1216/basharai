import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { targetRole, companyName, recipientName, locale = "en" } = await req.json();

    const groqKey = process.env.GROQ_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;

    const prompt = `
Generate a highly compelling, professional, personalized cold outreach / cover message from Bashar Almuntaser (AI Engineer specializing in LLMs, RAG, AI Agents, Computer Vision) to ${recipientName || "Hiring Manager"} at ${companyName || "Target Enterprise"} for the role of ${targetRole || "AI Engineer"}.

Language: ${locale === "ar" ? "Arabic" : "English"}.
Keep it concise, impactful, highlighting engineering achievements and production AI delivery.
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
        return NextResponse.json({ outreachText: data.choices?.[0]?.message?.content || "" });
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
          outreachText: data.candidates?.[0]?.content?.parts?.[0]?.text || "",
        });
      }
    }

    return NextResponse.json({
      outreachText: `Dear ${recipientName || "Hiring Manager"},\n\nI am writing to express my strong interest in the ${targetRole || "AI Engineer"} position at ${companyName || "your team"}. With extensive experience building production RAG pipelines, LLM agent architectures, and bilingual AI systems, I am excited about the opportunity to deliver measurable engineering impact.\n\nBest regards,\nBashar Almuntaser`,
    });
  } catch (error: any) {
    console.error("Vercel Career Outreach API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
