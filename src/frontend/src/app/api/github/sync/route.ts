import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  return handleSync();
}

export async function POST() {
  return handleSync();
}

async function handleSync() {
  try {
    const headers: Record<string, string> = {
      "User-Agent": "bashar-ai-platform",
      "Accept": "application/vnd.github.v3+json",
    };

    if (process.env.GITHUB_TOKEN) {
      headers["Authorization"] = `token ${process.env.GITHUB_TOKEN}`;
    }

    const res = await fetch("https://api.github.com/users/Bashar-1216/repos?sort=updated&per_page=100", {
      headers,
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json({ error: `GitHub API error: ${res.statusText}` }, { status: res.status });
    }

    const repos = await res.json();
    const synced = [];

    for (const repo of repos) {
      const name = repo.name;
      if (!name || name === "Bashar-1216" || repo.fork) continue; // Skip profile repo & forks

      const topics: string[] = repo.topics || [];
      const hasPortfolioTag = topics.includes("portfolio") || topics.includes("portfolio-project") || topics.includes("featured");

      // ONLY sync repositories that the user explicitly tagged with "portfolio" or "featured"
      if (!hasPortfolioTag) {
        continue;
      }

      const slug = name.toLowerCase().replace(/_/g, "-");
      const githubUrl = repo.html_url || `https://github.com/Bashar-1216/${name}`;
      const title = name.replace(/[-_]/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase());
      const description = repo.description || `Production AI engineering project repository for ${title}.`;
      const stars = repo.stargazers_count || 0;
      const forks = repo.forks_count || 0;
      const language = repo.language || "Python";
      const openIssues = repo.open_issues_count || 0;
      const homepage = repo.homepage || null;
      const repoPath = `Bashar-1216/${name}`;
      const lastCommit = repo.pushed_at ? new Date(repo.pushed_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Recently";

      // 1. Upsert Project table
      await db.project.upsert({
        where: { slug },
        update: {
          githubUrl,
          liveUrl: homepage && homepage.startsWith("http") ? homepage : undefined,
          featured: true,
        },
        create: {
          slug,
          titleEn: title,
          titleAr: title,
          descriptionEn: description,
          descriptionAr: description,
          githubUrl,
          liveUrl: homepage && homepage.startsWith("http") ? homepage : null,
          featured: true,
        },
      });

      // 2. Upsert GithubRepository cache table
      await db.githubRepository.upsert({
        where: { repoName: repoPath },
        update: {
          stars,
          forks,
          language,
          lastCommit,
          openIssues,
        },
        create: {
          repoName: repoPath,
          stars,
          forks,
          language,
          lastCommit,
          openIssues,
        },
      });

      synced.push({ repo: repoPath, title, topics });
    }

    return NextResponse.json({
      success: true,
      message: `Successfully synced ${synced.length} portfolio-tagged repositories for Bashar-1216 from GitHub!`,
      synced,
    });
  } catch (error: any) {
    console.error("GitHub Sync error:", error);
    return NextResponse.json({ error: error.message || "Failed to sync GitHub repositories" }, { status: 500 });
  }
}
