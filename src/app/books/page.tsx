import type { Metadata } from "next";
import Link from "next/link";
import { BookCard } from "@/components/book-card";
import { API_URL } from "@/lib/api";
import { CATEGORIES, type Book } from "@/lib/types";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "BookNook | All Books" };


async function getBooks(category: string): Promise<Book[] | null> {
  const query = category ? `?category=${encodeURIComponent(category)}` : "";
  try {
    const res = await fetch(`${API_URL}/books${query}`, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export default async function AllBooksPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category = "" } = await searchParams;
  const selected = CATEGORIES.includes(category) ? category : "";
  const books = await getBooks(selected);

  const filterClass = (active: boolean) =>
    cn(
      "rounded-md border px-4 py-2 text-sm transition-colors",
      active
        ? "border-brand bg-brand font-semibold text-brand-ink"
        : "border-border bg-card text-foreground hover:border-brand hover:text-brand",
    );

  return (
    <main className="mx-auto max-w-6xl px-5 py-12">
      <div className="text-center">
        <h1 className="font-heading text-4xl font-medium md:text-5xl">
          All Books
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Every book on the BookNook shelf.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/books" className={filterClass(selected === "")}>
          All
        </Link>
        {CATEGORIES.map((item) => (
          <Link
            key={item}
            href={`/books?category=${item}`}
            className={filterClass(selected === item)}
          >
            {item}
          </Link>
        ))}
      </div>

      {books === null ? (
        <p role="alert" className="mt-12 text-center text-destructive">
          Books could not be loaded. Check that the backend server is running.
        </p>
      ) : books.length === 0 ? (
        <p className="mt-12 text-center text-muted-foreground">
          No books found in this category.
        </p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      )}
    </main>
  );
}
