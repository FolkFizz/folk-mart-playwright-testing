import { DemoInboxPage } from "../pages/demo-inbox.page";
import { ForgotPasswordPage } from "../pages/forgot-password.page";
import { LoginPage } from "../pages/login.page";
import { ResetPasswordPage } from "../pages/reset-password.page";

export class PasswordResetFlow {
  private readonly forgotPasswordPage: ForgotPasswordPage;
  private readonly demoInboxPage: DemoInboxPage;
  private readonly resetPasswordPage: ResetPasswordPage;
  private readonly loginPage: LoginPage;

  constructor(
    forgotPasswordPage: ForgotPasswordPage,
    demoInboxPage: DemoInboxPage,
    resetPasswordPage: ResetPasswordPage,
    loginPage: LoginPage
  ) {
    this.forgotPasswordPage = forgotPasswordPage;
    this.demoInboxPage = demoInboxPage;
    this.resetPasswordPage = resetPasswordPage;
    this.loginPage = loginPage;
  }

  async requestAndResetPasswordFor(email: string, newPassword: string): Promise<void> {
    await this.demoInboxPage.open();
    let latestEmailIdBeforeRequest = await this.demoInboxPage.getLatestResetEmailId();

    await this.forgotPasswordPage.open();
    await this.forgotPasswordPage.requestReset(email);

    // Retry once with a newer reset email if the first opened token is already invalid.
    for (let attempt = 0; attempt < 2; attempt += 1) {
      latestEmailIdBeforeRequest = await this.demoInboxPage.openLatestResetEmailAfter(latestEmailIdBeforeRequest);
      await this.demoInboxPage.openFirstResetLink();

      const viewState = await this.resetPasswordPage.resolveViewState();
      if (viewState === "form") {
        await this.resetPasswordPage.updatePassword(newPassword);
        return;
      }
    }

    throw new Error("Unable to open a valid reset token from demo inbox after retrying");
  }

  async loginWithCredentials(username: string, password: string): Promise<void> {
    await this.loginPage.open();
    await this.loginPage.login(username, password);
  }
}
