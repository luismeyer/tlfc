let loggingDisabled = false;

export function disableLogging() {
  loggingDisabled = true;
}

export function log(...args: unknown[]) {
  if (loggingDisabled) {
    return;
  }

  console.info("@tlfc: ", ...args);
}
