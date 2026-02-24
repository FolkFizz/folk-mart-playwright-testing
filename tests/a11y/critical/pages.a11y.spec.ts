import { expect, test } from "../../../src/fixtures/test-fixtures";
import { ROUTES, ROUTE_MATCHERS } from "../../../src/data/routes";
import { USERS } from "../../../src/data/users";
import { expectNoSeriousA11yViolations } from "../../../src/support/a11y";

test.describe("CRITICAL PAGES :: A11y", () => {
  test.describe("positive cases", () => {
    test(
      "A11Y-P01: login page has no serious accessibility violations @a11y @critical @safe @auth",
      async ({ loginPage, page }, testInfo) => {
        await loginPage.open();
        await expectNoSeriousA11yViolations(page, testInfo);
      }
    );

    test(
      "A11Y-P02: cart page has no serious accessibility violations @a11y @regression @safe @cart",
      async ({ authFlow, cartPage, page }, testInfo) => {
        await authFlow.loginAsStandardUser();
        await cartPage.open();
        await expectNoSeriousA11yViolations(page, testInfo);
      }
    );

    test(
      "A11Y-P03: checkout page has no serious accessibility violations @a11y @regression @safe @checkout",
      async ({ authFlow, homePage, cartPage, page }, testInfo) => {
        await authFlow.loginAsStandardUser();
        await homePage.open();
        await homePage.addFirstProductToCart();
        await cartPage.open();
        await cartPage.goCheckout();
        await expectNoSeriousA11yViolations(page, testInfo);
      }
    );

    test(
      "A11Y-P04: profile orders page has no serious accessibility violations @a11y @regression @safe @orders",
      async ({ authFlow, profilePage, page }, testInfo) => {
        await authFlow.loginAsStandardUser();
        await profilePage.openOrdersTab();
        await expectNoSeriousA11yViolations(page, testInfo);
      }
    );
  });

  test.describe("negative cases", () => {
    test(
      "A11Y-N01: invalid login error state has no serious accessibility violations @a11y @regression @safe @auth",
      async ({ loginPage, page }, testInfo) => {
        await loginPage.open();
        await loginPage.login(USERS.invalid.username, USERS.invalid.password);
        await loginPage.expectInvalidCredentialsMessage();
        await expectNoSeriousA11yViolations(page, testInfo);
      }
    );
  });

  test.describe("edge cases", () => {
    test(
      "A11Y-E01: guard redirect to login remains accessible @a11y @regression @safe @auth",
      async ({ page }, testInfo) => {
        await page.goto(ROUTES.profileOrders, { waitUntil: "domcontentloaded" });
        await expect(page).toHaveURL(ROUTE_MATCHERS.login);
        await expectNoSeriousA11yViolations(page, testInfo);
      }
    );
  });
});
