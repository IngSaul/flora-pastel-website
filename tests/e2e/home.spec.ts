import { test, expect } from "@playwright/test";

test.describe("Home (US1)", () => {
  test("hero communicates the brand and a WhatsApp CTA is visible without scrolling on mobile", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    await expect(page.locator(".hero h1")).toContainText("Flora Pastel");
    await expect(page.locator(".hero .whatsapp-cta")).toBeInViewport();
  });

  test("the page introduces and links to the catalog and custom-cake offerings", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(
      page.locator('main a[href="/catalogo"]').first(),
    ).toBeVisible();
    await expect(
      page.locator('main a[href="/pasteles-personalizados"]').first(),
    ).toBeVisible();
  });

  test("following the catalog link lands on a page with the same site-wide nav and footer", async ({
    page,
  }) => {
    await page.goto("/");
    await page.locator('main a[href="/catalogo"]').first().click();

    await expect(page).toHaveURL(/\/catalogo\/?$/);
    await expect(page.locator(".site-nav")).toBeVisible();
    await expect(page.locator(".site-footer")).toBeVisible();
  });

  test("the hero WhatsApp CTA opens a pre-filled conversation", async ({
    page,
  }) => {
    await page.goto("/");

    const href = await page.locator(".hero .whatsapp-cta").getAttribute("href");
    expect(href).toContain("https://wa.me/523319027014");
    expect(decodeURIComponent(href ?? "")).toContain("Hola");
  });
});
