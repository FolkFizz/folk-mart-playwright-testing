import { test as base, expect, request as playwrightRequest } from "@playwright/test";
import { BackendApiClient } from "../api/backend-api.client";
import { ENV } from "../config/env";
import { AuthFlow } from "../flows/auth.flow";
import { PasswordResetFlow } from "../flows/password-reset.flow";
import { PurchaseFlow } from "../flows/purchase.flow";
import { CartPage } from "../pages/cart.page";
import { CheckoutPage } from "../pages/checkout.page";
import { DemoInboxPage } from "../pages/demo-inbox.page";
import { ForgotPasswordPage } from "../pages/forgot-password.page";
import { HomePage } from "../pages/home.page";
import { InboxPage } from "../pages/inbox.page";
import { LoginPage } from "../pages/login.page";
import { OrderSuccessPage } from "../pages/order-success.page";
import { ProductPage } from "../pages/product.page";
import { ProfilePage } from "../pages/profile.page";
import { ResetPasswordPage } from "../pages/reset-password.page";
import { createUniqueUserSeed, TestUserSeed } from "../support/test-data-factory";

type Fixtures = {
  apiClient: BackendApiClient;
  loginPage: LoginPage;
  homePage: HomePage;
  productPage: ProductPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  orderSuccessPage: OrderSuccessPage;
  inboxPage: InboxPage;
  demoInboxPage: DemoInboxPage;
  profilePage: ProfilePage;
  forgotPasswordPage: ForgotPasswordPage;
  resetPasswordPage: ResetPasswordPage;
  authFlow: AuthFlow;
  purchaseFlow: PurchaseFlow;
  passwordResetFlow: PasswordResetFlow;
  uniqueUserSeed: TestUserSeed;
};

export const test = base.extend<Fixtures>({
  apiClient: async ({}, use) => {
    const context = await playwrightRequest.newContext({
      baseURL: ENV.apiBaseUrl,
      ignoreHTTPSErrors: true
    });
    await use(new BackendApiClient(context));
    await context.dispose();
  },

  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  homePage: async ({ page }, use) => use(new HomePage(page)),
  productPage: async ({ page }, use) => use(new ProductPage(page)),
  cartPage: async ({ page }, use) => use(new CartPage(page)),
  checkoutPage: async ({ page }, use) => use(new CheckoutPage(page)),
  orderSuccessPage: async ({ page }, use) => use(new OrderSuccessPage(page)),
  inboxPage: async ({ page }, use) => use(new InboxPage(page)),
  demoInboxPage: async ({ page }, use) => use(new DemoInboxPage(page)),
  profilePage: async ({ page }, use) => use(new ProfilePage(page)),
  forgotPasswordPage: async ({ page }, use) => use(new ForgotPasswordPage(page)),
  resetPasswordPage: async ({ page }, use) => use(new ResetPasswordPage(page)),

  authFlow: async ({ page, loginPage }, use) => use(new AuthFlow(page, loginPage)),
  purchaseFlow: async (
    { homePage, cartPage, checkoutPage, orderSuccessPage, inboxPage, profilePage },
    use
  ) => use(new PurchaseFlow(homePage, cartPage, checkoutPage, orderSuccessPage, inboxPage, profilePage)),
  passwordResetFlow: async (
    { forgotPasswordPage, demoInboxPage, resetPasswordPage, loginPage },
    use
  ) => use(new PasswordResetFlow(forgotPasswordPage, demoInboxPage, resetPasswordPage, loginPage)),
  uniqueUserSeed: async ({}, use) => use(createUniqueUserSeed())
});

export { expect };
