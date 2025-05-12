// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

import sitemap from "@astrojs/sitemap";

import tailwind from "@astrojs/tailwind";
import rehypeCallouts from "rehype-callouts";
import { SITE_URL } from "./src/consts";

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  base: "/",
  integrations: [mdx(), sitemap(), tailwind()],
  markdown: {
    rehypePlugins: [rehypeCallouts],
    shikiConfig: {
      themes: {
        light: 'snazzy-light',
        dark: 'tokyo-night',
      },
    },
  },
});
