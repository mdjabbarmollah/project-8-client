import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BorrowButton } from "@/components/borrow-button";
import { API_URL } from "@/lib/api";
import { requireUser } from "@/lib/session";
import type { Book } from "@/lib/types";

async function getBook(id: string): Promise<Book | null> {
  try {
    const res = await fetch(`${API_URL}/books/${id}`, { cache: "no-store" });
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  return { title: "BookNook | Book Details" };
}

export default async function BookDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Private route: logged-out visitors are sent to Login and come back here
  const user = await requireUser(`/books/${id}`);

  const book = await getBook(id);
  if (!book) notFound();

  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,400px)_1fr]">
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-muted">
          <Image
            src={book.imageUrl}
            alt={`Cover of ${book.title}`}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 400px"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col">
          <span className="w-fit rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
            {book.category}
          </span>

          <h1 className="mt-4 font-heading text-4xl leading-tight font-medium md:text-5xl">
            {book.title}
          </h1>
          <p className="mt-3 text-muted-foreground">by {book.author}</p>
          <p className="mt-5 max-w-2xl leading-relaxed text-foreground/85">
            {book.description}
          </p>

          {/* Who added it + copies left */}
          <div className="mt-7 grid gap-6 rounded-lg border border-border bg-card px-6 py-5 text-sm sm:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground">Added by</p>
              <p className="mt-1.5 font-medium">{book.addedByName}</p>
              <p className="text-xs text-muted-foreground">
                {book.addedByEmail}
              </p>
            </div>
            <div className="sm:text-right">
              <p className="text-xs text-muted-foreground">Copies left</p>
              <p className="mt-1.5 font-medium text-brand">
                {book.availableCopies}
              </p>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-6">
            <BorrowButton
              bookId={book._id}
              bookTitle={book.title}
              userName={user.name}
              userEmail={user.email}
              available={book.availableCopies > 0}
            />
            <Link
              href="/books"
              className="text-sm text-muted-foreground transition-colors hover:text-brand"
            >
              Back to all books
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
