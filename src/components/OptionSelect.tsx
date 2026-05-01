"use client";

import clsx from "clsx";
import { Select } from "@/components/ui";
import type { OptionDef } from "@/lib/options";

interface Props<T extends string> {
  value: T;
  options: OptionDef[];
  onChange: (next: T) => void;
  className?: string;
  showHint?: boolean;
  id?: string;
}

export function OptionSelect<T extends string>({
  value,
  options,
  onChange,
  className,
  showHint = true,
  id,
}: Props<T>) {
  const active = options.find((o) => o.value === value);
  return (
    <div className={clsx("space-y-1.5", className)}>
      <Select id={id} value={value} onChange={(e) => onChange(e.target.value as T)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </Select>
      {showHint && active?.hint && (
        <p className="text-xs text-ink-500 dark:text-ink-400 leading-relaxed">{active.hint}</p>
      )}
    </div>
  );
}
