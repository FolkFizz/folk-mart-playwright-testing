import { PASSWORDS } from "../../../src/data/business";
import { expect, test } from "../../../src/fixtures/test-fixtures";

test.describe("AUTH RESET :: E2E", () => {
  test.describe("positive cases", () => {
    test(
      "AUTHRESETE2E-P01: user can reset password from demo inbox and login with new password @e2e @critical @seeded @destructive @auth",
      async ({ apiClient, uniqueUserSeed, passwordResetFlow, authFlow }) => {
        await apiClient.post("/api/auth/register", {
          body: {
            username: uniqueUserSeed.username,
            email: uniqueUserSeed.email,
            password: uniqueUserSeed.password,
            confirmPassword: uniqueUserSeed.password
          },
          expectedStatus: 201
        });

        await passwordResetFlow.requestAndResetPasswordFor(uniqueUserSeed.email, `${uniqueUserSeed.password}9`);
        await authFlow.loginWithCredentials(uniqueUserSeed.username, `${uniqueUserSeed.password}9`);
      }
    );
  });

  test.describe("negative cases", () => {
    test(
      "AUTHRESETE2E-N01: invalid reset token shows rejected state @e2e @regression @safe @auth",
      async ({ page }) => {
        await page.goto("/reset-password/invalid-token-for-testing", { waitUntil: "domcontentloaded" });
        await expect(page.getByText(/reset token is invalid or expired/i)).toBeVisible();
      }
    );
  });

  test.describe("edge cases", () => {
    test(
      "AUTHRESETE2E-E01: reset works with minimum accepted password length @e2e @regression @seeded @destructive @auth",
      async ({ apiClient, uniqueUserSeed, passwordResetFlow, authFlow }) => {
        await apiClient.post("/api/auth/register", {
          body: {
            username: uniqueUserSeed.username,
            email: uniqueUserSeed.email,
            password: uniqueUserSeed.password,
            confirmPassword: uniqueUserSeed.password
          },
          expectedStatus: 201
        });

        await passwordResetFlow.requestAndResetPasswordFor(uniqueUserSeed.email, PASSWORDS.minimumAccepted);
        await authFlow.loginWithCredentials(uniqueUserSeed.username, PASSWORDS.minimumAccepted);
      }
    );
  });
});
