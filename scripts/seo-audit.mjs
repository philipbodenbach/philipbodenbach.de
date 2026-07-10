#!/usr/bin/env node
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import {
  INDEXABLE_URLS,
  PAGE_PAIRS,
  SITEMAP_URL,
  SITE_URL,
  absoluteUrl,
  alternateLinksFor,
} from "../site.config.mjs";

const baseInput = process.argv[2] ?? process.env.SEO_AUDIT_BASE_URL;
const auditMode = baseInput ? "http" : "dist";
const auditBase = baseInput ? new URL(baseInput) : new URL(SITE_URL);
const distDir = "dist";
const productionOrigin = new URL(SITE_URL).origin;
const productionHost = new URL(SITE_URL).hostname;
const errors = [];
const warnings = [];
const pageHtmlByUrl = new Map();
const responseCache = new Map();

const expectedAlternatesByUrl = new Map();
for (const pageKey of Object.keys(PAGE_PAIRS)) {
  const links = alternateLinksFor(pageKey);
  expectedAlternatesByUrl.set(absoluteUrl(PAGE_PAIRS[pageKey].de.path), links);
  expectedAlternatesByUrl.set(absoluteUrl(PAGE_PAIRS[pageKey].en.path), links);
}

function fail(message) {
  errors.push(message);
}

function warn(message) {
  warnings.push(message);
}

function normalizeBaseUrl(url) {
  const normalized = new URL(url);
  if (!normalized.pathname.endsWith("/")) {
    normalized.pathname += "/";
  }
  return normalized;
}

function auditUrlFor(productionUrlOrPath) {
  const productionUrl = new URL(productionUrlOrPath, SITE_URL);
  const base = normalizeBaseUrl(auditBase);
  return new URL(`${productionUrl.pathname}${productionUrl.search}`, base);
}

function contentTypeFor(pathname) {
  const extension = extname(pathname);

  if (extension === ".html") {
    return "text/html; charset=utf-8";
  }
  if (extension === ".xml") {
    return "application/xml; charset=utf-8";
  }
  if (extension === ".txt" || pathname.endsWith("/_redirects")) {
    return "text/plain; charset=utf-8";
  }
  if (extension === ".png") {
    return "image/png";
  }
  if (extension === ".svg") {
    return "image/svg+xml";
  }
  if (extension === ".ico") {
    return "image/x-icon";
  }

  return "application/octet-stream";
}

function headersFor(pathname) {
  const headers = new Map([["content-type", contentTypeFor(pathname)]]);
  return {
    get(name) {
      return headers.get(name.toLowerCase()) ?? null;
    },
  };
}

function distPathFor(url) {
  const parsed = new URL(url);
  let pathname = decodeURIComponent(parsed.pathname);

  if (pathname.endsWith("/")) {
    pathname = `${pathname}index.html`;
  } else if (!extname(pathname)) {
    pathname = `${pathname}/index.html`;
  }

  const normalized = normalize(pathname).replace(/^(\.\.[/\\])+/, "");
  return join(distDir, normalized);
}

async function readDistResponse(url, label) {
  if (!existsSync(distDir)) {
    fail("dist/ does not exist. Run `npm run build` before `npm run seo:audit`.");
    return undefined;
  }

  const filePath = distPathFor(url);
  if (existsSync(filePath)) {
    return {
      body: await readFile(filePath, "utf8"),
      headers: headersFor(filePath),
      location: null,
      status: 200,
      url: String(url),
    };
  }

  const notFoundPath = join(distDir, "404.html");
  if (!existsSync(notFoundPath)) {
    fail(`${label} returned 404 and dist/404.html is missing`);
    return {
      body: "",
      headers: headersFor("404.html"),
      location: null,
      status: 404,
      url: String(url),
    };
  }

  return {
    body: await readFile(notFoundPath, "utf8"),
    headers: headersFor("404.html"),
    location: null,
    status: 404,
    url: String(url),
  };
}

function decodeXml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'");
}

function textContent(value) {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function extractTags(html, tagName) {
  return html.match(new RegExp(`<${tagName}\\b[^>]*>`, "gi")) ?? [];
}

function parseAttributes(tag) {
  const attributes = {};
  const pattern = /([^\s="'<>/]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/g;
  for (const match of tag.matchAll(pattern)) {
    attributes[match[1].toLowerCase()] = match[2] ?? match[3] ?? match[4] ?? "";
  }
  return attributes;
}

function getLinks(html) {
  return extractTags(html, "link").map(parseAttributes);
}

function getMetas(html) {
  return extractTags(html, "meta").map(parseAttributes);
}

function getAnchors(html) {
  return extractTags(html, "a").map(parseAttributes);
}

function getTitle(html) {
  const match = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
  return match ? textContent(match[1]) : "";
}

function getH1Count(html) {
  return html.match(/<h1\b/gi)?.length ?? 0;
}

function hasId(html, id) {
  const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`\\bid=(["'])${escaped}\\1`, "i").test(html);
}

function extractXmlLocs(xml) {
  return [...xml.matchAll(/<loc>([\s\S]*?)<\/loc>/gi)].map((match) =>
    decodeXml(match[1].trim()),
  );
}

function extractSitemapUrlBlocks(xml) {
  return xml.match(/<url>[\s\S]*?<\/url>/gi) ?? [];
}

function extractSitemapEntry(block) {
  const [loc] = extractXmlLocs(block);
  const links = [...block.matchAll(/<xhtml:link\b[^>]*\/?>/gi)].map((match) => {
    const attributes = parseAttributes(match[0]);
    return {
      hreflang: attributes.hreflang,
      href: attributes.href,
    };
  });
  return { loc, links };
}

function assertProductionUrl(url, label) {
  const parsed = new URL(url);
  if (parsed.protocol !== "https:") {
    fail(`${label} is not HTTPS: ${url}`);
  }
  if (parsed.hostname !== productionHost) {
    fail(`${label} is not on canonical host: ${url}`);
  }
}

async function fetchManual(url, label) {
  const key = String(url);
  if (responseCache.has(key)) {
    return responseCache.get(key);
  }

  if (auditMode === "dist") {
    const result = await readDistResponse(url, label);
    if (result) {
      responseCache.set(key, result);
    }
    return result;
  }

  let response;
  try {
    response = await fetch(url, { redirect: "manual" });
  } catch (error) {
    fail(`${label} could not be fetched: ${error.message}`);
    return undefined;
  }

  const body = await response.text();
  const result = {
    body,
    headers: response.headers,
    location: response.headers.get("location"),
    status: response.status,
    url: String(url),
  };
  responseCache.set(key, result);
  return result;
}

function assertNoRedirect(response, label) {
  if (response.status >= 300 && response.status < 400) {
    fail(`${label} redirects with ${response.status} to ${response.location}`);
  }
}

function assertStatus(response, expectedStatus, label) {
  if (response.status !== expectedStatus) {
    fail(`${label} returned ${response.status}, expected ${expectedStatus}`);
  }
}

function compareLinkSets(actual, expected, label) {
  const actualSet = new Set(
    actual.map((link) => `${link.hreflang}:${link.href}`).sort(),
  );
  const expectedSet = new Set(
    expected.map((link) => `${link.hreflang}:${link.href}`).sort(),
  );

  for (const entry of expectedSet) {
    if (!actualSet.has(entry)) {
      fail(`${label} is missing alternate link ${entry}`);
    }
  }

  for (const entry of actualSet) {
    if (!expectedSet.has(entry)) {
      fail(`${label} has unexpected alternate link ${entry}`);
    }
  }
}

function assertNoMixedOrWwwUrls(html, label) {
  if (html.includes(`www.${productionHost}`)) {
    fail(`${label} contains the legacy host`);
  }

  const httpUrls = [...html.matchAll(/http:\/\/[^\s"'<>]+/gi)].map(
    (match) => match[0],
  );
  for (const url of httpUrls) {
    fail(`${label} contains mixed HTTP URL: ${url}`);
  }
}

function assertStructuredData(html, label) {
  const scripts =
    html.match(
      /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi,
    ) ?? [];

  for (const script of scripts) {
    const json = script
      .replace(/^<script\b[^>]*>/i, "")
      .replace(/<\/script>$/i, "")
      .trim();

    try {
      const parsed = JSON.parse(json);
      const serialized = JSON.stringify(parsed);
      if (serialized.includes(`www.${productionHost}`)) {
        fail(`${label} JSON-LD contains the legacy host`);
      }
      if (serialized.includes("http://")) {
        fail(`${label} JSON-LD contains mixed HTTP URLs`);
      }
    } catch (error) {
      fail(`${label} JSON-LD is invalid: ${error.message}`);
    }
  }
}

async function assertAssetUrl(url, label) {
  assertProductionUrl(url, label);
  const response = await fetchManual(auditUrlFor(url), label);
  if (!response) {
    return;
  }
  assertNoRedirect(response, label);
  assertStatus(response, 200, label);
}

async function auditHtmlPage(productionUrl) {
  const label = productionUrl;
  const response = await fetchManual(auditUrlFor(productionUrl), label);
  if (!response) {
    return;
  }

  assertNoRedirect(response, label);
  assertStatus(response, 200, label);

  const html = response.body;
  pageHtmlByUrl.set(productionUrl, html);
  assertNoMixedOrWwwUrls(html, label);
  assertStructuredData(html, label);

  const title = getTitle(html);
  if (!title) {
    fail(`${label} has no title`);
  }

  const metas = getMetas(html);
  const description = metas.find((meta) => meta.name === "description");
  if (!description?.content?.trim()) {
    fail(`${label} has no meta description`);
  }

  const robots = metas.find((meta) => meta.name === "robots");
  if (robots?.content && /\bnoindex\b/i.test(robots.content)) {
    fail(`${label} is noindex but appears in the sitemap`);
  }
  if (robots?.content && /\bnofollow\b/i.test(robots.content)) {
    fail(`${label} is nofollow but appears in the sitemap`);
  }

  const links = getLinks(html);
  const canonicals = links.filter((link) => link.rel === "canonical");
  if (canonicals.length !== 1) {
    fail(`${label} has ${canonicals.length} canonical links`);
  } else {
    const canonicalHref = canonicals[0].href;
    assertProductionUrl(canonicalHref, `${label} canonical`);
    if (canonicalHref !== productionUrl) {
      fail(`${label} canonical is ${canonicalHref}, expected ${productionUrl}`);
    }
  }

  const hreflangLinks = links
    .filter((link) => link.rel === "alternate" && link.hreflang)
    .map((link) => ({ hreflang: link.hreflang, href: link.href }));
  const expectedAlternates = expectedAlternatesByUrl.get(productionUrl);
  if (!expectedAlternates) {
    fail(`${label} has no expected hreflang mapping`);
  } else {
    compareLinkSets(hreflangLinks, expectedAlternates, `${label} hreflang`);
  }
  for (const link of hreflangLinks) {
    assertProductionUrl(link.href, `${label} hreflang ${link.hreflang}`);
    const target = await fetchManual(auditUrlFor(link.href), `${label} hreflang target`);
    if (target) {
      assertNoRedirect(target, `${label} hreflang target ${link.href}`);
      assertStatus(target, 200, `${label} hreflang target ${link.href}`);
    }
  }

  const h1Count = getH1Count(html);
  if (h1Count !== 1) {
    fail(`${label} has ${h1Count} H1 elements`);
  }

  const ogUrl = metas.find((meta) => meta.property === "og:url");
  if (ogUrl?.content !== productionUrl) {
    fail(`${label} og:url is ${ogUrl?.content ?? "missing"}`);
  }

  const ogImage = metas.find((meta) => meta.property === "og:image");
  if (!ogImage?.content) {
    fail(`${label} has no og:image`);
  } else {
    await assertAssetUrl(ogImage.content, `${label} og:image`);
  }

  const twitterImage = metas.find((meta) => meta.name === "twitter:image");
  if (twitterImage?.content) {
    await assertAssetUrl(twitterImage.content, `${label} twitter:image`);
  }
}

function assertHreflangReciprocity() {
  for (const [sourceUrl, html] of pageHtmlByUrl.entries()) {
    const sourceLinks = getLinks(html)
      .filter((link) => link.rel === "alternate" && link.hreflang !== "x-default")
      .map((link) => ({ hreflang: link.hreflang, href: link.href }));

    for (const link of sourceLinks) {
      const targetHtml = pageHtmlByUrl.get(link.href);
      if (!targetHtml) {
        fail(`${sourceUrl} hreflang target was not loaded: ${link.href}`);
        continue;
      }

      const targetLinks = getLinks(targetHtml).filter(
        (targetLink) =>
          targetLink.rel === "alternate" &&
          targetLink.hreflang !== "x-default" &&
          targetLink.href === sourceUrl,
      );
      if (targetLinks.length === 0) {
        fail(`${sourceUrl} hreflang is not reciprocated by ${link.href}`);
      }
    }
  }
}

async function auditSitemap() {
  const robots = await fetchManual(auditUrlFor("/robots.txt"), "robots.txt");
  if (!robots) {
    return [];
  }
  assertNoRedirect(robots, "robots.txt");
  assertStatus(robots, 200, "robots.txt");
  if (!robots.body.includes(`Sitemap: ${SITEMAP_URL}`)) {
    fail(`robots.txt does not reference ${SITEMAP_URL}`);
  }
  if (/Disallow:/i.test(robots.body)) {
    fail("robots.txt contains Disallow rules");
  }

  const sitemapIndex = await fetchManual(auditUrlFor(SITEMAP_URL), SITEMAP_URL);
  if (!sitemapIndex) {
    return [];
  }
  assertNoRedirect(sitemapIndex, SITEMAP_URL);
  assertStatus(sitemapIndex, 200, SITEMAP_URL);
  if (!/<sitemapindex\b/i.test(sitemapIndex.body)) {
    fail(`${SITEMAP_URL} is not a sitemap index`);
  }
  if (sitemapIndex.body.includes(`www.${productionHost}`)) {
    fail("sitemap index contains the legacy host");
  }

  const childSitemaps = extractXmlLocs(sitemapIndex.body);
  if (childSitemaps.length === 0) {
    fail("sitemap index contains no child sitemaps");
  }

  const sitemapPageUrls = [];
  for (const childUrl of childSitemaps) {
    assertProductionUrl(childUrl, "child sitemap");
    const child = await fetchManual(auditUrlFor(childUrl), childUrl);
    if (!child) {
      continue;
    }
    assertNoRedirect(child, childUrl);
    assertStatus(child, 200, childUrl);
    if (!/<urlset\b/i.test(child.body)) {
      fail(`${childUrl} is not a urlset`);
    }
    if (child.body.includes(`www.${productionHost}`)) {
      fail(`${childUrl} contains the legacy host`);
    }

    for (const block of extractSitemapUrlBlocks(child.body)) {
      const entry = extractSitemapEntry(block);
      if (!entry.loc) {
        fail(`${childUrl} contains a URL entry without loc`);
        continue;
      }
      sitemapPageUrls.push(entry.loc);
      assertProductionUrl(entry.loc, `${childUrl} loc`);

      const expectedAlternates = expectedAlternatesByUrl.get(entry.loc);
      if (expectedAlternates) {
        compareLinkSets(entry.links, expectedAlternates, `${entry.loc} sitemap hreflang`);
      }
    }
  }

  const expected = new Set(INDEXABLE_URLS);
  const actual = new Set(sitemapPageUrls);
  for (const url of expected) {
    if (!actual.has(url)) {
      fail(`sitemap is missing ${url}`);
    }
  }
  for (const url of actual) {
    if (!expected.has(url)) {
      fail(`sitemap contains unexpected URL ${url}`);
    }
  }

  return sitemapPageUrls;
}

async function auditInternalLinks() {
  const checked = new Set();
  for (const [pageUrl, html] of pageHtmlByUrl.entries()) {
    for (const anchor of getAnchors(html)) {
      const href = anchor.href?.trim();
      if (!href || href.startsWith("#")) {
        continue;
      }
      if (/^(mailto|tel|sms|javascript):/i.test(href)) {
        continue;
      }

      let target;
      try {
        target = new URL(href, pageUrl);
      } catch {
        fail(`${pageUrl} contains invalid href: ${href}`);
        continue;
      }

      if (target.protocol === "http:") {
        fail(`${pageUrl} links to mixed HTTP URL: ${href}`);
      }
      if (target.hostname === `www.${productionHost}`) {
        fail(`${pageUrl} links to the legacy host: ${href}`);
      }
      if (target.origin !== productionOrigin) {
        continue;
      }

      const targetWithoutHash = `${target.pathname}${target.search}`;
      const cacheKey = `${targetWithoutHash}${target.hash}`;
      if (!checked.has(targetWithoutHash)) {
        const response = await fetchManual(
          auditUrlFor(targetWithoutHash),
          `${pageUrl} internal link ${href}`,
        );
        if (response) {
          assertNoRedirect(response, `${pageUrl} internal link ${href}`);
          assertStatus(response, 200, `${pageUrl} internal link ${href}`);
          if (target.hash && /^text\/html\b/i.test(response.headers.get("content-type") ?? "")) {
            const id = decodeURIComponent(target.hash.slice(1));
            if (id && !hasId(response.body, id)) {
              fail(`${pageUrl} links to missing anchor ${target.hash} on ${targetWithoutHash}`);
            }
          }
        }
        checked.add(targetWithoutHash);
      } else if (target.hash && !checked.has(cacheKey)) {
        const response = await fetchManual(
          auditUrlFor(targetWithoutHash),
          `${pageUrl} internal link ${href}`,
        );
        if (response && /^text\/html\b/i.test(response.headers.get("content-type") ?? "")) {
          const id = decodeURIComponent(target.hash.slice(1));
          if (id && !hasId(response.body, id)) {
            fail(`${pageUrl} links to missing anchor ${target.hash} on ${targetWithoutHash}`);
          }
        }
      }
      checked.add(cacheKey);
    }
  }
}

async function audit404() {
  const response = await fetchManual(
    auditUrlFor("/this-page-should-not-exist-for-seo-audit/"),
    "404 check",
  );
  if (!response) {
    return;
  }
  assertStatus(response, 404, "404 check");
  const robots = getMetas(response.body).find((meta) => meta.name === "robots");
  if (robots?.content !== "noindex, follow") {
    fail(`404 robots meta is ${robots?.content ?? "missing"}`);
  }
  const canonicals = getLinks(response.body).filter((link) => link.rel === "canonical");
  if (canonicals.length > 0) {
    fail("404 page contains a canonical link");
  }
}

async function auditRedirectFile() {
  const redirectFile = existsSync("dist/_redirects")
    ? "dist/_redirects"
    : existsSync("public/_redirects")
      ? "public/_redirects"
      : undefined;

  if (!redirectFile) {
    fail("No Netlify _redirects file found");
    return;
  }

  const redirects = await readFile(redirectFile, "utf8");
  const firstRule = redirects
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find((line) => line && !line.startsWith("#"));
  const expectedRule = `https://www.${productionHost}/* ${SITE_URL}/:splat 301!`;
  if (firstRule !== expectedRule) {
    fail(`First _redirects rule is ${firstRule}, expected ${expectedRule}`);
  }
}

const sitemapUrls = await auditSitemap();
for (const url of sitemapUrls) {
  await auditHtmlPage(url);
}
assertHreflangReciprocity();
await auditInternalLinks();
await audit404();
await auditRedirectFile();

for (const warning of warnings) {
  console.warn(`WARN ${warning}`);
}

if (errors.length > 0) {
  console.error(`SEO audit failed with ${errors.length} issue(s):`);
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(`SEO audit passed for ${sitemapUrls.length} indexable page(s).`);
