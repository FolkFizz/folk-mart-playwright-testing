import { test } from "../../../src/fixtures/test-fixtures";
import { expectNoSeriousA11yViolations } from "../../../src/support/a11y";

test.describe("CRITICAL PAGES :: A11y", () => {
  test.describe("positive cases", () => {
    test(
      "A11Y-P01: login page has no serious accessibility violations @a11y @critical @safe @auth",
      async ({ loginPage, page }) => {
        await loginPage.open();
        await expectNoSeriousA11yViolations(page);
      }
    );

    test(
      "A11Y-P02: cart page has no serious accessibility violations @a11y @regression @safe @cart",
      async ({ authFlow, cartPage, page }) => {
        await authFlow.loginAsStandardUser();
        await cartPage.open();
        await expectNoSeriousA11yViolations(page);
      }
    );

    test(
      "A11Y-P03: checkout page has no serious accessibility violations @a11y @regression @safe @checkout",
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
      "A11Y-P04: profile orders page has no serious accessibility violations @a11y @regression @safe @orders",
      async ({ authFlow, profilePage, page }) => {
        await authFlow.loginAsStandardUser();
        await profilePage.openOrdersTab();
        await expectNoSeriousA11yViolations(page);
      }
    );
  });
});
