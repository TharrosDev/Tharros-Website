"use client";

import { useState } from "react";
import { CONTACT_EMAIL } from "@/lib/site";
import { NEWSLETTER_CONNECTED } from "@/lib/commerce/state";

type State = "idle" | "invalid" | "not-connected";

/**
 * The field validates for real, but no mailing list is connected — so the form
 * says exactly that instead of showing a success message nobody earned. Wire a
 * provider, replace the `not-connected` branch, and the markup stays as-is.
 */
/**
 * NOTHING IS FAKED, AND NOTHING DEAD IS SHOWN.
 *
 * There is no email provider and no endpoint, so the form used to validate an
 * address, accept it, and then tell the visitor that the list was not open and
 * nothing had been sent — a control whose only possible outcome is a failure
 * message. Faking a success is not the alternative; removing the dead control
 * is. Until a provider is connected the signup is a real mailto, which works
 * today and reaches a real inbox.
 *
 * Flip `NEWSLETTER_CONNECTED` and the form below comes back. It still needs a
 * `POST` target wiring into `submit` — see the report in the repository notes.
 */
export default function Newsletter({ onDark = false }: { onDark?: boolean }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
    setState(valid ? "not-connected" : "invalid");
  };

  if (!NEWSLETTER_CONNECTED) {
    return (
      <div className="w-full max-w-lg">
        <a
          href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Drop list")}`}
          className={`btn ${onDark ? "btn-inverse" : "btn-solid"}`}
        >
          Email to join
        </a>
        <p
          className={`type-meta mt-4 ${onDark ? "text-ink-on-dark-faint" : "text-ink-faint"}`}
        >
          {CONTACT_EMAIL}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="w-full max-w-lg">
      <div className="flex items-end gap-4">
        <div className="flex-1">
          <label htmlFor="newsletter-email" className="field-label">
            Your email
          </label>
          <input
            id="newsletter-email"
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (state !== "idle") setState("idle");
            }}
            placeholder="name@email.com"
            // The status line was announced but the field itself never reported
            // as invalid, so a screen reader read the error and then described
            // the input beside it as a normal empty box.
            aria-invalid={state === "invalid" || undefined}
            aria-describedby="newsletter-status"
            className={`field ${onDark ? "field-on-dark" : ""}`}
          />
        </div>
        <button type="submit" className={`btn ${onDark ? "btn-inverse" : "btn-solid"} shrink-0`}>
          Join
        </button>
      </div>

      <p
        id="newsletter-status"
        role="status"
        // Reserves its line while empty. Without a min-height the footer jumped
        // by the height of a sentence the first time anyone pressed Join —
        // BuyPanel's error already holds its space for exactly this reason.
        className={`type-meta mt-4 block min-h-5 ${onDark ? "text-ink-on-dark-muted" : "text-ink-muted"}`}
      >
        {state === "invalid" ? "Enter a valid email address." : null}
        {state === "not-connected" ? "Nothing was sent." : null}
      </p>
    </form>
  );
}
