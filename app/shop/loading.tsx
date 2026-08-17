/**
 * `/shop` renders per request because filters live in the URL, so it needs a
 * loading state. Frames match the real grid's ratio, columns and rhythm, so
 * nothing shifts when the products arrive.
 *
 * It previously promised that and did not deliver it: the skeleton was two
 * columns where the grid is one below `sm`, its eyebrow read "Catalogue" where
 * the page says "Everything made so far", and it omitted the campaign feature
 * entirely, so a whole block appeared out of nowhere on the default view.
 */
function Bar({ className }: { className: string }) {
  return <div className={`bg-surface-frame ${className}`} />;
}

export default function ShopLoading() {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="visually-hidden">Loading products</span>

      <div className="page-frame page-top pb-14">
        <Bar className="mb-8 h-3 w-40" />
        <div className="border-t border-ink pt-4">
          <p className="eyebrow">
            <span className="num">01</span>
            <span>Everything made so far</span>
          </p>
        </div>
        <Bar className="mt-8 h-[clamp(2.125rem,6.4vw,6rem)] w-[min(20ch,90%)]" />
      </div>

      {/* The campaign feature that leads the unfiltered view. */}
      <div className="page-frame rhythm-tight">
        <div className="grid gap-x-12 gap-y-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Bar className="ratio-editorial w-full md:ratio-campaign" />
          </div>
          <div className="space-y-4 lg:col-span-4 lg:col-start-9">
            <Bar className="h-3 w-24" />
            <Bar className="h-8 w-full" />
            <Bar className="h-8 w-4/5" />
            <Bar className="h-3 w-32" />
          </div>
        </div>
      </div>

      <div className="border-y border-rule">
        <div className="page-frame flex items-center justify-between gap-6 py-4">
          <div className="flex gap-6">
            <Bar className="h-3 w-16" />
            <Bar className="h-3 w-20" />
            <Bar className="hidden h-3 w-16 sm:block" />
            <Bar className="hidden h-3 w-24 md:block" />
          </div>
          <Bar className="h-3 w-20" />
        </div>
      </div>

      <div className="page-frame rhythm-tight">
        <ul className="grid grid-cols-1 gap-x-4 gap-y-12 sm:grid-cols-2 md:gap-x-6 md:gap-y-16 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <li key={index}>
              <Bar className="ratio-portrait w-full" />
              <div className="mt-4 flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <Bar className="h-4 w-32" />
                  <Bar className="h-3 w-20" />
                </div>
                <Bar className="h-4 w-12" />
              </div>
              {/* The specimen row the real card prints under the frame. */}
              <div className="mt-4 flex gap-6 border-t border-rule pt-3">
                <Bar className="h-2.5 w-14" />
                <Bar className="h-2.5 w-10" />
                <Bar className="h-2.5 w-10" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
