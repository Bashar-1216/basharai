import { db } from "@/lib/db";

export const GITHUB_OWNER = "Bashar-1216";
export const PORTFOLIO_TOPICS = new Set(["portfolio", "portfolio-project", "featured"]);

const PAGE_SIZE = 100;

export interface GitHubRepositoryResponse {
  name?: string;
  full_name?: string;
  fork?: boolean;
  archived?: boolean;
  disabled?: boolean;
  topics?: unknown;
  html_url?: string | null;
  homepage?: string | null;
  description?: string | null;
  stargazers_count?: number | null;
  forks_count?: number | null;
  language?: string | null;
  open_issues_count?: number | null;
  pushed_at?: string | null;
  owner?: {
    login?: string;
  } | null;
}

export interface RepositorySyncResult {
  status: "synced" | "ignored" | "deactivated";
  repo: string;
  slug?: string;
  githubUrl?: string;
  liveUrl?: string | null;
  stars?: number;
  language?: string;
  featured?: boolean;
  topics?: string[];
  reason?: string;
}

interface SyncOptions {
  deactivateWhenIneligible?: boolean;
}

export async function fetchGitHubRepositories(): Promise<GitHubRepositoryResponse[]> {
  const repositories: GitHubRepositoryResponse[] = [];

  for (let page = 1; page <= 100; page += 1) {
    const url = new URL(`https://api.github.com/users/${GITHUB_OWNER}/repos`);
    url.searchParams.set("type", "owner");
    url.searchParams.set("sort", "updated");
    url.searchParams.set("direction", "desc");
    url.searchParams.set("per_page", String(PAGE_SIZE));
    url.searchParams.set("page", String(page));

    const response = await fetch(url, {
      headers: githubHeaders(),
      cache: "no-store",
      signal: AbortSignal.timeout(20_000),
    });

    if (!response.ok) {
      throw await githubApiError(response);
    }

    const pageRepositories = (await response.json()) as GitHubRepositoryResponse[];
    repositories.push(...pageRepositories);

    if (pageRepositories.length < PAGE_SIZE) break;
  }

  return repositories;
}

export async function fetchGitHubRepository(
  repositoryName: string,
): Promise<GitHubRepositoryResponse> {
  const response = await fetch(
    `https://api.github.com/repos/${encodeURIComponent(GITHUB_OWNER)}/${encodeURIComponent(repositoryName)}`,
    {
      headers: githubHeaders(),
      cache: "no-store",
      signal: AbortSignal.timeout(5_000),
    },
  );

  if (!response.ok) {
    throw await githubApiError(response);
  }

  return (await response.json()) as GitHubRepositoryResponse;
}

export async function syncGitHubRepository(
  repo: GitHubRepositoryResponse,
  options: SyncOptions = {},
): Promise<RepositorySyncResult> {
  const name = repo.name?.trim();
  const owner = getRepositoryOwner(repo);

  if (!name || !owner) {
    throw new Error("GitHub returned a repository without a valid name or owner.");
  }

  const repoPath = repo.full_name?.trim() || `${owner}/${name}`;
  if (owner.toLowerCase() !== GITHUB_OWNER.toLowerCase()) {
    return {
      status: "ignored",
      repo: repoPath,
      reason: `Repository owner ${owner} is outside the configured account.`,
    };
  }

  if (name.toLowerCase() === GITHUB_OWNER.toLowerCase() || repo.fork) {
    return {
      status: "ignored",
      repo: repoPath,
      reason: repo.fork ? "Forked repositories are excluded." : "The profile repository is excluded.",
    };
  }

  const topics = normalizeTopics(repo.topics);
  const slug = createSlug(name);
  const githubUrl = normalizeHttpUrl(repo.html_url) || `https://github.com/${repoPath}`;
  const isPortfolioRepository = topics.some((topic) => PORTFOLIO_TOPICS.has(topic));

  if (!slug) {
    throw new Error(`Repository ${repoPath} produced an empty slug.`);
  }

  if (!isPortfolioRepository || repo.archived || repo.disabled) {
    const reason = !isPortfolioRepository
      ? "Repository does not have a portfolio topic."
      : repo.archived
        ? "Repository is archived."
        : "Repository is disabled.";

    if (options.deactivateWhenIneligible) {
      return deactivateGitHubRepository(repo, reason, {
        knownSlug: slug,
        knownGithubUrl: githubUrl,
        knownTopics: topics,
      });
    }

    return {
      status: "ignored",
      repo: repoPath,
      slug,
      githubUrl,
      featured: false,
      topics,
      reason,
    };
  }

  const title = name
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
  const description =
    repo.description?.trim() || `Production AI engineering project repository for ${title}.`;
  const liveUrl = normalizeHttpUrl(repo.homepage);
  const stars = repo.stargazers_count ?? 0;
  const forks = repo.forks_count ?? 0;
  const language = repo.language?.trim() || "Unknown";
  const openIssues = repo.open_issues_count ?? 0;
  const lastCommit = repo.pushed_at || new Date(0).toISOString();
  const featured = topics.includes("featured");

  await db.$transaction([
    db.project.upsert({
      where: { slug },
      update: {
        githubUrl,
        liveUrl,
        featured,
        isFeatured: featured,
      },
      create: {
        slug,
        titleEn: title,
        titleAr: title,
        descriptionEn: description,
        descriptionAr: description,
        githubUrl,
        liveUrl,
        featured,
        isFeatured: featured,
      },
    }),
    db.githubRepository.upsert({
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
    }),
  ]);

  return {
    status: "synced",
    repo: repoPath,
    slug,
    githubUrl,
    liveUrl,
    stars,
    language,
    featured,
    topics,
  };
}

export async function deactivateGitHubRepository(
  repo: GitHubRepositoryResponse,
  reason: string,
  options: {
    knownSlug?: string;
    knownGithubUrl?: string;
    knownTopics?: string[];
    removeCache?: boolean;
  } = {},
): Promise<RepositorySyncResult> {
  const name = repo.name?.trim();
  const owner = getRepositoryOwner(repo) || GITHUB_OWNER;
  const repoPath = repo.full_name?.trim() || `${owner}/${name || "unknown"}`;
  const slug = options.knownSlug || (name ? createSlug(name) : "");
  const githubUrl =
    options.knownGithubUrl || normalizeHttpUrl(repo.html_url) || `https://github.com/${repoPath}`;

  const operations = [];

  if (slug) {
    operations.push(
      db.project.updateMany({
        where: {
          OR: [{ slug }, { githubUrl }],
        },
        data: {
          featured: false,
          isFeatured: false,
        },
      }),
    );
  }

  if (options.removeCache) {
    operations.push(
      db.githubRepository.deleteMany({
        where: { repoName: repoPath },
      }),
    );
  }

  if (operations.length > 0) {
    await db.$transaction(operations);
  }

  return {
    status: "deactivated",
    repo: repoPath,
    ...(slug ? { slug } : {}),
    githubUrl,
    featured: false,
    topics: options.knownTopics ?? normalizeTopics(repo.topics),
    reason,
  };
}

export function getRepositoryOwner(repository?: GitHubRepositoryResponse): string | null {
  const ownerLogin = repository?.owner?.login?.trim();
  if (ownerLogin) return ownerLogin;

  const fullNameOwner = repository?.full_name?.split("/", 1)[0]?.trim();
  return fullNameOwner || null;
}

export function hasCompleteRepositoryMetadata(
  repository: GitHubRepositoryResponse,
): repository is GitHubRepositoryResponse & { name: string; full_name: string; topics: string[] } {
  return Boolean(
    repository.name?.trim() &&
      repository.full_name?.trim() &&
      Array.isArray(repository.topics) &&
      typeof repository.stargazers_count === "number" &&
      typeof repository.forks_count === "number" &&
      typeof repository.open_issues_count === "number",
  );
}

export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unknown GitHub synchronization error";
}

function githubHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "bashar-ai-platform",
    "X-GitHub-Api-Version": process.env.GITHUB_API_VERSION ?? "2026-03-10",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  return headers;
}

async function githubApiError(response: Response): Promise<Error> {
  const responseBody = await response.text().catch(() => "");
  return new Error(
    `GitHub API error ${response.status} ${response.statusText}${responseBody ? `: ${responseBody.slice(0, 300)}` : ""}`,
  );
}

function normalizeTopics(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter((topic): topic is string => typeof topic === "string")
    .map((topic) => topic.trim().toLowerCase())
    .filter(Boolean);
}

function createSlug(name: string): string {
  return name
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeHttpUrl(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) return null;

  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}
