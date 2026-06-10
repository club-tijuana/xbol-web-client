import assert from "node:assert/strict";
import test from "node:test";

import { assertRootFirebaseDecodedToken } from "../src/services/firebaseRootToken.ts";

test("assertRootFirebaseDecodedToken rejects tenant-scoped decoded tokens", () => {
  assert.throws(
    () => assertRootFirebaseDecodedToken({ firebase: { tenant: "client-44m3w" } }),
    /root Firebase client ID token/,
  );
});

test("assertRootFirebaseDecodedToken accepts root decoded tokens", () => {
  assert.doesNotThrow(() =>
    assertRootFirebaseDecodedToken({ firebase: { sign_in_provider: "phone" } }),
  );
});
