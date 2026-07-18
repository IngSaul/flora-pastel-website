import { test, expect, type Page } from "@playwright/test";

async function assertHeroVisibleWithoutScrolling(page: Page) {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto("/");

  await expect(page.locator(".hero h1")).toContainText("Flora Pastel");
  await expect(page.locator(".hero .whatsapp-cta")).toBeInViewport();
}

async function assertOfferingsLinks(page: Page) {
  await page.goto("/");

  await expect(page.locator('main a[href="/catalogo"]').first()).toBeVisible();
  await expect(
    page.locator('main a[href="/pasteles-personalizados"]').first(),
  ).toBeVisible();
}

async function assertCatalogLinkKeepsChrome(page: Page) {
  await page.goto("/");
  await page.locator('main a[href="/catalogo"]').first().click();

  await expect(page).toHaveURL(/\/catalogo\/?$/);
  await expect(page.locator(".site-nav")).toBeVisible();
  await expect(page.locator(".site-footer")).toBeVisible();
}

async function assertHeroWhatsAppCta(page: Page) {
  await page.goto("/");

  const href = await page.locator(".hero .whatsapp-cta").getAttribute("href");
  expect(href).toContain("https://wa.me/523319027014");
  expect(decodeURIComponent(href ?? "")).toContain("Hola");
}

test.describe("Home (US1)", () => {
  test("hero communicates the brand and a WhatsApp CTA is visible without scrolling on mobile", async ({
    page,
  }) => {
    await assertHeroVisibleWithoutScrolling(page);
  });

  test("the page introduces and links to the catalog and custom-cake offerings", async ({
    page,
  }) => {
    await assertOfferingsLinks(page);
  });

  test("following the catalog link lands on a page with the same site-wide nav and footer", async ({
    page,
  }) => {
    await assertCatalogLinkKeepsChrome(page);
  });

  test("the hero WhatsApp CTA opens a pre-filled conversation", async ({
    page,
  }) => {
    await assertHeroWhatsAppCta(page);
  });
});

test.describe("Home (US1) — JavaScript disabled", () => {
  test.use({ javaScriptEnabled: false });

  test("hero communicates the brand and a WhatsApp CTA is visible without scrolling on mobile", async ({
    page,
  }) => {
    await assertHeroVisibleWithoutScrolling(page);
  });

  test("the page introduces and links to the catalog and custom-cake offerings", async ({
    page,
  }) => {
    await assertOfferingsLinks(page);
  });

  test("following the catalog link lands on a page with the same site-wide nav and footer", async ({
    page,
  }) => {
    await assertCatalogLinkKeepsChrome(page);
  });

  test("the hero WhatsApp CTA opens a pre-filled conversation", async ({
    page,
  }) => {
    await assertHeroWhatsAppCta(page);
  });
});
