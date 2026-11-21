'use client';

import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { apiRequest } from '@/lib/api';
import type { IBook } from '@/lib/types';
import { BookForm } from './book-form';

export function EditBookDialog({
  book,
  user,
  onClose,
  onUpdated,
}: {
  book: IBook;
  user: { name: string; email: string };
  onClose: () => void;
  onUpdated: (book: IBook) => void;
}) {
  return (
    <Dialog
      open
      onOpenChange={open => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit Book</DialogTitle>
          <DialogDescription>
            Update the details below and save your changes.
          </DialogDescription>
        </DialogHeader>
        <BookForm
          book={book}
          user={user}
          submitLabel="Save Changes"
          onCancel={onClose}
          onSubmit={async payload => {
            const updated = await apiRequest<IBook>(`/books/${book._id}`, {
              method: 'PATCH',
              body: payload,
            });
            toast.success('Book updated successfully!');
            onUpdated(updated);
            onClose();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
