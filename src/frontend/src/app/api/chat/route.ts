import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const backendUrl = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    // Call the FastAPI RAG backend with streaming enabled
    const response = await fetch(`${backendUrl}/api/v1/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `RAG backend error: ${errorText}` },
        { status: response.status }
      );
    }

    // Proxy the stream back to the browser client
    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error: any) {
    console.error("BFF chat streaming error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to reach RAG backend" },
      { status: 500 }
    );
  }
}
