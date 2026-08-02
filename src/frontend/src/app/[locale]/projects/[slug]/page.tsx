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

interface ProjectDetailViewModel {
  slug: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  githubUrl: string | null;
  liveUrl: string | null;
  status: string;
  isFeatured: boolean;
  featured: boolean;
  caseStudy: null;
  metrics: never[];
}

const projectSelect = {
  slug: true,
  titleEn: true,
  titleAr: true,
  descriptionEn: true,
  descriptionAr: true,
  githubUrl: true,
  liveUrl: true,
  status: true,
  isFeatured: true,
  featured: true,
} as const;

function fallbackProject(slug: string): ProjectDetailViewModel {
  const readableSlug = slug.replace(/-/g, " ");

  return {
    slug,
    titleEn: readableSlug.toUpperCase(),
    titleAr: readableSlug,
    descriptionEn: `Engineering implementation and case study for ${slug}.`,
    descriptionAr: `تفاصيل المعمارية الهندسية لمشروع ${slug}.`,
    githubUrl: `https://github.com/Bashar-1216/${encodeURIComponent(slug)}`,
    liveUrl: null,
    status: "unavailable",
    isFeatured: false,
    featured: false,
    caseStudy: null,
    metrics: [],
  };
}

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const fallback = fallbackProject(slug);
  let project: Pick<
    ProjectDetailViewModel,
    "slug" | "titleEn" | "titleAr" | "descriptionEn" | "descriptionAr" | "githubUrl" | "liveUrl" | "status" | "isFeatured" | "featured"
  > | null = null;

  try {
    project = await db.project.findUnique({
      where: { slug },
      select: projectSelect,
    });
  } catch (error) {
    console.warn("Project metadata fetch warning:", error);
  }

  const safeProject = project ?? fallback;
  const isAr = locale === "ar";
  const title = isAr ? safeProject.titleAr || safeProject.titleEn : safeProject.titleEn;
  const description = isAr
    ? safeProject.descriptionAr || safeProject.descriptionEn
    : safeProject.descriptionEn;

  return {
    title: `${title} — Bashar Almuntaser AI Case Study`,
    description,
    openGraph: {
      title,
      description,
      url: `https://basharai.vercel.app/${locale}/projects/${slug}`,
    },
    alternates: {
      canonical: `https://basharai.vercel.app/en/projects/${slug}`,
      languages: {
        en: `https://basharai.vercel.app/en/projects/${slug}`,
        ar: `https://basharai.vercel.app/ar/projects/${slug}`,
      },
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { locale, slug } = await params;
  const dict = await getDictionary(locale as Locale);
  let project: Omit<ProjectDetailViewModel, "caseStudy" | "metrics"> | null = null;

  try {
    project = await db.project.findUnique({
      where: { slug },
      select: projectSelect,
    });
  } catch (error) {
    console.warn("Project detail DB fetch error:", error);
  }

  const safeProject: ProjectDetailViewModel = project
    ? { ...project, caseStudy: null, metrics: [] }
    : fallbackProject(slug);

  return (
    <>
      <Navbar dict={dict} locale={locale as Locale} />
      <ProjectDetailClient
        locale={locale}
        slug={slug}
        project={safeProject}
        dict={dict}
      />
      <Footer dict={dict} />
    </>
  );
}
