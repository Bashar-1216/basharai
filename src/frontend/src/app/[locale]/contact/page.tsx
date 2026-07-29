import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ContactForm } from "./contact-form";
import styles from "./contact.module.css";

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
              <h1 className="gradient-text">{isAr ? "تواصل معي" : "Get in Touch"}</h1>
              <p className={styles.subtitle}>
                {isAr
                  ? "راسلني لمناقشة فرص العمل، الاستشارات التقنية، أو لبناء أنظمة ذكاء اصطناعي مخصصة."
                  : "Send a message to discuss opportunities, consulting work, or AI architecture."}
              </p>
            </header>

            <ContactForm locale={locale as Locale} />

            <div className={styles.details}>
              <div className={styles.detailItem}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <a href="mailto:almuntaserbashar@gmail.com" className={styles.detailLink}>almuntaserbashar@gmail.com</a>
              </div>

              <div className={styles.detailItem}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 9 0 1 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <span>{isAr ? "الرياض، المملكة العربية السعودية / صنعاء، اليمن" : "Riyadh, Saudi Arabia / Sana'a, Yemen"}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer dict={dict} />
    </>
  );
}
