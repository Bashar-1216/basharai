import type { Locale } from "@/lib/i18n";
import { db } from "@/lib/db";
import styles from "./experience.module.css";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { getDictionary } from "@/lib/i18n";

interface ExperienceIndexProps {
  params: Promise<{ locale: string }>;
}

function getExperienceSlug(companyName: string): string {
  const c = companyName.toLowerCase();
  if (c.includes("geo")) return "geo-platform";
  if (c.includes("sapa")) return "sapa";
  if (c.includes("drowsiness")) return "drowsiness-detection";
  if (c.includes("fraud")) return "fraud-detection";
  if (c.includes("sentiment")) return "sentiment-analysis";
  return c.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ExperienceIndex({ params }: ExperienceIndexProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  let experiences: any[] = [];
  try {
    experiences = await db.experience.findMany({
      orderBy: { startDate: "desc" },
    });
  } catch (err) {
    console.warn("Experiences DB fetch warning:", err);
  }

  const isAr = locale === "ar";

  return (
    <>
      <Navbar dict={dict} locale={locale as Locale} />
      <main className={styles.main}>
        <div className="container">
          <header className={styles.header}>
            <h1 className="gradient-text">
              {isAr ? "الخبرة والمسيرة المهنية" : "Professional Experience"}
            </h1>
            <p className={styles.subtitle}>
              {isAr
                ? "تفاصيل المسيرة الهندسية وتطوير الأنظمة البرمجية في بيئات تقنية رائدة."
                : "Timeline of engineering impact and production-grade systems delivery."}
            </p>
          </header>

          <div className={styles.timeline}>
            {experiences.map((exp, idx) => {
              const slug = getExperienceSlug(exp.company);
              return (
                <div key={exp.id} className={styles.timelineItem}>
                  <div className={styles.timelineMarker}>
                    <div className={styles.markerCircle} />
                    {idx < experiences.length - 1 && <div className={styles.markerLine} />}
                  </div>

                  <div className={styles.timelineContent}>
                    <span className={styles.year}>
                      {exp.startDate.getFullYear()} —{" "}
                      {exp.isCurrent
                        ? isAr
                          ? "الآن"
                          : "Present"
                        : exp.endDate?.getFullYear()}
                    </span>

                    <h3 className={styles.companyName}>{exp.company}</h3>
                    <h4 className={styles.roleTitle}>
                      {isAr ? exp.titleAr : exp.titleEn}
                    </h4>

                    <p className={styles.summary}>
                      {isAr ? exp.summaryAr : exp.summaryEn}
                    </p>

                    <Link href={`/${locale}/experience/${slug}`} className={styles.readCase}>
                      {isAr ? "اقرأ ورقة العمل الكاملة ←" : "Read Full Case Study ←"}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
      <Footer dict={dict} />
    </>
  );
}
