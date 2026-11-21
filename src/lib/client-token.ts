import { authClient } from "./auth-client";

// Browser-এ লগইন করা user এর JWT token নেয়। Backend-এর private route-এ এটা পাঠাতে হয়।
export async function getClientToken(): Promise<string | null> {
  const { data } = await authClient.token();
  return data?.token ?? null;
}
