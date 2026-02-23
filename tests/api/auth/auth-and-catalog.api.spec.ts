import { expect, test } from "../../../src/fixtures/test-fixtures";
import { API_QUERIES } from "../../../src/data/api-queries";
import { COUPONS } from "../../../src/data/business";
import { USERS } from "../../../src/data/users";
import { resetStateIfEnabled } from "../../../src/support/state-control";

test.beforeEach(async ({ apiClient }) => {
  await resetStateIfEnabled(apiClient);
});

test.describe("AUTH-CATALOG :: API", () => {
  test.describe("positive cases", () => {
    test(
      "CATALOGAPI-P01: products endpoint returns filtered and sorted list @api @critical @safe @catalog",
      async ({ apiClient }) => {
        const payload = await apiClient.listProducts(API_QUERIES.productsSmoke);

        expect(payload.ok).toBeTruthy();
        expect(Array.isArray(payload.products)).toBeTruthy();
        expect(payload.products.length).toBeGreaterThan(0);
      }
    );

    test(
      "AUTHAPI-P01: login succeeds with valid credentials @api @smoke @critical @safe @auth",
      async ({ apiClient }) => {
        const payload = await apiClient.login(USERS.standard.username, USERS.standard.password);

        expect(payload.ok).toBeTruthy();
        expect(payload.user.username).toBe(USERS.standard.username);
      }
    );
  });

  test.describe("negative cases", () => {
    test(
      "AUTHAPI-N01: login fails with invalid credentials @api @critical @safe @auth",
      async ({ apiClient }) => {
        const payload = await apiClient.login(USERS.invalid.username, USERS.invalid.password, 401);

        expect(payload.ok).toBeFalsy();
        expect(String(payload.message)).toMatch(/invalid/i);
      }
    );

    test(
      "CARTAPI-N01: invalid coupon code is rejected @api @regression @safe @cart",
      async ({ apiClient }) => {
        await apiClient.login(USERS.standard.username, USERS.standard.password);
        await apiClient.addCartItem(1, 1);
        const payload = await apiClient.applyCoupon(COUPONS.invalid, 404);

        expect(payload.ok).toBeFalsy();
        expect(String(payload.message)).toMatch(/coupon/i);
      }
    );

    test(
      "ORDERAPI-N01: orders endpoint rejects unauthenticated access @api @critical @safe @orders",
      async ({ apiClient }) => {
        const payload = await apiClient.get("/api/orders", 401);

        expect(payload.ok).toBeFalsy();
        expect(String(payload.message)).toMatch(/authentication required/i);
      }
    );
  });
});
