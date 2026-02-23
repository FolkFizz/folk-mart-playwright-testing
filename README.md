# Folk Mart Playwright Testing

Playwright test project for Folk Mart with a strict QA standard:
- POM + Flow layer only
- test files stay clean (no business constants in test body)
- tag-driven execution
- critical-first coverage
- reproducible reports (HTML + Allure)

## Project Structure

```text
src/
  api/            # API client wrapper
  config/         # env parsing
  data/           # business data, routes
  fixtures/       # shared typed fixtures
  flows/          # business flows used by tests
  pages/          # page objects (POM)
  support/        # helpers (a11y, state control, test ids)
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

### 3) Data/State Impact
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

## Browser/Device Matrix

- `chrome-desktop` (channel `chrome`)
- `webkit-desktop`
- `iphone-14`
- `pixel-7`

## Install

```bash
npm ci
npx playwright install --with-deps chrome webkit
```

## Run Tests

### Run all

```bash
npm test
```

### Run by tag

```bash
npm run test:critical
npm run test:e2e
npm run test:api
npm run test:integration
npm run test:security
npm run test:a11y
```

### Run by browser/device

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

## Environment

Copy `.env.example` to `.env` and set values:
- `APP_BASE_URL`
- `API_BASE_URL`
- `TEST_API_KEY`
- `ALLOW_TEST_CONTROL_API`
- `TEST_USER_USERNAME`
- `TEST_USER_PASSWORD`
- `TEST_USER_EMAIL`
- `TEST_COUPON_CODE`

## Flaky Controls

- Locator + `expect` only, no `waitForTimeout`
- `data-testid` as primary selectors
- retries: CI = 1, local = 0
- trace: `on-first-retry`
- screenshot/video: failure only
- full parallel support + shard support
- optional state reset via `/api/test/reset` when `ALLOW_TEST_CONTROL_API=true`

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
- Regression in reset-password + inbox handoff

### Coverage map
- E2E: real user flow through UI for critical journeys
- API: endpoint correctness and auth/validation behavior
- Integration: API-created business state reflected in UI
- Security smoke: CORS, auth guards, baseline headers/cookie flags
- A11y: critical pages only (login/cart/checkout/profile orders)

### Data + environment strategy
- No business constants in spec bodies
- All data centralized in `src/data` and `src/config/env.ts`
- Optional idempotent reset/seed via test-control API
- Unique users for reset-password flow where needed

### Exit criteria
- `@critical` passes on required browser/device matrix
- No serious/critical a11y violations on scoped pages
- No blocker defects in checkout/order/auth critical path
- HTML + Allure report generated and attached in CI
