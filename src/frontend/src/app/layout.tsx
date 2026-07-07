import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "bashar.ai — AI Engineering Platform",
  description:
    "Personal AI engineering portfolio platform with bilingual support (EN/AR), featuring an interactive RAG-powered assistant.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
