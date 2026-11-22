"use client";

import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiRequest } from "@/lib/api";
import type { IBook } from "@/lib/types";
import { EditBookDialog } from "./edit-book-dialog";

export function MyBooksList({
  initialBooks,
  user,
}: {
  initialBooks: IBook[];
  user: { name: string; email: string };
}) {
  const [books, setBooks] = useState(initialBooks);
  const [editing, setEditing] = useState<IBook | null>(null);
  const [deleting, setDeleting] = useState<IBook | null>(null);
  const [busy, setBusy] = useState(false);

  const confirmDelete = async () => {
    if (!deleting) return;
    setBusy(true);
    try {
      await apiRequest(`/books/${deleting._id}`, { method: "DELETE" });
      setBooks((current) => current.filter((b) => b._id !== deleting._id));
      toast.success(`“${deleting.title}” was deleted.`);
      setDeleting(null);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not delete the book.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-4">Book</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Copies</TableHead>
              <TableHead className="pr-4 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.map((book) => (
              <TableRow key={book._id}>
                <TableCell className="py-3 pl-4">
                  <div className="flex items-center gap-3">
                    <Image
                      src={book.imageUrl}
                      alt={`Cover of ${book.title}`}
                      width={44}
                      height={60}
                      className="h-[60px] w-11 shrink-0 rounded object-cover"
                    />
                    <div className="min-w-0">
                      <p className="truncate font-medium">{book.title}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {book.author}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">
                    {book.category}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {book.availableCopies} / {book.totalCopies}
                </TableCell>
                <TableCell className="pr-4">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditing(book)}
                      className="rounded-md border border-border bg-muted px-3.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-brand hover:text-brand"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleting(book)}
                      className="rounded-md bg-destructive px-3.5 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90"
                    >
                      Delete
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {editing && (
        <EditBookDialog
          key={editing._id}
          book={editing}
          user={user}
          onClose={() => setEditing(null)}
          onUpdated={(updated) =>
            setBooks((current) =>
              current.map((b) => (b._id === updated._id ? updated : b)),
            )
          }
        />
      )}

    
      <AlertDialog
        open={!!deleting}
        onOpenChange={(open) => {
          if (!open && !busy) setDeleting(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading">
              Delete this book?
            </AlertDialogTitle>
            <AlertDialogDescription>
              “{deleting?.title}” will be removed from the library and from
              every borrow list. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={busy}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={busy}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {busy ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
