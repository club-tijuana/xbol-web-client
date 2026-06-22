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
  const source = readFileSync(
    "src/models/filters/event-catalog-filters.dto.ts",
    "utf8",
  );

  assert.match(source, /buyableOnly\?:\s*boolean/);
});

test("season banner routes renewal bundles to renovation flow", () => {
  const source = readFileSync(
    "src/components/SeasonBanner/SeasonBanner.tsx",
    "utf8",
  );

  assert.match(source, /bundleBanner\.isRenewal/);
  assert.match(source, /router\.push\(`\/season\/renovation\/\$\{bundleBanner\.relatedOrderId\}`\)/);
  assert.doesNotMatch(
    source,
    /\(bundleBanner\.isRenewal \|\| bundleBanner\.isPreSale\) && bundleBanner\.relatedOrderId/,
  );
});

test("season booking route waits for an available season before mounting purchase controls", () => {
  const source = readFileSync(
    "src/app/booking/components/BookingSeasonClient/BookingSeasonClient.tsx",
    "utf8",
  );

  assert.match(source, /throw new Error\("La temporada no está disponible para compra\."\)/);
  assert.match(source, /season && bookingStep === "selection"/);
  assert.match(source, /season &&\s*<BookingRightPanel/);
  assert.match(source, /season && bookingStep !== "payment"/);
});
