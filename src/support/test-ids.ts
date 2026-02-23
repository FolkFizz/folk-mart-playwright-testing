export const TEST_IDS = {
  nav: {
    home: "nav-home",
    cart: "nav-cart",
    profile: "nav-profile",
    inbox: "nav-inbox",
    demoInbox: "nav-demo-inbox",
    login: "nav-login",
    logout: "nav-logout"
  },
  auth: {
    loginUsername: "login-username-input",
    loginPassword: "login-password-input",
    loginSubmit: "login-submit-btn",
    forgotEmail: "forgot-email-input",
    forgotSubmit: "forgot-submit-btn",
    resetPassword: "reset-password-input",
    resetConfirmPassword: "reset-confirm-password-input",
    resetSubmit: "reset-submit-btn"
  },
  catalog: {
    grid: "product-grid",
    addToCartButton: "add-to-cart-btn",
    sortSelect: "sort-select",
    searchInput: "search-input"
  },
  product: {
    detail: "product-detail",
    add: "product-add-btn",
    qtyIncrease: "product-quantity-increase-btn",
    qtyDecrease: "product-quantity-decrease-btn",
    qtyValue: "product-quantity-input"
  },
  cart: {
    empty: "cart-empty",
    checkout: "checkout-btn",
    couponInput: "coupon-input",
    applyCoupon: "apply-coupon-btn",
    couponBadge: "coupon-badge",
    totals: "cart-totals",
    qtyIncrease: "cart-qty-increase-btn",
    qtyDecrease: "cart-qty-decrease-btn"
  },
  checkout: {
    name: "checkout-name-input",
    email: "checkout-email-input",
    address: "checkout-address-input",
    cardNumber: "card-number-input",
    cardExpiry: "card-expiry-input",
    cardCvv: "card-cvv-input",
    authorize: "authorize-payment-btn",
    placeOrder: "place-order-btn",
    cardNumberError: "card-number-error",
    cardExpiryError: "card-expiry-error",
    cardCvvError: "card-cvv-error"
  },
  order: {
    successPage: "order-success-page",
    orderId: "order-id",
    goProfileOrders: "go-profile-orders-btn"
  },
  profile: {
    tabOrders: "profile-tab-orders",
    invoicePanel: "invoice-panel"
  },
  inbox: {
    detail: "inbox-detail",
    boxInbox: "inbox-box-inbox",
    boxTrash: "inbox-box-trash"
  },
  demoInbox: {
    detail: "demo-inbox-detail"
  },
  shared: {
    flashMessage: "flash-message"
  }
} as const;
