import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";
import { db } from "@/lib/db";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ExperienceDetailClient } from "./experience-detail-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

interface ExperienceDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

interface ExperienceViewModel {
  company: string;
  titleEn: string;
  titleAr: string;
  summaryEn: string;
  summaryAr: string;
}

function safeDecodeSlug(slug: string): string {
  try {
    return decodeURIComponent(slug);
  } catch (error) {
    console.warn("Malformed experience slug; using the original value:", error);
    return slug;
  }
}

function normalizeCompanySlug(company: string): string {
  return company
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function findExperience(experiences: ExperienceViewModel[], decodedSlug: string) {
  const normalizedSlug = decodedSlug.toLowerCase();

  return experiences.find((experience) => {
    const company = experience.company.toLowerCase();
    if (company.includes("geo") && normalizedSlug.includes("geo")) return true;
    if (company.includes("sapa") && normalizedSlug.includes("sapa")) return true;
    if (company.includes("drowsiness") && normalizedSlug.includes("drowsiness")) return true;
    if (company.includes("fraud") && normalizedSlug.includes("fraud")) return true;
    if (company.includes("sentiment") && normalizedSlug.includes("sentiment")) return true;
    return normalizeCompanySlug(company) === normalizedSlug;
  });
}

function fallbackExperience(decodedSlug: string): ExperienceViewModel {
  const company = decodedSlug.replace(/-/g, " ").toUpperCase();

  return {
    company,
    titleEn: "AI & ML Application Engineer",
    titleAr: "مهندس ذكاء اصطناعي ونماذج لغة",
    summaryEn: `Engineering experience and production delivery for ${decodedSlug}.`,
    summaryAr: `خبرة هندسية وتطوير أنظمة إنتاجية لـ ${decodedSlug}.`,
  };
}

export async function generateMetadata({ params }: ExperienceDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const decodedSlug = safeDecodeSlug(slug);
  let experiences: ExperienceViewModel[] = [];

  try {
    experiences = await db.experience.findMany({
      select: {
        company: true,
        titleEn: true,
        titleAr: true,
        summaryEn: true,
        summaryAr: true,
      },
    });
  } catch (error) {
    console.warn("Experience metadata fetch warning:", error);
  }

  const experience = findExperience(experiences, decodedSlug) ?? fallbackExperience(decodedSlug);
  const isAr = locale === "ar";
  const title = `${experience.company} — Bashar Almuntaser AI Portfolio`;
  const description = isAr ? experience.summaryAr : experience.summaryEn;

  return {
    title: `${title} | Engineering Experience Case Study`,
    description,
  };
}

export default async function ExperienceDetailPage({ params }: ExperienceDetailPageProps) {
  const { locale, slug } = await params;
  const decodedSlug = safeDecodeSlug(slug);
  const dict = await getDictionary(locale as Locale);
  const isAr = locale === "ar";
  let experiences: ExperienceViewModel[] = [];

  try {
    experiences = await db.experience.findMany({
      orderBy: { startDate: "desc" },
      select: {
        company: true,
        titleEn: true,
        titleAr: true,
        summaryEn: true,
        summaryAr: true,
      },
    });
  } catch (error) {
    console.warn("Experience detail DB fetch warning:", error);
  }

  const experience = findExperience(experiences, decodedSlug) ?? fallbackExperience(decodedSlug);
  let caseStudy: {
    architectureDescEn: string | null;
    architectureDescAr: string | null;
    problemEn: string | null;
    problemAr: string | null;
    challengesEn: string | null;
    challengesAr: string | null;
    experimentsEn: string | null;
    experimentsAr: string | null;
    lessonsLearnedEn: string | null;
    lessonsLearnedAr: string | null;
  } | null = null;

  try {
    const project = await db.project.findFirst({
      where: {
        OR: [
          { slug: decodedSlug },
          { titleEn: { contains: experience.company, mode: "insensitive" } },
        ],
      },
      select: {
        caseStudy: {
          select: {
            architectureDescEn: true,
            architectureDescAr: true,
            problemEn: true,
            problemAr: true,
            challengesEn: true,
            challengesAr: true,
            experimentsEn: true,
            experimentsAr: true,
            lessonsLearnedEn: true,
            lessonsLearnedAr: true,
          },
        },
      },
    });
    caseStudy = project?.caseStudy ?? null;
  } catch (error) {
    console.warn("Project fetch in experience detail warning:", error);
  }

  const detail = {
    overview: isAr
      ? caseStudy?.architectureDescAr || caseStudy?.architectureDescEn || experience.summaryAr
      : caseStudy?.architectureDescEn || experience.summaryEn,
    problem: isAr
      ? caseStudy?.problemAr || caseStudy?.problemEn || "تسليم نظام ذكاء اصطناعي مؤسسي عالي الأداء."
      : caseStudy?.problemEn || "High-performance enterprise AI system delivery.",
    role: isAr ? experience.titleAr || experience.titleEn : experience.titleEn || experience.titleAr,
    challenges: isAr
      ? caseStudy?.challengesAr || caseStudy?.challengesEn || "تحسين الحاويات والخدمات المصغرة والتنفيذ اللحظي."
      : caseStudy?.challengesEn || "Microservices containerization and real-time execution optimization.",
    impact: isAr
      ? caseStudy?.experimentsAr || caseStudy?.experimentsEn || "إطلاق إنتاجي ضمن قيود صارمة لزمن الاستجابة."
      : caseStudy?.experimentsEn || "Production release under strict latency SLA constraints.",
    technologies: "Python, FastAPI, Next.js, PostgreSQL, Redis, Docker, Langfuse",
    learned: isAr
      ? caseStudy?.lessonsLearnedAr || caseStudy?.lessonsLearnedEn || "عزل المكونات والمعمارية النظيفة."
      : caseStudy?.lessonsLearnedEn || "Component isolation and clean architecture.",
  };

  return (
    <>
      <Navbar dict={dict} locale={locale as Locale} />
      <ExperienceDetailClient
        locale={locale}
        slug={decodedSlug}
        companyName={experience.company}
        roleTitle={isAr ? experience.titleAr || experience.titleEn : experience.titleEn || experience.titleAr}
        detail={detail}
      />
      <Footer dict={dict} />
    </>
  );
}
