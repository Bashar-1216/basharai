import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const repo = searchParams.get("repo");

    if (!repo) {
      return NextResponse.json({ error: "Missing repo parameter" }, { status: 400 });
    }

    const backendUrl = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    const response = await fetch(`${backendUrl}/api/v1/github/stats?repo=${repo}`);
    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch from RAG backend" }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("BFF GitHub stats error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
