import dotenv from "dotenv";

dotenv.config({ quiet: true });

const readString = (value: string | undefined, fallback: string): string => {
  const next = String(value || "").trim();
  return next || fallback;
};

const readBoolean = (value: string | undefined, fallback = false): boolean => {
  const normalized = String(value || "").trim().toLowerCase();
  if (!normalized) return fallback;
  return ["1", "true", "yes", "on"].includes(normalized);
};

export const ENV = Object.freeze({
  appBaseUrl: readString(process.env.APP_BASE_URL, "http://localhost:5173"),
  apiBaseUrl: readString(process.env.API_BASE_URL, "http://localhost:3000"),
  testApiKey: readString(process.env.TEST_API_KEY, "dev_only_test_api_key"),
  testUserUsername: readString(process.env.TEST_USER_USERNAME, "user"),
  testUserPassword: readString(process.env.TEST_USER_PASSWORD, "user123"),
  testUserEmail: readString(process.env.TEST_USER_EMAIL, "user@folkmart.com"),
  testCouponCode: readString(process.env.TEST_COUPON_CODE, "WELCOME10"),
  allowTestControlApi: readBoolean(process.env.ALLOW_TEST_CONTROL_API, false)
});
