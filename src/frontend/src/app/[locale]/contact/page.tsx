import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import styles from "./contact.module.css";
import Link from "next/link";

interface ContactPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  const isAr = locale === "ar";

  return (
    <>
      <Navbar dict={dict} locale={locale as Locale} />
      <main className={styles.main}>
        <div className="container">
          <div className={styles.wrapper}>
            <header className={styles.header}>
              <h1 className="gradient-text">{isAr ? "اتصل بي" : "Get in Touch"}</h1>
              <p className={styles.subtitle}>
                {isAr
                  ? "راسلني لمناقشة فرص العمل، أو لبناء أنظمة ذكاء اصطناعي مخصصة."
                  : "Send a message to discuss opportunities, consulting work, or AI architecture."}
              </p>
            </header>

            <form className={styles.form}>
              <div className={styles.field}>
                <label htmlFor="name">{isAr ? "الاسم كاملًا" : "Full Name"}</label>
                <input type="text" id="name" required placeholder={isAr ? "مثال: عبدالله محمد" : "e.g. John Doe"} />
              </div>

              <div className={styles.field}>
                <label htmlFor="email">{isAr ? "البريد الإلكتروني" : "Email Address"}</label>
                <input type="email" id="email" required placeholder={isAr ? "example@domain.com" : "name@company.com"} />
              </div>

              <div className={styles.field}>
                <label htmlFor="message">{isAr ? "رسالتك" : "Your Message"}</label>
                <textarea id="message" required rows={5} placeholder={isAr ? "اكتب تفاصيل مشروعك هنا..." : "Tell me about your project..."} />
              </div>

              <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                ✉️ {isAr ? "إرسال الرسالة" : "Send Message"}
              </button>
            </form>

            <div className={styles.details}>
              <p>📧 owner@bashar.ai</p>
              <p>📍 Riyadh, Saudi Arabia</p>
            </div>
          </div>
        </div>
      </main>
      <Footer dict={dict} />
    </>
  );
}
