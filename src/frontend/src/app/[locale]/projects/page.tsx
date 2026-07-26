import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";
import { db } from "@/lib/db";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ProjectList } from "./project-list";

export const dynamic = "force-dynamic";
export const revalidate = 0;


interface ProjectsIndexProps {
  params: Promise<{ locale: string }>;
}

export default async function ProjectsIndex({ params }: ProjectsIndexProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  // Fetch all projects from database
  const projects = await db.project.findMany({
    orderBy: { publishedAt: "desc" },
  });

  // Fetch all cached GitHub stats from DB
  const githubStats = await db.githubRepository.findMany();

  // Determine tags dynamically based on actual database-seeded project slugs
  const projectsWithTags = projects.map((p) => {
    let tags: string[] = ["All"];
    if (p.slug === "geo-platform") tags.push("RAG", "LLM");
    if (p.slug === "sapa") tags.push("Automation", "LLM");
    if (p.slug === "drowsiness-detection") tags.push("Vision", "Automation");
    if (p.slug === "fraud-detection") tags.push("Automation");
    if (p.slug === "sentiment-analysis") tags.push("LLM");
    return { ...p, tags };
  });

  return (
    <>
      <Navbar dict={dict} locale={locale as Locale} />
      <main style={{ minHeight: "100vh", padding: "8rem 0 4rem", background: "hsl(var(--color-bg))" }}>
        <div className="container">
          <header style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h1 className="gradient-text" style={{ fontSize: "clamp(2rem, 4vw, 2.75rem)", fontWeight: 800, marginBottom: "0.5rem" }}>
              {locale === "ar" ? "دراسات الحالة والمشاريع" : "Case Studies & Projects"}
            </h1>
            <p style={{ color: "hsl(var(--color-text-body))", fontSize: "1.0625rem" }}>
              {locale === "ar"
                ? "استعراض عميق للمشاريع الهندسية وأنظمة الذكاء الاصطناعي التي قمت ببنائها."
                : "Deep dives into engineering architectural decisions and AI systems built."}
            </p>
          </header>

          <ProjectList 
            initialProjects={projectsWithTags} 
            githubStats={githubStats}
            locale={locale as Locale} 
          />
        </div>
      </main>
      <Footer dict={dict} />
    </>
  );
}
