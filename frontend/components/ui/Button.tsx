import { ReactNode } from "react";

/**
 * Button component
 * @param {ReactNode} children - Content inside the button
 * @param {() => void} onClick - Click handler
 * @param {"primary" | "secondary" | "ghost"} variant - Visual style (default: "primary")
 * @param {boolean} disabled - Whether the button is disabled (default: false)
 */
interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  disabled?: boolean;
}

export default function Button({
  children,
  onClick,
  variant = "primary",
  disabled = false,
}: ButtonProps) {
  const base =
    "px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-200 shadow-sm active:scale-95 disabled:cursor-not-allowed disabled:opacity-50";
  const styles = {
    primary:
      "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-md hover:from-green-700 hover:to-emerald-700",
    secondary:
      "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600",
    ghost:
      "bg-transparent text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:bg-gray-800",
  };

  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${styles[variant]}`}>
      {children}
    </button>
  );
}
