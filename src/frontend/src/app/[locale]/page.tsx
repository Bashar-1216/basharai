import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Experience } from "@/components/experience";
import { Projects } from "@/components/projects";
import { Footer } from "@/components/footer";

/**
 * Home page — the landing page that hiring managers see first.
 * Must convey engineering credibility within 60 seconds.
 */
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  return (
    <>
      <Navbar dict={dict} locale={locale as Locale} />
      <main>
        <Hero dict={dict} locale={locale as Locale} />
        <Experience dict={dict} locale={locale as Locale} />
        <Projects dict={dict} locale={locale as Locale} />
      </main>
      <Footer dict={dict} />
    </>
  );
}
