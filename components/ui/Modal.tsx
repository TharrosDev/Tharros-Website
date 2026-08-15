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

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-70">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-black/45"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="absolute inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto bg-surface md:inset-1/2 md:bottom-auto md:max-h-[80vh] md:w-[min(46rem,92vw)] md:-translate-x-1/2 md:-translate-y-1/2"
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
