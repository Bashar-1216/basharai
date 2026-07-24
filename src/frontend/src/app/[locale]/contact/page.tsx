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
              <p>📧 almuntaserbashar@gmail.com</p>
              <p>📍 Riyadh, Saudi Arabia / Sana'a, Yemen</p>
            </div>
          </div>
        </div>
      </main>
      <Footer dict={dict} />
    </>
  );
}
