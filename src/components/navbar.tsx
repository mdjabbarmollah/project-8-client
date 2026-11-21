"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LogOut, Menu, UserRound, X } from "lucide-react";
import { toast } from "sonner";

import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/books", label: "All Books" },
];

// Private links — only shown to logged-in users
const privateLinks = [
  { href: "/add-book", label: "Add Book" },
  { href: "/my-books", label: "My Books" },
  { href: "/my-borrows", label: "My Borrows" },
];

export function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const pathname = usePathname();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false); // profile dropdown
  const [mobileOpen, setMobileOpen] = useState(false); // mobile nav
  const menuRef = useRef<HTMLDivElement>(null);

  const links = user ? [...publicLinks, ...privateLinks] : publicLinks;

  // Close the profile dropdown when clicking outside
  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [menuOpen]);

  // Close menus when the route changes (adjust state during render, per React docs)
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMobileOpen(false);
    setMenuOpen(false);
  }

  const handleLogout = async () => {
    await authClient.signOut();
    setMenuOpen(false);
    toast.success("Logged out");
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
        <Logo />

        {/* Desktop links */}
        <ul className="hidden items-center gap-7 text-sm md:flex">
          {links.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "transition-colors hover:text-brand",
                    active ? "text-brand" : "text-foreground/90",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right side: theme toggle + login buttons or avatar */}
        <div className="flex items-center gap-2 md:gap-3">
          <ThemeToggle />

          {isPending ? null : user ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                className="rounded-full ring-2 ring-transparent transition-shadow hover:ring-brand/60"
                aria-label="Open account menu"
                aria-expanded={menuOpen}
              >
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name}
                    width={36}
                    height={36}
                    referrerPolicy="no-referrer"
                    className="size-9 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex size-9 items-center justify-center rounded-full bg-brand font-semibold text-brand-ink">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-3 w-56 rounded-lg border border-border bg-popover p-4 text-left shadow-xl">
                  <p className="truncate font-semibold text-foreground">
                    {user.name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </p>

                  <div className="my-3 h-px bg-border" />

                  <Link
                    href="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-foreground transition-colors hover:bg-muted"
                  >
                    <UserRound className="size-4" />
                    My Profile
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
                  >
                    <LogOut className="size-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden px-3 py-2 text-sm transition-colors hover:text-brand sm:block"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-brand-ink transition-colors hover:bg-brand-dark"
              >
                Register
              </Link>
            </>
          )}

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className="flex size-9 items-center justify-center rounded-md text-foreground transition-colors hover:bg-muted md:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile links */}
      {mobileOpen && (
        <ul className="border-t border-border bg-background px-5 py-3 text-sm md:hidden">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "block rounded-md px-3 py-2.5 transition-colors hover:bg-muted",
                  pathname === link.href ? "text-brand" : "text-foreground",
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
          {!isPending && !user && (
            <li>
              <Link
                href="/login"
                className="block rounded-md px-3 py-2.5 text-foreground transition-colors hover:bg-muted"
              >
                Login
              </Link>
            </li>
          )}
        </ul>
      )}
    </header>
  );
}
