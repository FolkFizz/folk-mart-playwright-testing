import { ENV } from "../config/env";

export const COUPONS = {
  valid: ENV.testCouponCode,
  invalid: "INVALID999"
} as const;

export const PAYMENT = {
  approvedCardNumber: "4242 4242 4242 4242",
  declinedCardNumber: "5555 5555 5555 5555",
  insufficientFundsCardNumber: "4000 0000 0000 0000",
  expMonth: "12",
  expYear: "35",
  expiry: "12/35",
  cvv: "123",
  invalidCvv: "12",
  invalidExpiry: "00/20"
} as const;

export const BILLING = {
  name: "QA User",
  address: "123 Test Lane, QA City"
} as const;

export const PASSWORDS = {
  resetTarget: "user123456"
} as const;

export const PRODUCT_IDS = {
  stockEdgeCase: 1
} as const;
