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
    await this.byTestId(TEST_IDS.auth.forgotSubmit).click();
  }
}
