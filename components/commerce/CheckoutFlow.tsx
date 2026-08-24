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

/**
 * Two steps, because there are two things to collect.
 *
 * It was four — contact, shipping, delivery, payment — which is the shape of a
 * checkout that takes a card. This one cannot: the last step was a review and a
 * disabled button, and the three before it walked a customer through a
 * card-shaped flow to reach an email. Contact is one field and a name; delivery
 * is a choice of two; neither earns a screen of its own, and a shorter walk to
 * the same email is a smaller thing to abandon.
 *
 * A stored step id from the old four survives it: the progress store falls back
 * to the first step rather than throwing, and clamps `furthest` to the steps
 * that exist.
 */
type StepId = "details" | "delivery";

const STEPS: { id: StepId; index: string; name: string }[] = [
  { id: "details", index: "01", name: "Your details" },
  { id: "delivery", index: "02", name: "Delivery" },
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

/** Step 01: who this is going to and where the reply goes. */
const DETAIL_FIELDS: (keyof Form)[] = ["firstName", "lastName", "email"];

/** Step 02: where it ships. The name moved up with the rest of the person. */
const ADDRESS_FIELDS: (keyof Form)[] = [
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
  step: "details",
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

export default function CheckoutFlow({
  notice,
}: {
  /**
   * The "no card can be taken yet" panel, passed in from the page rather than
   * rendered above this component.
   *
   * It has to be here because whether it belongs on screen depends on the bag,
   * and the bag is client state. Rendered unconditionally by the page it was
   * explaining the payment situation to someone whose bag is empty — four
   * lines about the checkout they cannot start, above the line telling them
   * why. It stays for the loading state, because with scripting unavailable
   * that is the only state there is and the page should still say the thing.
   */
  notice?: React.ReactNode;
}) {
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

  /**
   * Everything the composed email needs, checked before it is composed.
   *
   * The delivery step only ever validated the address, on the reasoning that
   * the details step had already checked itself on the way through. The step
   * rail breaks that: it walks backwards to a reachable step without
   * validating, so blanking the email on Details and clicking "02 Delivery" to
   * come back leaves the flow on a step whose checks pass. The one artefact
   * this checkout produces is an order enquiry, and that path composes one with
   * no name and no address to reply to — the single failure that makes the
   * whole flow worthless, and it is silent.
   *
   * A failing detail field is off screen here, so `validate`'s focus move
   * cannot land. The step it lives on is what gets shown instead; the errors it
   * set are already rendered when it arrives.
   */
  const validateOrder = (): boolean => {
    if (!validate(DETAIL_FIELDS)) {
      goTo("details");
      return false;
    }
    return validate(ADDRESS_FIELDS);
  };

  if (!ready) {
    return (
      <>
        {notice}
        <p className="type-meta min-h-[50svh] text-ink-faint" role="status">
          Loading your bag
        </p>
      </>
    );
  }

  if (lines.length === 0) {
    return (
      <EmptyState
        className="pb-24"
        title="Your bag is empty."
        body="There is nothing to check out yet."
        action={{ href: "/shop", label: "Shop the drop" }}
        secondary={{ href: "/drop", label: "What is coming" }}
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
      [form.city, regionName(form.country, form.region), form.postal]
        .filter(Boolean)
        .join(", "),
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
    <>
      {notice}
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
        {step === "details" ? (
          <form
            className="pt-10"
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              if (validate(DETAIL_FIELDS)) goTo("delivery");
            }}
          >
            <h2
              ref={headingRef}
              tabIndex={-1}
              className="type-display-4 outline-none"
            >
              Your details
            </h2>
            <p className="type-body-sm mt-3 text-ink-muted">
              Three fields. The reply about this order goes to the email
              address.
            </p>
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
                className="sm:col-span-2"
              />
            </div>
            <button type="submit" className="btn btn-solid mt-8">
              Continue to delivery
            </button>
          </form>
        ) : null}

        {step === "delivery" ? (
          <form
            className="pt-10"
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              validateOrder();
            }}
          >
            <h2
              ref={headingRef}
              tabIndex={-1}
              className="type-display-4 outline-none"
            >
              Where it goes
            </h2>
            <p className="type-meta mt-8 text-ink-faint">Shipping address</p>
            <div className="mt-5 grid gap-6 sm:grid-cols-2">
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

            {/* The legend was visually hidden, so two bordered boxes appeared
                under the address with nothing naming what they were a choice
                between. */}
            <fieldset className="mt-12">
              <legend className="type-meta text-ink-faint">Delivery method</legend>
              <div className="mt-5 space-y-3">
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

            {/* The review sits under the fields it reviews. It used to be a
                fourth step, which meant reading back an address on a screen
                that could not change it; here the same values are three
                keystrokes from where they are shown, so only the one entered on
                the step before carries an Edit. */}
            <dl className="mt-12 divide-y divide-rule border-y border-rule">
              <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1 py-4">
                <dt className="type-meta w-24 shrink-0 text-ink-faint">Order</dt>
                <dd className="type-body-sm min-w-0 flex-1">
                  <span className="num">{lines.length}</span>{" "}
                  {lines.length === 1 ? "piece" : "pieces"} ·{" "}
                  <span className="num">{formatPrice(total)}</span> including{" "}
                  {deliveryName.toLowerCase()}
                </dd>
              </div>
              <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1 py-4">
                <dt className="type-meta w-24 shrink-0 text-ink-faint">Reply to</dt>
                <dd className="type-body-sm min-w-0 flex-1 break-words">
                  {form.firstName} {form.lastName} · {form.email}
                </dd>
                <button
                  type="button"
                  onClick={() => goTo("details")}
                  className="link-rule link-rule-reveal shrink-0"
                >
                  Edit
                </button>
              </div>
            </dl>

            {/* No payment provider is connected. Rather than mock a card form
                that appears to work, the flow says what is actually true and
                then does the thing that does work. */}
            <div className="mt-10 border border-ink p-8">
              {/* The page opens on the full disclosure, so this states the
                  mechanics of the button under it and not the situation again:
                  two panels a scroll apart saying the same paragraph read as a
                  site apologising twice. */}
              <p className="type-meta">Placing this order</p>
              <p className="type-body mt-4 text-ink-muted">
                This opens a message to {CONTACT_EMAIL} with the pieces, sizes,
                delivery method, address and total already written into it.
                Nothing is sent until you send it, and nothing is charged.
              </p>

              <dl className="mt-8 border-t border-rule pt-5">
                <div className="flex justify-between">
                  <dt className="type-meta">Total</dt>
                  <dd className="num type-mono-3">{formatPrice(total)}</dd>
                </div>
              </dl>

              {/* Submitting the form validates the address; the mail link is
                  the action itself. Both are here because an address typed and
                  never checked would otherwise ride into the email unvalidated. */}
              <a
                href={orderMail}
                onClick={(event) => {
                  if (!validateOrder()) event.preventDefault();
                }}
                className="btn btn-solid btn-full mt-8"
              >
                Write this order
              </a>
            </div>

            <button
              type="button"
              onClick={() => goTo("details")}
              className="btn btn-outline mt-8"
            >
              Back
            </button>
          </form>
        ) : null}
      </div>

      {/* `no-scrollbar` is gone. The cap is right here — a bag summary beside a
          form genuinely wants to stay put, and it is short enough that most
          orders never reach the bound — but hiding the scrollbar on a region
          that can still overflow means a long bag loses lines with nothing on
          screen to say they exist. The platform's own scrollbar is the
          affordance; it only appears when there is something to scroll. */}
      <div className="hidden lg:col-span-4 lg:col-start-9 lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:block lg:max-h-[calc(100svh-var(--header-h)-3rem)] lg:self-start lg:overflow-y-auto lg:overscroll-contain">
        {summary}
      </div>
      </div>
    </>
  );
}
