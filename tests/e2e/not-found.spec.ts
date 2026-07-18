import { test, expect } from "@playwright/test";

test.describe("Custom 404 page", () => {
  test("shows the custom 404 page with a link back to Home and to Contact", async ({
    page,
  }) => {
    const response = await page.goto("/esta-pagina-no-existe");

    expect(response?.status()).toBe(404);
    await expect(page.locator("h1")).toContainText("404");
    await expect(page.locator('main a[href="/"]')).toBeVisible();
    await expect(page.locator('main a[href="/contacto"]')).toBeVisible();
  });
});
