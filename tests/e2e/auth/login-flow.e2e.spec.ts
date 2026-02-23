import { test } from "../../../src/fixtures/test-fixtures";
import { TAGS, tags } from "../../../src/data/tags";
import { USERS } from "../../../src/data/users";

test(
  `User can login with valid credentials ${tags(
    TAGS.testType.e2e,
    TAGS.executionScope.smoke,
    TAGS.executionScope.critical,
    TAGS.caseStyle.positive,
    TAGS.dataImpact.safe,
    TAGS.businessArea.auth,
    TAGS.owner.folk
  )}`,
  async ({ authFlow }) => {
    await authFlow.loginWithCredentials(USERS.standard.username, USERS.standard.password);
  }
);

test(
  `User cannot login with invalid credentials ${tags(
    TAGS.testType.e2e,
    TAGS.executionScope.regression,
    TAGS.caseStyle.negative,
    TAGS.dataImpact.safe,
    TAGS.businessArea.auth,
    TAGS.owner.folk
  )}`,
  async ({ authFlow }) => {
    await authFlow.attemptLogin(USERS.invalid.username, USERS.invalid.password);
    await authFlow.expectLoginRejected();
  }
);
