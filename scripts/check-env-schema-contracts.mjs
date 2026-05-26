import { readFileSync } from "node:fs";

const schema = JSON.parse(readFileSync("src/config/env.schema.json", "utf8"));
const schemaNames = Object.keys(schema.schemas ?? {}).sort();
const expectedSchemaNames = ["publicEnv", "serverEnv"];

if (JSON.stringify(schemaNames) !== JSON.stringify(expectedSchemaNames)) {
  throw new Error(
    `Expected generated env schemas ${expectedSchemaNames.join(", ")}, got ${schemaNames.join(", ")}`,
  );
}

const publicEnv = schema.schemas.publicEnv;
const serverEnv = schema.schemas.serverEnv;

for (const key of Object.keys(publicEnv.properties ?? {})) {
  const exposure = publicEnv.envMetadata?.[key]?.exposure;
  if (!key.startsWith("NEXT_PUBLIC_") || exposure !== "public-build-time") {
    throw new Error(`${key} must be a public build-time env key.`);
  }
}

for (const key of Object.keys(serverEnv.properties ?? {})) {
  const exposure = serverEnv.envMetadata?.[key]?.exposure;
  if (key.startsWith("NEXT_PUBLIC_") || exposure !== "server-runtime") {
    throw new Error(`${key} must be a server runtime env key.`);
  }
}
