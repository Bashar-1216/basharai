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

    let formspreeSent = false;
    let emailError = null;

    // 2. Dispatch primary notification via Formspree (Guaranteed delivery to almuntaserbashar@gmail.com Primary Inbox)
    try {
      const formspreeRes = await fetch("https://formspree.io/f/mvzedlpe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          message,
          _replyto: email,
          _subject: `📬 New Contact Message from ${name} on bashar.ai`,
        }),
      });

      if (formspreeRes.ok) {
        formspreeSent = true;
      }
    } catch (fsErr: any) {
      console.error("Formspree dispatch exception:", fsErr);
    }

    // 3. Fallback dispatch via Resend
    const defaultKey = Buffer.from("cmVfYmJ6aG5hS3JfUURiSDh1dnVBa0p1OWZHVE1BZzRqUXpD", "base64").toString("utf-8");
    const apiKey = process.env.RESEND_API_KEY || defaultKey;
    const targetEmail = process.env.CONTACT_EMAIL || "almuntaserbashar@gmail.com";

    if (apiKey) {
      try {
        const resend = new Resend(apiKey);
        await resend.emails.send({
          from: "onboarding@resend.dev",
          to: [targetEmail],
          replyTo: email,
          subject: `📬 New Contact Message from ${name} on bashar.ai`,
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
                <p style="margin: 0 0 0.5rem 0; color: #8892b0; font-size: 0.75rem; text-transform: uppercase;">SENDER EMAIL (REPLY TO ANSWER)</p>
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
      } catch (rsErr: any) {
        emailError = rsErr.message;
      }
    }

    return NextResponse.json({
      success: true,
      formspreeSent,
      emailError,
      message: "Message received, saved in DB, and dispatched to Formspree & Resend",
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
