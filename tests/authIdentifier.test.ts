import assert from "node:assert/strict";
import test from "node:test";

import {
  getPhoneAuthIdentifier,
  resolvePhoneAuthCountryCode,
  shouldShowPhoneCountrySelector,
} from "../src/helpers/authIdentifier.ts";

test("E.164 phone identifiers do not require country context", () => {
  assert.equal(getPhoneAuthIdentifier("+14155550100"), "+14155550100");
  assert.equal(shouldShowPhoneCountrySelector("+14155550100"), false);
});

test("national phone identifiers require visible country context", () => {
  assert.equal(getPhoneAuthIdentifier("4155550100"), null);
  assert.equal(getPhoneAuthIdentifier("4155550100", "US"), "+14155550100");
  assert.equal(shouldShowPhoneCountrySelector("4155550100"), true);
});

test("phone-only controls can show country context before typing", () => {
  assert.equal(shouldShowPhoneCountrySelector("", true), true);
});

test("resolves supported country context from E.164 phone identifiers", () => {
  assert.equal(resolvePhoneAuthCountryCode("+16194223311", "MX"), "US");
  assert.equal(resolvePhoneAuthCountryCode("+526641234567", "US"), "MX");
});

test("keeps current country context for national phone identifiers", () => {
  assert.equal(resolvePhoneAuthCountryCode("6194223311", "US"), "US");
  assert.equal(resolvePhoneAuthCountryCode("6641234567", "MX"), "MX");
});
