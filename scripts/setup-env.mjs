import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { randomBytes } from "node:crypto";

const envPath = new URL("../.env", import.meta.url);
const examplePath = new URL("../.env.example", import.meta.url);

if (!existsSync(envPath)) {
  writeFileSync(envPath, readFileSync(examplePath, "utf8"));
  console.log("Created .env from .env.example");
}

let env = readFileSync(envPath, "utf8");
const match = env.match(/^AUTH_SECRET=("?)(.*)\1$/m);
const hasSecret = !!match && match[2].trim().length > 0;

if (!hasSecret) {
  const secret = randomBytes(32).toString("base64");
  if (/^AUTH_SECRET=/m.test(env)) {
    env = env.replace(/^AUTH_SECRET=.*$/m, `AUTH_SECRET="${secret}"`);
  } else {
    env += `${env.endsWith("\n") || env === "" ? "" : "\n"}AUTH_SECRET="${secret}"\n`;
  }
  writeFileSync(envPath, env);
  console.log("Generated AUTH_SECRET and wrote it to .env");
} else {
  console.log("AUTH_SECRET already set in .env — leaving it alone");
}
