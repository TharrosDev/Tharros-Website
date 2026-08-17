import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  description: "That page does not exist. Return to THARROS.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="on-dark flex min-h-[100svh] flex-col justify-end">
      <div className="page-frame pb-16">
        <p className="type-colossal">404</p>
        <h1 className="type-display-2 mt-6">You wandered off.</h1>
        {/* The line under the headline used to be "Let's get you back." — the
            headline already said that. This one says something the headline
            does not. */}
        <p className="type-body mt-6 max-w-md text-ink-on-dark-muted">
          Nothing lives at this address. The line is small enough that everything
          made so far fits on one page.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/" className="btn btn-inverse">
            Return home
          </Link>
          {/* THARROS releases drops, not collections. */}
          <Link href="/shop" className="btn btn-outline-on-dark">
            Shop the drop
          </Link>
        </div>
      </div>
    </section>
  );
}
