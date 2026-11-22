import { auth } from "@/lib/auth";
import { isTransientMongoError, resetMongoClient, sleep } from "@/lib/mongodb";
import { toNextJsHandler } from "better-auth/next-js";

const handlers = toNextJsHandler(auth);

const MAX_ATTEMPTS = 3;
const RETRY_DELAYS_MS = [200, 400];

type AuthHandler = (request: Request) => Promise<Response>;

function pickHandler(method: string): AuthHandler {
  const key = method.toUpperCase() as keyof typeof handlers;
  return (handlers[key] ?? handlers.GET) as AuthHandler;
}

async function handleAuthRequest(request: Request): Promise<Response> {
  const handler = pickHandler(request.method);
  // Clone before the first attempt so every retry gets an unconsumed body.
  const attempts: Request[] = [request];
  for (let i = 1; i < MAX_ATTEMPTS; i++) attempts.push(request.clone());

  for (let attempt = 0; attempt < attempts.length; attempt++) {
    let response: Response;
    try {
      response = await handler(attempts[attempt]);
    } catch (error) {
      if (!isTransientMongoError(error) || attempt === attempts.length - 1) {
        throw error;
      }
      resetMongoClient();
      await sleep(RETRY_DELAYS_MS[attempt] ?? 200);
      continue;
    }

    if (response.status < 500 || attempt === attempts.length - 1) {
      return response;
    }

    // 5xx here is almost always a failed MongoDB session/adapter lookup
    // (FAILED_TO_GET_SESSION or a closed topology) — reconnect and retry.
    resetMongoClient();
    void response.body?.cancel().catch(() => undefined);
    await sleep(RETRY_DELAYS_MS[attempt] ?? 200);
  }

  return new Response(null, { status: 500, statusText: "Internal Server Error" });
}

export const GET = handleAuthRequest;
export const POST = handleAuthRequest;
export const PATCH = handleAuthRequest;
export const PUT = handleAuthRequest;
export const DELETE = handleAuthRequest;
