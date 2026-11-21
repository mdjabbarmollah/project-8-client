import { Loader2 } from 'lucide-react';

export function LoadingSpinner({ label = 'Loading...' }: { label?: string }) {
  return (
    <div
      role="status"
      className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-muted-foreground"
    >
      <Loader2 className="size-9 animate-spin text-brand" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
