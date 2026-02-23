import { expect } from "@playwright/test";
import { ROUTES } from "../data/routes";
import { TEST_IDS } from "../support/test-ids";
import { BasePage } from "./base.page";

export class ProfilePage extends BasePage {
  async openOrdersTab(): Promise<void> {
    await this.goto(ROUTES.profileOrders);
    await expect(this.byTestId(TEST_IDS.profile.tabOrders)).toBeVisible();
  }

  async openFirstInvoice(): Promise<void> {
    await expect(this.page.getByRole("button", { name: "Invoice" }).first()).toBeVisible();
    await this.page.getByRole("button", { name: "Invoice" }).first().click();
  }

  async expectOrderVisible(orderId: string): Promise<void> {
    await expect(this.page.getByTestId(`profile-order-${orderId}`)).toBeVisible();
  }

  async openInvoiceForOrder(orderId: string): Promise<void> {
    const orderRow = this.page.getByTestId(`profile-order-${orderId}`);
    await expect(orderRow).toBeVisible();
    await orderRow.getByRole("button", { name: "Invoice" }).click();
  }

  async expectInvoiceVisible(): Promise<void> {
    await expect(this.byTestId(TEST_IDS.profile.invoicePanel)).toBeVisible();
  }
}
