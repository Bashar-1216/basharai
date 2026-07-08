import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AssistantConsole } from "./assistant-console";

interface AssistantPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AssistantPage({ params }: AssistantPageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  return (
    <>
      <Navbar dict={dict} locale={locale as Locale} />
      <main style={{ minHeight: "100vh", padding: "6rem 0 0", background: "hsl(var(--color-bg))" }}>
        <AssistantConsole locale={locale as Locale} />
      </main>
      <Footer dict={dict} />
    </>
  );
}
