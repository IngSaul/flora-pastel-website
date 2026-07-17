import { test, expect, type Page } from "@playwright/test";

async function assertMultiPresentationProduct(page: Page) {
  await page.goto("/catalogo");
  const oreo = page.locator(
    '.product-card:has(.product-card__name:text-is("Oreo"))',
  );
  const items = oreo.locator(".presentation-list__item");

  await expect(items).toHaveCount(3);
  await expect(items.nth(0)).toContainText("Grande");
  await expect(items.nth(0)).toContainText("12 porciones");
  await expect(items.nth(0)).toContainText("$540");
  await expect(items.nth(1)).toContainText("Mediano");
  await expect(items.nth(1)).toContainText("8 porciones");
  await expect(items.nth(1)).toContainText("$340");
  await expect(items.nth(2)).toContainText("Individual");
  await expect(items.nth(2)).toContainText("$75");
}

async function assertSinglePresentationProduct(page: Page) {
  await page.goto("/catalogo");
  const roscaDeNaranja = page.locator(
    '.product-card:has(.product-card__name:text-is("Rosca de Naranja"))',
  );
  const items = roscaDeNaranja.locator(".presentation-list__item");

  await expect(items).toHaveCount(1);
  await expect(items.first()).toContainText("Rosca");
  await expect(items.first()).toContainText("12 porciones");
  await expect(items.first()).toContainText("$370");
}

async function assertWhatsAppCtaPerPresentation(page: Page) {
  await page.goto("/catalogo");
  const oreo = page.locator(
    '.product-card:has(.product-card__name:text-is("Oreo"))',
  );

  const grandeCta = oreo
    .locator('.presentation-list__item:has-text("Grande")')
    .locator(".whatsapp-cta");
  const grandeHref = await grandeCta.getAttribute("href");
  expect(grandeHref).toContain("https://wa.me/523319027014");
  expect(decodeURIComponent(grandeHref ?? "")).toContain(
    'me interesa el producto "Oreo" (Grande)',
  );

  const individualCta = oreo
    .locator('.presentation-list__item:has-text("Individual")')
    .locator(".whatsapp-cta");
  const individualHref = await individualCta.getAttribute("href");
  expect(decodeURIComponent(individualHref ?? "")).toContain(
    'me interesa el producto "Oreo" (Individual)',
  );
}

test.describe("Presentation pricing & WhatsApp CTA (US2)", () => {
  test("multi-presentation product shows every size and price without interaction", async ({
    page,
  }) => {
    await assertMultiPresentationProduct(page);
  });

  test("single-presentation product renders its one size/price plainly", async ({
    page,
  }) => {
    await assertSinglePresentationProduct(page);
  });

  test("each presentation has its own WhatsApp CTA naming the product and that presentation", async ({
    page,
  }) => {
    await assertWhatsAppCtaPerPresentation(page);
  });
});

test.describe("Presentation pricing & WhatsApp CTA (US2) — JavaScript disabled", () => {
  test.use({ javaScriptEnabled: false });

  test("multi-presentation product shows every size and price without interaction", async ({
    page,
  }) => {
    await assertMultiPresentationProduct(page);
  });

  test("single-presentation product renders its one size/price plainly", async ({
    page,
  }) => {
    await assertSinglePresentationProduct(page);
  });

  test("each presentation has its own WhatsApp CTA naming the product and that presentation", async ({
    page,
  }) => {
    await assertWhatsAppCtaPerPresentation(page);
  });
});
