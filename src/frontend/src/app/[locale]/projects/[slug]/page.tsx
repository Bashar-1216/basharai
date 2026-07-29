import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";
import { db } from "@/lib/db";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ProjectDetailClient } from "./project-detail-client";

interface ProjectDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = await db.project.findUnique({ where: { slug } });
  if (!project) return {};

  const isAr = locale === "ar";
  const title = isAr ? (project.titleAr || project.titleEn) : project.titleEn;
  const description = isAr ? (project.descriptionAr || project.descriptionEn) : project.descriptionEn;

  return {
    title: `${title} — Bashar Almuntaser AI Case Study`,
    description: description,
    openGraph: {
      title,
      description,
      url: `https://bashar.ai/${locale}/projects/${slug}`,
    },
    alternates: {
      canonical: `https://bashar.ai/en/projects/${slug}`,
      languages: {
        en: `https://bashar.ai/en/projects/${slug}`,
        ar: `https://bashar.ai/ar/projects/${slug}`,
      },
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { locale, slug } = await params;
  const dict = await getDictionary(locale as Locale);

  let project: any = null;
  try {
    project = await db.project.findUnique({
      where: { slug },
      include: {
        caseStudy: true,
        metrics: true,
      },
    });
  } catch (err) {
    console.warn("Project detail DB fetch error:", err);
  }

  // Fallback mock project if DB is unreachable during build/offline
  if (!project) {
    project = {
      slug,
      titleEn: slug.replace(/-/g, " ").toUpperCase(),
      titleAr: slug.replace(/-/g, " "),
      descriptionEn: `Engineering implementation and case study for ${slug}.`,
      descriptionAr: `تفاصيل المعمارية الهندسية لمشروع ${slug}.`,
      githubUrl: `https://github.com/Bashar-1216/${slug}`,
    };
  }

  return (
    <>
      <Navbar dict={dict} locale={locale as Locale} />
      <ProjectDetailClient
        locale={locale}
        slug={slug}
        project={project}
        dict={dict}
      />
      <Footer dict={dict} />
    </>
  );
}
