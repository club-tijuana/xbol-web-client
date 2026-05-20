import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { z } from "zod";

import {
  publicEnvSchema,
  serverEnvSchema,
} from "../src/config/envContracts.ts";

const schemaPath = resolve("src/config/env.schema.json");
const checkOnly = process.argv.includes("--check");
const schemaContracts = {
  publicEnv: publicEnvSchema,
  serverEnv: serverEnvSchema,
};
const registrySchema = z.toJSONSchema(z.globalRegistry, { io: "input" });
const payload = {
  schemas: Object.fromEntries(
    Object.keys(schemaContracts).map((name) => [name, registrySchema.schemas[name]]),
  ),
};
const output = `${JSON.stringify(payload, null, 2)}\n`;

if (checkOnly) {
  const current = readFileSync(schemaPath, "utf8");
  if (current !== output) {
    console.error(`${schemaPath} is stale. Run npm run schema:export.`);
    process.exit(1);
  }
  process.exit(0);
}

writeFileSync(schemaPath, output);
