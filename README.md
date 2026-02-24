# Folk Mart Playwright Testing

Playwright-based test suite for the [Folk Mart](https://folk-mart-1.onrender.com) web application, covering E2E, API, Integration, Security smoke, and Accessibility layers.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Configuration](#environment-configuration)
- [Run Commands](#run-commands)
- [Coverage Inventory](#coverage-inventory)
- [Tag Model](#tag-model)
- [Browser and Device Matrix](#browser-and-device-matrix)
- [Test Strategy](#test-strategy)
- [Failure Semantics](#failure-semantics)
- [Flakiness Controls](#flakiness-controls)
- [Reports](#reports)
- [CI Execution](#ci-execution)
- [Latest Execution Snapshot](#latest-execution-snapshot-february-24-2026)

---

## Project Overview

| Attribute          | Detail                                              |
|--------------------|-----------------------------------------------------|
| Application URL    | https://folk-mart-1.onrender.com                    |
| Test layers        | E2E, API, Integration, Security smoke, A11y         |
| Design approach    | POM + Flow layers with centralized test data        |
| Execution style    | Tag-based selection, browser matrix, shard-ready    |

---

## Project Structure

```text
src/
  api/            # API client wrapper
  config/         # Environment parsing
  data/           # Test data and constants
  fixtures/       # Shared fixtures
  flows/          # Business flows
  pages/          # Page objects (POM)
  support/        # Utilities (a11y, state control, test ids)
tests/
  a11y/
  api/
  e2e/
  integration/
  security/
```

---

## Installation

```bash
npm ci
npx playwright install --with-deps chrome webkit
```

---

## Environment Configuration

Copy `.env.example` to `.env` and populate the required keys.

### Required Keys

| Key                       | Description                              |
|---------------------------|------------------------------------------|
| `APP_BASE_URL`            | Base URL for the web application         |
| `API_BASE_URL`            | Base URL for the API                     |
| `TEST_API_KEY`            | API key for test control endpoints       |
| `ALLOW_TEST_CONTROL_API`  | Enable/disable stock reset capability    |
| `STOCK_RESET_VALUE`       | Stock quantity used during reset         |
| `TEST_USER_USERNAME`      | Test user login username                 |
| `TEST_USER_PASSWORD`      | Test user login password                 |
| `TEST_USER_EMAIL`         | Test user email address                  |
| `TEST_COUPON_CODE`        | Coupon code used in checkout tests       |

### Recommended Profiles

**`prod-safe`** — read-only runs, no data mutation

```env
ALLOW_TEST_CONTROL_API=false
```

**`seeded-control`** — full suite with stock reset

```env
ALLOW_TEST_CONTROL_API=true
STOCK_RESET_VALUE=50
```

> Backend prerequisites for `seeded-control` in production:
> `TEST_MODE=true`, `TEST_ALLOW_PROD_STOCK_CONTROL=true`, and a strong `TEST_API_KEY`.

---

## Run Commands

### Full Suite

```bash
npm test
```

### By Test Type

```bash
npm run test:e2e
npm run test:api
npm run test:integration
npm run test:security
npm run test:a11y
```

### By Execution Scope

```bash
npm run test:smoke
npm run test:regression
npm run test:critical
```

### By Browser / Device

```bash
npm run test:chrome
npm run test:webkit
npm run test:iphone
npm run test:pixel
```

### Sharded Runs

```bash
npm run test:critical:shard:1of2
npm run test:critical:shard:2of2
```

---

## Coverage Inventory

### Active Specs

| Path                                                  | Layer       | Area         |
|-------------------------------------------------------|-------------|--------------|
| `tests/a11y/critical/pages.a11y.spec.ts`              | A11y        | Pages        |
| `tests/api/auth/auth-catalog.api.spec.ts`             | API         | Auth         |
| `tests/e2e/auth/reset-password.e2e.spec.ts`           | E2E         | Auth         |
| `tests/e2e/auth/login.e2e.spec.ts`                    | E2E         | Auth         |
| `tests/e2e/checkout/authorization.e2e.spec.ts`        | E2E         | Checkout     |
| `tests/e2e/checkout/purchase.e2e.spec.ts`             | E2E         | Checkout     |
| `tests/integration/orders/api-to-ui.integration.spec.ts` | Integration | Orders    |
| `tests/security/api/smoke.security.spec.ts`           | Security    | API          |

### Out of Active Suite

| Path                                                  | Reason        |
|-------------------------------------------------------|---------------|
| `tests/e2e/checkout/quantity-over-stock.e2e.spec.ts`  | Out of scope  |

---

## Tag Model

Tags are composed per test title to enable flexible filtering.

### Test Type
`@e2e` · `@api` · `@integration` · `@a11y` · `@security`

### Execution Scope
`@smoke` · `@regression` · `@critical`

### Data / State Impact
`@safe` · `@destructive` · `@seeded`

### Business Area
`@auth` · `@catalog` · `@cart` · `@checkout` · `@orders`

**Example:**
```
Customer completes purchase flow @e2e @critical @destructive @checkout @orders
```

---

## Browser and Device Matrix

| Project   | Config                   | Engine           |
|-----------|--------------------------|------------------|
| `chrome`  | Desktop Chrome           | Chromium (stable channel) |
| `webkit`  | Desktop Safari / WebKit  | WebKit           |
| `iphone`  | iPhone 14                | Mobile WebKit    |
| `pixel`   | Pixel 7                  | Mobile Chromium  |

---

## Test Strategy

### In Scope

| Layer            | Coverage Goal                                     |
|------------------|---------------------------------------------------|
| E2E              | User-centric flows through the UI                 |
| API              | Direct endpoint validation and auth behavior      |
| Integration      | Cross-layer state validation (API → UI)           |
| Security smoke   | CORS, auth guards, baseline headers and cookies   |
| A11y             | Critical user journeys only                       |

**Business flows covered:** `auth`, `catalog`, `cart`, `checkout`, `orders`

### Out of Scope

- Full visual regression suite
- Full DAST or penetration testing
- Long-tail non-critical permutations

### Primary Risks

- Authentication or session instability
- Incorrect totals or checkout logic
- Missing authorization checks on protected APIs
- Regressions in password reset and invoice workflows

---

## Failure Semantics

- Expected-fail annotations are **disabled** in this suite.
- Every failed test is a **true failure** and should be treated as a real defect until triaged.
- Bug IDs in the execution table are reporting labels only — they do not affect pass/fail behavior.

---

## Flakiness Controls

- Locator + `expect` patterns only (`waitForTimeout` avoided)
- `data-testid` as primary selector strategy
- Retries: `1` on CI, `0` locally
- Trace, screenshot, and video capture enabled on failure
- Parallel and shard-compatible test commands
- Optional stock reset via `POST /api/test/reset-stock` when control API is enabled

---

## Reports

### HTML Report

```bash
npm run report:html
```

### Allure Report

```bash
npm run report:allure:generate
npm run report:allure:open
```

### Output Paths

| Report         | Path                                        |
|----------------|---------------------------------------------|
| HTML           | `playwright-report/index.html`              |
| Allure         | `allure-report/index.html`                  |
| Allure image   | `docs/images/allure-overall-summary.png`    |

---

## CI Execution

CI workflow runs **only via `workflow_dispatch`** (manual trigger only).

**Workflow file:** `.github/workflows/playwright.yml`

### Required GitHub Secrets

| Secret                | Description               |
|-----------------------|---------------------------|
| `TEST_API_KEY`        | API key for test control  |
| `TEST_USER_PASSWORD`  | Test user password        |

### Manual Inputs at Runtime

| Input                    | Description                       |
|--------------------------|-----------------------------------|
| `app_base_url`           | Application base URL              |
| `api_base_url`           | API base URL                      |
| `allow_test_control_api` | Enable stock reset capability     |
| `test_user_username`     | Test user login username          |
| `test_user_email`        | Test user email address           |
| `test_coupon_code`       | Coupon code for checkout tests    |

---

## Latest Execution Snapshot (February 24, 2026)

### Full Suite Result

| Command     | Total | Passed | Failed | Skipped |
|-------------|------:|-------:|-------:|--------:|
| `npm test`  | 124   | 95     | 29     | 0       |

### Allure Summary

![Allure Overall Summary](docs/images/allure-overall-summary.png)

### Detected Bugs (29 Failed Cases)

| Bug ID       | Project  | Failed Cases | Affected Areas                          | Recommended Fix                                                                                                         |
|--------------|----------|--------------:|-----------------------------------------|-------------------------------------------------------------------------------------------------------------------------|
| `FM-BUG-004` | `webkit` | 14            | `a11y`, `auth`, `checkout`, `orders`    | Stabilize WebKit session persistence after login (cookie flags + deterministic session check endpoint) before navigating to protected routes |
| `FM-BUG-005` | `iphone` | 14            | `a11y`, `auth`, `checkout`, `orders`    | Apply the same session-continuity hardening for mobile WebKit and re-verify full chain (`auth → cart → checkout → orders`) |
| `FM-BUG-006` | `pixel`  | 1             | `checkout edge`                         | Add explicit checkout form readiness assertion + synchronization before invalid-expiry validation                        |

<details>
<summary><strong>Failed Case Map (Expanded)</strong></summary>

**`FM-BUG-004` — `webkit` (14 failures)**

`A11Y-P02`, `A11Y-P03`, `A11Y-P04`, `AUTHE2E-P01`, `AUTHE2E-E01`,
`CHECKOUTE2E-P01/N01/E01` (authorization), `CHECKOUTE2E-P01/N01/E01` (purchase),
`ORDERSINT-P01/N01/E01`

**`FM-BUG-005` — `iphone` (14 failures)**

`A11Y-P02`, `A11Y-P03`, `A11Y-P04`, `AUTHE2E-P01`, `AUTHE2E-E01`,
`CHECKOUTE2E-P01/N01/E01` (authorization), `CHECKOUTE2E-P01/N01/E01` (purchase),
`ORDERSINT-P01/N01/E01`

**`FM-BUG-006` — `pixel` (1 failure)**

`CHECKOUTE2E-E01` — `tests/e2e/checkout/purchase.e2e.spec.ts:35`

</details>