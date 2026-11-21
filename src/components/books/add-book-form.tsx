'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { LoadingSpinner } from '@/components/loading-spinner';
import { apiRequest } from '@/lib/api';
import { authClient } from '@/lib/auth-client';
import type { IBook } from '@/lib/types';
import { BookForm } from './book-form';

export function AddBookForm() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.replace('/login?redirect=/add-book');
    }
  }, [isPending, session, router]);

  if (isPending || !session?.user) return <LoadingSpinner />;

  return (
    <BookForm
      user={{ name: session.user.name, email: session.user.email }}
      submitLabel="Add Book"
      onSubmit={async payload => {
        await apiRequest<IBook>('/books', { method: 'POST', body: payload });
        toast.success('Book added successfully!');
        router.push('/my-books');
        router.refresh();
      }}
    />
  );
}
