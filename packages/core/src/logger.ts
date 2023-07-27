// TODO
const debug = process.env.TLFC_DEBUG !== undefined;

export const devLog = (...args: unknown[]) => {
  if (!debug) {
    return;
  }

  console.log(...args);
};
