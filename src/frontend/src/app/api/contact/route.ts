import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // 1. Save message in PostgreSQL database
    const savedMessage = await db.contactMessage.create({
      data: {
        name,
        email,
        message,
      },
    });

    // 2. Send email notification via Resend
    const targetEmail = process.env.CONTACT_EMAIL || "almuntaserbashar@gmail.com";

    await resend.emails.send({
      from: "bashar.ai <onboarding@resend.dev>",
      to: targetEmail,
      subject: `📬 New Contact: ${name}`,
      html: `
        <div style="font-family: 'Inter', system-ui, sans-serif; max-width: 600px; margin: 0 auto; background: #0a192f; color: #ccd6f6; padding: 2rem; border-radius: 12px;">
          <h2 style="color: #64ffda; margin-bottom: 1.5rem; font-size: 1.25rem;">
            📬 New Message from bashar.ai
          </h2>
          
          <div style="background: #112240; border: 1px solid rgba(100,255,218,0.15); border-radius: 8px; padding: 1.25rem; margin-bottom: 1rem;">
            <p style="margin: 0 0 0.75rem 0; color: #8892b0; font-size: 0.8125rem;">FROM</p>
            <p style="margin: 0; font-size: 1rem; font-weight: 600;">${name}</p>
            <p style="margin: 0.25rem 0 0 0; color: #64ffda; font-size: 0.875rem;">${email}</p>
          </div>

          <div style="background: #112240; border: 1px solid rgba(100,255,218,0.15); border-radius: 8px; padding: 1.25rem;">
            <p style="margin: 0 0 0.75rem 0; color: #8892b0; font-size: 0.8125rem;">MESSAGE</p>
            <p style="margin: 0; font-size: 0.9375rem; line-height: 1.7; white-space: pre-wrap;">${message}</p>
          </div>

          <p style="margin-top: 1.5rem; color: #8892b0; font-size: 0.75rem; text-align: center;">
            Sent via bashar.ai contact form · ${new Date().toISOString()}
          </p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Message received and notification sent",
      id: savedMessage.id,
    });
  } catch (error: any) {
    console.error("Contact form error:", error);

    // Even if email fails, the message is saved in DB
    return NextResponse.json(
      { error: "Message saved but notification may have failed" },
      { status: 207 }
    );
  }
}
