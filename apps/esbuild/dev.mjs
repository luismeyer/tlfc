// @ts-check

import liveServer from "live-server";

/**
 * @type {import("live-server").LiveServerParams}
 */
const params = {
  port: 8080,
  host: "localhost",
  open: true,
  file: "./public/index.html",
  logLevel: 2,
};

liveServer.start(params);
