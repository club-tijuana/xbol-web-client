import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("homepage package catalog requests only buyable basic bundles", () => {
  const source = readFileSync("src/app/page.tsx", "utf8");
  const homepageCatalogCall = source.slice(source.indexOf("getEventCatalog({"));

  assert.match(homepageCatalogCall, /bundleType:\s*BundleType\.Basic/);
  assert.match(homepageCatalogCall, /buyableOnly:\s*true/);
});

test("event catalog filters include buyableOnly", () => {
  const source = readFileSync("src/models/filters/event-catalog-filters.dto.ts", "utf8");

  assert.match(source, /buyableOnly\?:\s*boolean/);
});

test("season banner routes renewal bundles to renovation", () => {
  const source = readFileSync("src/components/SeasonBanner/SeasonBanner.tsx", "utf8");

  assert.match(source, /bundleBanner\.isRenewal/);
  assert.match(source, /bundleBanner\.relatedOrderId/);
  assert.match(source, /\/season\/renovation\/\$\{bundleBanner\.relatedOrderId\}/);
});
