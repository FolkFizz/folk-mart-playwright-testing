import { test } from "../../../src/fixtures/test-fixtures";
import { ENV } from "../../../src/config/env";
import { PRODUCT_IDS } from "../../../src/data/business";
import { resetStateIfEnabled } from "../../../src/support/state-control";

test.skip(!ENV.allowTestControlApi, "Edge stock test requires test control API");

test.beforeEach(async ({ apiClient }) => {
  await resetStateIfEnabled(apiClient);
  await apiClient.setProductStock(PRODUCT_IDS.stockEdgeCase, 1);
});

test.describe("CART STOCK :: E2E", () => {
  test.describe("edge cases", () => {
    test(
      "CARTE2E-E01: adding quantity above stock fails with clear feedback @e2e @critical @seeded @safe @cart",
      async ({ authFlow, productPage }) => {
        await authFlow.loginAsStandardUser();
        await productPage.open(PRODUCT_IDS.stockEdgeCase);
        await productPage.addToCart();

        await productPage.open(PRODUCT_IDS.stockEdgeCase);
        await productPage.addToCart();
        await productPage.expectStockLimitError();
      }
    );
  });
});
