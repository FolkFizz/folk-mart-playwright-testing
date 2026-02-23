import { expect } from "@playwright/test";
import { ENV } from "../config/env";
import { ROUTES } from "../data/routes";
import { TEST_IDS } from "../support/test-ids";
import { BasePage } from "./base.page";

export class DemoInboxPage extends BasePage {
  async open(): Promise<void> {
    await this.goto(ROUTES.demoInbox);
    await expect(this.byTestId(TEST_IDS.demoInbox.detail)).toBeVisible();
  }

  async getLatestResetEmailId(): Promise<number | null> {
    const latestId = await this.getLatestResetEmailIdFromApi();
    return latestId > 0 ? latestId : null;
  }

  async openLatestResetEmailAfter(previousEmailId: number | null): Promise<number> {
    const baseline = previousEmailId ?? 0;

    await expect.poll(
      async () => this.getLatestResetEmailIdFromApi(),
      { timeout: 45_000, message: "Expected a new reset email to appear in demo inbox" }
    ).toBeGreaterThan(baseline);

    const latestEmailId = await this.getLatestResetEmailIdFromApi();
    if (latestEmailId <= 0) {
      throw new Error("Unable to open latest reset email because inbox returned no items");
    }

    await this.openResetEmailById(latestEmailId);
    return latestEmailId;
  }

  async openResetEmailById(emailId: number): Promise<void> {
    await this.goto(`${ROUTES.demoInbox}?box=inbox&id=${emailId}`);
    await expect(this.byTestId(TEST_IDS.demoInbox.detail)).toBeVisible();
    await expect(this.page.locator(".mail-body a[href*='/reset-password/']").first()).toBeVisible();
  }

  async openFirstResetLink(): Promise<void> {
    const link = this.page.locator(".mail-body a[href*='/reset-password/']").first();
    await expect(link).toBeVisible();
    const href = await link.getAttribute("href");
    if (!href) {
      throw new Error("Reset link is missing in demo inbox email body");
    }
    await this.page.goto(href, { waitUntil: "domcontentloaded" });
  }

  private async getLatestResetEmailIdFromApi(): Promise<number> {
    const cacheBust = Date.now();
    const response = await this.page.request.get(`${ENV.apiBaseUrl}/api/demo-inbox?box=inbox&_ts=${cacheBust}`, {
      headers: {
        "cache-control": "no-cache"
      }
    });
    if (!response.ok()) {
      return 0;
    }

    const payload = await response.json().catch(() => ({ emails: [] }));
    return Number(payload?.emails?.[0]?.id || 0);
  }
}
