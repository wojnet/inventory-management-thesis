import { execSync, ExecSyncOptionsWithStringEncoding } from "node:child_process";

export function resetDatabase() {
  const options: ExecSyncOptionsWithStringEncoding = {
    encoding: "utf-8",
    stdio: "inherit" as const,
    env: {
      ...process.env,
      NODE_ENV: "test",
    },
  };

  execSync("npx prisma migrate reset --force", options);
  execSync("npm run seed", options);
}