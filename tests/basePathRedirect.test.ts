import assert from "node:assert/strict";
import test from "node:test";

import {
  getPublicAppBasePath,
  normalizeBasePath,
  withBasePath,
  withPublicAppBasePath,
  withPublicRedirectBasePath,
} from "../src/utils/routing/basePath.ts";

test("base path helper normalizes configured path prefixes", () => {
  assert.equal(normalizeBasePath(" /client/ "), "/client");
  assert.equal(normalizeBasePath(""), "");
});

test("base path helper prefixes root-relative redirect targets", () => {
  assert.equal(
    withBasePath("/?error=No%20encontrado", " /client/ "),
    "/client/?error=No%20encontrado",
  );
});

test("public app base path falls back to the deployed asset prefix", () => {
  assert.equal(getPublicAppBasePath("", "/client"), "/client");
  assert.equal(getPublicAppBasePath("/client", "/assets"), "/client");
});

test("public app base path prefixes external return targets", () => {
  assert.equal(
    withPublicAppBasePath("/paymentLink/abc?source=evo", "", "/client"),
    "/client/paymentLink/abc?source=evo",
  );
});

test("public redirect path lets Next apply its configured base path", () => {
  assert.equal(
    withPublicRedirectBasePath("/?error=Order+not+found", "/client", "/client"),
    "/?error=Order+not+found",
  );
});

test("public redirect path uses asset prefix when Next has no base path", () => {
  assert.equal(
    withPublicRedirectBasePath("/?error=Order+not+found", "", "/client"),
    "/client/?error=Order+not+found",
  );
});

test("base path helper leaves redirect targets unchanged without a base path", () => {
  assert.equal(
    withBasePath("/?error=No%20encontrado", ""),
    "/?error=No%20encontrado",
  );
});

test("base path helper does not double-prefix already-prefixed redirect targets", () => {
  assert.equal(
    withBasePath("/client/?error=No%20encontrado", "/client"),
    "/client/?error=No%20encontrado",
  );
});
