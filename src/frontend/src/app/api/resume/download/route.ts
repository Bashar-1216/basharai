import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/v1/resume/download");
    if (!response.ok) {
      return NextResponse.json({ error: "Failed to download resume PDF" }, { status: response.status });
    }

    const fileBuffer = await response.arrayBuffer();

    return new Response(fileBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="Bashar_Almuntaser_AI_Engineer.pdf"',
      },
    });
  } catch (error: any) {
    console.error("BFF Resume download error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
