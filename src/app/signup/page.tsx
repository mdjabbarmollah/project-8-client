import type { Metadata } from "next";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = { title: "BookNook | Register" };

export default function SignUpPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-14">
      <SignupForm />
    </main>
  );
}
