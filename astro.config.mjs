import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  output: "static",
  // TODO: replace with the real production domain once it's confirmed.
  site: "https://florapastel.com",
  integrations: [sitemap()],
});
