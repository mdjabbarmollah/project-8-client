import { Mail, MapPin, Phone } from "lucide-react";

import { Logo } from "@/components/logo";

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-muted/40 px-5 pt-14 pb-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {/* About */}
          <div>
            <Logo linked={false} />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              A small neighbourhood library on the web. Share the books on your
              shelf and borrow the ones you have been meaning to read.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading text-lg font-semibold">Contact</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2.5">
                <Mail className="size-4 shrink-0 text-brand" />
                <a
                  href="mailto:hello@booknook.app"
                  className="transition-colors hover:text-foreground"
                >
                  hello@booknook.app
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="size-4 shrink-0 text-brand" />
                <a
                  href="tel:+8801700000000"
                  className="transition-colors hover:text-foreground"
                >
                  +880 1700 000 000
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin className="size-4 shrink-0 text-brand" />
                <span>12 Reading Lane, Dhaka</span>
              </li>
            </ul>
          </div>

          {/* Social links */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="font-heading text-lg font-semibold">Follow us</h3>
            <div className="mt-4 flex items-center gap-3">
              <a
                href="https://x.com"
                aria-label="X"
                className="flex size-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-brand hover:text-brand"
              >
                {/* New X logo (not the old Twitter bird) */}
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://facebook.com"
                aria-label="Facebook"
                className="flex size-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-brand hover:text-brand"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                aria-label="Instagram"
                className="flex size-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-brand hover:text-brand"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-4"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © 2026 BookNook. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
