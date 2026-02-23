import { test } from "../../../src/fixtures/test-fixtures";
import { BILLING, PAYMENT } from "../../../src/data/business";
import { TAGS, tags } from "../../../src/data/tags";
import { USERS } from "../../../src/data/users";
import { resetStateIfEnabled } from "../../../src/support/state-control";

test.beforeEach(async ({ apiClient }) => {
  await resetStateIfEnabled(apiClient);
});

test(
  `Order created via API is visible in profile invoice UI ${tags(
    TAGS.testType.integration,
    TAGS.executionScope.critical,
    TAGS.caseStyle.positive,
    TAGS.dataImpact.destructive,
    TAGS.dataImpact.seeded,
    TAGS.businessArea.orders,
    TAGS.owner.folk
  )}`,
  async ({ apiClient, authFlow, profilePage }) => {
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

    await authFlow.loginAsStandardUser();
    await profilePage.openOrdersTab();
    await profilePage.expectOrderVisible(order.orderId);
    await profilePage.openInvoiceForOrder(order.orderId);
    await profilePage.expectInvoiceVisible();
  }
);
