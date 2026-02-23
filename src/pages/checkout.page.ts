import { expect } from "@playwright/test";
import { ROUTES } from "../data/routes";
import { TEST_IDS } from "../support/test-ids";
import { BasePage } from "./base.page";

export class CheckoutPage extends BasePage {
  async open(): Promise<void> {
    await this.goto(ROUTES.checkout);
    await expect(this.byTestId(TEST_IDS.checkout.authorize)).toBeVisible();
  }

  async fillBilling(name: string, email: string, address: string): Promise<void> {
    await this.byTestId(TEST_IDS.checkout.name).fill(name);
    await this.byTestId(TEST_IDS.checkout.email).fill(email);
    await this.byTestId(TEST_IDS.checkout.address).fill(address);
  }

  async fillPayment(cardNumber: string, expiry: string, cvv: string): Promise<void> {
    await this.byTestId(TEST_IDS.checkout.cardNumber).fill(cardNumber);
    await this.byTestId(TEST_IDS.checkout.cardExpiry).fill(expiry);
    await this.byTestId(TEST_IDS.checkout.cardCvv).fill(cvv);
  }

  async authorizePayment(): Promise<void> {
    await this.byTestId(TEST_IDS.checkout.authorize).click();
  }

  async placeOrder(): Promise<void> {
    await this.byTestId(TEST_IDS.checkout.placeOrder).click();
  }

  async expectPlaceOrderEnabled(): Promise<void> {
    await expect(this.byTestId(TEST_IDS.checkout.placeOrder)).toBeEnabled();
  }

  async expectPaymentAuthorizationError(): Promise<void> {
    await expect(this.byTestId(TEST_IDS.checkout.cardNumberError)).toContainText(/authorize/i);
  }

  async expectCardNumberErrorContains(text: RegExp): Promise<void> {
    await expect(this.byTestId(TEST_IDS.checkout.cardNumberError)).toContainText(text);
  }

  async expectExpiryErrorContains(text: RegExp): Promise<void> {
    await expect(this.byTestId(TEST_IDS.checkout.cardExpiryError)).toContainText(text);
  }
}
