"use client";

import { MinusIcon, PlusIcon } from "@/components/ui/icons";

type Props = {
  value: number;
  max: number;
  onChange: (next: number) => void;
  label: string;
  /** Floor. Below it the control stops rather than falling through to zero. */
  min?: number;
  className?: string;
};

/**
 * Only the plus used to have a floor. Stepping down from one called
 * `onChange(0)`, and in the bag that deletes the line — so the quietest control
 * on the drawer was also the one irreversible one, with no confirmation and no
 * undo. Removing a line is the Remove button's job; this one counts.
 *
 * The guard lives here rather than in each caller: the buy panel already
 * clamped with `Math.max(1, next)` and the bag did not, which is the shape of
 * bug that comes back the next time someone adds a third caller.
 */
export default function QuantityStepper({
  value,
  max,
  onChange,
  label,
  min = 1,
  className = "",
}: Props) {
  return (
    <div className={`inline-flex items-center border border-rule-strong ${className}`}>
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        className="flex h-10 w-10 items-center justify-center transition-opacity hover:opacity-60 disabled:cursor-not-allowed disabled:opacity-30"
      >
        <MinusIcon />
        <span className="visually-hidden">Decrease quantity of {label}</span>
      </button>
      <span className="num type-mono-3 w-8 text-center" aria-live="polite">
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
