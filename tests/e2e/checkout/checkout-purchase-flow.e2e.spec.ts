import { test } from "../../../src/fixtures/test-fixtures";
import { resetStateIfEnabled } from "../../../src/support/state-control";

test.beforeEach(async ({ apiClient }) => {
  await resetStateIfEnabled(apiClient);
});

test.describe("CHECKOUT :: E2E", () => {
  test.describe("positive cases", () => {
    test(
      "CHECKOUTE2E-P01: customer completes checkout and opens invoice from inbox @e2e @critical @destructive @seeded @auth @cart @checkout @orders",
      async ({ authFlow, purchaseFlow }) => {
        await authFlow.loginAsStandardUser();
        await purchaseFlow.completeHappyPathCheckout();
        await purchaseFlow.openInvoiceFromInbox();
      }
    );
  });
});
