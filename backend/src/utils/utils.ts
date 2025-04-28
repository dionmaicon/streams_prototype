
const asyncDelay = async (func: Function, timeout = 0, ...args: Array<any>) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(func(...args));
    }, timeout);
  });
};

export { asyncDelay };