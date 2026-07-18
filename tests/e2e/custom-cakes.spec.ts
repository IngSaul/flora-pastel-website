import { test, expect, type Page } from "@playwright/test";

async function assertGalleryItemContent(page: Page) {
  await page.goto("/pasteles-personalizados");

  const items = page.locator(".gallery-item");
  await expect(items.first()).toBeVisible();

  const first = items.first();
  await expect(first.locator(".gallery-item__image")).toBeVisible();
  await expect(first.locator(".gallery-item__title")).not.toBeEmpty();
  await expect(first.locator(".gallery-item__description")).not.toBeEmpty();
  await expect(first.locator(".gallery-item__tags li").first()).toBeVisible();
}

async function assertWhatsAppCtaContext(page: Page) {
  await page.goto("/pasteles-personalizados");

  const first = page.locator(".gallery-item").first();
  const title = await first.locator(".gallery-item__title").textContent();
  const href = await first.locator(".whatsapp-cta").getAttribute("href");

  expect(href).toContain("https://wa.me/523319027014");
  expect(decodeURIComponent(href ?? "")).toContain((title ?? "").trim());
}

async function assertNoIntakeForm(page: Page) {
  await page.goto("/pasteles-personalizados");

  await expect(page.locator("form")).toHaveCount(0);
}

test.describe("Custom Cakes gallery (US2)", () => {
  test("renders a gallery of past work, each item with photo, title, description, and tag", async ({
    page,
  }) => {
    await assertGalleryItemContent(page);
  });

  test("an item's WhatsApp CTA identifies the request context", async ({
    page,
  }) => {
    await assertWhatsAppCtaContext(page);
  });

  test("has no structured multi-field intake form, only the WhatsApp CTA", async ({
    page,
  }) => {
    await assertNoIntakeForm(page);
  });
});

test.describe("Custom Cakes gallery (US2) — JavaScript disabled", () => {
  test.use({ javaScriptEnabled: false });

  test("renders a gallery of past work, each item with photo, title, description, and tag", async ({
    page,
  }) => {
    await assertGalleryItemContent(page);
  });

  test("an item's WhatsApp CTA identifies the request context", async ({
    page,
  }) => {
    await assertWhatsAppCtaContext(page);
  });

  test("has no structured multi-field intake form, only the WhatsApp CTA", async ({
    page,
  }) => {
    await assertNoIntakeForm(page);
  });
});
