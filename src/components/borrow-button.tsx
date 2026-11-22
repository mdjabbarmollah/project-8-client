"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";

import { API_URL } from "@/lib/api";
import { getClientToken } from "@/lib/client-token";
import { brandButton, cn } from "@/lib/utils";

type Props = {
  bookId: string;
  bookTitle: string;
  userName: string;
  userEmail: string;
  available: boolean;
};


export function BorrowButton({
  bookId,
  bookTitle,
  userName,
  userEmail,
  available,
}: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const confirmBorrow = async () => {
    setSaving(true);
    try {
      const token = await getClientToken();
      const res = await fetch(`${API_URL}/borrows`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bookId }),
      });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        toast.error(data?.message ?? "Borrow failed. Please try again.");
        return;
      }

      toast.success(`Book borrowed! Return it within 7 days.`);
      setOpen(false);
      router.refresh(); // refresh copy count and availability
    } catch {
      toast.error("Network problem. Please try again.");
    } finally {
      setSaving(false);
    }
  };


  if (!available) {
    return (
      <button
        type="button"
        disabled
        className="cursor-not-allowed rounded-md bg-muted px-6 py-3 text-sm font-semibold text-muted-foreground"
      >
        Not Available
      </button>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(brandButton, "px-6 py-3 text-sm")}
      >
        Borrow This Book
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-5"
          onClick={() => !saving && setOpen(false)}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Borrow ${bookTitle}`}
            className="relative w-full max-w-md rounded-lg border border-border bg-popover p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close"
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="size-4.5" />
            </button>

            <h2 className="pr-8 font-heading text-xl font-medium">
              Borrow &ldquo;{bookTitle}&rdquo;
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              You can keep this book for 7 days.
            </p>

            <div className="mt-6 grid gap-4 text-sm">
              <label className="grid gap-1.5">
                <span className="text-muted-foreground">User Name</span>
                <input
                  readOnly
                  value={userName}
                  className="rounded-md border border-border bg-muted px-3 py-2.5 text-foreground outline-none"
                />
              </label>
              <label className="grid gap-1.5">
                <span className="text-muted-foreground">User Email</span>
                <input
                  readOnly
                  value={userEmail}
                  className="rounded-md border border-border bg-muted px-3 py-2.5 text-foreground outline-none"
                />
              </label>
            </div>

            <div className="mt-7 flex justify-end">
              <button
                type="button"
                onClick={confirmBorrow}
                disabled={saving}
                className={cn(brandButton, "px-5 py-2.5 text-sm disabled:opacity-60")}
              >
                {saving ? "Confirming..." : "Confirm Borrow"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
