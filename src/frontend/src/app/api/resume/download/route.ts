import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const pdfPath = path.join(process.cwd(), "public", "resume.pdf");

    if (fs.existsSync(pdfPath)) {
      const fileBuffer = fs.readFileSync(pdfPath);
      return new Response(fileBuffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": 'attachment; filename="Bashar_Almuntaser_AI_Engineer.pdf"',
        },
      });
    }

    return NextResponse.json({ error: "Resume file not found" }, { status: 404 });
  } catch (error: any) {
    console.error("Vercel Resume download error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
