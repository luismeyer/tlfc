import { readFileSync, writeFileSync } from "fs";

type DevConfig = {
  invokeEndpoint: string;
  apiEndpoint: string;
};

const CONFIG_PATH = "/tmp/tsls.json";

export function storeDevConfig(config: DevConfig) {
  writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
}

export function readDevConfig(): DevConfig | undefined {
  try {
    return JSON.parse(readFileSync(CONFIG_PATH, "utf-8"));
  } catch {
    return undefined;
  }
}
