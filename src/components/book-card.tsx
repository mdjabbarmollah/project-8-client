import Image from "next/image";
import Link from "next/link";
import type { Book } from "@/lib/types";

/** One book card: cover, category, title, author and a View Details button */
export function BookCard({ book }: { book: Book }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-brand/60">
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-muted">
        <Image
          src={book.imageUrl}
          alt={`Cover of ${book.title}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs tracking-wide text-muted-foreground">
          {book.category}
        </p>
        <h3 className="mt-1.5 font-heading text-lg leading-snug font-medium text-foreground">
          {book.title}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">by {book.author}</p>

        <Link
          href={`/books/${book._id}`}
          className="mt-4 rounded-md bg-brand px-4 py-2.5 text-center text-sm font-semibold text-brand-ink transition-colors hover:bg-brand-dark"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}
