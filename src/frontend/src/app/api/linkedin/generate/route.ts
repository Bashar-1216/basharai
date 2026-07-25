import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const backendUrl = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    const response = await fetch(`${backendUrl}/api/v1/linkedin/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: errorText }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("BFF LinkedIn generation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
