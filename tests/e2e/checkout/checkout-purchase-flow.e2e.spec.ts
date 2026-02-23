import { test } from "../../../src/fixtures/test-fixtures";
import { TAGS, tags } from "../../../src/data/tags";
import { resetStateIfEnabled } from "../../../src/support/state-control";

test.beforeEach(async ({ apiClient }) => {
  await resetStateIfEnabled(apiClient);
});

test(
  `Customer completes purchase and opens invoice from inbox ${tags(
    TAGS.testType.e2e,
    TAGS.executionScope.critical,
    TAGS.caseStyle.positive,
    TAGS.dataImpact.destructive,
    TAGS.dataImpact.seeded,
    TAGS.businessArea.auth,
    TAGS.businessArea.cart,
    TAGS.businessArea.checkout,
    TAGS.businessArea.orders,
    TAGS.owner.folk
  )}`,
  async ({ authFlow, purchaseFlow }) => {
    await authFlow.loginAsStandardUser();
    await purchaseFlow.completeHappyPathCheckout();
    await purchaseFlow.openInvoiceFromInbox();
  }
);
