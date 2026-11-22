import { getTokenFromServer } from "./getTokenFromServer";


export async function serverFetch(path: string, withAuth = false) {
  const headers: Record<string, string> = {};

  if (withAuth) {
    const token = await getTokenFromServer();
    if (token) headers.authorization = `Bearer ${token}`;
  }

  return fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    headers,
    cache: "no-store",
  });
}