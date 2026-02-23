import { expect } from "@playwright/test";
import { ROUTES } from "../data/routes";
import { TEST_IDS } from "../support/test-ids";
import { BasePage } from "./base.page";

export class InboxPage extends BasePage {
  async open(): Promise<void> {
    await this.goto(ROUTES.inbox);
    await expect(this.byTestId(TEST_IDS.inbox.boxInbox)).toBeVisible();
  }

  async openLatestEmail(): Promise<void> {
    await expect(this.page.locator("[data-testid^='inbox-item-']").first()).toBeVisible();
    await this.page.locator("[data-testid^='inbox-item-']").first().click();
    await expect(this.byTestId(TEST_IDS.inbox.detail)).toBeVisible();
  }

  async clickFirstLinkInBody(): Promise<void> {
    const link = this.page.locator(".mail-body a").first();
    await expect(link).toBeVisible();
    const href = await link.getAttribute("href");
    if (!href) {
      throw new Error("Expected invoice link in inbox email body but href was missing");
    }
    await this.page.goto(href, { waitUntil: "domcontentloaded" });
  }
}
