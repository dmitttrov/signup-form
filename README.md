# dimi-dim-uie-signup-form

A responsive marketing sign-up form built with **Angular 22** for the UIE code exercise. It
captures a first name, last name, and email address and submits them to a mock
`POST /api/signup` endpoint that responds with HTTP 200.

## Running it

Requires Node 22.22+, 24.15+, or 26 (see `.nvmrc`; Angular 22's supported range).

```bash
npm install
npm start          # serves http://localhost:4200
```

Fill in the form and submit — the request is visible in DevTools → Network as a real
`POST /api/signup` returning `200`, served by a [Mock Service Worker](https://mswjs.io/).

Other scripts:

```bash
npm test           # unit tests (Vitest)
npm run lint       # ESLint (angular-eslint flat config)
npm run build      # production build
```

## How it works

```
src/app/
  app.routes.ts            Top-level routes; the signup feature is lazy-loaded
  features/signup/
    signup.routes.ts       Feature routes (default export → one lazy chunk)
    signup-form.ts         Form component: Signal Forms model + validation schema
    data/
      signup.model.ts      SignupData — the single source of truth for what the form captures
      signup-store.ts      NgRx SignalStore owning the submission lifecycle
      signup-api.ts        HttpClient wrapper for POST /api/signup
  shared/ui/text-field/    Reusable labelled input with an accessible error slot
src/mocks/                 MSW handlers + worker (development only)
```

Routing: `/` redirects to `/signup`, unknown URLs fall back there, and the whole
signup feature (routes + components + store) is code-split into its own chunk via
`loadChildren` — the shell bundle contains only the router and the app config.

- **Signal Forms** (stable since Angular v22) define the form: `form()` over a
  `signal<SignupData>` with a schema of `required`/`email`/`maxLength` rules.
- **NgRx SignalStore** (`SignupStore`, provided at component level) owns the
  `idle → submitting → success | error` lifecycle. `rxMethod` + `exhaustMap` guards
  double-submits. Admittedly more machinery than one form strictly needs — it is here to
  show the pattern that scales as the form grows, and it keeps the component presentational.
- **MSW** provides the mock endpoint as a service worker, so the submission is a genuine
  network request returning 200 with zero extra processes. Production builds swap the
  mock bootstrap for a no-op via `fileReplacements`, so msw and the worker script are
  absent from the production output entirely (verifiable: `npm run build` emits only
  `main.js` + styles).

### UX / accessibility

- Validation errors appear only after a field has been touched — never on pristine load.
- `aria-invalid` and `aria-describedby` are set only while an error is visible; error
  slots are `aria-live="polite"` (a deliberate tradeoff: on an empty-form submit the
  three regions all announce — at this scale that beats a GOV.UK-style error summary).
- An invalid submit focuses the first invalid field (Signal Forms'
  `errorSummary()`/`focusBoundControl()`); reaching the success panel moves focus to the
  confirmation heading so keyboard and screen-reader users aren't dropped to `<body>`.
- Every input has a `<label for>` and an `autocomplete` token
  (`given-name` / `family-name` / `email`, per WCAG 2.2 "Identify Input Purpose").
- The submit button uses `aria-disabled` while a request is in flight instead of
  `disabled`, so it keeps keyboard focus (double-submits are ignored by the store's
  `exhaustMap`); failures show a retryable `role="alert"` banner. The button stays
  enabled while the form is invalid, so keyboard users always get feedback on activation.
- Colour palette checked against WCAG 2.2 AA (text ≥ 4.5:1, input borders ≥ 3:1).
- Mobile-first layout using fluid `clamp()` sizing and logical properties; no UI library.

### Extending with more questions

Adding a question is three additive edits: a field on `SignupData`, a rule in the schema
in `signup-form.ts`, and an `<app-text-field>` element in the template. A config-driven
dynamic form engine was deliberately left out as over-engineering at this scale — the
uniform `text-field` component is the extension point.

## Decisions & trade-offs

| Decision                               | Why                                                                                         | Trade-off accepted                                |
| -------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| Signal Forms over typed Reactive Forms | Stable since v22 and the API Angular now positions as current best practice                 | Smaller ecosystem/CVA interop than Reactive Forms |
| MSW over json-server/interceptor       | Real 200 in the Network tab, one process, reproducible from a clean clone                   | A committed worker script in `public/`            |
| SignalStore for one form               | Demonstrates the scalable state pattern the brief hints at ("more questions in the future") | Overkill for a single form in isolation           |
| No router, no UI library               | Single-view app; custom SCSS is lighter and shows the CSS                                   | Re-adding routing is a 5-minute change            |

Stock `ng new` defaults kept: zoneless change detection, OnPush default strategy, strict
TypeScript, Vitest. CI (GitHub Actions) runs lint, tests, and a production build.

## With more time

- E2E smoke test (Playwright) of the happy path against the MSW worker.
- Server-side field errors mapped onto the form (Signal Forms supports this via `submit()`).
- Visual polish: success animation, dark color scheme via `prefers-color-scheme`.
