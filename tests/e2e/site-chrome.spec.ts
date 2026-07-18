import { test, expect, type Page } from "@playwright/test";

const pages = ["/", "/catalogo", "/pasteles-personalizados", "/contacto"];

async function assertChromePresent(page: Page, path: string) {
  await page.goto(path);

  const nav = page.locator(".site-nav");
  await expect(nav).toBeVisible();
  await expect(nav.locator('a[href="/"]')).toBeVisible();
  await expect(nav.locator('a[href="/catalogo"]')).toBeVisible();
  await expect(nav.locator('a[href="/pasteles-personalizados"]')).toBeVisible();
  await expect(nav.locator('a[href="/contacto"]')).toBeVisible();

  const footer = page.locator(".site-footer");
  await expect(footer).toBeVisible();
}

test.describe("Site-wide chrome (nav & footer)", () => {
  for (const path of pages) {
    test(`renders the site nav and footer on ${path}`, async ({ page }) => {
      await assertChromePresent(page, path);
    });
  }
});

test.describe("Site-wide chrome (nav & footer) — JavaScript disabled", () => {
  test.use({ javaScriptEnabled: false });

  for (const path of pages) {
    test(`renders the site nav and footer on ${path}`, async ({ page }) => {
      await assertChromePresent(page, path);
    });
  }
});
