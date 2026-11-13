import { existsSync, writeFileSync, readFileSync } from "node:fs";
import { randomBytes } from "node:crypto";
import { fileURLToPath } from "node:url";
const target = new URL("../.env", import.meta.url);
if (
  existsSync(target) &&
  /^ADMIN_PASSWORD=.{12,}$/m.test(readFileSync(target, "utf8"))
) {
  console.log("Local configuration already exists.");
  process.exit(0);
}
const password = randomBytes(24).toString("base64url");
writeFileSync(
  target,
  `HOST=127.0.0.1\nPORT=3000\nPUBLIC_ORIGIN=http://127.0.0.1:3000\nNODE_ENV=development\nADMIN_PASSWORD=${password}\n`,
  { mode: 0o600 },
);
writeFileSync(
  new URL("../.admin-access.txt", import.meta.url),
  `Local admin panel: http://127.0.0.1:3000/admin.html#/admin\nPassword: ${password}\n\nThis file and .env are ignored by Git. Change ADMIN_PASSWORD in .env before public deployment.\n`,
  { mode: 0o600 },
);
console.log(
  "Local admin password generated. Open .admin-access.txt to view it.",
);
