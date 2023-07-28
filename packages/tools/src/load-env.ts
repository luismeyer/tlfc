import { globSync } from "glob";
import dotenv from "dotenv";

export function loadEnv() {
  const [path] = globSync(".env*");

  const env = path ? dotenv.config({ path }) : dotenv.config({ path: `.env` });

  const varNames = Object.keys(env.parsed ?? {}).join("', '");

  console.info(`@tlfc: loaded env vars: '${varNames}'`);
}
