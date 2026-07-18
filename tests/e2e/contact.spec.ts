import { test, expect, type Page } from "@playwright/test";

async function assertAddressPhoneHours(page: Page) {
  await page.goto("/contacto");

  await expect(page.locator(".business-info__address")).toContainText(
    "Paseo de los Filósofos",
  );
  await expect(page.locator(".business-info__phone")).toContainText(
    "33 1902 7014",
  );
  await expect(page.locator(".business-info__hours")).toContainText(
    "Lunes a sábado",
  );
}

async function assertMapAndDirectionsFallback(page: Page) {
  await page.goto("/contacto");

  await expect(page.locator(".map-embed iframe")).toBeVisible();
  await expect(page.locator(".map-embed__address")).toContainText(
    "Paseo de los Filósofos",
  );

  const directionsHref = await page
    .locator(".map-embed__directions")
    .getAttribute("href");
  expect(directionsHref).toContain("google.com/maps/search");
}

async function assertSocialLinksEverywhere(page: Page) {
  await page.goto("/contacto");

  await expect(
    page.locator("main a[href*='facebook.com']").first(),
  ).toBeVisible();
  await expect(
    page.locator("footer a[href*='facebook.com']").first(),
  ).toBeVisible();
}

test.describe("Contact (US3)", () => {
  test("shows address, phone, and hours of operation", async ({ page }) => {
    await assertAddressPhoneHours(page);
  });

  test("the map renders with an always-visible text address and directions fallback", async ({
    page,
  }) => {
    await assertMapAndDirectionsFallback(page);
  });

  test("social media links are present on the page and in the site-wide footer", async ({
    page,
  }) => {
    await assertSocialLinksEverywhere(page);
  });
});

test.describe("Contact (US3) — JavaScript disabled", () => {
  test.use({ javaScriptEnabled: false });

  test("shows address, phone, and hours of operation", async ({ page }) => {
    await assertAddressPhoneHours(page);
  });

  test("the map renders with an always-visible text address and directions fallback", async ({
    page,
  }) => {
    await assertMapAndDirectionsFallback(page);
  });

  test("social media links are present on the page and in the site-wide footer", async ({
    page,
  }) => {
    await assertSocialLinksEverywhere(page);
  });
});
