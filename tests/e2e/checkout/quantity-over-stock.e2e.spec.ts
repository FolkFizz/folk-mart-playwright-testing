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
  test.describe("positive cases", () => {
    test(
      "CARTE2E-P01: adding quantity within stock succeeds @e2e @critical @seeded @safe @cart",
      async ({ authFlow, productPage, cartPage }) => {
        await authFlow.loginAsStandardUser();
        await productPage.open(PRODUCT_IDS.stockEdgeCase);
        await productPage.addToCart();
        await cartPage.expectHasItems();
      }
    );
  });

  test.describe("negative cases", () => {
    test(
      "CARTE2E-N01: add-to-cart is disabled when stock is zero @e2e @regression @seeded @safe @cart",
      async ({ apiClient, authFlow, productPage }) => {
        await apiClient.setProductStock(PRODUCT_IDS.stockEdgeCase, 0);
        await authFlow.loginAsStandardUser();
        await productPage.open(PRODUCT_IDS.stockEdgeCase);
        await productPage.expectAddDisabled();
      }
    );
  });

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
