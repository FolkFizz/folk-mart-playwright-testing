import AxeBuilder from "@axe-core/playwright";
import { expect, Page, TestInfo } from "@playwright/test";

export const expectNoSeriousA11yViolations = async (page: Page, testInfo?: TestInfo): Promise<void> => {
  const report = await new AxeBuilder({ page }).analyze();
  const seriousViolations = report.violations.filter((violation) => {
    const impact = String(violation.impact || "").toLowerCase();
    return impact === "serious" || impact === "critical";
  });

  if (testInfo && seriousViolations.length > 0) {
    await testInfo.attach("a11y-serious-violations.json", {
      body: Buffer.from(JSON.stringify(seriousViolations, null, 2), "utf8"),
      contentType: "application/json"
    });
  }

  expect(seriousViolations, JSON.stringify(seriousViolations, null, 2)).toEqual([]);
};
