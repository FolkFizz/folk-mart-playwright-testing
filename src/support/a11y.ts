import AxeBuilder from "@axe-core/playwright";
import { expect, Page } from "@playwright/test";

export const expectNoSeriousA11yViolations = async (page: Page): Promise<void> => {
  const report = await new AxeBuilder({ page }).analyze();
  const seriousViolations = report.violations.filter((violation) => {
    const impact = String(violation.impact || "").toLowerCase();
    return impact === "serious" || impact === "critical";
  });

  expect(seriousViolations, JSON.stringify(seriousViolations, null, 2)).toEqual([]);
};
