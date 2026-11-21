"use client";

import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiRequest } from "@/lib/api";
import type { IBorrow } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function MyBorrowsTable({
  initialBorrows,
}: {
  initialBorrows: IBorrow[];
}) {
  const [borrows, setBorrows] = useState(initialBorrows);
  const [returningId, setReturningId] = useState<string | null>(null);

  // Return Book: removes the row, backend increases the copy count by 1
  const handleReturn = async (borrow: IBorrow) => {
    setReturningId(borrow._id);
    try {
      await apiRequest(`/borrows/${borrow._id}`, { method: "DELETE" });
      setBorrows((current) => current.filter((b) => b._id !== borrow._id));
      toast.success("Book returned. Thank you!");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not return the book.",
      );
    } finally {
      setReturningId(null);
    }
  };

  if (borrows.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-12 text-center text-muted-foreground">
        You have not borrowed any book yet. Time to pick a new one!
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="pl-4">Image</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Borrow Date</TableHead>
            <TableHead>Return Date</TableHead>
            <TableHead className="pr-4 text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {borrows.map((borrow) => (
            <TableRow key={borrow._id}>
              <TableCell className="py-3 pl-4">
                <Image
                  src={borrow.bookImage}
                  alt={`Cover of ${borrow.bookTitle}`}
                  width={44}
                  height={60}
                  className="h-[60px] w-11 shrink-0 rounded object-cover"
                />
              </TableCell>
              <TableCell className="font-medium">
                {borrow.bookTitle}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(borrow.borrowDate)}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(borrow.returnDate)}
              </TableCell>
              <TableCell className="pr-4 text-right">
                <button
                  type="button"
                  disabled={returningId === borrow._id}
                  onClick={() => handleReturn(borrow)}
                  className="rounded-md border border-border bg-muted px-4 py-2 text-xs font-medium text-foreground transition-colors hover:border-brand hover:text-brand disabled:opacity-60"
                >
                  {returningId === borrow._id ? "Returning..." : "Return Book"}
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
