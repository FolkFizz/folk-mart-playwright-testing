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
    const productCards = this.page.locator("[data-testid^='product-card-']");
    const cartCountBadge = this.byTestId(TEST_IDS.nav.cart).locator(".cart-count");
    const cardCount = await productCards.count();

    const readCartCount = async (): Promise<number> => {
      const text = (await cartCountBadge.textContent()) || "0";
      return Number(text.trim() || "0");
    };

    for (let index = 0; index < cardCount; index += 1) {
      const card = productCards.nth(index);
      const stockText = String((await card.locator(".stock").textContent()) || "");
      const matchedStock = stockText.match(/stock:\s*(\d+)/i);
      const stock = Number(matchedStock?.[1] || 0);
      if (stock <= 0) {
        continue;
      }

      const addButton = card.getByTestId(TEST_IDS.catalog.addToCartButton);
      await expect(addButton).toBeVisible();
      const beforeCount = await readCartCount();
      const addRequest = this.page.waitForResponse(
        (response) =>
          response.request().method() === "POST" &&
          response.url().includes("/api/cart/add"),
        { timeout: 10_000 }
      );
      await addButton.click();

      const addResponse = await addRequest.catch(() => null);
      if (!addResponse || !addResponse.ok()) {
        continue;
      }

      try {
        await expect
          .poll(async () => {
            return readCartCount();
          })
          .toBeGreaterThan(beforeCount);
        return;
      } catch {
        continue;
      }
    }

    throw new Error("No in-stock product could be added to cart. Catalog appears depleted.");
  }
}
