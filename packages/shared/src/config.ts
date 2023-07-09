type Config = {
  invoke: {
    port: number;
    host: string;
    endpoint: string;
  };
  api: {
    port: number;
    host: string;
    endpoint: string;
  };
};

export function readConfig(): Config {
  const invokePort = 3002;
  const invokeHost = "localhost";
  const invokeEndpoint = `http://${invokeHost}:${invokePort}`;

  const apiPort = 3000;
  const apiHost = "localhost";
  const apiEndpoint = `http://${apiHost}:${apiPort}`;

  return {
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
}
