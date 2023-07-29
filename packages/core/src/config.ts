let apiPath: string | undefined;

type Config = {
  invoke?: undefined;
  api: {
    endpoint: string;
  };
};

type DevConfig = {
  invoke: {
    port: number;
    host: string;
    endpoint?: string;
  };
  api: {
    port: number;
    host: string;
    endpoint: string;
  };
};

const invokePort = 56789;
const invokeHost = "localhost";
const invokeEndpoint = `http://${invokeHost}:${invokePort}`;

const apiPort = 56790;
const apiHost = "localhost";
const apiEndpoint = `http://${apiHost}:${apiPort}`;

export const devConfig: DevConfig = {
  api: {
    port: apiPort,
    host: apiHost,
    endpoint: apiEndpoint,
  },
  invoke: {
    port: invokePort,
    host: invokeHost,
    endpoint: invokeEndpoint,
  },
};

export function readConfig(): Config | DevConfig {
  if (apiPath) {
    return {
      api: {
        endpoint: apiPath,
      },
    };
  }

  return devConfig;
}

export function configure(endpoint?: string) {
  apiPath = endpoint;
}
