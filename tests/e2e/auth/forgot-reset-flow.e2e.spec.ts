import { test } from "../../../src/fixtures/test-fixtures";

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
});
