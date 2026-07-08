import type { Locale } from "@/lib/i18n";
import { localeDirection, locales } from "@/lib/i18n";
import { notFound } from "next/navigation";
import "@/app/globals.css";

/**
 * Generate static params for all supported locales.
 */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

import { FloatingChat } from "@/components/floating-chat";

/**
 * Locale-aware layout — sets HTML dir/lang attributes dynamically.
 * Arabic pages get RTL direction and IBM Plex Sans Arabic font.
 */
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const dir = localeDirection[locale as Locale];
  const fontClass = locale === "ar" ? "font-arabic-noto" : "font-sans";

  return (
    <html lang={locale} dir={dir}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&family=Noto+Sans+Arabic:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={fontClass}>
        {children}
        <FloatingChat locale={locale as Locale} />
      </body>
    </html>
  );
}
