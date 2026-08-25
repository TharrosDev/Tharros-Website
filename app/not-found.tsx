import type { Metadata } from "next";
import Link from "next/link";
import Parallax from "@/components/motion/Parallax";
import SplitLines from "@/components/motion/SplitLines";
import Magnetic from "@/components/motion/Magnetic";

export const metadata: Metadata = {
  title: "Page not found",
  description: "That page does not exist. Return to THARROS.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="on-dark flex min-h-[100svh] flex-col justify-end">
      <div className="page-frame pb-16">
        {/* The one page on the site that can be pure spectacle at no cost:
            it is full-screen, on dark, and nobody is trying to buy anything
            on it. The numeral drifts against the type below it. */}
        <Parallax depth="foreground" as="p" className="type-colossal">
          404
        </Parallax>
        <SplitLines
          as="h1"
          text="You wandered off."
          className="type-display-2 mt-6"
        />
        {/* The line under the headline used to be "Let's get you back." — the
            headline already said that. This one says something the headline
            does not. */}
        <p className="type-body mt-6 max-w-md text-ink-on-dark-muted">
          Nothing lives at this address. The line is small enough that the whole
          catalogue fits on one page.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Magnetic>
            <Link href="/" className="btn btn-inverse">
              Return home
            </Link>
          </Magnetic>
          {/* THARROS releases drops, not collections. */}
          <Magnetic>
            <Link href="/shop" className="btn btn-outline-on-dark">
              Shop the drop
            </Link>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
