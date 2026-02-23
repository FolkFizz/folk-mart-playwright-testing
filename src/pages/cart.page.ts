import { expect } from "@playwright/test";
import { ROUTES } from "../data/routes";
import { TEST_IDS } from "../support/test-ids";
import { BasePage } from "./base.page";

export class CartPage extends BasePage {
  async open(): Promise<void> {
    await this.goto(ROUTES.cart);
    await expect(this.byTestId(TEST_IDS.cart.checkout)).toBeVisible();
  }

  async applyCoupon(code: string): Promise<void> {
    await this.byTestId(TEST_IDS.cart.couponInput).fill(code);
    await this.byTestId(TEST_IDS.cart.applyCoupon).click();
  }

  async goCheckout(): Promise<void> {
    const checkoutButton = this.byTestId(TEST_IDS.cart.checkout);
    await expect(checkoutButton).toBeVisible();
    await expect(checkoutButton).toBeEnabled();
    await checkoutButton.scrollIntoViewIfNeeded();

    try {
      await checkoutButton.click({ timeout: 10_000 });
    } catch {
      // Fallback for small/mobile viewports where transient overlays intercept pointer events.
      await checkoutButton.focus();
      await checkoutButton.press("Enter");
    }
  }

  async increaseQuantityOnce(): Promise<void> {
    await this.byTestId(TEST_IDS.cart.qtyIncrease).first().click();
  }

  async expectHasItems(): Promise<void> {
    await expect(this.page.locator("[data-testid^='cart-item-']")).toHaveCount(1);
  }
}
