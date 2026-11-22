import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";
import { isTransientMongoError, withMongoRetry } from "./mongodb";

async function getSessionOrNull() {
  try {
    return await withMongoRetry(async () =>
      auth.api.getSession({ headers: await headers() }),
    );
  } catch (error) {
    if (!isTransientMongoError(error)) throw error;
    console.error(
      "Session lookup failed after retries, treating as signed out:",
      error,
    );
    return null;
  }
}

export async function requireUser(returnPath: string) {
  const session = await getSessionOrNull();
  if (!session) {
    redirect(`/login?callbackURL=${encodeURIComponent(returnPath)}`);
  }
  return session.user;
}
