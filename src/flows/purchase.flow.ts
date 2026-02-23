import { BILLING, COUPONS, PAYMENT } from "../data/business";
import { USERS } from "../data/users";
import { CartPage } from "../pages/cart.page";
import { CheckoutPage } from "../pages/checkout.page";
import { HomePage } from "../pages/home.page";
import { InboxPage } from "../pages/inbox.page";
import { OrderSuccessPage } from "../pages/order-success.page";
import { ProfilePage } from "../pages/profile.page";

export class PurchaseFlow {
  private readonly homePage: HomePage;
  private readonly cartPage: CartPage;
  private readonly checkoutPage: CheckoutPage;
  private readonly orderSuccessPage: OrderSuccessPage;
  private readonly inboxPage: InboxPage;
  private readonly profilePage: ProfilePage;

  constructor(
    homePage: HomePage,
    cartPage: CartPage,
    checkoutPage: CheckoutPage,
    orderSuccessPage: OrderSuccessPage,
    inboxPage: InboxPage,
    profilePage: ProfilePage
  ) {
    this.homePage = homePage;
    this.cartPage = cartPage;
    this.checkoutPage = checkoutPage;
    this.orderSuccessPage = orderSuccessPage;
    this.inboxPage = inboxPage;
    this.profilePage = profilePage;
  }

  async completeHappyPathCheckout(): Promise<string> {
    await this.homePage.open();
    await this.homePage.addFirstProductToCart();

    await this.cartPage.open();
    await this.cartPage.applyCoupon(COUPONS.valid);
    await this.cartPage.goCheckout();

    await this.checkoutPage.fillBilling(BILLING.name, USERS.standard.email, BILLING.address);
    await this.checkoutPage.fillPayment(PAYMENT.approvedCardNumber, PAYMENT.expiry, PAYMENT.cvv);
    await this.checkoutPage.authorizePayment();
    await this.checkoutPage.placeOrder();

    return this.orderSuccessPage.getOrderId();
  }

  async expectOrderBlockedWithoutAuthorization(): Promise<void> {
    await this.homePage.open();
    await this.homePage.addFirstProductToCart();

    await this.cartPage.open();
    await this.cartPage.goCheckout();

    await this.checkoutPage.fillBilling(BILLING.name, USERS.standard.email, BILLING.address);
    await this.checkoutPage.expectPlaceOrderDisabled();
  }

  async openInvoiceFromInbox(): Promise<void> {
    await this.inboxPage.open();
    await this.inboxPage.openLatestEmail();
    await this.inboxPage.clickFirstLinkInBody();
    await this.profilePage.expectInvoiceVisible();
  }
}
