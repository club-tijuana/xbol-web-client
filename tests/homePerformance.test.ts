import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import test from "node:test";

test("header logo is eagerly discoverable without deprecated priority", () => {
  const source = readFileSync("src/components/Header/Header.tsx", "utf8");
  const logoImage = source.slice(
    source.indexOf("src={`${process.env.NEXT_PUBLIC_BASE_PATH}/assets/logo.svg`}"),
    source.indexOf("</Image>", source.indexOf("src={`${process.env.NEXT_PUBLIC_BASE_PATH}/assets/logo.svg`}")),
  );

  assert.match(logoImage, /\bpreload\b/);
  assert.match(logoImage, /loading="eager"/);
  assert.match(logoImage, /sizes=/);
  assert.doesNotMatch(logoImage, /\bpriority\b/);
});

test("root layout keeps heavy client-only providers out of the global shell", () => {
  const source = readFileSync("src/app/layout.tsx", "utf8");

  assert.doesNotMatch(source, new RegExp('from "@/providers/PickersProvider"'));
  assert.doesNotMatch(
    source,
    new RegExp('from "@/components/LoginModal/LoginModal"'),
  );
  assert.match(source, /LoginModalHost/);
});

test("login modal host mounts only after the modal has been requested", () => {
  const hostSource = readFileSync(
    "src/components/LoginModal/LoginModalHost.tsx",
    "utf8",
  );
  const uiSource = readFileSync("src/store/slices/uiSlice.ts", "utf8");

  assert.match(hostSource, /dynamic\(\(\) => import\("\.\/LoginModal"\)/);
  assert.match(hostSource, /state\.ui\.loginModalLoaded/);
  assert.match(uiSource, /loginModalLoaded:\s*false/);
  assert.match(uiSource, /state\.loginModalLoaded = true/);
});

test("event filters own the date picker provider only where date pickers are used", () => {
  const source = readFileSync(
    "src/app/event/components/EventsFilters/EventsFilters.tsx",
    "utf8",
  );

  assert.match(source, new RegExp('from "@/providers/PickersProvider"'));
  assert.match(source, /<PickersProvider>/);
});

test("auth slice defers auth service imports to thunk execution", () => {
  const source = readFileSync("src/store/slices/authSlice.ts", "utf8");

  assert.doesNotMatch(source, new RegExp('from "@/services/authService"'));
  assert.match(source, /await import\("@\/services\/authService"\)/);
});

test("root providers dynamically load the auth state bridge", () => {
  const source = readFileSync("src/store/Providers.tsx", "utf8");

  assert.doesNotMatch(source, /import AuthStateBridge from "\.\/AuthStateBridge"/);
  assert.match(source, /dynamic\(\(\) => import\("\.\/AuthStateBridge"\)/);
  assert.match(source, /ssr:\s*false/);
});

test("root background prefers an optimized webp asset with png fallback", () => {
  const source = readFileSync("src/app/layout.tsx", "utf8");

  assert.match(source, /pattern\.webp/);
  assert.match(source, /pattern\.png/);
  assert.match(source, /image-set\(/);
  assert.equal(existsSync("public/assets/background/pattern.webp"), true);
  assert.ok(statSync("public/assets/background/pattern.webp").size <= 150_000);
});
