"use client";

import { MinusIcon, PlusIcon } from "@/components/ui/icons";

type Props = {
  value: number;
  max: number;
  onChange: (next: number) => void;
  label: string;
  className?: string;
};

export default function QuantityStepper({
  value,
  max,
  onChange,
  label,
  className = "",
}: Props) {
  return (
    <div className={`inline-flex items-center border border-rule-strong ${className}`}>
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        className="flex h-10 w-10 items-center justify-center transition-opacity hover:opacity-60"
      >
        <MinusIcon />
        <span className="visually-hidden">Decrease quantity of {label}</span>
      </button>
      <span className="num w-8 text-center text-[0.8125rem]" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        className="flex h-10 w-10 items-center justify-center transition-opacity hover:opacity-60 disabled:cursor-not-allowed disabled:opacity-30"
      >
        <PlusIcon />
        <span className="visually-hidden">Increase quantity of {label}</span>
      </button>
    </div>
  );
}
