import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { TelemetryTabs } from "./telemetry-tabs";

interface DashboardPageProps {
  params: Promise<{ locale: string }>;
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  return (
    <>
      <Navbar dict={dict} locale={locale as Locale} />
      <main style={{ minHeight: "100vh", padding: "8rem 0 4rem", background: "hsl(var(--color-bg))" }}>
        <div className="container">
          <header style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h1 className="gradient-text" style={{ fontSize: "clamp(2rem, 4vw, 2.75rem)", fontWeight: 800, marginBottom: "0.5rem" }}>
              {locale === "ar" ? "لوحة تحليلات المراقبة والتقييم" : "Observability Telemetry Dashboard"}
            </h1>
            <p style={{ color: "hsl(var(--color-text-body))", fontSize: "1.0625rem" }}>
              {locale === "ar"
                ? "مراقبة مستمرة لأداء مساعد الذكاء الاصطناعي (أداء الاسترجاع، التكلفة، ودقة الاستناد) في الوقت الفعلي."
                : "Real-time logging of the AI assistant's query performance, costs, and groundedness ratings."}
            </p>
          </header>

          <TelemetryTabs locale={locale as Locale} />
        </div>
      </main>
      <Footer dict={dict} />
    </>
  );
}
