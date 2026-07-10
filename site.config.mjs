export const SITE_URL = "https://philipbodenbach.de";
export const SITEMAP_INDEX_PATH = "/sitemap-index.xml";
export const SITEMAP_URL = new URL(SITEMAP_INDEX_PATH, SITE_URL).toString();
export const OG_IMAGE_URL = new URL(
  "/og/philip-bodenbach-og.png",
  SITE_URL,
).toString();
export const LOGO_IMAGE_URL = new URL(
  "/pb_Logos_schwarz.png",
  SITE_URL,
).toString();
export const PERSON_ID = new URL("/#person", SITE_URL).toString();

export const PAGE_PAIRS = {
  home: {
    xDefault: "de",
    de: { path: "/", hreflang: "de" },
    en: { path: "/en/", hreflang: "en" },
  },
  imprint: {
    xDefault: "de",
    de: { path: "/impressum/", hreflang: "de" },
    en: { path: "/en/imprint/", hreflang: "en" },
  },
  privacy: {
    xDefault: "de",
    de: { path: "/datenschutz/", hreflang: "de" },
    en: { path: "/en/privacy/", hreflang: "en" },
  },
};

export function absoluteUrl(pathname = "/") {
  return new URL(pathname, SITE_URL).toString();
}

export function alternateLinksFor(pageKey) {
  const pagePair = PAGE_PAIRS[pageKey];

  if (!pagePair) {
    throw new Error(`Unknown page pair: ${pageKey}`);
  }

  return [
    { hreflang: pagePair.de.hreflang, href: absoluteUrl(pagePair.de.path) },
    { hreflang: pagePair.en.hreflang, href: absoluteUrl(pagePair.en.path) },
    {
      hreflang: "x-default",
      href: absoluteUrl(pagePair[pagePair.xDefault].path),
    },
  ];
}

export const INDEXABLE_PATHS = Object.values(PAGE_PAIRS).flatMap((pagePair) => [
  pagePair.de.path,
  pagePair.en.path,
]);

export const INDEXABLE_URLS = INDEXABLE_PATHS.map((pathname) =>
  absoluteUrl(pathname),
);

export function sitemapLinksForUrl(url) {
  const pagePair = Object.values(PAGE_PAIRS).find((candidate) =>
    [candidate.de.path, candidate.en.path].some(
      (pathname) => absoluteUrl(pathname) === url,
    ),
  );

  if (!pagePair) {
    return undefined;
  }

  return [
    { lang: pagePair.de.hreflang, url: absoluteUrl(pagePair.de.path) },
    { lang: pagePair.en.hreflang, url: absoluteUrl(pagePair.en.path) },
    { lang: "x-default", url: absoluteUrl(pagePair[pagePair.xDefault].path) },
  ];
}
