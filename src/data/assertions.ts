export const API_MESSAGE_PATTERNS = Object.freeze({
  invalidCredentials: /invalid/i,
  couponError: /coupon/i,
  authenticationRequired: /authentication required/i,
  corsOriginNotAllowed: /origin not allowed by cors/i
});

export const CHECKOUT_ERROR_PATTERNS = Object.freeze({
  paymentAuthorizationRequired: /authorize/i,
  cardDeclined: /declined/i,
  expiryFormat: /mm\/yy/i
});

export const UI_MESSAGE_PATTERNS = Object.freeze({
  invalidCredentials: /invalid/i,
  resetTokenInvalidOrExpired: /reset token is invalid or expired/i,
  stockLimitReached: /stock limit/i
});
