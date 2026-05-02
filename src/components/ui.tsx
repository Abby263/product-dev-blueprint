"use client";

import clsx from "clsx";
import { forwardRef, ReactNode } from "react";

export const Button = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
}>(function Button({ className, variant = "primary", ...rest }, ref) {
  const styles: Record<string, string> = {
    primary:
      "bg-ink-900 text-white hover:bg-ink-800 disabled:bg-ink-300 dark:bg-ink-50 dark:text-ink-900 dark:hover:bg-white dark:disabled:bg-ink-700 dark:disabled:text-ink-400",
    secondary:
      "bg-white text-ink-900 border border-ink-300 hover:bg-ink-50 dark:bg-ink-900 dark:text-ink-100 dark:border-ink-700 dark:hover:bg-ink-800",
    ghost:
      "bg-transparent text-ink-700 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800",
    danger:
      "bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600",
  };
  return (
    <button
      ref={ref}
      className={clsx(
        "inline-flex min-w-0 items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-center whitespace-normal transition-colors disabled:cursor-not-allowed",
        styles[variant],
        className,
      )}
      {...rest}
    />
  );
});

export function Field({
  label,
  hint,
  children,
  required,
  htmlFor,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  required?: boolean;
  htmlFor?: string;
}) {
  return (
    <label htmlFor={htmlFor} className="block">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-medium text-ink-800 dark:text-ink-200">
          {label}
          {required && <span className="text-red-600 dark:text-red-400 ml-0.5">*</span>}
        </span>
      </div>
      {children}
      {hint && <p className="text-xs text-ink-500 dark:text-ink-400 mt-1.5 leading-relaxed">{hint}</p>}
    </label>
  );
}

const fieldClasses =
  "w-full bg-white border border-ink-300 rounded-md px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400 dark:bg-ink-900 dark:border-ink-700 dark:text-ink-100 dark:placeholder:text-ink-500 focus:outline-none focus:ring-2 focus:ring-accent-300 dark:focus:ring-accent-500/40 focus:border-accent-400";

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...rest }, ref) {
    return <input ref={ref} className={clsx(fieldClasses, className)} {...rest} />;
  },
);

export const Textarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className, ...rest }, ref) {
    return <textarea ref={ref} className={clsx(fieldClasses, "leading-relaxed", className)} {...rest} />;
  },
);

export const Select = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className, children, ...rest }, ref) {
    return (
      <select ref={ref} className={clsx(fieldClasses, className)} {...rest}>
        {children}
      </select>
    );
  },
);

export function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-ink-800 dark:text-ink-200 cursor-pointer select-none">
      <input
        type="checkbox"
        className="h-4 w-4 rounded border-ink-300 dark:border-ink-700 dark:bg-ink-900 text-accent-600 focus:ring-accent-300"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label}
    </label>
  );
}

export function MultiCheck({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string[];
  onChange: (next: string[]) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {options.map((opt) => {
        const on = value.includes(opt.value);
        return (
          <Checkbox
            key={opt.value}
            label={opt.label}
            checked={on}
            onChange={(v) => onChange(v ? [...value, opt.value] : value.filter((x) => x !== opt.value))}
          />
        );
      })}
    </div>
  );
}

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "min-w-0 max-w-full bg-white border border-ink-200 rounded-xl shadow-sm dark:bg-ink-900 dark:border-ink-800 dark:shadow-none",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "good" | "warn" | "bad" | "accent";
}) {
  const styles: Record<string, string> = {
    neutral:
      "bg-ink-100 text-ink-700 border-ink-200 dark:bg-ink-800 dark:text-ink-200 dark:border-ink-700",
    good:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-200 dark:border-emerald-700/50",
    warn:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/40 dark:text-amber-200 dark:border-amber-700/50",
    bad:
      "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/40 dark:text-red-200 dark:border-red-700/50",
    accent:
      "bg-accent-50 text-accent-700 border-accent-200 dark:bg-accent-900/40 dark:text-accent-200 dark:border-accent-700/50",
  };
  return (
    <span
      className={clsx(
        "inline-flex min-w-0 max-w-full items-center px-2 py-0.5 text-xs font-medium rounded-full border break-words",
        styles[tone],
      )}
    >
      {children}
    </span>
  );
}

export function ProgressBar({ value, max = 100 }: { value: number; max?: number }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="h-1.5 w-full bg-ink-100 dark:bg-ink-800 rounded-full overflow-hidden">
      <div className="h-full bg-accent-500 transition-[width]" style={{ width: `${pct}%` }} />
    </div>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="min-w-0 max-w-full overflow-hidden text-center py-12 sm:py-16 px-4 sm:px-6 border-2 border-dashed border-ink-200 dark:border-ink-800 rounded-xl bg-white dark:bg-ink-900">
      <h3 className="text-base font-semibold text-ink-900 dark:text-ink-50">{title}</h3>
      <p className="text-sm text-ink-600 dark:text-ink-400 mt-1 max-w-md mx-auto break-words">{body}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
