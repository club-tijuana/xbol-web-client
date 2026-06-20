import assert from "node:assert/strict";
import test from "node:test";

import {
  getPhoneAuthIdentifier,
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
