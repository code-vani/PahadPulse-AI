export default function EmptyState({ message, actionLabel, onAction }: { message: string; actionLabel?: string; onAction?: () => void }) {
  return (
    <div className="text-center py-16 text-muted">
      <p className="text-sm">{message}</p>
      {actionLabel && onAction && (
        <button onClick={onAction} className="mt-4 bg-brand text-background px-5 py-2 rounded-full text-sm font-semibold">
          {actionLabel}
        </button>
      )}
    </div>
  );
}