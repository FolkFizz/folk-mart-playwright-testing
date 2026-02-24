import { BackendApiClient } from "../api/backend-api.client";
import { BILLING, PAYMENT } from "../data/business";
import { USERS } from "../data/users";
import { ProfilePage } from "../pages/profile.page";
import { AuthFlow } from "./auth.flow";

export class OrdersIntegrationFlow {
  private readonly apiClient: BackendApiClient;
  private readonly authFlow: AuthFlow;
  private readonly profilePage: ProfilePage;

  constructor(apiClient: BackendApiClient, authFlow: AuthFlow, profilePage: ProfilePage) {
    this.apiClient = apiClient;
    this.authFlow = authFlow;
    this.profilePage = profilePage;
  }

  private async createOrderViaApiForStandardUser(): Promise<string> {
    await this.apiClient.login(USERS.standard.username, USERS.standard.password);
    const productId = await this.apiClient.getFirstInStockProductId();
    await this.apiClient.addCartItem(productId, 1);

    const authorization = await this.apiClient.authorizePayment({
      cardNumber: PAYMENT.approvedCardNumber,
      expMonth: PAYMENT.expMonth,
      expYear: PAYMENT.expYear,
      cvv: PAYMENT.cvv
    });

    const order = await this.apiClient.placeOrder({
      paymentToken: authorization.token,
      name: BILLING.name,
      email: USERS.standard.email,
      address: BILLING.address
    });

    return String(order.orderId);
  }

  async expectApiCreatedOrderVisibleInProfileInvoice(): Promise<void> {
    const orderId = await this.createOrderViaApiForStandardUser();
    await this.authFlow.loginAsStandardUser();
    await this.profilePage.openOrdersTab();
    await this.profilePage.expectOrderVisible(orderId);
    await this.profilePage.openInvoiceForOrder(orderId);
    await this.profilePage.expectInvoiceVisible();
  }

  async expectInvalidInvoiceDeepLinkDoesNotOpen(): Promise<void> {
    await this.authFlow.loginAsStandardUser();
    await this.profilePage.openOrdersTabWithInvoice("ORD-UNKNOWN-INVOICE");
    await this.profilePage.expectInvoiceHidden();
  }

  async expectExistingInvoiceDeepLinkOpens(): Promise<void> {
    const orderId = await this.createOrderViaApiForStandardUser();
    await this.authFlow.loginAsStandardUser();
    await this.profilePage.openOrdersTabWithInvoice(orderId);
    await this.profilePage.expectInvoiceVisible();
  }
}
