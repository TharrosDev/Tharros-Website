"use client";

import Link from "next/link";
import { useEffect } from "react";

/**
 * Route-level error boundary. Without this, an unexpected render error shows
 * Next's default page — which is neither branded nor useful to a customer.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="on-dark flex min-h-[100svh] flex-col justify-end">
      <div className="page-frame pb-16">
        <p className="type-meta text-ink-on-dark-muted">Something broke</p>
        <h1 className="type-display-2 mt-6">That didn&apos;t work.</h1>
        <p className="type-body mt-6 max-w-md text-ink-on-dark-muted">
          The page failed to load. Nothing in your bag has been lost.
        </p>
        {error.digest ? (
          <p className="type-meta num mt-4 text-ink-on-dark-faint">
            Reference {error.digest}
          </p>
        ) : null}
        <div className="mt-10 flex flex-wrap gap-4">
          <button type="button" onClick={reset} className="btn btn-inverse">
            Try again
          </button>
          <Link href="/" className="btn btn-outline-on-dark">
            Return home
          </Link>
        </div>
      </div>
    </section>
  );
}
