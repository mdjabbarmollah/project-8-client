import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "BookNook | Login" };

export default function LoginPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-14">
      <LoginForm />
    </main>
  );
}
