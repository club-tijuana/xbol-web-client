import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { registerHooks } from "node:module";
import { dirname, extname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith("@/")) {
      const path = resolve(specifier.replace("@/", "src/"));
      return nextResolve(pathToFileURL(path.endsWith(".ts") ? path : `${path}.ts`).href);
    }

    if (
      specifier.startsWith(".")
      && !extname(specifier)
      && context.parentURL
    ) {
      const parentPath = fileURLToPath(context.parentURL);
      const path = resolve(dirname(parentPath), `${specifier}.ts`);

      if (existsSync(path)) {
        return nextResolve(pathToFileURL(path).href);
      }
    }

    return nextResolve(specifier, context);
  },
});

const {
  buildCheckoutClientContact,
  isCheckoutClientContactComplete,
} = await import("../src/helpers/checkoutContact.ts");

test("phone login username is not reused as checkout contact email", () => {
  const contact = buildCheckoutClientContact({
    userId: "firebase-phone-uid",
    username: "+526641234567",
    token: "id-token",
    firstName: "Ada",
    lastName: "Lovelace",
    phoneNumber: "+526641234567",
    phoneRegionCodeId: 1,
  }, null);

  assert.equal(contact.email, "");
  assert.equal(contact.fullName, "Ada Lovelace");
  assert.equal(contact.phoneNumber, "6641234567");
  assert.equal(contact.phoneRegionCodeId, 1);
  assert.equal(isCheckoutClientContactComplete(contact), false);
});

test("checkout contact email stays separate from phone auth identity", () => {
  const contact = buildCheckoutClientContact({
    userId: "firebase-phone-uid",
    username: "+526641234567",
    token: "id-token",
    firstName: "Ada",
    lastName: "Lovelace",
    phoneNumber: "+526641234567",
    phoneRegionCodeId: 1,
  }, {
    email: "buyer@example.com",
    firstName: "",
    lastName: "",
    fullName: "",
    phoneNumber: "",
  });

  assert.equal(contact.email, "buyer@example.com");
  assert.equal(contact.fullName, "Ada Lovelace");
  assert.equal(contact.phoneNumber, "6641234567");
  assert.equal(contact.phoneRegionCodeId, 1);
  assert.equal(isCheckoutClientContactComplete(contact), true);
});

test("hosted checkout contact requires the phone region id", () => {
  const contact = buildCheckoutClientContact({
    userId: "firebase-phone-uid",
    username: "+526641234567",
    token: "id-token",
    firstName: "Ada",
    lastName: "Lovelace",
    email: "buyer@example.com",
    phoneNumber: "+526641234567",
  }, null);

  assert.equal(contact.email, "buyer@example.com");
  assert.equal(contact.phoneRegionCodeId, undefined);
  assert.equal(isCheckoutClientContactComplete(contact), false);
});
