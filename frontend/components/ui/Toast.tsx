/**
 * Toast component
 * @param {string} message - Message text to display
 * @param {"success" | "error" | "info"} type - Visual category of the toast (default: "info")
 * @param {boolean} show - Whether the toast is visible
 */
interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  show?: boolean;
}

export default function Toast({ message, type = "info", show = true }: ToastProps) {
  if (!show) return null;

  const styles = {
    success: "bg-gradient-to-r from-green-600 to-emerald-600",
    error: "bg-gradient-to-r from-red-600 to-rose-600",
    info: "bg-gradient-to-r from-gray-700 to-gray-800",
  };

  return (
    <div
      className={`fixed bottom-6 right-6 ${styles[type]} text-white text-sm font-medium px-5 py-3 rounded-xl shadow-lg z-50 animate-[fadeIn_0.2s_ease-out]`}
    >
      {message}
    </div>
  );
}
