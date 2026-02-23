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
    await expect(this.byTestId(TEST_IDS.catalog.addToCartButton).first()).toBeVisible();
    await this.byTestId(TEST_IDS.catalog.addToCartButton).first().click();
  }
}
