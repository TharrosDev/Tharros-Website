"use client";

import { useId, useState } from "react";
import { MinusIcon, PlusIcon } from "./icons";

type Props = {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
};

export default function Accordion({ title, children, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();

  return (
    <div className="border-b border-rule">
      <h3>
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
      </h3>
      <div id={panelId} hidden={!open} className="pb-6">
        {children}
      </div>
    </div>
  );
}
