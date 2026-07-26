import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Resend } from "resend";

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
    // Note: Resend free tier requires recipient to be the registered account owner (basharalmuntaser2@gmail.com)
    const apiKey = process.env.RESEND_API_KEY;

    const resend = new Resend(apiKey);
    const targetEmail = process.env.CONTACT_EMAIL || "basharalmuntaser2@gmail.com";

    let emailSent = false;
    let emailError = null;

    try {
      const emailResult = await resend.emails.send({
        from: "onboarding@resend.dev",
        to: [targetEmail],
        subject: `📬 New Contact Message on bashar.ai from ${name}`,
        html: `
          <div style="font-family: 'Inter', system-ui, sans-serif; max-width: 600px; margin: 0 auto; background: #0a192f; color: #ccd6f6; padding: 2rem; border-radius: 12px; border: 1px solid #64ffda;">
            <h2 style="color: #64ffda; margin-bottom: 1.5rem; font-size: 1.25rem;">
              📬 New Contact Submission from bashar.ai
            </h2>
            
            <div style="background: #112240; border: 1px solid rgba(100,255,218,0.2); border-radius: 8px; padding: 1.25rem; margin-bottom: 1rem;">
              <p style="margin: 0 0 0.5rem 0; color: #8892b0; font-size: 0.75rem; text-transform: uppercase;">SENDER NAME</p>
              <p style="margin: 0; font-size: 1rem; font-weight: 600; color: #ffffff;">${name}</p>
            </div>

            <div style="background: #112240; border: 1px solid rgba(100,255,218,0.2); border-radius: 8px; padding: 1.25rem; margin-bottom: 1rem;">
              <p style="margin: 0 0 0.5rem 0; color: #8892b0; font-size: 0.75rem; text-transform: uppercase;">SENDER EMAIL</p>
              <p style="margin: 0; color: #64ffda; font-size: 0.9375rem;"><a href="mailto:${email}" style="color: #64ffda; text-decoration: none;">${email}</a></p>
            </div>

            <div style="background: #112240; border: 1px solid rgba(100,255,218,0.2); border-radius: 8px; padding: 1.25rem;">
              <p style="margin: 0 0 0.5rem 0; color: #8892b0; font-size: 0.75rem; text-transform: uppercase;">MESSAGE CONTENT</p>
              <p style="margin: 0; font-size: 0.9375rem; line-height: 1.7; white-space: pre-wrap; color: #ccd6f6;">${message}</p>
            </div>

            <p style="margin-top: 1.5rem; color: #8892b0; font-size: 0.75rem; text-align: center;">
              Sent via bashar.ai contact form · ${new Date().toLocaleString()}
            </p>
          </div>
        `,
      });

      if (emailResult.data) {
        emailSent = true;
      } else if (emailResult.error) {
        emailError = emailResult.error;
        console.error("Resend API error detail:", emailResult.error);
      }
    } catch (sendErr: any) {
      emailError = sendErr.message;
      console.error("Resend send exception:", sendErr);
    }

    return NextResponse.json({
      success: true,
      emailSent,
      emailError,
      message: "Message received and saved",
      id: savedMessage.id,
    });
  } catch (error: any) {
    console.error("Contact form route error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process message" },
      { status: 500 }
    );
  }
}
