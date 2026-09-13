import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import clsx from "clsx";

export default function Input({ label, error, className, id, type = "text", ...props }) {
  const inputId = id || props.name;
  const isPassword = type === "password";
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-ink-700">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          type={isPassword && isPasswordVisible ? "text" : type}
          className={clsx(
            "w-full rounded-lg border px-3 py-2 text-sm text-ink-900 placeholder:text-ink-300",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-forge-500",
            isPassword && "pr-11",
            error ? "border-red-400" : "border-ink-200",
            className
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            aria-label={isPasswordVisible ? "Hide password" : "Show password"}
            aria-pressed={isPasswordVisible}
            onClick={() => setIsPasswordVisible((visible) => !visible)}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-ink-400 transition-colors hover:text-ink-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-forge-500"
          >
            {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
