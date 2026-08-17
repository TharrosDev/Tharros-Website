"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useCart } from "./CartProvider";
import OrderSummary from "./OrderSummary";
import { formatPrice } from "@/lib/format";
import {
  DEFAULT_SHIPPING_OPTION,
  SHIPPING_OPTIONS,
  shippingCost,
} from "@/lib/commerce/shipping";

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
  country: "Canada",
};

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
  error,
  className = "",
}: {
  id: keyof Form;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
  error?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(event) => onChange(event.target.value)}
        className="field field-boxed"
      />
      {error ? (
        <span id={`${id}-error`} className="field-error">
          {error}
        </span>
      ) : null}
    </div>
  );
}

export default function CheckoutFlow() {
  const { lines, subtotal, ready } = useCart();
  const [step, setStep] = useState<StepId>("contact");
  const [form, setForm] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [shippingOption, setShippingOption] = useState(
    DEFAULT_SHIPPING_OPTION.id,
  );
  const headingRef = useRef<HTMLHeadingElement>(null);

  /**
   * Move to a step and put focus on its heading.
   *
   * Each step replaces the last, so the button that was just pressed is
   * unmounted and focus falls back to `<body>`. For anyone on a keyboard or a
   * screen reader that means the form silently restarts from the top of the
   * document on every step — the change is announced to nobody. Focusing the new
   * heading is what makes the flow followable without a mouse.
   */
  const goTo = (next: StepId) => {
    setStep(next);
    // The heading belongs to the step being rendered, so it only exists after
    // this commit.
    requestAnimationFrame(() => headingRef.current?.focus());
  };

  const set = (key: keyof Form) => (value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const validate = (fields: (keyof Form)[]): boolean => {
    const next: Partial<Record<keyof Form, string>> = {};

    for (const field of fields) {
      if (!form[field].trim()) next[field] = "Required.";
    }
    if (fields.includes("email") && form.email.trim()) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) {
        next.email = "Enter a valid email address.";
      }
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  if (!ready) return <div className="min-h-[50vh]" aria-hidden="true" />;

  if (lines.length === 0) {
    return (
      <div className="border-t border-rule pt-16 pb-24">
        <p className="type-display-3 uppercase">Your bag is empty.</p>
        <p className="type-body mt-4 text-ink-muted">
          There is nothing to check out yet.
        </p>
        <Link href="/shop" className="btn btn-solid mt-10">
          Shop the collection
        </Link>
      </div>
    );
  }

  const total = subtotal + shippingCost(subtotal, shippingOption);
  const currentIndex = STEPS.findIndex((entry) => entry.id === step);

  return (
    <div className="grid gap-12 pb-24 lg:grid-cols-12 lg:gap-16">
      <div className="lg:col-span-7">
        <ol className="flex flex-wrap gap-x-6 gap-y-2 border-b border-rule pb-4">
          {STEPS.map((entry, index) => (
            <li
              key={entry.id}
              className={`type-meta ${
                index === currentIndex
                  ? "text-ink"
                  : index < currentIndex
                    ? "text-ink-muted"
                    : "text-ink-faint"
              }`}
              aria-current={index === currentIndex ? "step" : undefined}
            >
              <span className="num">{entry.index}</span> {entry.name}
            </li>
          ))}
        </ol>

        {step === "contact" ? (
          <section className="pt-10">
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
                label="Email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={set("email")}
                error={errors.email}
              />
            </div>
            <button
              type="button"
              onClick={() => validate(["email"]) && goTo("address")}
              className="btn btn-solid mt-8"
            >
              Continue to shipping
            </button>
          </section>
        ) : null}

        {step === "address" ? (
          <section className="pt-10">
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
                label="First name"
                autoComplete="given-name"
                value={form.firstName}
                onChange={set("firstName")}
                error={errors.firstName}
              />
              <Field
                id="lastName"
                label="Last name"
                autoComplete="family-name"
                value={form.lastName}
                onChange={set("lastName")}
                error={errors.lastName}
              />
              <Field
                id="address1"
                label="Address"
                autoComplete="address-line1"
                value={form.address1}
                onChange={set("address1")}
                error={errors.address1}
                className="sm:col-span-2"
              />
              <Field
                id="address2"
                label="Apartment, suite (optional)"
                autoComplete="address-line2"
                value={form.address2}
                onChange={set("address2")}
                className="sm:col-span-2"
              />
              <Field
                id="city"
                label="City"
                autoComplete="address-level2"
                value={form.city}
                onChange={set("city")}
                error={errors.city}
              />
              <Field
                id="region"
                label="Province / State"
                autoComplete="address-level1"
                value={form.region}
                onChange={set("region")}
                error={errors.region}
              />
              <Field
                id="postal"
                label="Postal code"
                autoComplete="postal-code"
                value={form.postal}
                onChange={set("postal")}
                error={errors.postal}
              />
              <Field
                id="country"
                label="Country"
                autoComplete="country-name"
                value={form.country}
                onChange={set("country")}
                error={errors.country}
              />
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() =>
                  validate([
                    "firstName",
                    "lastName",
                    "address1",
                    "city",
                    "region",
                    "postal",
                    "country",
                  ]) && goTo("delivery")
                }
                className="btn btn-solid"
              >
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
          </section>
        ) : null}

        {step === "delivery" ? (
          <section className="pt-10">
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
                        shippingOption === option.id
                          ? "border-ink"
                          : "border-rule-strong"
                      }`}
                    >
                      <span className="flex items-center gap-4">
                        <input
                          type="radio"
                          name="shipping"
                          value={option.id}
                          checked={shippingOption === option.id}
                          onChange={() => setShippingOption(option.id)}
                          className="h-4 w-4 accent-black"
                        />
                        <span>
                          <span className="type-body-sm block font-medium">
                            {option.name}
                          </span>
                          <span className="type-meta mt-1 block text-ink-faint">
                            {option.detail}
                          </span>
                        </span>
                      </span>
                      <span className="num text-[0.8125rem]">
                        {cost === 0 ? "Free" : formatPrice(cost)}
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => goTo("payment")}
                className="btn btn-solid"
              >
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
          </section>
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

            {/* No payment provider is connected. Rather than mock a card form
                that appears to work, the step says what is actually true. */}
            <div className="mt-8 border border-ink p-8">
              <p className="type-meta">Payment provider not connected</p>
              <p className="type-body mt-4 text-ink-muted">
                This storefront is not yet wired to a payment processor, so no
                card can be taken and no order can be placed. Everything up to
                this point — your bag, address and delivery method — is real and
                working.
              </p>
              <p className="type-body mt-4 text-ink-muted">
                To finish an order today, email{" "}
                <a href="mailto:hello@tharros.com" className="link-rule">
                  hello@tharros.com
                </a>{" "}
                with the pieces and sizes you want.
              </p>

              <dl className="mt-8 border-t border-rule pt-5">
                <div className="flex justify-between">
                  <dt className="type-meta">Amount due</dt>
                  <dd className="num font-medium">{formatPrice(total)}</dd>
                </div>
              </dl>

              <button
                type="button"
                disabled
                aria-disabled="true"
                className="btn btn-solid btn-full mt-8"
              >
                Pay {formatPrice(total)}
              </button>
              <p className="type-meta mt-3 text-ink-faint">
                Disabled until a provider is connected.
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

      <div className="no-scrollbar lg:col-span-4 lg:col-start-9 lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:max-h-[calc(100svh-var(--header-h)-3rem)] lg:self-start lg:overflow-y-auto lg:overscroll-contain">
        <OrderSummary shippingOptionId={shippingOption} />
      </div>
    </div>
  );
}
