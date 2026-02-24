import { test } from "../../../src/fixtures/test-fixtures";
import { BILLING, PAYMENT } from "../../../src/data/business";
import { USERS } from "../../../src/data/users";

test.describe("CHECKOUT :: E2E", () => {
  test.describe("positive cases", () => {
    test(
      "CHECKOUTE2E-P01: authorized payment enables place order action @e2e @critical @seeded @safe @checkout",
      async ({ authFlow, homePage, cartPage, checkoutPage }) => {
        await authFlow.loginAsStandardUser();
        await homePage.open();
        await homePage.addFirstProductToCart();
        await cartPage.open();
        await cartPage.goCheckout();
        await checkoutPage.fillBilling(BILLING.name, USERS.standard.email, BILLING.address);
        await checkoutPage.fillPayment(PAYMENT.approvedCardNumber, PAYMENT.expiry, PAYMENT.cvv);
        await checkoutPage.authorizePayment();
        await checkoutPage.expectPlaceOrderEnabled();
      }
    );
  });

  test.describe("negative cases", () => {
    test(
      "CHECKOUTE2E-N01: placing order is blocked when payment is not authorized @e2e @critical @seeded @safe @checkout",
      async ({ authFlow, purchaseFlow }) => {
        await authFlow.loginAsStandardUser();
        await purchaseFlow.expectOrderBlockedWithoutAuthorization();
      }
    );
  });

  test.describe("edge cases", () => {
    test(
      "CHECKOUTE2E-E01: compact card number input is accepted and authorizes @e2e @regression @seeded @safe @checkout",
      async ({ authFlow, homePage, cartPage, checkoutPage }) => {
        await authFlow.loginAsStandardUser();
        await homePage.open();
        await homePage.addFirstProductToCart();
        await cartPage.open();
        await cartPage.goCheckout();
        await checkoutPage.fillBilling(BILLING.name, USERS.standard.email, BILLING.address);
        await checkoutPage.fillPayment(PAYMENT.approvedCardNumberCompact, PAYMENT.expiry, PAYMENT.cvv);
        await checkoutPage.authorizePayment();
        await checkoutPage.expectPlaceOrderEnabled();
      }
    );
  });
});
