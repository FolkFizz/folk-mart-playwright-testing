import { expect } from "@playwright/test";
import { TEST_IDS } from "../support/test-ids";
import { BasePage } from "./base.page";

export class OrderSuccessPage extends BasePage {
  async expectVisible(): Promise<void> {
    await expect(this.byTestId(TEST_IDS.order.successPage)).toBeVisible();
  }

  async getOrderId(): Promise<string> {
    await this.expectVisible();
    const orderId = await this.byTestId(TEST_IDS.order.orderId).innerText();
    return orderId.trim();
  }

  async openProfileOrders(): Promise<void> {
    await this.byTestId(TEST_IDS.order.goProfileOrders).click();
  }
}
