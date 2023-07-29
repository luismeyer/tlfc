import { globSync } from "glob";
import dotenv from "dotenv";
import { log } from "./dev/log";

const DotenvOptions: dotenv.DotenvConfigOptions = { override: true };
export function loadEnv() {
  const [path] = globSync(".env*");

  const env = path
    ? dotenv.config({ ...DotenvOptions, path })
    : dotenv.config({ ...DotenvOptions, path: `.env` });

  const varNames = Object.keys(env.parsed ?? {}).join("', '");

  if (varNames.length) {
    log(`loaded env vars: '${varNames}'`);
  }
}
