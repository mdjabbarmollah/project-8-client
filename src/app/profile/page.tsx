import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Library, RotateCcw } from "lucide-react";

import { requireUser } from "@/lib/session";
import { serverFetch } from "@/lib/server-api";
import type { Book, Borrow } from "@/lib/types";

export const metadata: Metadata = { title: "BookNook | My Profile" };

export default async function ProfilePage() {
  const user = await requireUser("/profile");

  // Two small stats so the page is not just a name and an email
  let bookCount = 0;
  let borrowCount = 0;
  try {
    const [booksRes, borrowsRes] = await Promise.all([
      serverFetch(`/books?email=${encodeURIComponent(user.email)}`, true),
      serverFetch("/borrows", true),
    ]);
    if (booksRes.ok) bookCount = ((await booksRes.json()) as Book[]).length;
    if (borrowsRes.ok) borrowCount = ((await borrowsRes.json()) as Borrow[]).length;
  } catch {
    // stats are optional — page still renders without them
  }

  const stats = [
    { icon: Library, label: "Books added", value: bookCount },
    { icon: BookOpen, label: "Active borrows", value: borrowCount },
    { icon: RotateCcw, label: "Returned", value: 0 },
  ];

  return (
    <main className="mx-auto max-w-6xl px-5 py-14">
      <div className="mx-auto flex max-w-xl flex-col items-center rounded-lg border border-border bg-card px-6 py-12 text-center">
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name}
            width={112}
            height={112}
            referrerPolicy="no-referrer"
            className="size-28 rounded-full object-cover"
          />
        ) : (
          <span className="flex size-28 items-center justify-center rounded-full bg-brand font-heading text-4xl font-semibold text-brand-ink">
            {user.name.charAt(0).toUpperCase()}
          </span>
        )}

        <h1 className="mt-6 font-heading text-3xl font-medium">{user.name}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{user.email}</p>

        <div className="mt-8 grid w-full grid-cols-3 gap-3">
          {stats.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="rounded-lg border border-border bg-background px-3 py-4"
            >
              <Icon className="mx-auto size-4.5 text-brand" />
              <p className="mt-2 font-heading text-2xl font-medium">{value}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex gap-3">
          <Link
            href="/my-books"
            className="rounded-md border border-border bg-muted px-5 py-2.5 text-sm font-medium transition-colors hover:border-brand hover:text-brand"
          >
            My Books
          </Link>
          <Link
            href="/my-borrows"
            className="rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-brand-ink transition-colors hover:bg-brand-dark"
          >
            My Borrows
          </Link>
        </div>
      </div>
    </main>
  );
}
