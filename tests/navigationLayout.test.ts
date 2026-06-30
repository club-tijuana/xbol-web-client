import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path: string) => readFileSync(path, "utf8");

test("header owns fixed header offset and Vender coming-soon behavior", () => {
  const source = read("src/components/Header/Header.tsx");
  const globals = read("src/styles/globals.scss");

  assert.match(source, /const HEADER_HEIGHT/);
  assert.match(source, /position="fixed"/);
  assert.match(source, /aria-hidden="true"/);
  assert.match(source, /height:\s*HEADER_HEIGHT/);
  assert.doesNotMatch(source, /\/no-content/);
  assert.match(source, /title:\s*"Vender"[\s\S]*isComingSoon:\s*true/);
  assert.match(source, /title="Próximamente"/);
  assert.doesNotMatch(globals, /nav\s*\{[\s\S]*position:\s*relative\s*!important/);
});

test("ticket sell actions are visible but disabled as coming soon", () => {
  const ticketActionPaths = [
    "src/app/account/tickets/order/[orderId]/event/[eventId]/components/TicketQRGridItem/TicketQRGridItem.tsx",
    "src/app/account/tickets/order/[orderId]/event/[eventId]/components/CarouselSlideQRTickets/CarouselSlideQRTicket.tsx",
  ];

  for (const path of ticketActionPaths) {
    const source = read(path);

    assert.match(source, /title="Próximamente"/, path);
    assert.match(source, /aria-label="Vender"/, path);
    assert.match(source, /\bdisabled\b/, path);
  }
});

test("pages do not compensate for the fixed header with large top margins", () => {
  const pagePaths = [
    "src/app/account/tickets/page.tsx",
    "src/app/account/favourites/components/FavouritesClientWrapper/FavouritesClientWrapper.tsx",
    "src/app/event/page.tsx",
    "src/app/booking/components/BookingClient/BookingClient.tsx",
    "src/app/booking/components/BookingSeasonClient/BookingSeasonClient.tsx",
    "src/app/account/tickets/order/[orderId]/success/components/SuccessClient/SuccessClient.tsx",
    "src/app/account/tickets/order/[orderId]/event/[eventId]/components/TicketPageClient/TicketPageClient.tsx",
  ];

  for (const path of pagePaths) {
    const source = read(path);

    assert.doesNotMatch(source, /mt=\{20\}/, path);
    assert.doesNotMatch(source, /mt:\s*20/, path);
  }
});

test("otros eventos sections render only when trending events exist", () => {
  const guardedPages = [
    "src/app/account/tickets/page.tsx",
    "src/app/event/[id]/page.tsx",
    "src/app/account/tickets/order/[orderId]/success/page.tsx",
  ];

  for (const path of guardedPages) {
    const source = read(path);
    const otrosEventosIndex = source.indexOf("Otros eventos");
    const beforeSection = source.slice(Math.max(0, otrosEventosIndex - 800), otrosEventosIndex);

    assert.notEqual(otrosEventosIndex, -1, path);
    assert.match(beforeSection, /trendingEventsVM\.length > 0 && \(/, path);
  }
});

test("fallback home hero fills the viewport below the fixed header without letterboxing", () => {
  const source = read("src/components/EventCarousel/EventCarousel.tsx");
  const styles = read("src/components/EventCarousel/EventCarousel.module.scss");

  assert.match(source, /const FALLBACK_HERO_HEIGHT\s*=\s*"calc\(100dvh - 96px\)"/);
  assert.match(source, /height:\s*FALLBACK_HERO_HEIGHT/);
  assert.match(source, /mediaUrl\(event\.media\?\.banner\) \|\| event\.bannerImageUrl\?\.trim\(\)/);
  assert.match(source, /usesLandingFallbackImage\s*=\s*!eventHeroImageUrl && !!fallbackImageUrl\?\.trim\(\)/);
  assert.match(source, /height:\s*usesLandingFallbackImage \? FALLBACK_HERO_HEIGHT : undefined/);
  assert.match(source, /aspectRatio:\s*usesLandingFallbackImage\s*\?\s*undefined/);
  assert.match(source, /alt="Próximos eventos"[\s\S]*className=\{styles\.image\}/);
  assert.doesNotMatch(source, /styles\.fallbackImage/);
  assert.doesNotMatch(styles, /\.fallbackImage/);
  assert.doesNotMatch(source, /backgroundColor:\s*"#0c0c0c"/);
  assert.match(source, /objectFit:\s*"cover"/);
});

test("homepage content wrapper does not add a header-height gap before the footer", () => {
  const source = read("src/app/page.tsx");

  assert.match(source, /minHeight:\s*"calc\(100dvh - 96px\)"/);
  assert.doesNotMatch(source, /minHeight:\s*"100vh"/);
});

test("homepage does not mount the season banner in the fallback-only hero state", () => {
  const source = read("src/app/page.tsx");

  assert.match(source, /const showSeasonBanner\s*=/);
  assert.match(source, /\{showSeasonBanner && <SeasonBanner \/>\}/);
  assert.doesNotMatch(source, /^\s*<SeasonBanner \/>\s*$/m);
});
