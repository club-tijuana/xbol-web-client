import assert from "node:assert/strict";
import test from "node:test";

import {
  AUTH_SMS_RESEND_COOLDOWN_SECONDS,
  getPhoneLoginPrimaryActionLabel,
  getPhoneLoginTitle,
  getSmsResendLabel,
  loginModalBlockedOnPath,
  shouldCloseLoginModalForBlockedPath,
  shouldResetPhoneCodeForIdentifierChange,
} from "../src/helpers/authUx.ts";

test("registration routes block login modal entrypoints", () => {
  assert.equal(loginModalBlockedOnPath("/register"), true);
  assert.equal(loginModalBlockedOnPath("/register/verify-email"), true);
  assert.equal(loginModalBlockedOnPath("/account/register"), false);
  assert.equal(loginModalBlockedOnPath("/"), false);
});

test("open login modal state closes when entering blocked registration routes", () => {
  assert.equal(shouldCloseLoginModalForBlockedPath("/register", true), true);
  assert.equal(shouldCloseLoginModalForBlockedPath("/register/verify-email", true), true);
  assert.equal(shouldCloseLoginModalForBlockedPath("/register", false), false);
  assert.equal(shouldCloseLoginModalForBlockedPath("/", true), false);
});

test("SMS resend cooldown uses the selected 30 second interval", () => {
  assert.equal(AUTH_SMS_RESEND_COOLDOWN_SECONDS, 30);
});

test("SMS resend label includes remaining seconds until resend is available", () => {
  assert.equal(getSmsResendLabel(30), "Reenviar código (30s)");
  assert.equal(getSmsResendLabel(1), "Reenviar código (1s)");
  assert.equal(getSmsResendLabel(0), "Reenviar código");
});

test("phone login primary action matches SMS verification state", () => {
  assert.equal(getPhoneLoginPrimaryActionLabel(false), "Enviar código");
  assert.equal(getPhoneLoginPrimaryActionLabel(true), "Continuar");
});

test("phone login title is compact enough for the modal", () => {
  assert.equal(getPhoneLoginTitle(true), "Accede o crea tu cuenta");
  assert.equal(getPhoneLoginTitle(false), "Inicia sesión");
});

test("phone code state survives display-only phone formatting", () => {
  assert.equal(
    shouldResetPhoneCodeForIdentifierChange("6641231717", "664 123 1717", "MX"),
    false,
  );
  assert.equal(
    shouldResetPhoneCodeForIdentifierChange("6641231717", "664 123 1718", "MX"),
    true,
  );
});
