import { expect } from "@playwright/test";
import { ROUTES } from "../data/routes";
import { TEST_IDS } from "../support/test-ids";
import { BasePage } from "./base.page";

export class DemoInboxPage extends BasePage {
  async open(): Promise<void> {
    await this.goto(ROUTES.demoInbox);
    await expect(this.byTestId(TEST_IDS.demoInbox.detail)).toBeVisible();
  }

  async openLatestResetEmail(): Promise<void> {
    await expect(this.page.locator("[data-testid^='demo-inbox-item-']").first()).toBeVisible();
    await this.page.locator("[data-testid^='demo-inbox-item-']").first().click();
    await expect(this.byTestId(TEST_IDS.demoInbox.detail)).toBeVisible();
  }

  async openFirstResetLink(): Promise<void> {
    const link = this.page.locator(".mail-body a").first();
    await expect(link).toBeVisible();
    const href = await link.getAttribute("href");
    if (!href) {
      throw new Error("Reset link is missing in demo inbox email body");
    }
    await this.page.goto(href, { waitUntil: "domcontentloaded" });
  }
}
