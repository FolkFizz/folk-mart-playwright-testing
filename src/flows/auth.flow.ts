import { expect, Page } from "@playwright/test";
import { USERS } from "../data/users";
import { TEST_IDS } from "../support/test-ids";
import { LoginPage } from "../pages/login.page";

export class AuthFlow {
  private readonly page: Page;
  private readonly loginPage: LoginPage;

  constructor(page: Page, loginPage: LoginPage) {
    this.page = page;
    this.loginPage = loginPage;
  }

  async loginAsStandardUser(): Promise<void> {
    await this.loginWithCredentials(USERS.standard.username, USERS.standard.password);
  }

  async loginWithCredentials(username: string, password: string): Promise<void> {
    await this.loginPage.open();
    await this.loginPage.login(username, password);
    await expect(this.page).toHaveURL(/\/home/);
    await expect(this.page.getByTestId(TEST_IDS.nav.profile)).toBeVisible();
  }

  async attemptLogin(username: string, password: string): Promise<void> {
    await this.loginPage.open();
    await this.loginPage.login(username, password);
  }

  async expectLoginRejected(): Promise<void> {
    await this.loginPage.expectInvalidCredentialsMessage();
  }
}
