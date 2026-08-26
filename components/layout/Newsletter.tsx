"use client";

import { useState } from "react";
import { subscribe } from "@/lib/commerce/newsletter";

type State = "idle" | "invalid" | "sending" | "ok" | "duplicate" | "error";

const MESSAGE: Partial<Record<State, string>> = {
  invalid: "Enter a valid email address.",
  ok: "You are on the list.",
  duplicate: "That address is already on the list.",
  error: "That did not go through. Try again in a moment.",
};

/**
 * THE SIGNUP, AS THE FINISHED CONTROL.
 *
 * Every state a real mailing list produces is here — validating, sending,
 * accepted, already subscribed, failed — and the provider lives behind
 * `subscribe()` in `lib/commerce/newsletter.ts`. Wiring one is a change to that
 * function; nothing in this file moves.
 *
 * `handoff` is the outcome while no list exists: the address is not stored, so
 * no success is claimed and the submission opens a message to the label
 * instead. Nothing is faked and nothing is narrated at the customer.
 */
export default function Newsletter({ onDark = false }: { onDark?: boolean }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const address = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(address)) {
      setState("invalid");
      return;
    }

    setState("sending");
    try {
      const result = await subscribe(address);
      if (result.status === "handoff") {
        setState("idle");
        window.location.assign(result.url);
        return;
      }
      setState(result.status);
      if (result.status === "ok") setEmail("");
    } catch {
      setState("error");
    }
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
            // The status line was announced but the field itself never reported
            // as invalid, so a screen reader read the error and then described
            // the input beside it as a normal empty box.
            aria-invalid={state === "invalid" || undefined}
            aria-describedby="newsletter-status"
            className={`field ${onDark ? "field-on-dark" : ""}`}
          />
        </div>
        <button
          type="submit"
          disabled={state === "sending"}
          className={`btn ${onDark ? "btn-inverse" : "btn-solid"} shrink-0`}
        >
          {state === "sending" ? "Joining" : "Join"}
        </button>
      </div>

      <p
        id="newsletter-status"
        role="status"
        // Reserves its line while empty. Without a min-height the footer jumped
        // by the height of a sentence the first time anyone pressed Join.
        className={`type-meta mt-4 block min-h-5 ${onDark ? "text-ink-on-dark-muted" : "text-ink-muted"}`}
      >
        {MESSAGE[state]}
      </p>
    </form>
  );
}
