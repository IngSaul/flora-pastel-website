import { test, expect } from "@playwright/test";

const categories = [
  { id: "cheesecakes", label: "Cheesecakes" },
  { id: "gelatinas", label: "Gelatinas" },
  { id: "panques", label: "Panqués" },
  { id: "pasteles", label: "Pasteles" },
  { id: "postres", label: "Postres" },
  { id: "sobre-pedido", label: "Sobre Pedido" },
];

const spotChecks = [
  { category: "cheesecakes", name: "Oreo" },
  { category: "gelatinas", name: "Fresa" },
  { category: "panques", name: "Rosca de Naranja" },
  { category: "pasteles", name: "Tres Leches" },
  { category: "postres", name: "Cajetoso de Elote" },
  { category: "sobre-pedido", name: "Panqué de Plátano" },
];

test.describe("Catalog browsing (US1)", () => {
  test("renders all 6 categories with a visible heading", async ({ page }) => {
    await page.goto("/catalogo");
    for (const category of categories) {
      await expect(page.locator(`#${category.id} h2`)).toHaveText(
        category.label,
      );
    }
  });

  test("a category nav link jumps directly to that category's section", async ({
    page,
  }) => {
    await page.goto("/catalogo");
    await page.click('a[href="#gelatinas"]');
    await expect(page).toHaveURL(/#gelatinas$/);
    await expect(page.locator("#gelatinas")).toBeInViewport();
  });

  test("each category shows at least one product with name, photo, and description", async ({
    page,
  }) => {
    await page.goto("/catalogo");
    for (const { category, name } of spotChecks) {
      const card = page.locator(`#${category} .product-card`, {
        hasText: name,
      });
      await expect(card.locator(".product-card__name")).toHaveText(name);
      await expect(card.locator(".product-card__image")).toBeVisible();
      await expect(card.locator(".product-card__description")).not.toBeEmpty();
    }
  });
});
