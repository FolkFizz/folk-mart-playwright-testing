import { test } from "../../../src/fixtures/test-fixtures";
import { resetStateIfEnabled } from "../../../src/support/state-control";

test.beforeEach(async ({ apiClient }) => {
  await resetStateIfEnabled(apiClient);
});

test.describe("CHECKOUT :: E2E", () => {
  test.describe("negative cases", () => {
    test(
      "CHECKOUTE2E-N01: placing order is blocked when payment is not authorized @e2e @critical @seeded @safe @checkout",
      async ({ authFlow, purchaseFlow }) => {
        await authFlow.loginAsStandardUser();
        await purchaseFlow.expectOrderBlockedWithoutAuthorization();
      }
    );
  });
});
