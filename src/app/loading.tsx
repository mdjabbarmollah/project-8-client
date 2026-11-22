
export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div
        role="status"
        aria-label="Loading"
        className="size-10 animate-spin rounded-full border-4 border-brand border-t-transparent"
      />
    </div>
  );
}
