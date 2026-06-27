import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
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

      return nextResolve(pathToFileURL(path).href);
    }

    return nextResolve(specifier, context);
  },
});

const legalContent = readFileSync(
  resolve("src/app/legal/TermsAndConditionsContent.tsx"),
  "utf8",
);

test("legal page includes the June 2026 summarized terms content", () => {
  assert.match(legalContent, /El presente documento constituye un contrato de adhesión/);
  assert.match(legalContent, /id="entrega"/);
  assert.match(legalContent, /id="reembolsos"/);
  assert.match(legalContent, /La responsabilidad total de la Boletera se limita al Cargo por Servicio/);
});

test("legal page includes the June 2026 integral privacy notice content", () => {
  assert.match(legalContent, /id="privacidad"/);
  assert.match(legalContent, /AVISO DE PRIVACIDAD INTEGRAL/);
  assert.match(legalContent, /DATOS PERSONALES SENSIBLES/);
  assert.match(legalContent, /Derechos ARCO/);
});

test("PWR legal metadata matches the provided documents", async () => {
  const { whiteLabelConfigs } = await import("../src/config/whiteLabel/configs.ts");
  const pwrTicket = whiteLabelConfigs["pwr-ticket"];

  assert.equal(pwrTicket.legalLastUpdated, "26 de junio de 2026");
  assert.equal(
    pwrTicket.contact.address,
    "Calle Rufino Tamayo No. 9990, Int. 401, Zona Urbana Rio Tijuana, C.P. 22010, Tijuana, Baja California, México.",
  );
  assert.equal(pwrTicket.contact.whatsapp, "+52 1 664 6933586");
});
