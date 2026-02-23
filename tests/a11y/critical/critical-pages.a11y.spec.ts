import { test } from "../../../src/fixtures/test-fixtures";
import { TAGS, tags } from "../../../src/data/tags";
import { expectNoSeriousA11yViolations } from "../../../src/support/a11y";

test(
  `Login page has no serious accessibility violations ${tags(
    TAGS.testType.a11y,
    TAGS.executionScope.critical,
    TAGS.caseStyle.positive,
    TAGS.dataImpact.safe,
    TAGS.businessArea.auth,
    TAGS.owner.folk
  )}`,
  async ({ loginPage, page }) => {
    await loginPage.open();
    await expectNoSeriousA11yViolations(page);
  }
);

test(
  `Cart page has no serious accessibility violations ${tags(
    TAGS.testType.a11y,
    TAGS.executionScope.regression,
    TAGS.caseStyle.positive,
    TAGS.dataImpact.safe,
    TAGS.businessArea.cart,
    TAGS.owner.folk
  )}`,
  async ({ authFlow, cartPage, page }) => {
    await authFlow.loginAsStandardUser();
    await cartPage.open();
    await expectNoSeriousA11yViolations(page);
  }
);

test(
  `Checkout page has no serious accessibility violations ${tags(
    TAGS.testType.a11y,
    TAGS.executionScope.regression,
    TAGS.caseStyle.positive,
    TAGS.dataImpact.safe,
    TAGS.businessArea.checkout,
    TAGS.owner.folk
  )}`,
  async ({ authFlow, homePage, cartPage, page }) => {
    await authFlow.loginAsStandardUser();
    await homePage.open();
    await homePage.addFirstProductToCart();
    await cartPage.open();
    await cartPage.goCheckout();
    await expectNoSeriousA11yViolations(page);
  }
);

test(
  `Profile orders page has no serious accessibility violations ${tags(
    TAGS.testType.a11y,
    TAGS.executionScope.regression,
    TAGS.caseStyle.positive,
    TAGS.dataImpact.safe,
    TAGS.businessArea.orders,
    TAGS.owner.folk
  )}`,
  async ({ authFlow, profilePage, page }) => {
    await authFlow.loginAsStandardUser();
    await profilePage.openOrdersTab();
    await expectNoSeriousA11yViolations(page);
  }
);
