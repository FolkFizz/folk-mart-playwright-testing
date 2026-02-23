import { test } from "../../../src/fixtures/test-fixtures";
import { TAGS, tags } from "../../../src/data/tags";
import { resetStateIfEnabled } from "../../../src/support/state-control";

test.beforeEach(async ({ apiClient }) => {
  await resetStateIfEnabled(apiClient);
});

test(
  `Checkout is blocked when payment is not authorized ${tags(
    TAGS.testType.e2e,
    TAGS.executionScope.critical,
    TAGS.caseStyle.negative,
    TAGS.dataImpact.safe,
    TAGS.dataImpact.seeded,
    TAGS.businessArea.checkout,
    TAGS.owner.folk
  )}`,
  async ({ authFlow, purchaseFlow }) => {
    await authFlow.loginAsStandardUser();
    await purchaseFlow.expectOrderBlockedWithoutAuthorization();
  }
);
