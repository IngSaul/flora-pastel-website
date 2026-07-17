import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Accessibility (WCAG AA)", () => {
  test("catalog page has no serious or critical accessibility violations", async ({
    page,
  }) => {
    await page.goto("/catalogo");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    const seriousOrCritical = results.violations.filter(
      (violation) =>
        violation.impact === "serious" || violation.impact === "critical",
    );

    expect(
      seriousOrCritical,
      JSON.stringify(seriousOrCritical, null, 2),
    ).toEqual([]);
  });
});
