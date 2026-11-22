"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";


export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
    
      <Sun className="hidden size-4.5 dark:block" />
      <Moon className="block size-4.5 dark:hidden" />
    </button>
  );
}
