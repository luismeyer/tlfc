const debug = (() => {
  try {
    return process.env.TLFC_DEBUG !== undefined;
  } catch {
    return false;
  }
})();

export const devLog = (...args: unknown[]) => {
  if (!debug) {
    return;
  }

  console.log(...args);
};
