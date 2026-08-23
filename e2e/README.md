# End-to-end

```
npm run e2e          # all three projects
npm run e2e:ui       # pick and watch individual tests
npx playwright test --project=chromium
```

The suite **builds the site and serves it itself** on port 3100 — see
`webServer` in `playwright.config.ts`. There is nothing to start first.

One thing will waste your afternoon if you do not know it: a server already
listening on 3100 is reused rather than replaced (`reuseExistingServer`). If you
run `npm run build` while that server is up, it keeps serving the old chunk
manifest, every asset 404s, and **every test in the suite fails at once**. A
wall of unrelated failures means the server is stale, not that the site is
broken. Kill it and run again.

## What these tests are for

Breakage, not appearance. Nothing here asserts a colour, a spacing value or a
screenshot — the site's look is the owner's and it changes often, and a suite
that fails when a margin moves is a suite people start ignoring. What they
assert is that the site still *works*:

| File | What it protects |
|---|---|
| `routes.spec.ts` | Every route loads directly, renders a heading, logs nothing, fetches nothing that 404s, and does not scroll sideways |
| `commerce.spec.ts` | Size → add → drawer → persistence → undo → checkout validation. The only flow whose failure costs anybody money |
| `navigation.spec.ts` | The overlays: scroll lock taken and released, focus not stranded, no two dialogs live at once, reduced motion |

## Three engines, and WebKit is the point

The site leans on sticky positioning, clip-path, masks, backdrop-filter and
`svh` — the set Safari implements differently. The `mobile` project is Chromium
at a phone viewport with a coarse pointer, which is what puts the site on its
touch branches: no custom cursor, no magnetics, halved parallax, no pins.

Two assertions are deliberately engine-aware, and both are Safari's behaviour
rather than the site's:

- **Safari does not focus a button when you click it**, so an overlay opened by
  mouse has no opener for the focus trap to restore to. The cross-engine
  assertion is the one that matters — focus is never left inside a dialog that
  has been hidden.
- **Safari only tabs to links when Full Keyboard Access is on**, so the skip
  link's Tab-reachability is asserted elsewhere. What it *does* when activated
  is asserted everywhere, because that part is ours.

## Two environment workarounds

Both exist because a local production build is served over http and the real
site is not. Neither weakens what production ships.

- `CSP_ALLOW_INSECURE=1` is set on the test server. Without it the CSP's
  `upgrade-insecure-requests` rewrites every asset request to https, nothing is
  listening, and WebKit renders an unstyled, unscripted page. Chromium exempts
  loopback and hides it. A deploy never sets the variable.
- `/_vercel/insights/script.js` is ignored in `fixtures.ts`. The platform serves
  it and `next start` does not, so a local run 404s it. Every other failed
  request still fails the run.

## Adding a test

Import `test` and `expect` from `./fixtures`, not from `@playwright/test`. The
fixture marks the session as already entered, which stops the opening title
sequence holding a full-screen plane over `/` for 1.5s on every run, and it
gives you `console` — the collected errors and failed requests for that page.
