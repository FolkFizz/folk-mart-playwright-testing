import { expect } from "@playwright/test";
import { UI_MESSAGE_PATTERNS } from "../data/assertions";
import { TEST_IDS } from "../support/test-ids";
import { BasePage } from "./base.page";

export class ProductPage extends BasePage {
  async open(productId: number): Promise<void> {
    await this.goto(`/product/${productId}`);
    await expect(this.byTestId(TEST_IDS.product.detail)).toBeVisible();
  }

  async increaseQuantity(times: number): Promise<void> {
    for (let index = 0; index < times; index += 1) {
      const button = this.byTestId(TEST_IDS.product.qtyIncrease);
      if (await button.isDisabled()) break;
      await button.click();
    }
  }

  async addToCart(): Promise<void> {
    await this.byTestId(TEST_IDS.product.add).click();
  }

  async expectAddDisabled(): Promise<void> {
    await expect(this.byTestId(TEST_IDS.product.add)).toBeDisabled();
  }

  async expectStockLimitError(): Promise<void> {
    await expect(this.byTestId(TEST_IDS.shared.flashMessage)).toContainText(
      UI_MESSAGE_PATTERNS.stockLimitReached
    );
  }
}
