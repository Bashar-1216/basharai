"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import styles from "./contact.module.css";

interface ContactFormProps {
  locale: Locale;
}

export function ContactForm({ locale }: ContactFormProps) {
  const isAr = locale === "ar";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (res.ok) {
        setStatus("success");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label htmlFor="name">{isAr ? "الاسم كاملًا" : "Full Name"}</label>
        <input
          type="text"
          id="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={isAr ? "مثال: عبدالله محمد" : "e.g. John Doe"}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="email">{isAr ? "البريد الإلكتروني" : "Email Address"}</label>
        <input
          type="email"
          id="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={isAr ? "example@domain.com" : "name@company.com"}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="message">{isAr ? "رسالتك" : "Your Message"}</label>
        <textarea
          id="message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={isAr ? "اكتب تفاصيل مشروعك أو استفسارك هنا..." : "Tell me about your project or inquiry..."}
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-primary"
        style={{ width: "100%", justifyContent: "center" }}
      >
        {status === "loading"
          ? (isAr ? "جاري الإرسال..." : "Sending...")
          : (`✉️ ${isAr ? "إرسال الرسالة" : "Send Message"}`)}
      </button>

      {status === "success" && (
        <div style={{ padding: "0.875rem", borderRadius: "var(--radius-sm)", background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.3)", color: "#10b981", fontSize: "0.875rem", textAlign: "center" }}>
          ✅ {isAr ? "تم إرسال رسالتك بنجاح! سأتواصل معك في أقرب وقت." : "Your message has been sent successfully! I'll get back to you soon."}
        </div>
      )}

      {status === "error" && (
        <div style={{ padding: "0.875rem", borderRadius: "var(--radius-sm)", background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#ef4444", fontSize: "0.875rem", textAlign: "center" }}>
          ❌ {isAr ? "حدث خطأ أثناء الإرسال. يرجى المحاولة لاحقاً." : "Failed to send message. Please try again later."}
        </div>
      )}
    </form>
  );
}
