"use client";

interface Props {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm">
        <h3 className="font-display font-semibold text-lg text-brand">{title}</h3>
        <p className="text-sm text-foreground/70 mt-2">{message}</p>
        <div className="flex gap-3 mt-5 justify-end">
          <button onClick={onCancel} className="px-4 py-2 rounded-full text-sm border border-brand/20 text-brand">
            Cancel
          </button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-full text-sm bg-clay text-white font-semibold">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}