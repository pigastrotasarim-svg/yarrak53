#!/usr/bin/env node
/**
 * Railway release phase: migrate + seed with DB retries.
 * Keeps startCommand free so healthchecks don't SIGTERM mid-migrate.
 */
import { spawnSync } from "node:child_process";

function run(cmd, args) {
  console.log(`> ${cmd} ${args.join(" ")}`);
  const res = spawnSync(cmd, args, { stdio: "inherit", env: process.env });
  if (res.status !== 0) {
    process.exit(res.status || 1);
  }
}

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL eksik — Postgres reference bağla.");
  process.exit(1);
}

const maxAttempts = 10;
for (let i = 1; i <= maxAttempts; i++) {
  console.log(`Prisma migrate (deneme ${i}/${maxAttempts})…`);
  const res = spawnSync(
    "npx",
    ["prisma", "migrate", "deploy"],
    { stdio: "inherit", env: process.env }
  );
  if (res.status === 0) break;
  if (i === maxAttempts) {
    console.error("migrate deploy başarısız");
    process.exit(res.status || 1);
  }
  spawnSync("sleep", ["3"], { stdio: "ignore" });
}

run("npx", ["tsx", "prisma/seed.ts"]);
console.log("Railway release tamam");
