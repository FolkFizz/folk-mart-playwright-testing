import { expect } from "@playwright/test";
import { ROUTES, ROUTE_MATCHERS } from "../data/routes";
import { TEST_IDS } from "../support/test-ids";
import { BasePage } from "./base.page";

export class CartPage extends BasePage {
  async open(): Promise<void> {
    await this.goto(ROUTES.cart);
    await expect(this.byTestId(TEST_IDS.cart.checkout)).toBeVisible();
  }

  async applyCoupon(code: string): Promise<void> {
    await this.byTestId(TEST_IDS.cart.couponInput).fill(code);
    const couponRequest = this.page.waitForResponse(
      (response) =>
        response.request().method() === "POST" &&
        response.url().includes("/api/cart/coupon") &&
        response.ok()
    );
    await this.clickActionButtonWithFallback(TEST_IDS.cart.applyCoupon);
    await couponRequest;
    await expect(this.byTestId(TEST_IDS.cart.couponBadge)).toBeVisible();
  }

  async goCheckout(): Promise<void> {
    await this.clickActionButtonWithFallback(TEST_IDS.cart.checkout);
    await expect(this.page).toHaveURL(ROUTE_MATCHERS.checkout);
  }

  async increaseQuantityOnce(): Promise<void> {
    await this.byTestId(TEST_IDS.cart.qtyIncrease).first().click();
  }

  async expectHasItems(): Promise<void> {
    await expect.poll(async () => this.page.locator("[data-testid^='cart-item-']").count()).toBeGreaterThan(0);
  }

  async hasItems(): Promise<boolean> {
    return (await this.page.locator("[data-testid^='cart-item-']").count()) > 0;
  }

  private async clickActionButtonWithFallback(testId: string): Promise<void> {
    const actionButton = this.byTestId(testId);
    await expect(actionButton).toBeVisible();
    await expect(actionButton).toBeEnabled();

    try {
      await actionButton.click({ timeout: 10_000 });
    } catch {
      // Some mobile layouts briefly overlap the button during transitions.
      await actionButton.focus();
      await this.page.keyboard.press("Enter");
    }
  }
}
