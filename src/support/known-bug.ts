import { test, TestInfo } from "@playwright/test";
import { KNOWN_BUGS, KnownBug } from "../data/known-bugs";

export const knownBugExpectedFailReason = (bug: KnownBug): string =>
  `Expected to fail due to ${bug.id}: ${bug.title}. Tracker: ${bug.trackerUrl}`;

export const annotateKnownBug = (testInfo: TestInfo, bug: KnownBug): void => {
  testInfo.annotations.push({ type: "bug", description: bug.id });
  testInfo.annotations.push({ type: "issue", description: bug.trackerUrl });
  testInfo.annotations.push({ type: "known-bug", description: bug.title });
};

export const markKnownBugAsExpectedFail = (isAffected: boolean, testInfo: TestInfo, bug: KnownBug): void => {
  if (!isAffected) {
    return;
  }

  annotateKnownBug(testInfo, bug);
  test.fail(true, knownBugExpectedFailReason(bug));
};

export const markKnownBugForBrowser = (
  browserName: string,
  affectedBrowserName: string,
  testInfo: TestInfo,
  bug: KnownBug
): void => {
  markKnownBugAsExpectedFail(browserName === affectedBrowserName, testInfo, bug);
};

export const markWebkitAuthSessionKnownBug = (browserName: string, testInfo: TestInfo): void => {
  markKnownBugForBrowser(browserName, "webkit", testInfo, KNOWN_BUGS.authSessionLostOnWebkit);
};
