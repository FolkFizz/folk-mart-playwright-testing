import { expect } from "@playwright/test";
import { TEST_IDS } from "../support/test-ids";
import { BasePage } from "./base.page";

export class ResetPasswordPage extends BasePage {
  async expectLoaded(): Promise<void> {
    await expect(this.byTestId(TEST_IDS.auth.resetSubmit)).toBeVisible();
  }

  async updatePassword(password: string): Promise<void> {
    await this.byTestId(TEST_IDS.auth.resetPassword).fill(password);
    await this.byTestId(TEST_IDS.auth.resetConfirmPassword).fill(password);
    await this.byTestId(TEST_IDS.auth.resetSubmit).click();
  }
}
