import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";
import { db } from "@/lib/db";
import { ResumeView } from "./resume-view";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface ResumePageProps {
  params: Promise<{ locale: string }>;
}

export default async function ResumePage({ params }: ResumePageProps) {
  const { locale } = await params;
  await getDictionary(locale as Locale);

  // Fetch experiences and projects from the database
  let experiences: any[] = [];
  let projects: any[] = [];
  try {
    experiences = await db.experience.findMany({
      orderBy: { startDate: "desc" },
    });
    projects = await db.project.findMany({
      where: { featured: true },
      orderBy: { publishedAt: "desc" },
    });
  } catch (err) {
    console.warn("Resume page DB fetch warning:", err);
  }

  return (
    <ResumeView
      locale={locale}
      experiences={experiences}
      projects={projects}
    />
  );
}
