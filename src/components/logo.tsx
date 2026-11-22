import Link from "next/link";
import { cn } from "@/lib/utils";


export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-md bg-brand",
        className,
      )}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="#0a0e0a"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-5"
        aria-hidden="true"
      >
        <path d="M12 7v14" />
        <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
      </svg>
    </span>
  );
}


export function Logo({ linked = true }: { linked?: boolean }) {
  const content = (
    <span className="flex items-center gap-2.5">
      <LogoMark />
      <span className="font-heading text-2xl font-bold tracking-tight text-foreground">
        BookNook
      </span>
    </span>
  );

  return linked ? (
    <Link href="/" className="shrink-0" aria-label="BookNook home">
      {content}
    </Link>
  ) : (
    content
  );
}
