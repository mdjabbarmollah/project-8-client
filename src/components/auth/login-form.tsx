"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { brandButton, cn } from "@/lib/utils";

const GOOGLE_ICON = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-4">
    <path
      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
      fill="currentColor"
    />
  </svg>
);


function getReturnPath() {
  if (typeof window === "undefined") return "/";
  const params = new URLSearchParams(window.location.search);
  const path = params.get("callbackURL") ?? params.get("redirect");
  return path && path.startsWith("/") ? path : "/";
}

export function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    setLoading(true);
    const { error } = await authClient.signIn.email({
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
    });
    setLoading(false);

    if (error) {
      toast.error(error.message ?? "Login failed. Please try again.");
      return;
    }

    toast.success("Welcome back!");
    router.push(getReturnPath());
    router.refresh();
  };

  
  const handleGoogleLogin = async () => {
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: getReturnPath(),
    });
    if (error) toast.error(error.message ?? "Google login failed.");
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-lg border border-border bg-card p-7">
      <div className="text-center">
        <h1 className="font-heading text-3xl font-medium">Welcome back</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Login with your email or Google account
        </p>
      </div>

      <form onSubmit={handleEmailLogin} className="mt-7 grid gap-5">
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-2.5 rounded-md border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          {GOOGLE_ICON}
          Login with Google
        </button>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          Or continue with email
          <span className="h-px flex-1 bg-border" />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="grid gap-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <span
              className="cursor-default text-xs text-muted-foreground"
              title="Password reset is not enabled for this demo"
            >
              Forget Password?
            </span>
          </div>
          <Input id="password" name="password" type="password" required />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={cn(brandButton, "w-full px-4 py-2.5 text-sm disabled:opacity-60")}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium text-brand hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
