// Backend (Express) এর ঠিকানা। .env.local এর NEXT_PUBLIC_API_URL থেকে আসে।
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

type RequestOptions = {
  method?: string;
  body?: unknown;
};

// Backend-এ request পাঠানোর সহজ helper (Client Component থেকে ব্যবহার হয়)।
// লগইন থাকলে token নিজে থেকে যোগ হয়। Error হলে Backend-এর message দিয়ে Error ছোড়ে।
export async function apiRequest<T = unknown>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  // client-token শুধু browser-এ দরকার, তাই এখানে আলাদা করে আনা হচ্ছে
  const { getClientToken } = await import("./client-token");
  const token = await getClientToken();

  const headers: Record<string, string> = {};
  if (options.body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.message ?? "Something went wrong. Please try again.");
  }
  return data as T;
}
