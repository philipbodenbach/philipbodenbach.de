// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { INDEXABLE_URLS, SITE_URL, sitemapLinksForUrl } from './site.config.mjs';

const indexableUrls = new Set(INDEXABLE_URLS);

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'always',
  i18n: {
    locales: ['de', 'en'],
    defaultLocale: 'de',
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      filter: (page) => indexableUrls.has(page),
      namespaces: {
        news: false,
        image: false,
        video: false,
        xhtml: true,
      },
      serialize(item) {
        return {
          ...item,
          links: sitemapLinksForUrl(item.url),
        };
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
