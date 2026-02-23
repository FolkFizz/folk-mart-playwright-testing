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
    await this.forgotPasswordPage.open();
    await this.forgotPasswordPage.requestReset(email);

    await this.demoInboxPage.open();
    await this.demoInboxPage.openLatestResetEmail();
    await this.demoInboxPage.openFirstResetLink();

    await this.resetPasswordPage.expectLoaded();
    await this.resetPasswordPage.updatePassword(newPassword);
  }

  async loginWithCredentials(username: string, password: string): Promise<void> {
    await this.loginPage.open();
    await this.loginPage.login(username, password);
  }
}
