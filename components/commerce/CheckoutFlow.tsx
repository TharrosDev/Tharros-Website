"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { useCart } from "./CartProvider";
import OrderSummary from "./OrderSummary";
import EmptyState from "@/components/ui/EmptyState";
import Accordion from "@/components/ui/Accordion";
import { createPersistentStore } from "@/lib/persistent-store";
import { formatPrice } from "@/lib/format";
import { DEFAULT_SHIPPING_OPTION, SHIPPING_OPTIONS, shippingCost } from "@/lib/commerce/shipping";
import {
  COUNTRIES,
  DEFAULT_COUNTRY,
  getCountry,
  isValidPostal,
  regionName,
} from "@/lib/commerce/regions";
import { CONTACT_EMAIL } from "@/lib/site";

type StepId = "contact" | "address" | "delivery" | "payment";

const STEPS: { id: StepId; index: string; name: string }[] = [
  { id: "contact", index: "01", name: "Contact" },
  { id: "address", index: "02", name: "Shipping" },
  { id: "delivery", index: "03", name: "Delivery" },
  { id: "payment", index: "04", name: "Payment" },
];

type Form = {
  email: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  city: string;
  region: string;
  postal: string;
  country: string;
};

const EMPTY: Form = {
  email: "",
  firstName: "",
  lastName: "",
  address1: "",
  address2: "",
  city: "",
  region: "",
  postal: "",
  country: DEFAULT_COUNTRY.code,
};

const ADDRESS_FIELDS: (keyof Form)[] = [
  "firstName",
  "lastName",
  "address1",
  "city",
  "region",
  "postal",
  "country",
];

const LABELS: Record<keyof Form, string> = {
  email: "Email",
  firstName: "First name",
  lastName: "Last name",
  address1: "Address",
  address2: "Apartment, suite",
  city: "City",
  region: "Province / State",
  postal: "Postal code",
  country: "Country",
};

/** Reads after "Enter your …". `region` is country-specific and set inline. */
const MISSING: Record<keyof Form, string> = {
  email: "email address",
  firstName: "first name",
  lastName: "last name",
  address1: "street address",
  address2: "apartment or suite",
  city: "city",
  region: "province or state",
  postal: "postal code",
  country: "country",
};

/**
 * An address is eight fields. Losing it to a refresh, a back-navigation or a
 * stray tab close is the single most expensive thing this form could do, and it
 * did exactly that — every value lived in component state only.
 *
 * Same store the bag and the wishlist already use. It stays on the customer's
 * own device and never leaves it, because there is nowhere for it to go: no
 * payment provider is connected.
 */
const formStore = createPersistentStore<Form>("tharros:checkout:v1", EMPTY, (raw) => {
  if (typeof raw !== "object" || raw === null) return null;
  const value = raw as Partial<Record<keyof Form, unknown>>;
  const next = { ...EMPTY };
  for (const key of Object.keys(EMPTY) as (keyof Form)[]) {
    if (typeof value[key] === "string") next[key] = value[key];
  }
  return next;
});

/**
 * Where in the flow the customer had got to, and what they had chosen.
 *
 * All nine address fields survived a refresh and none of the progress did:
 * `step`, `shippingOption` and `furthest` were plain component state. Refreshing
 * on Payment dropped you back on Contact with every field still filled and the
 * step rail collapsed to a single reachable entry — the persistence was ninety
 * per cent right, and the missing ten per cent is what made it read as broken.
 */
type Progress = { step: StepId; shippingOption: string; furthest: number };

const EMPTY_PROGRESS: Progress = {
  step: "contact",
  shippingOption: DEFAULT_SHIPPING_OPTION.id,
  furthest: 0,
};

const progressStore = createPersistentStore<Progress>(
  "tharros:checkout:progress:v1",
  EMPTY_PROGRESS,
  (raw) => {
    if (typeof raw !== "object" || raw === null) return null;
    const value = raw as Partial<Record<keyof Progress, unknown>>;
    // Anything unrecognised falls back rather than throwing — a stored step id
    // or shipping option can outlive the constant that named it.
    const step = STEPS.some((entry) => entry.id === value.step)
      ? (value.step as StepId)
      : EMPTY_PROGRESS.step;
    const shippingOption = SHIPPING_OPTIONS.some(
      (option) => option.id === value.shippingOption,
    )
      ? (value.shippingOption as string)
      : EMPTY_PROGRESS.shippingOption;
    const furthest =
      typeof value.furthest === "number" && Number.isFinite(value.furthest)
        ? Math.min(Math.max(0, Math.trunc(value.furthest)), STEPS.length - 1)
        : EMPTY_PROGRESS.furthest;
    return { step, shippingOption, furthest };
  },
);

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
  inputMode,
  enterKeyHint,
  required = false,
  error,
  className = "",
}: {
  id: keyof Form;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
  inputMode?: "text" | "email" | "numeric" | "tel";
  enterKeyHint?: "next" | "done" | "go";
  required?: boolean;
  error?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="field-label">
        {label}
        {required ? null : (
          <span className="ml-2 text-ink-faint">Optional</span>
        )}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        required={required}
        autoComplete={autoComplete}
        inputMode={inputMode}
        enterKeyHint={enterKeyHint}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(event) => onChange(event.target.value)}
        className="field field-boxed"
      />
      {error ? (
        // Announced. The errors used to render into a plain span with no live
        // region and no focus move, so a screen-reader user pressed Continue
        // and nothing at all happened as far as they could tell.
        <span id={`${id}-error`} role="alert" className="field-error">
          {error}
        </span>
      ) : null}
    </div>
  );
}

export default function CheckoutFlow() {
  const { lines, subtotal, ready } = useCart();
  const form = useSyncExternalStore(
    formStore.subscribe,
    formStore.get,
    formStore.getServer,
  );
  const { step, shippingOption, furthest } = useSyncExternalStore(
    progressStore.subscribe,
    progressStore.get,
    progressStore.getServer,
  );
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const panelRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const country = getCountry(form.country);

  const set = (key: keyof Form) => (value: string) => {
    formStore.set((current) => {
      const next = { ...current, [key]: value };
      // A subdivision code only means something inside its own country, and
      // "ON" is a province in one list and nothing at all in the other. Changing
      // the country clears it rather than carrying a code that no longer exists.
      if (key === "country" && value !== current.country) next.region = "";
      return next;
    });
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const setShippingOption = (id: string) => {
    progressStore.set((current) => ({ ...current, shippingOption: id }));
  };

  const validate = (fields: (keyof Form)[]): boolean => {
    const next: Partial<Record<keyof Form, string>> = {};

    // "Required." on eight identical fields tells someone which field but never
    // what would satisfy it. Each message names the thing that is missing.
    for (const field of fields) {
      if (!form[field].trim()) {
        next[field] =
          field === "region"
            ? `Select your ${country.regionLabel.toLowerCase()}.`
            : `Enter your ${MISSING[field]}.`;
      }
    }
    if (fields.includes("email") && form.email.trim()) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) {
        next.email = "Enter a valid email address.";
      }
    }
    if (fields.includes("postal") && !isValidPostal(form.country, form.postal)) {
      next.postal = country.postalHint;
    }

    setErrors(next);

    // Take them to the problem. Marking a field invalid and leaving the
    // viewport where it was is how a form loses someone on a phone.
    const first = fields.find((field) => next[field]);
    if (first) {
      const node = document.getElementById(first);
      if (node instanceof HTMLElement) {
        node.focus();
        node.scrollIntoView({ block: "center" });
      }
      return false;
    }
    return true;
  };

  /**
   * Move to a step, and put focus on its heading.
   *
   * Each step replaces the last, so the button that was just pressed is
   * unmounted and focus falls back to `<body>`. For anyone on a keyboard or a
   * screen reader that means the form silently restarts from the top of the
   * document on every step — the change is announced to nobody. Focusing the
   * new heading is what makes the flow followable without a mouse.
   */
  const goTo = (id: StepId) => {
    progressStore.set((current) => ({
      ...current,
      step: id,
      furthest: Math.max(
        current.furthest,
        STEPS.findIndex((entry) => entry.id === id),
      ),
    }));
    // Two scrolls used to race here. `html` carries `scroll-behavior: smooth`
    // globally, so this call animated; then the focus below scrolled again on
    // its own, landing mid-travel and jumping a second time. The move is
    // instant and the focus is told not to scroll at all.
    panelRef.current?.scrollIntoView({ block: "start", behavior: "instant" });
    // The heading belongs to the step being rendered, so it only exists after
    // this commit.
    requestAnimationFrame(() =>
      headingRef.current?.focus({ preventScroll: true }),
    );
  };

  if (!ready) {
    return (
      <p className="type-meta min-h-[50vh] text-ink-faint" role="status">
        Loading your bag
      </p>
    );
  }

  if (lines.length === 0) {
    return (
      <EmptyState
        className="pb-24"
        title="Your bag is empty."
        body="There is nothing to check out yet."
        action={{ href: "/shop", label: "Shop the drop" }}
      />
    );
  }

  const total = subtotal + shippingCost(subtotal, shippingOption);
  const currentIndex = STEPS.findIndex((entry) => entry.id === step);
  const deliveryName =
    SHIPPING_OPTIONS.find((option) => option.id === shippingOption)?.name ?? "";
  const countryName = country.name;

  /**
   * The escape hatch, pre-filled.
   *
   * It used to ask the customer to email "with the pieces and sizes you want" —
   * asking them to transcribe, by hand, the exact bag and address this component
   * is already holding. The subject and body are composed from `lines` and
   * `form`, so what arrives is confirmed rather than retyped, and the mail
   * client still shows every word before anything is sent.
   */
  const orderMail = (() => {
    const items = lines.map(
      (line) =>
        `- ${line.product.name} / size ${line.size} x${line.quantity} — ${formatPrice(line.lineTotal)}`,
    );
    const address = [
      `${form.firstName} ${form.lastName}`.trim(),
      form.address1,
      form.address2,
      [form.city, form.region, form.postal].filter(Boolean).join(", "),
      countryName,
    ].filter(Boolean);
    const body = [
      "I would like to order the following:",
      "",
      ...items,
      "",
      `Delivery: ${deliveryName}`,
      `Total: ${formatPrice(total)}`,
      "",
      "Ship to:",
      ...address,
      form.email ? `Email: ${form.email}` : null,
    ]
      .filter((row) => row !== null)
      .join("\n");
    return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      "Order enquiry",
    )}&body=${encodeURIComponent(body)}`;
  })();

  const summary = <OrderSummary shippingOptionId={shippingOption} />;

  return (
    <div className="grid gap-12 pb-24 lg:grid-cols-12 lg:gap-16">
      <div className="lg:col-span-7" ref={panelRef}>
        {/* The rail is navigable backwards. It was a flat list of `<li>`s, so
            the only way back to a typed-in address was the one Back button on
            the step you happened to be standing on. */}
        <ol className="flex flex-wrap gap-x-6 gap-y-2 border-b border-rule pb-4">
          {STEPS.map((entry, index) => {
            const reachable = index <= furthest;
            const tone =
              index === currentIndex
                ? "text-ink"
                : index < currentIndex
                  ? "text-ink-muted"
                  : "text-ink-faint";
            return (
              <li
                key={entry.id}
                className={`type-meta ${tone}`}
                aria-current={index === currentIndex ? "step" : undefined}
              >
                {reachable && index !== currentIndex ? (
                  <button
                    type="button"
                    onClick={() => goTo(entry.id)}
                    className="-my-2 py-2 transition-opacity hover:opacity-60"
                  >
                    <span className="num">{entry.index}</span> {entry.name}
                  </button>
                ) : (
                  <span className="-my-2 inline-block py-2">
                    <span className="num">{entry.index}</span> {entry.name}
                  </span>
                )}
              </li>
            );
          })}
        </ol>

        {/* The summary on a phone used to stack below all four steps, so an
            eight-field address was filled in with no sight of what was being
            bought. */}
        <div className="mt-8 border-y border-rule lg:hidden">
          <Accordion title={`Order summary — ${formatPrice(total)}`} level={2}>
            {summary}
          </Accordion>
        </div>

        {/* Real forms. Every Continue was `type="button"`, so pressing Enter in
            the email field did nothing at all. */}
        {step === "contact" ? (
          <form
            className="pt-10"
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              if (validate(["email"])) goTo("address");
            }}
          >
            <h2
              ref={headingRef}
              tabIndex={-1}
              className="type-display-4 outline-none"
            >
              Contact
            </h2>
            <p className="type-body-sm mt-3 text-ink-muted">
              Order confirmation and shipping updates go here.
            </p>
            <div className="mt-8">
              <Field
                id="email"
                label={LABELS.email}
                type="email"
                required
                inputMode="email"
                enterKeyHint="next"
                autoComplete="email"
                value={form.email}
                onChange={set("email")}
                error={errors.email}
              />
            </div>
            <button type="submit" className="btn btn-solid mt-8">
              Continue to shipping
            </button>
          </form>
        ) : null}

        {step === "address" ? (
          <form
            className="pt-10"
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              if (validate(ADDRESS_FIELDS)) goTo("delivery");
            }}
          >
            <h2
              ref={headingRef}
              tabIndex={-1}
              className="type-display-4 outline-none"
            >
              Shipping address
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <Field
                id="firstName"
                label={LABELS.firstName}
                required
                enterKeyHint="next"
                autoComplete="given-name"
                value={form.firstName}
                onChange={set("firstName")}
                error={errors.firstName}
              />
              <Field
                id="lastName"
                label={LABELS.lastName}
                required
                enterKeyHint="next"
                autoComplete="family-name"
                value={form.lastName}
                onChange={set("lastName")}
                error={errors.lastName}
              />
              <Field
                id="address1"
                label={LABELS.address1}
                required
                enterKeyHint="next"
                autoComplete="address-line1"
                value={form.address1}
                onChange={set("address1")}
                error={errors.address1}
                className="sm:col-span-2"
              />
              <Field
                id="address2"
                label={LABELS.address2}
                enterKeyHint="next"
                autoComplete="address-line2"
                value={form.address2}
                onChange={set("address2")}
                className="sm:col-span-2"
              />
              <Field
                id="city"
                label={LABELS.city}
                required
                enterKeyHint="next"
                autoComplete="address-level2"
                value={form.city}
                onChange={set("city")}
                error={errors.city}
              />
              {/* A closed list rather than a text box. Free text accepted "zz"
                  as a province, and nothing downstream would ever have caught
                  it — there is no downstream. A select cannot be wrong. */}
              <div>
                <label htmlFor="region" className="field-label">
                  {country.regionLabel}
                </label>
                <select
                  id="region"
                  name="region"
                  required
                  autoComplete="address-level1"
                  value={form.region}
                  onChange={(event) => set("region")(event.target.value)}
                  aria-invalid={errors.region ? true : undefined}
                  aria-describedby={errors.region ? "region-error" : undefined}
                  className="field field-boxed"
                >
                  <option value="">Select a {country.regionLabel.toLowerCase()}</option>
                  {country.regions.map((entry) => (
                    <option key={entry.code} value={entry.code}>
                      {entry.name}
                    </option>
                  ))}
                </select>
                {errors.region ? (
                  <span id="region-error" role="alert" className="field-error">
                    {errors.region}
                  </span>
                ) : null}
              </div>
              <Field
                id="postal"
                label={country.postalLabel}
                required
                enterKeyHint="next"
                autoComplete="postal-code"
                value={form.postal}
                onChange={set("postal")}
                error={errors.postal}
              />
              <div>
                <label htmlFor="country" className="field-label">
                  {LABELS.country}
                </label>
                <select
                  id="country"
                  name="country"
                  required
                  autoComplete="country"
                  value={form.country}
                  onChange={(event) => set("country")(event.target.value)}
                  className="field field-boxed"
                >
                  {COUNTRIES.map((entry) => (
                    <option key={entry.code} value={entry.code}>
                      {entry.name}
                    </option>
                  ))}
                </select>
                {/* The list is two entries long and the reason is a shipping
                    one. Someone outside it used to discover the limit by
                    opening a select and finding their country missing. */}
                <p className="type-meta mt-2 text-ink-faint">
                  THARROS ships to Canada and the United States.
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <button type="submit" className="btn btn-solid">
                Continue to delivery
              </button>
              <button
                type="button"
                onClick={() => goTo("contact")}
                className="btn btn-outline"
              >
                Back
              </button>
            </div>
          </form>
        ) : null}

        {step === "delivery" ? (
          <form
            className="pt-10"
            onSubmit={(event) => {
              event.preventDefault();
              goTo("payment");
            }}
          >
            <h2
              ref={headingRef}
              tabIndex={-1}
              className="type-display-4 outline-none"
            >
              Delivery
            </h2>
            <fieldset className="mt-8">
              <legend className="visually-hidden">Delivery method</legend>
              <div className="space-y-3">
                {SHIPPING_OPTIONS.map((option) => {
                  const cost = shippingCost(subtotal, option.id);
                  return (
                    <label
                      key={option.id}
                      className={`flex cursor-pointer items-center justify-between gap-4 border p-5 transition-colors ${
                        shippingOption === option.id ? "border-ink" : "border-rule-strong"
                      }`}
                    >
                      <span className="flex items-center gap-4">
                        <input
                          type="radio"
                          name="shipping"
                          value={option.id}
                          checked={shippingOption === option.id}
                          onChange={() => setShippingOption(option.id)}
                          // 16px was under the 24px floor the rest of the site
                          // holds itself to.
                          className="h-6 w-6 shrink-0 accent-black"
                        />
                        <span>
                          <span className="type-body-sm block font-medium">{option.name}</span>
                          <span className="type-meta mt-1 block text-ink-faint">
                            {option.detail}
                          </span>
                        </span>
                      </span>
                      <span className="num type-mono-3">
                        {cost === 0 ? "Free" : formatPrice(cost)}
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <div className="mt-8 flex flex-wrap gap-4">
              <button type="submit" className="btn btn-solid">
                Continue to payment
              </button>
              <button
                type="button"
                onClick={() => goTo("address")}
                className="btn btn-outline"
              >
                Back
              </button>
            </div>
          </form>
        ) : null}

        {step === "payment" ? (
          <section className="pt-10">
            <h2
              ref={headingRef}
              tabIndex={-1}
              className="type-display-4 outline-none"
            >
              Payment
            </h2>

            {/* The review. Nothing on this step used to show the email, the
                address or the delivery method that had been entered, so the
                last screen before the final action was the one screen where
                none of your own answers were visible. */}
            <dl className="mt-8 divide-y divide-rule border-y border-rule">
              <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1 py-4">
                <dt className="type-meta w-24 shrink-0 text-ink-faint">Email</dt>
                <dd className="type-body-sm min-w-0 flex-1 break-words">{form.email}</dd>
                <button
                  type="button"
                  onClick={() => goTo("contact")}
                  className="link-rule link-rule-reveal shrink-0"
                >
                  Edit
                </button>
              </div>
              <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1 py-4">
                <dt className="type-meta w-24 shrink-0 text-ink-faint">Ship to</dt>
                <dd className="type-body-sm min-w-0 flex-1">
                  {form.firstName} {form.lastName}
                  <br />
                  {form.address1}
                  {form.address2 ? `, ${form.address2}` : ""}
                  <br />
                  {form.city}, {regionName(form.country, form.region)} {form.postal}
                  <br />
                  {countryName}
                </dd>
                <button
                  type="button"
                  onClick={() => goTo("address")}
                  className="link-rule link-rule-reveal shrink-0"
                >
                  Edit
                </button>
              </div>
              <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1 py-4">
                <dt className="type-meta w-24 shrink-0 text-ink-faint">Delivery</dt>
                <dd className="type-body-sm min-w-0 flex-1">{deliveryName}</dd>
                <button
                  type="button"
                  onClick={() => goTo("delivery")}
                  className="link-rule link-rule-reveal shrink-0"
                >
                  Edit
                </button>
              </div>
            </dl>

            {/* No payment provider is connected. Rather than mock a card form
                that appears to work, the step says what is actually true. */}
            <div className="mt-10 border border-ink p-8">
              <p className="type-meta">Payment provider not connected</p>
              <p className="type-body mt-4 text-ink-muted">
                This storefront is not yet wired to a payment processor, so no card can be
                taken and no order can be placed. Everything up to this point — your bag,
                address and delivery method — is real and working.
              </p>
              <p className="type-body mt-4 text-ink-muted">
                To finish an order today, send it to {CONTACT_EMAIL}. The email opens
                with your bag, delivery method and address already in it — nothing
                sends until you press send.
              </p>

              <dl className="mt-8 border-t border-rule pt-5">
                <div className="flex justify-between">
                  <dt className="type-meta">Amount due</dt>
                  <dd className="num type-mono-3">{formatPrice(total)}</dd>
                </div>
              </dl>

              <a href={orderMail} className="btn btn-solid btn-full mt-8">
                Email this order
              </a>

              {/* The disabled control used to read "Pay $284.00" — an exact,
                  precise, entirely unpayable amount, which is the cruellest
                  available label for a dead button. It names its own state
                  instead, and the working action above it is the one that is
                  styled as the primary. */}
              <button
                type="button"
                disabled
                aria-disabled="true"
                aria-describedby="pay-disabled"
                className="btn btn-outline btn-full mt-4"
              >
                Card payment unavailable
              </button>
              <p id="pay-disabled" className="type-meta mt-3 text-ink-faint">
                Disabled until a payment provider is connected.
              </p>
            </div>

            <button
              type="button"
              onClick={() => goTo("delivery")}
              className="btn btn-outline mt-8"
            >
              Back
            </button>
          </section>
        ) : null}
      </div>

      <div className="no-scrollbar hidden lg:col-span-4 lg:col-start-9 lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:block lg:max-h-[calc(100svh-var(--header-h)-3rem)] lg:self-start lg:overflow-y-auto lg:overscroll-contain">
        {summary}
      </div>
    </div>
  );
}
