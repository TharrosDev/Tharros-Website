import Link from "next/link";

export default function NotFound() {
  return (
    <section className="on-dark flex min-h-[100svh] flex-col justify-end">
      <div className="page-frame pb-16">
        <p className="type-colossal">404</p>
        <h1 className="type-display-2 mt-6">You wandered off.</h1>
        <p className="type-body mt-6 max-w-md text-ink-on-dark-muted">
          Let&apos;s get you back.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/" className="btn btn-inverse">
            Return home
          </Link>
          <Link href="/shop" className="btn btn-outline-on-dark">
            Shop the collection
          </Link>
        </div>
      </div>
    </section>
  );
}
