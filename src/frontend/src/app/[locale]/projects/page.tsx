import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";
import { db } from "@/lib/db";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ProjectList } from "./project-list";

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

  // Mock categorizations for filtering (matching metadata tags)
  const projectsWithTags = projects.map((p) => {
    // Determine tags dynamically based on slug
    let tags: string[] = ["All"];
    if (p.slug === "bashar-ai") tags.push("RAG", "LLM");
    if (p.slug === "eval-framework") tags.push("Evaluation", "Automation");
    if (p.slug === "rag-pipeline") tags.push("RAG", "LLM");
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

          <ProjectList initialProjects={projectsWithTags} locale={locale as Locale} />
        </div>
      </main>
      <Footer dict={dict} />
    </>
  );
}
