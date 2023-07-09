export function getCallerFile() {
  let filename = "";

  const _pst = Error.prepareStackTrace;
  Error.prepareStackTrace = (_err, stack) => stack;

  try {
    const err = new Error();

    let callerfile;

    // TODO
    // @ts-ignore
    let currentfile = err.stack?.shift().getFileName();

    while (err.stack?.length) {
      // TODO
      // @ts-ignore
      callerfile = err.stack.shift().getFileName();

      if (currentfile !== callerfile) {
        filename = callerfile;
        break;
      }
    }
  } catch (err) {}

  Error.prepareStackTrace = _pst;

  return filename;
}
