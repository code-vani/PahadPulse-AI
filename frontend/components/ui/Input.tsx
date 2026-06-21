/**
 * Input component
 * @param {string} label - Label text shown above the input
 * @param {string} placeholder - Placeholder text inside the input
 * @param {string} type - HTML input type, e.g. "text", "email", "password" (default: "text")
 * @param {string} value - Current value of the input
 * @param {(value: string) => void} onChange - Called with the new value when input changes
 */
interface InputProps {
  label?: string;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export default function Input({ label, placeholder, type = "text", value, onChange }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">{label}</label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm shadow-sm
          focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
          transition-all dark:bg-gray-800 dark:border-gray-600 dark:text-white
          placeholder:text-gray-400"
      />
    </div>
  );
}
