import { expect } from "@playwright/test";
import { ROUTES } from "../data/routes";
import { TEST_IDS } from "../support/test-ids";
import { BasePage } from "./base.page";

export class ForgotPasswordPage extends BasePage {
  async open(): Promise<void> {
    await this.goto(ROUTES.forgotPassword);
    await expect(this.byTestId(TEST_IDS.auth.forgotSubmit)).toBeVisible();
  }

  async requestReset(email: string): Promise<void> {
    await this.byTestId(TEST_IDS.auth.forgotEmail).fill(email);
    const forgotResponse = this.page.waitForResponse(
      (response) =>
        response.request().method() === "POST" &&
        response.url().includes("/api/auth/forgot-password") &&
        response.ok()
    );

    await this.byTestId(TEST_IDS.auth.forgotSubmit).click();
    await forgotResponse;
    await expect(this.page.getByRole("link", { name: /open demo inbox/i })).toBeVisible();
  }
}
