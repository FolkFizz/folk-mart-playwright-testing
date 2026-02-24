import { expect } from "@playwright/test";
import { UI_MESSAGE_PATTERNS } from "../data/assertions";
import { ROUTES } from "../data/routes";
import { TEST_IDS } from "../support/test-ids";
import { BasePage } from "./base.page";

export class LoginPage extends BasePage {
  async open(): Promise<void> {
    await this.goto(ROUTES.login);
    await expect(this.byTestId(TEST_IDS.auth.loginSubmit)).toBeVisible();
  }

  async login(username: string, password: string): Promise<void> {
    await this.byTestId(TEST_IDS.auth.loginUsername).fill(username);
    await this.byTestId(TEST_IDS.auth.loginPassword).fill(password);
    await this.byTestId(TEST_IDS.auth.loginSubmit).click();
  }

  async expectInvalidCredentialsMessage(): Promise<void> {
    await expect(this.byTestId(TEST_IDS.shared.flashMessage)).toContainText(
      UI_MESSAGE_PATTERNS.invalidCredentials
    );
  }
}
