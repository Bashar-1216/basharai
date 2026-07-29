import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";
import { db } from "@/lib/db";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { notFound } from "next/navigation";
import { ExperienceDetailClient } from "./experience-detail-client";

interface ExperienceDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: ExperienceDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  const experiences = await db.experience.findMany();
  const experience = experiences.find((e) => {
    const c = e.company.toLowerCase();
    if (c.includes("geo") && decodedSlug.includes("geo")) return true;
    if (c.includes("sapa") && decodedSlug.includes("sapa")) return true;
    if (c.includes("drowsiness") && decodedSlug.includes("drowsiness")) return true;
    if (c.includes("fraud") && decodedSlug.includes("fraud")) return true;
    if (c.includes("sentiment") && decodedSlug.includes("sentiment")) return true;
    return c.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") === decodedSlug;
  });

  if (!experience) return {};

  const isAr = locale === "ar";
  const title = `${experience.company} — ${isAr ? experience.titleAr : experience.titleEn}`;
  const description = isAr ? experience.summaryAr : experience.summaryEn;

  return {
    title: `${title} | Bashar Almuntaser Engineering Experience`,
    description,
  };
}

export default async function ExperienceDetailPage({ params }: ExperienceDetailPageProps) {
  const { locale, slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const dict = await getDictionary(locale as Locale);
  const isAr = locale === "ar";

  let experiences: any[] = [];
  try {
    experiences = await db.experience.findMany({
      orderBy: { startDate: "desc" },
    });
  } catch (err) {
    console.warn("Experience detail DB fetch warning:", err);
  }

  const experience = experiences.find((e) => {
    const c = e.company.toLowerCase();
    if (c.includes("geo") && decodedSlug.includes("geo")) return true;
    if (c.includes("sapa") && decodedSlug.includes("sapa")) return true;
    if (c.includes("drowsiness") && decodedSlug.includes("drowsiness")) return true;
    if (c.includes("fraud") && decodedSlug.includes("fraud")) return true;
    if (c.includes("sentiment") && decodedSlug.includes("sentiment")) return true;
    return c.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") === decodedSlug;
  });

  if (!experience) {
    notFound();
  }

  // Query dynamic project and case study from Prisma DB
  const project = await db.project.findFirst({
    where: {
      OR: [
        { slug: decodedSlug },
        { titleEn: { contains: experience.company, mode: "insensitive" } },
      ],
    },
    include: {
      caseStudy: true,
      metrics: true,
    },
  });

  const cs = project?.caseStudy;

  const detail = {
    overview: cs ? (isAr ? (cs.architectureDescAr || cs.architectureDescEn || experience.summaryAr) : (cs.architectureDescEn || experience.summaryEn)) : (isAr ? experience.summaryAr : experience.summaryEn),
    problem: cs ? (isAr ? (cs.problemAr || cs.problemEn) : (cs.problemEn)) || "High-performance enterprise AI system delivery." : "High-performance enterprise AI system delivery.",
    role: isAr ? experience.titleAr : experience.titleEn,
    challenges: cs ? (isAr ? (cs.challengesAr || cs.challengesEn) : (cs.challengesEn)) || "Microservices containerization and real-time execution optimization." : "Microservices containerization and real-time execution optimization.",
    impact: cs ? (isAr ? (cs.resultsAr || cs.resultsEn) : (cs.resultsEn)) || "Production release under strict latency SLA constraints." : "Production release under strict latency SLA constraints.",
    technologies: "Python, FastAPI, Next.js, PostgreSQL, Redis, Docker, Langfuse",
    learned: cs ? (isAr ? (cs.lessonsAr || cs.lessonsEn) : (cs.lessonsEn)) || "Component isolation and clean architecture." : "Component isolation and clean architecture.",
  };

  return (
    <>
      <Navbar dict={dict} locale={locale as Locale} />
      <ExperienceDetailClient
        locale={locale}
        slug={decodedSlug}
        companyName={experience.company}
        roleTitle={isAr ? experience.titleAr : experience.titleEn}
        detail={detail}
      />
      <Footer dict={dict} />
    </>
  );
}
