import { test } from "../../../src/fixtures/test-fixtures";
import { TAGS, tags } from "../../../src/data/tags";

test(
  `User can reset password via demo inbox and login ${tags(
    TAGS.testType.e2e,
    TAGS.executionScope.critical,
    TAGS.caseStyle.positive,
    TAGS.dataImpact.seeded,
    TAGS.dataImpact.destructive,
    TAGS.businessArea.auth,
    TAGS.owner.folk
  )}`,
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
