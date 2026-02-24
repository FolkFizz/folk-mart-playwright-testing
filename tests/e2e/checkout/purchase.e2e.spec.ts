import { test } from "../../../src/fixtures/test-fixtures";
import { BILLING, PAYMENT } from "../../../src/data/business";
import { USERS } from "../../../src/data/users";

test.describe("CHECKOUT :: E2E", () => {
  test.describe("positive cases", () => {
    test(
      "CHECKOUTE2E-P01: customer completes checkout and opens invoice from inbox @e2e @critical @destructive @seeded @auth @cart @checkout @orders",
      async ({ authFlow, purchaseFlow }) => {
        await authFlow.loginAsStandardUser();
        await purchaseFlow.completeHappyPathCheckout();
        await purchaseFlow.openInvoiceFromInbox();
      }
    );
  });

  test.describe("negative cases", () => {
    test(
      "CHECKOUTE2E-N01: declined card is rejected at authorization step @e2e @regression @safe @checkout",
      async ({ authFlow, homePage, cartPage, checkoutPage }) => {
        await authFlow.loginAsStandardUser();
        await homePage.open();
        await homePage.addFirstProductToCart();
        await cartPage.open();
        await cartPage.goCheckout();
        await checkoutPage.fillBilling(BILLING.name, USERS.standard.email, BILLING.address);
        await checkoutPage.fillPayment(PAYMENT.declinedCardNumber, PAYMENT.expiry, PAYMENT.cvv);
        await checkoutPage.authorizePayment();
        await checkoutPage.expectCardDeclinedError();
      }
    );
  });

  test.describe("edge cases", () => {
    test(
      "CHECKOUTE2E-E01: invalid expiry format is validated before placement @e2e @regression @safe @checkout",
      async ({ authFlow, homePage, cartPage, checkoutPage }) => {
        await authFlow.loginAsStandardUser();
        await homePage.open();
        await homePage.addFirstProductToCart();
        await cartPage.open();
        await cartPage.goCheckout();
        await checkoutPage.fillBilling(BILLING.name, USERS.standard.email, BILLING.address);
        await checkoutPage.fillPayment(PAYMENT.approvedCardNumber, PAYMENT.invalidExpiry, PAYMENT.cvv);
        await checkoutPage.authorizePayment();
        await checkoutPage.expectExpiryFormatError();
      }
    );
  });
});
