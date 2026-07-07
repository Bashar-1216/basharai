import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";
import { Navbar } from "@/components/navbar";
import { ChatInterface } from "@/components/chat-interface";
import { Footer } from "@/components/footer";

/**
 * Chat page — interactive AI assistant powered by RAG.
 * This is the demo that distinguishes bashar.ai from static portfolios.
 */
export default async function ChatPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  return (
    <>
      <Navbar dict={dict} locale={locale as Locale} />
      <main
        style={{
          paddingTop: "5rem",
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <ChatInterface dict={dict} locale={locale as Locale} />
      </main>
      <Footer dict={dict} />
    </>
  );
}
