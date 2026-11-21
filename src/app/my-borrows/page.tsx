import type { Metadata } from "next";
import Link from "next/link";

import { MyBorrowsTable } from "@/components/borrows/my-borrows-table";
import { API_URL } from "@/lib/api";
import { auth } from "@/lib/auth";
import { requireUser } from "@/lib/session";
import type { Borrow } from "@/lib/types";
import { headers } from "next/headers";

export const metadata: Metadata = { title: "BookNook | My Borrows" };

// Server-side call to GET /borrows — needs the JWT of the logged-in user
async function getBorrows(): Promise<Borrow[] | null> {
  try {
    const tokenResult = await auth.api.getToken({ headers: await headers() });
    const res = await fetch(`${API_URL}/borrows`, {
      cache: "no-store",
      headers: { Authorization: `Bearer ${tokenResult?.token}` },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export default async function MyBorrowsPage() {
  await requireUser("/my-borrows");
  const borrows = await getBorrows();

  return (
    <main className="mx-auto max-w-6xl px-5 py-12">
      <div className="text-center">
        <h1 className="font-heading text-4xl font-medium md:text-5xl">
          My Borrows
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Books you are reading right now.
        </p>
      </div>

      <div className="mt-10">
        {borrows === null ? (
          <p role="alert" className="text-center text-destructive">
            Your borrows could not be loaded. Check that the backend server is
            running.
          </p>
        ) : borrows.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-12 text-center text-muted-foreground">
            You have not borrowed any book yet.{" "}
            <Link
              href="/books"
              className="font-medium text-brand underline-offset-4 hover:underline"
            >
              Browse All Books
            </Link>
            .
          </div>
        ) : (
          <MyBorrowsTable initialBorrows={borrows} />
        )}
      </div>
    </main>
  );
}
