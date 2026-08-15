"use client";

import { useId, useState } from "react";
import { MinusIcon, PlusIcon } from "./icons";

type Props = {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  /** Depth in the page outline. 3 assumes a section heading above it. */
  level?: 2 | 3;
};

export default function Accordion({
  title,
  children,
  defaultOpen = false,
  level = 3,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();
  const Heading = level === 2 ? "h2" : "h3";

  return (
    <div className="border-b border-rule">
      <Heading>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls={panelId}
          className="type-meta flex w-full items-center justify-between gap-4 py-5 text-left transition-opacity hover:opacity-60"
        >
          <span>{title}</span>
          {open ? <MinusIcon /> : <PlusIcon />}
        </button>
      </Heading>
      <div id={panelId} hidden={!open} className="pb-6">
        {children}
      </div>
    </div>
  );
}
