import { test, expect, type Page } from "@playwright/test";

async function assertCategoryLevelNotice(page: Page) {
  await page.goto("/catalogo");
  const section = page.locator("#sobre-pedido");
  await expect(section.locator(".sobre-pedido-notice").first()).toContainText(
    "3 días",
  );
}

async function assertProductLevelNotice(page: Page) {
  await page.goto("/catalogo");
  const product = page.locator(
    '#sobre-pedido .product-card:has(.product-card__name:text-is("Panqué de Plátano"))',
  );
  await expect(product.locator(".sobre-pedido-notice")).toContainText("3 días");
}

async function assertWhatsAppCtaReflectsLeadTime(page: Page) {
  await page.goto("/catalogo");
  const product = page.locator(
    '#sobre-pedido .product-card:has(.product-card__name:text-is("Panqué de Plátano"))',
  );
  const cta = product.locator(".whatsapp-cta").first();
  const href = await cta.getAttribute("href");
  expect(decodeURIComponent(href ?? "")).toContain(
    "Entiendo que es sobre pedido",
  );
}

test.describe("Sobre Pedido lead time (US3)", () => {
  test("the Sobre Pedido category itself is labeled as made-to-order", async ({
    page,
  }) => {
    await assertCategoryLevelNotice(page);
  });

  test("each Sobre Pedido product shows the advance-notice text", async ({
    page,
  }) => {
    await assertProductLevelNotice(page);
  });

  test("the WhatsApp CTA message reflects the made-to-order expectation", async ({
    page,
  }) => {
    await assertWhatsAppCtaReflectsLeadTime(page);
  });
});

test.describe("Sobre Pedido lead time (US3) — JavaScript disabled", () => {
  test.use({ javaScriptEnabled: false });

  test("the Sobre Pedido category itself is labeled as made-to-order", async ({
    page,
  }) => {
    await assertCategoryLevelNotice(page);
  });

  test("each Sobre Pedido product shows the advance-notice text", async ({
    page,
  }) => {
    await assertProductLevelNotice(page);
  });

  test("the WhatsApp CTA message reflects the made-to-order expectation", async ({
    page,
  }) => {
    await assertWhatsAppCtaReflectsLeadTime(page);
  });
});
