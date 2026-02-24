import { expect } from "@playwright/test";
import { UI_MESSAGE_PATTERNS } from "../data/assertions";
import { TEST_IDS } from "../support/test-ids";
import { BasePage } from "./base.page";

export type ResetPasswordViewState = "form" | "invalid" | "unknown";

export class ResetPasswordPage extends BasePage {
  async openWithToken(token: string): Promise<void> {
    await this.goto(`/reset-password/${token}`);
  }

  async resolveViewState(timeoutMs = 10_000): Promise<ResetPasswordViewState> {
    const submitButton = this.byTestId(TEST_IDS.auth.resetSubmit);
    const invalidTokenAlert = this.page.locator(".auth-card .alert.alert-error");

    const result = await expect
      .poll(
        async () => {
          if (await submitButton.isVisible().catch(() => false)) return "form";
          if (await invalidTokenAlert.isVisible().catch(() => false)) return "invalid";
          return "unknown";
        },
        { timeout: timeoutMs }
      )
      .not.toBe("unknown")
      .then(async () => {
        if (await submitButton.isVisible().catch(() => false)) return "form";
        if (await invalidTokenAlert.isVisible().catch(() => false)) return "invalid";
        return "unknown";
      });

    return result;
  }

  async expectLoaded(): Promise<void> {
    await expect(this.byTestId(TEST_IDS.auth.resetSubmit)).toBeVisible();
  }

  async expectInvalidTokenMessage(): Promise<void> {
    await expect(this.page.locator(".auth-card .alert.alert-error")).toContainText(
      UI_MESSAGE_PATTERNS.resetTokenInvalidOrExpired
    );
  }

  async updatePassword(password: string): Promise<void> {
    await this.byTestId(TEST_IDS.auth.resetPassword).fill(password);
    await this.byTestId(TEST_IDS.auth.resetConfirmPassword).fill(password);
    await this.byTestId(TEST_IDS.auth.resetSubmit).click();
  }
}
