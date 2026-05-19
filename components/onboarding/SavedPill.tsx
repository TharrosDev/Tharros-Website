"use client";

import { useEffect, useState } from "react";

interface Props { savedAt: number | null }

function timeAgo(ts: number): string {
  const seconds = Math.floor((Date.now() - ts) / 1000);
  if (seconds < 5)  return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const m = Math.floor(seconds / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  return `${h}h ago`;
}

export function SavedPill({ savedAt }: Props) {
  const [, force] = useState(0);
  useEffect(() => {
    const id = setInterval(() => force((n) => n + 1), 15_000);
    return () => clearInterval(id);
  }, []);

  if (!savedAt) return null;
  return (
    <div className="ob-saved-pill" role="status" aria-live="polite">
      <span className="dot" />
      Saved {timeAgo(savedAt)}
    </div>
  );
}
