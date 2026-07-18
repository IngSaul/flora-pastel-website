import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const pages = ["/", "/catalogo", "/pasteles-personalizados", "/contacto"];

test.describe("Accessibility (WCAG AA)", () => {
  for (const path of pages) {
    test(`${path} has no serious or critical accessibility violations`, async ({
      page,
    }) => {
      await page.goto(path);
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
  }
});
