import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("Next does not emit slash-normalization redirects without the public prefix", () => {
  const source = readFileSync("next.config.ts", "utf8");

  assert.match(source, /skipProxyUrlNormalize:\s*true/);
  assert.match(source, /skipTrailingSlashRedirect:\s*true/);
});
