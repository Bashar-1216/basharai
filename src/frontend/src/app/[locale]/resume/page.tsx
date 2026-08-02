import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";
import { db } from "@/lib/db";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ResumeView } from "./resume-view";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

interface ResumePageProps {
  params: Promise<{
    locale: string;
  }>;
}

interface ResumeExperience {
  id: string;
  company: string;
  titleEn: string;
  titleAr: string;
  summaryEn: string;
  summaryAr: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
}

interface ResumeProject {
  id: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  githubUrl: string | null;
}

export default async function ResumePage({
  params,
}: ResumePageProps) {
  const { locale } = await params;

  const safeLocale: Locale = locale === "ar" ? "ar" : "en";
  const dict = await getDictionary(safeLocale);

  let experiences: ResumeExperience[] = [];
  let projects: ResumeProject[] = [];

  try {
    const [experienceRows, projectRows] = await Promise.all([
      db.experience.findMany({
        select: {
          id: true,
          company: true,
          titleEn: true,
          titleAr: true,
          summaryEn: true,
          summaryAr: true,
          startDate: true,
          endDate: true,
          isCurrent: true,
        },
        orderBy: {
          startDate: "desc",
        },
      }),

      db.project.findMany({
        where: {
          featured: true,
        },
        select: {
          id: true,
          titleEn: true,
          titleAr: true,
          descriptionEn: true,
          descriptionAr: true,
          githubUrl: true,
        },
        orderBy: {
          publishedAt: "desc",
        },
      }),
    ]);

    experiences = experienceRows.map((experience) => ({
      ...experience,
      startDate: experience.startDate.toISOString(),
      endDate: experience.endDate
        ? experience.endDate.toISOString()
        : null,
    }));

    projects = projectRows;
  } catch (error) {
    console.error("Resume page database error:", error);

    experiences = [];
    projects = [];
  }

  return (
    <>
      <Navbar dict={dict} locale={safeLocale} />

      <ResumeView
        locale={safeLocale}
        experiences={experiences}
        projects={projects}
      />

      <Footer dict={dict} />
    </>
  );
}
