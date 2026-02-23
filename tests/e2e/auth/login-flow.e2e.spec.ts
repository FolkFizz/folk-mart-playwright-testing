import { test } from "../../../src/fixtures/test-fixtures";
import { USERS } from "../../../src/data/users";

test.describe("AUTH :: E2E", () => {
  test.describe("positive cases", () => {
    test(
      "AUTHE2E-P01: valid user can login successfully @e2e @smoke @critical @safe @auth",
      async ({ authFlow }) => {
        await authFlow.loginWithCredentials(USERS.standard.username, USERS.standard.password);
      }
    );
  });

  test.describe("negative cases", () => {
    test(
      "AUTHE2E-N01: invalid credentials are rejected with visible feedback @e2e @regression @safe @auth",
      async ({ authFlow }) => {
        await authFlow.attemptLogin(USERS.invalid.username, USERS.invalid.password);
        await authFlow.expectLoginRejected();
      }
    );
  });
});
