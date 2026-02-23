import { BackendApiClient } from "../../../src/api/backend-api.client";
import { test } from "../../../src/fixtures/test-fixtures";
import { BILLING, PAYMENT } from "../../../src/data/business";
import { USERS } from "../../../src/data/users";
import { markWebkitAuthSessionKnownBug } from "../../../src/support/known-bug";
import { resetStateIfEnabled } from "../../../src/support/state-control";

test.beforeEach(async ({ apiClient }) => {
  await resetStateIfEnabled(apiClient);
});

const createOrderViaApi = async (apiClient: BackendApiClient): Promise<string> => {
  await apiClient.login(USERS.standard.username, USERS.standard.password);
  await apiClient.addCartItem(1, 1);

  const authorization = await apiClient.authorizePayment({
    cardNumber: PAYMENT.approvedCardNumber,
    expMonth: PAYMENT.expMonth,
    expYear: PAYMENT.expYear,
    cvv: PAYMENT.cvv
  });

  const order = await apiClient.placeOrder({
    paymentToken: authorization.token,
    name: BILLING.name,
    email: USERS.standard.email,
    address: BILLING.address
  });

  return String(order.orderId);
};

test.describe("ORDERS :: INTEGRATION", () => {
  test.describe("positive cases", () => {
    test(
      "ORDERSINT-P01: order created via API is visible in profile invoice UI @integration @critical @destructive @seeded @orders",
      async ({ apiClient, authFlow, profilePage, browserName }, testInfo) => {
        markWebkitAuthSessionKnownBug(browserName, testInfo);
        const orderId = await createOrderViaApi(apiClient);

        await authFlow.loginAsStandardUser();
        await profilePage.openOrdersTab();
        await profilePage.expectOrderVisible(orderId);
        await profilePage.openInvoiceForOrder(orderId);
        await profilePage.expectInvoiceVisible();
      }
    );
  });

  test.describe("negative cases", () => {
    test(
      "ORDERSINT-N01: invalid invoice deep-link does not open invoice panel @integration @regression @safe @orders",
      async ({ authFlow, profilePage, browserName }, testInfo) => {
        markWebkitAuthSessionKnownBug(browserName, testInfo);
        await authFlow.loginAsStandardUser();
        await profilePage.openOrdersTabWithInvoice("ORD-UNKNOWN-INVOICE");
        await profilePage.expectInvoiceHidden();
      }
    );
  });

  test.describe("edge cases", () => {
    test(
      "ORDERSINT-E01: invoice deep-link opens panel when invoice id exists @integration @critical @destructive @seeded @orders",
      async ({ apiClient, authFlow, profilePage, browserName }, testInfo) => {
        markWebkitAuthSessionKnownBug(browserName, testInfo);
        const orderId = await createOrderViaApi(apiClient);

        await authFlow.loginAsStandardUser();
        await profilePage.openOrdersTabWithInvoice(orderId);
        await profilePage.expectInvoiceVisible();
      }
    );
  });
});
