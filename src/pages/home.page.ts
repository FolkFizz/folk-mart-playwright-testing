import { expect } from "@playwright/test";
import { ROUTES } from "../data/routes";
import { TEST_IDS } from "../support/test-ids";
import { BasePage } from "./base.page";

export class HomePage extends BasePage {
  async open(): Promise<void> {
    await this.goto(ROUTES.home);
    await expect(this.byTestId(TEST_IDS.catalog.grid)).toBeVisible();
  }

  async addFirstProductToCart(): Promise<void> {
    const addButton = this.page.locator(`[data-testid="${TEST_IDS.catalog.addToCartButton}"]:not([disabled])`).first();
    const cartCountBadge = this.byTestId(TEST_IDS.nav.cart).locator(".cart-count");
    const beforeText = (await cartCountBadge.textContent()) || "0";
    const beforeCount = Number(beforeText.trim() || "0");

    await expect(addButton).toBeVisible();
    await addButton.click();

    await expect.poll(async () => {
      const nextText = (await cartCountBadge.textContent()) || "0";
      return Number(nextText.trim() || "0");
    }).toBeGreaterThan(beforeCount);
  }
}
