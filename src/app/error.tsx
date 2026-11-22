"use client";

import Link from "next/link";
import { useEffect } from "react";


export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-6xl flex-col items-center justify-center gap-5 px-5 text-center">
      <p className="font-heading text-6xl font-medium text-destructive">!</p>
      <h1 className="font-heading text-3xl font-medium">
        Something went wrong
      </h1>
      <p className="max-w-md text-sm text-muted-foreground">
        This page could not be loaded. Try again, or go back to the home page.
      </p>
      <div className="mt-2 flex gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-md bg-brand px-6 py-3 text-sm font-semibold text-brand-ink transition-colors hover:bg-brand-dark"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="rounded-md border border-border bg-muted px-6 py-3 text-sm font-medium transition-colors hover:border-brand hover:text-brand"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
