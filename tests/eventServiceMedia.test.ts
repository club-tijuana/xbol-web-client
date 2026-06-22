import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("getUpcomingEvents requests media-backed event images", () => {
  const source = readFileSync("src/services/eventService.ts", "utf8");
  const getUpcomingEvents = source.slice(
    source.indexOf("export async function getUpcomingEvents"),
  );

  assert.match(getUpcomingEvents, /events\/upcoming-events/);
  assert.match(getUpcomingEvents, /includeMedia:\s*true/);
});
