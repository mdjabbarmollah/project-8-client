import type { Metadata } from "next";
import { Suspense } from "react";
import { AddBookForm } from "@/components/books/add-book-form";
import { LoadingSpinner } from "@/components/loading-spinner";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = { title: "BookNook | Add Book" };

export default async function AddBookPage() {
  
  await requireUser("/add-book");

  return (
    <main className="mx-auto max-w-6xl px-5 py-12">
      <div className="text-center">
        <h1 className="font-heading text-4xl font-medium md:text-5xl">
          Add a Book
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Put a book from your shelf into the library.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-lg">
        <Suspense fallback={<LoadingSpinner />}>
          <AddBookForm />
        </Suspense>
      </div>
    </main>
  );
}
