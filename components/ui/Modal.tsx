"use client";

import { useRef } from "react";
import { useEscape, useFocusTrap, useLockBodyScroll } from "@/lib/hooks";
import { CloseIcon } from "./icons";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

export default function Modal({ open, onClose, title, children }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);

  useLockBodyScroll(open);
  useEscape(open, onClose);
  useFocusTrap(open, panelRef);

  return (
    // Stays mounted so it can animate out; `visibility: hidden` keeps it out
    // of the tab order and the accessibility tree while closed. Centring is
    // flex rather than inset-1/2 + -translate-1/2, which would have fought the
    // panel's own transform.
    <div
      data-open={open}
      className="overlay-root fixed inset-0 z-[var(--z-overlay)] flex items-end justify-center md:items-center"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        tabIndex={open ? undefined : -1}
        className="absolute inset-0 h-full w-full cursor-default bg-black/45"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="overlay-panel overlay-from-below relative max-h-[88vh] w-full overflow-y-auto bg-surface md:max-h-[80vh] md:w-[min(46rem,92vw)]"
      >
        <div className="flex items-center justify-between border-b border-rule px-6 py-5 md:px-8">
          <p className="type-meta">{title}</p>
          <button
            type="button"
            onClick={onClose}
            className="p-1 transition-opacity hover:opacity-60"
          >
            <CloseIcon />
            <span className="visually-hidden">Close</span>
          </button>
        </div>
        <div className="px-6 py-8 md:px-8">{children}</div>
      </div>
    </div>
  );
}
