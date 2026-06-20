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

const { getVerifiedPhoneRegistrationUser } = await import(
  "../src/helpers/phoneRegistrationHandoff.ts"
);

test("uses an unlinked user when the verified phone matches registration", () => {
  const user = {
    userId: "firebase-phone-uid",
    username: "+526641234567",
    token: "id-token",
    firstName: "",
    lastName: "",
    phoneNumber: "+526641234567",
    onboardingStatus: "unlinked",
    verificationStatus: "verified",
  };

  assert.equal(
    getVerifiedPhoneRegistrationUser(user, "+526641234567"),
    user,
  );
});

test("does not reuse linked or different-phone users for registration", () => {
  const user = {
    userId: "firebase-phone-uid",
    username: "+526641234567",
    token: "id-token",
    firstName: "",
    lastName: "",
    phoneNumber: "+526641234567",
    onboardingStatus: "linked",
    verificationStatus: "verified",
  };

  assert.equal(
    getVerifiedPhoneRegistrationUser(user, "+526641234567"),
    null,
  );
  assert.equal(
    getVerifiedPhoneRegistrationUser(
      { ...user, onboardingStatus: "unlinked" },
      "+14155550100",
    ),
    null,
  );
});
