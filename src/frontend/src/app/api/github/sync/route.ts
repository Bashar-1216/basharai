import { NextResponse } from "next/server";
import {
  errorMessage,
  fetchGitHubRepositories,
  GITHUB_OWNER,
  syncGitHubRepository,
  type RepositorySyncResult,
} from "@/lib/github-sync";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface SyncFailure {
  repo: string;
  error: string;
}

export async function GET(request: Request) {
  const authorizationError = validateCronAuthorization(request);
  if (authorizationError) return authorizationError;

  return handleSync();
}

function validateCronAuthorization(request: Request): NextResponse | null {
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    if (process.env.NODE_ENV === "production") {
      console.error("GitHub sync blocked: CRON_SECRET is not configured.");
      return NextResponse.json(
        { error: "GitHub sync is unavailable because CRON_SECRET is not configured." },
        { status: 503 },
      );
    }

    return null;
  }

  if (request.headers.get("authorization") !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}

async function handleSync() {
  try {
    const repositories = await fetchGitHubRepositories();
    const results: RepositorySyncResult[] = [];
    const failures: SyncFailure[] = [];

    for (const repository of repositories) {
      const repositoryName = repository.full_name || repository.name || "unknown";

      try {
        const result = await syncGitHubRepository(repository, {
          deactivateWhenIneligible: true,
        });

        if (result.status !== "ignored") {
          results.push(result);
        }
      } catch (error) {
        console.error(`GitHub sync failed for ${repositoryName}:`, error);
        failures.push({ repo: repositoryName, error: errorMessage(error) });
      }
    }

    const synced = results.filter((result) => result.status === "synced");
    const deactivated = results.filter((result) => result.status === "deactivated");

    if (synced.length === 0 && failures.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No repository could be synchronized.",
          owner: GITHUB_OWNER,
          synced,
          deactivated,
          failures,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: failures.length === 0,
      partial: failures.length > 0,
      owner: GITHUB_OWNER,
      message: `Synchronized ${synced.length} and deactivated ${deactivated.length} repositories for ${GITHUB_OWNER}.`,
      synced,
      deactivated,
      failures,
    });
  } catch (error) {
    console.error("GitHub Sync error:", error);
    return NextResponse.json(
      { success: false, error: errorMessage(error) },
      { status: 500 },
    );
  }
}
