import { test } from "../../../src/fixtures/test-fixtures";

test.describe("ORDERS :: INTEGRATION", () => {
  test.describe("positive cases", () => {
    test(
      "ORDERSINT-P01: order created via API is visible in profile invoice UI @integration @critical @destructive @seeded @orders",
      async ({ ordersIntegrationFlow }) => {
        await ordersIntegrationFlow.expectApiCreatedOrderVisibleInProfileInvoice();
      }
    );
  });

  test.describe("negative cases", () => {
    test(
      "ORDERSINT-N01: invalid invoice deep-link does not open invoice panel @integration @regression @safe @orders",
      async ({ ordersIntegrationFlow }) => {
        await ordersIntegrationFlow.expectInvalidInvoiceDeepLinkDoesNotOpen();
      }
    );
  });

  test.describe("edge cases", () => {
    test(
      "ORDERSINT-E01: invoice deep-link opens panel when invoice id exists @integration @critical @destructive @seeded @orders",
      async ({ ordersIntegrationFlow }) => {
        await ordersIntegrationFlow.expectExistingInvoiceDeepLinkOpens();
      }
    );
  });
});
