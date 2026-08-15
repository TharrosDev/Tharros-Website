/**
 * `/shop` renders per request because filters live in the URL, so it needs a
 * loading state. Frames match the real grid's ratio and rhythm, so nothing
 * shifts when the products arrive.
 */
export default function ShopLoading() {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="visually-hidden">Loading products</span>

      <div
        className="page-frame"
        style={{ paddingTop: "calc(var(--header-h) + 3.5rem)", paddingBottom: "2.5rem" }}
      >
        <div className="border-t border-ink pt-4">
          <p className="eyebrow">
            <span className="num">01</span>
            <span>Catalogue</span>
          </p>
        </div>
        <div className="mt-8 h-[clamp(3.5rem,9vw,7rem)] w-[min(24ch,90%)] bg-surface-frame" />
      </div>

      <div className="border-y border-rule">
        <div className="page-frame py-3">
          <div className="h-4 w-56 bg-surface-frame" />
        </div>
      </div>

      <div className="page-frame rhythm-tight">
        <ul className="grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-6 md:gap-y-16 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <li key={index}>
              <div className="ratio-portrait w-full bg-surface-frame" />
              <div className="mt-4 flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-surface-frame" />
                  <div className="h-3 w-20 bg-surface-frame" />
                </div>
                <div className="h-4 w-12 bg-surface-frame" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
