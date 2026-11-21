import type { Metadata } from "next";
import Link from "next/link";

import { MyBooksList } from "@/components/books/my-books-list";
import { requireUser } from "@/lib/session";
import { serverFetch } from "@/lib/server-api";
import type { IBook } from "@/lib/types";

export const metadata: Metadata = { title: "BookNook | My Books" };

export default async function MyBooksPage() {
  // Private route — session comes from the cookie, so a reload stays logged in
  const user = await requireUser("/my-books");

  let books: IBook[] = [];
  try {
    const res = await serverFetch(
      `/books?email=${encodeURIComponent(user.email)}`,
      true,
    );
    if (res.ok) books = await res.json();
  } catch {
    books = [];
  }

  return (
    <main className="mx-auto max-w-6xl px-5 py-12">
      <div className="text-center">
        <h1 className="font-heading text-4xl font-medium md:text-5xl">
          My Books
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Books you added to the library.
        </p>
      </div>

      <div className="mt-10">
        {books.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-12 text-center text-muted-foreground">
            You have not added any books yet.{" "}
            <Link
              href="/add-book"
              className="font-medium text-brand underline-offset-4 hover:underline"
            >
              Add your first book
            </Link>
            .
          </div>
        ) : (
          <MyBooksList
            initialBooks={books}
            user={{ name: user.name, email: user.email }}
          />
        )}
      </div>
    </main>
  );
}
