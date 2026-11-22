import type { Metadata } from "next";
import Link from "next/link";
import {
  Atom,
  BookOpen,
  Landmark,
  RotateCcw,
  Search,
  Smile,
  Sparkles,
} from "lucide-react";

import { BookCard } from "@/components/book-card";
import { HeroSlider } from "@/components/hero-slider";
import { API_URL } from "@/lib/api";
import type { Book } from "@/lib/types";

export const metadata: Metadata = { title: "BookNook | Home" };


async function getLatestBooks(): Promise<Book[]> {
  try {
    const res = await fetch(`${API_URL}/books?limit=6`, { cache: "no-store" });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

const steps = [
  {
    icon: Search,
    step: "Step 1",
    title: "Find a book",
    text: "Browse the shelf and open any book you like.",
  },
  {
    icon: BookOpen,
    step: "Step 2",
    title: "Borrow it",
    text: "Confirm the borrow. The book is yours for 7 days.",
  },
  {
    icon: RotateCcw,
    step: "Step 3",
    title: "Return it",
    text: "Done reading? Return it from My Borrows in one click.",
  },
];

const categories = [
  { name: "Fiction", icon: Sparkles, text: "Novels and short stories" },
  { name: "Science", icon: Atom, text: "How the world works" },
  { name: "History", icon: Landmark, text: "Stories from the past" },
  { name: "Kids", icon: Smile, text: "Picture books and more" },
  { name: "Others", icon: BookOpen, text: "Everything else on the shelf" },
];

export default async function HomePage() {
  const latest = await getLatestBooks();

  return (
    <main>
      <HeroSlider />

      {/* New Arrivals: the 6 newest books */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="mb-10 text-center">
          <h2 className="font-heading text-4xl font-medium md:text-5xl">
            New Arrivals
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            The latest books added by our readers.
          </p>
        </div>

        {latest.length === 0 ? (
          <p className="text-center text-muted-foreground">
            No books to show yet. Add the first one, or check that the server is
            running.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latest.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            href="/books"
            className="inline-block rounded-md border border-border bg-muted px-6 py-3 text-sm font-medium text-foreground transition-colors hover:border-brand hover:text-brand"
          >
            See All Books
          </Link>
        </div>
      </section>

      {/* Extra section 1: How Borrowing Works */}
      <section className="border-y border-border bg-muted/30 px-5 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="font-heading text-4xl font-medium md:text-5xl">
              How Borrowing Works
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Three steps. No library card needed.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {steps.map(({ icon: Icon, ...step }) => (
              <div
                key={step.title}
                className="rounded-lg border border-border bg-card p-7 text-center"
              >
                <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-brand">
                  <Icon className="size-5 text-brand-ink" />
                </span>
                <p className="mt-4 text-xs font-semibold tracking-wider text-amber-label uppercase">
                  {step.step}
                </p>
                <h3 className="mt-2 font-heading text-xl font-medium">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Extra section 2: Top Categories */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="text-center">
          <h2 className="font-heading text-4xl font-medium md:text-5xl">
            Top Categories
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Pick a shelf and start reading.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map(({ icon: Icon, name, text }) => (
            <Link
              key={name}
              href={`/books?category=${name}`}
              className="rounded-lg border border-border bg-card p-6 text-center transition-colors hover:border-brand"
            >
              <Icon className="mx-auto size-6 text-brand" strokeWidth={1.6} />
              <h3 className="mt-4 font-heading text-lg font-medium">{name}</h3>
              <p className="mt-1.5 text-xs text-muted-foreground">{text}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
