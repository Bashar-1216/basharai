import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import {
  GITHUB_OWNER,
  deactivateGitHubRepository,
  errorMessage,
  fetchGitHubRepository,
  getRepositoryOwner,
  hasCompleteRepositoryMetadata,
  syncGitHubRepository,
  type GitHubRepositoryResponse,
} from "@/lib/github-sync";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SUPPORTED_REPOSITORY_ACTIONS = new Set([
  "created",
  "edited",
  "renamed",
  "transferred",
  "publicized",
  "privatized",
  "archived",
  "unarchived",
]);
const MAX_WEBHOOK_BODY_BYTES = 10 * 1024 * 1024;

interface GitHubWebhookPayload {
  action?: string;
  repository?: GitHubRepositoryResponse;
  zen?: string;
}

export async function POST(request: Request) {
  const startedAt = performance.now();
  const deliveryId = request.headers.get("x-github-delivery") ?? "unknown";
  const eventName = request.headers.get("x-github-event")?.trim().toLowerCase();
  const secret = process.env.GITHUB_WEBHOOK_SECRET;

  if (!secret) {
    console.error("GitHub webhook blocked: GITHUB_WEBHOOK_SECRET is not configured.");
    return webhookResponse(
      {
        success: false,
        error: "GitHub webhook is unavailable because its secret is not configured.",
        deliveryId,
      },
      503,
      startedAt,
    );
  }

  if (!eventName) {
    return webhookResponse(
      { success: false, error: "Missing X-GitHub-Event header.", deliveryId },
      400,
      startedAt,
    );
  }

  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(contentLength) && contentLength > MAX_WEBHOOK_BODY_BYTES) {
    return webhookResponse(
      { success: false, error: "Webhook payload is too large.", deliveryId },
      413,
      startedAt,
    );
  }

  const rawBody = await request.text();
  if (Buffer.byteLength(rawBody, "utf8") > MAX_WEBHOOK_BODY_BYTES) {
    return webhookResponse(
      { success: false, error: "Webhook payload is too large.", deliveryId },
      413,
      startedAt,
    );
  }

  const signature = request.headers.get("x-hub-signature-256");
  if (!verifyGitHubSignature(rawBody, signature, secret)) {
    console.warn(`Rejected GitHub webhook delivery ${deliveryId}: invalid signature.`);
    return webhookResponse(
      { success: false, error: "Invalid webhook signature.", deliveryId },
      401,
      startedAt,
    );
  }

  let payload: GitHubWebhookPayload;
  try {
    payload = JSON.parse(rawBody) as GitHubWebhookPayload;
  } catch {
    return webhookResponse(
      { success: false, error: "Webhook body is not valid JSON.", deliveryId },
      400,
      startedAt,
    );
  }

  if (eventName === "ping") {
    return webhookResponse(
      {
        success: true,
        event: eventName,
        deliveryId,
        message: payload.zen ?? "GitHub webhook is connected.",
      },
      200,
      startedAt,
    );
  }

  if (!isSupportedEvent(eventName, payload.action)) {
    return webhookResponse(
      {
        success: true,
        ignored: true,
        event: eventName,
        action: payload.action ?? null,
        deliveryId,
        message: "Event acknowledged but does not require repository synchronization.",
      },
      202,
      startedAt,
    );
  }

  const webhookRepository = payload.repository;
  const owner = getRepositoryOwner(webhookRepository);

  if (!webhookRepository?.name || !owner) {
    return webhookResponse(
      { success: false, error: "Webhook payload has no valid repository.", deliveryId },
      400,
      startedAt,
    );
  }

  if (owner.toLowerCase() !== GITHUB_OWNER.toLowerCase()) {
    return webhookResponse(
      {
        success: true,
        ignored: true,
        event: eventName,
        deliveryId,
        message: `Repository owner ${owner} is outside the configured account.`,
      },
      202,
      startedAt,
    );
  }

  try {
    const result =
      eventName === "repository" && payload.action === "deleted"
        ? await deactivateGitHubRepository(webhookRepository, "Repository was deleted on GitHub.", {
            removeCache: true,
          })
        : await syncGitHubRepository(
            hasCompleteRepositoryMetadata(webhookRepository)
              ? webhookRepository
              : await fetchGitHubRepository(webhookRepository.name),
            { deactivateWhenIneligible: true },
          );

    console.info(
      `GitHub webhook ${deliveryId} processed ${eventName}${payload.action ? `/${payload.action}` : ""} for ${result.repo}: ${result.status}.`,
    );

    return webhookResponse(
      {
        success: true,
        event: eventName,
        action: payload.action ?? null,
        deliveryId,
        result,
      },
      result.status === "ignored" ? 202 : 200,
      startedAt,
    );
  } catch (error) {
    console.error(`GitHub webhook delivery ${deliveryId} failed:`, error);
    return webhookResponse(
      {
        success: false,
        event: eventName,
        action: payload.action ?? null,
        deliveryId,
        error: errorMessage(error),
      },
      500,
      startedAt,
    );
  }
}

function isSupportedEvent(eventName: string, action?: string): boolean {
  if (eventName === "push" || eventName === "create" || eventName === "delete") {
    return true;
  }

  if (eventName !== "repository") return false;
  if (action === "deleted") return true;

  return Boolean(action && SUPPORTED_REPOSITORY_ACTIONS.has(action));
}

function verifyGitHubSignature(rawBody: string, signature: string | null, secret: string): boolean {
  if (!signature?.startsWith("sha256=")) return false;

  const receivedDigest = signature.slice("sha256=".length);
  if (!/^[a-f0-9]{64}$/i.test(receivedDigest)) return false;

  const expectedDigest = createHmac("sha256", secret).update(rawBody).digest("hex");

  return timingSafeEqual(
    Buffer.from(receivedDigest, "hex"),
    Buffer.from(expectedDigest, "hex"),
  );
}

function webhookResponse(
  body: Record<string, unknown>,
  status: number,
  startedAt: number,
): NextResponse {
  const durationMs = Math.round((performance.now() - startedAt) * 10) / 10;
  const response = NextResponse.json({ ...body, durationMs }, { status });
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("Server-Timing", `githubWebhook;dur=${durationMs}`);
  return response;
}
