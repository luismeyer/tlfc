// TODO
const debug = false;

export const devLog = (...args: unknown[]) => {
  if (!debug) {
    return;
  }

  console.log(...args);
};
