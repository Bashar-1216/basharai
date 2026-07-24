import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Save message in PostgreSQL database
    const savedMessage = await db.contactMessage.create({
      data: {
        name,
        email,
        message,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Message received successfully",
      id: savedMessage.id,
    });
  } catch (error: any) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    );
  }
}
