import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";

// Private page-এর শুরুতে এটা বসান।
// Login করা না থাকলে Login পেজে পাঠাবে, আর login শেষে এই পেজেই ফিরিয়ে আনবে।
export async function requireUser(returnPath: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect(`/login?callbackURL=${encodeURIComponent(returnPath)}`);
  }
  return session.user;
}
