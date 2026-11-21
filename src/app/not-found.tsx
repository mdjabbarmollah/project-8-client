import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "BookNook | Page Not Found" };

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-6xl flex-col items-center justify-center gap-5 px-5 text-center">
      <p className="font-heading text-7xl font-medium text-brand">404</p>
      <h1 className="font-heading text-3xl font-medium">Page not found</h1>
      <p className="text-sm text-muted-foreground">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-md bg-brand px-7 py-3.5 text-sm font-semibold text-brand-ink transition-colors hover:bg-brand-dark"
      >
        Back to Home
      </Link>
    </main>
  );
}
