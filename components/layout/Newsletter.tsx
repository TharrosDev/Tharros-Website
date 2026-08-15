"use client";

import { useState } from "react";

type State = "idle" | "invalid" | "not-connected";

/**
 * The field validates for real, but no mailing list is connected — so the form
 * says exactly that instead of showing a success message nobody earned. Wire a
 * provider, replace the `not-connected` branch, and the markup stays as-is.
 */
export default function Newsletter({ onDark = false }: { onDark?: boolean }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
    setState(valid ? "not-connected" : "invalid");
  };

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
        className={`type-meta mt-4 ${onDark ? "text-ink-on-dark-muted" : "text-ink-muted"}`}
      >
        {state === "invalid" ? "Enter a valid email address." : null}
        {state === "not-connected"
          ? "Signup is not connected yet — nothing was sent. Check back at the next drop."
          : null}
      </p>
    </form>
  );
}
