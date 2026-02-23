# Folk Mart Playwright Testing

Playwright test project for Folk Mart with strict QA standards:
- POM + Flow layer only
- clean spec files (no business constants in test body)
- tag-driven execution
- critical-first coverage
- reproducible reports (HTML + Allure)

## Table of Contents
- [Latest Status Snapshot (February 23, 2026)](#latest-status-snapshot-february-23-2026)
- [Coverage Inventory](#coverage-inventory)
- [Project Structure](#project-structure)
- [QA Tag Taxonomy (Required)](#qa-tag-taxonomy-required)
- [Browser and Device Matrix](#browser-and-device-matrix)
- [Install](#install)
- [Environment Profiles](#environment-profiles)
- [Run Tests](#run-tests)
- [Reports](#reports)
- [Known Bugs and Expected-Fail Policy](#known-bugs-and-expected-fail-policy)
- [Flaky Controls](#flaky-controls)
- [Recent Change Summary](#recent-change-summary)
- [Test Strategy (1-page)](#test-strategy-1-page)

## Latest Status Snapshot (February 23, 2026)

### Full-suite execution
- Command: `npx playwright test --workers=1`
- Result: `124 total`, `115 passed`, `9 failed`
- Fail cluster in this run: `pixel` project on state-sensitive checkout/orders paths when running the entire suite sequentially against shared real environment data

### Focused suite re-runs completed in this iteration
- `tests/e2e/auth/forgot-reset-flow.e2e.spec.ts`: `12 passed`
- `tests/e2e/auth/login-flow.e2e.spec.ts`: `12 passed`
- `tests/e2e/checkout/checkout-authorization-block.e2e.spec.ts`: `12 passed`
- `tests/e2e/checkout/checkout-purchase-flow.e2e.spec.ts`: `12 passed`
- `tests/integration/orders/order-created-via-api-visible-in-ui.integration.spec.ts`: `12 passed`
- `tests/security/api/security-smoke.security.spec.ts`: `16 passed`

## Coverage Inventory

Active test files (8):

- `tests/a11y/critical/critical-pages.a11y.spec.ts`
- `tests/api/auth/auth-and-catalog.api.spec.ts`
- `tests/e2e/auth/forgot-reset-flow.e2e.spec.ts`
- `tests/e2e/auth/login-flow.e2e.spec.ts`
- `tests/e2e/checkout/checkout-authorization-block.e2e.spec.ts`
- `tests/e2e/checkout/checkout-purchase-flow.e2e.spec.ts`
- `tests/integration/orders/order-created-via-api-visible-in-ui.integration.spec.ts`
- `tests/security/api/security-smoke.security.spec.ts`

Removed from active suite:
- `tests/e2e/checkout/quantity-over-stock.e2e.spec.ts`

## Project Structure

```text
src/
  api/            # API client wrapper
  config/         # env parsing
  data/           # business data, routes, known bugs
  fixtures/       # shared typed fixtures
  flows/          # business flows used by tests
  pages/          # page objects (POM)
  support/        # helpers (a11y, known bug, state control, test ids)
tests/
  e2e/
  api/
  integration/
  security/
  a11y/
```

## QA Tag Taxonomy (Required)

### 1) Test Type
- `@e2e`
- `@api`
- `@integration`
- `@a11y`
- `@security`

### 2) Execution Scope
- `@smoke`
- `@regression`
- `@critical`

### 3) Data and State Impact
- `@safe`
- `@destructive`
- `@seeded`

### 4) Business Area
- `@auth`
- `@catalog`
- `@cart`
- `@checkout`
- `@orders`

Example title:
`Customer completes purchase flow @e2e @critical @destructive @checkout @orders`

## Browser and Device Matrix

- `chrome` (Desktop Chrome, channel `chrome`)
- `webkit` (Desktop Safari/WebKit)
- `iphone` (iPhone 14)
- `pixel` (Pixel 7)

## Install

```bash
npm ci
npx playwright install --with-deps chrome webkit
```

## Environment Profiles

Copy `.env.example` to `.env` and set:
- `APP_BASE_URL`
- `API_BASE_URL`
- `TEST_API_KEY`
- `ALLOW_TEST_CONTROL_API`
- `STOCK_RESET_VALUE`
- `TEST_USER_USERNAME`
- `TEST_USER_PASSWORD`
- `TEST_USER_EMAIL`
- `TEST_COUPON_CODE`

Recommended profiles:

1. `prod-safe` (real URL smoke/regression)
- `ALLOW_TEST_CONTROL_API=false`

2. `seeded-control` (local/staging with reset endpoints)
- `ALLOW_TEST_CONTROL_API=true`
- `STOCK_RESET_VALUE=50`
- backend must enable test mode endpoints
- for production control, backend also needs:
  - `TEST_MODE=true`
  - `TEST_ALLOW_PROD_STOCK_CONTROL=true`
  - secure `TEST_API_KEY`

## Run Tests

### Run all

```bash
npm test
```

### Run by tag

```bash
npm run test:smoke
npm run test:regression
npm run test:critical
npm run test:e2e
npm run test:api
npm run test:integration
npm run test:security
npm run test:a11y
```

### Run by browser and device

```bash
npm run test:chrome
npm run test:webkit
npm run test:iphone
npm run test:pixel
```

### Run shards

```bash
npm run test:critical:shard:1of2
npm run test:critical:shard:2of2
```

## Reports

### HTML report

```bash
npm run report:html
```

### Allure report

```bash
npm run report:allure:generate
npm run report:allure:open
```

## Known Bugs and Expected-Fail Policy

- Known bug tracking is centralized in `src/data/known-bugs.ts`
- Current tracked bug:
  - `FM-BUG-001`: Authenticated session not persisted on WebKit-based browsers
- Login-dependent suites on `webkit` and `iphone` are annotated via `test.fail(...)` helper:
  - if bug reproduces: reported as expected fail (suite stays stable)
  - if bug is fixed unexpectedly: reported as unexpected pass (signals cleanup needed)

## Flaky Controls

- Locator + `expect` only (no `waitForTimeout`)
- `data-testid` as primary selectors
- retries: `CI=1`, local `=0`
- trace/screenshot/video: `on`
- full parallel + shard support
- mobile click fallbacks for transient overlay interception cases
- optional stock reset via `/api/test/reset-stock` (when control API is enabled)

## Recent Change Summary

- Stabilized forgot/reset flow with deterministic inbox polling and token-state handling
- Normalized login-dependent known-bug annotation usage across E2E and integration suites
- Improved cart interaction stability on mobile viewports (`checkout`/`coupon` actions)
- Fixed invoice navigation from inbox emails opened with `target="_blank"` links
- Removed stock-overflow E2E scenario from active suite

## Test Strategy (1-page)

### Scope in
- Critical business flows only: auth, catalog, cart, checkout, orders
- Multi-layer checks: E2E, API, Integration, Security smoke, targeted A11y

### Scope out
- Full visual regression
- Full DAST/pentest
- Non-critical long-tail permutations

### Critical risks
- Login/session break
- Wrong cart/discount/checkout totals
- Unauthorized order APIs exposed
- Checkout allows place-order without authorization
- Regression in reset-password and inbox handoff

### Coverage map
- E2E: real user flow through UI for critical journeys
- API: endpoint correctness and auth/validation behavior
- Integration: API-created business state reflected in UI
- Security smoke: CORS, auth guards, baseline headers/cookie flags
- A11y: critical pages only (login/cart/checkout/profile orders)

### Data and environment strategy
- No business constants in spec bodies
- Data centralized in `src/data` and `src/config/env.ts`
- Optional idempotent reset and seed via test-control API
- Unique users for reset-password flow where needed

### Exit criteria
- `@critical` passes on required browser and device matrix
- no serious and critical a11y violations on scoped pages
- no blocker defects in checkout/order/auth critical path
- HTML + Allure reports generated and attached in CI
