import { globSync } from "glob";
import dotenv from "dotenv";

const DotenvOptions: dotenv.DotenvConfigOptions = { override: true };
export function loadEnv() {
  const [path] = globSync(".env*");

  const env = path
    ? dotenv.config({ ...DotenvOptions, path })
    : dotenv.config({ ...DotenvOptions, path: `.env` });

  const varNames = Object.keys(env.parsed ?? {}).join("', '");

  if (varNames.length) {
    console.info(`@tlfc: loaded env vars: '${varNames}'`);
  }
}
