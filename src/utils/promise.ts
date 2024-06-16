export const withResolvers = <T>(_?: T) => {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: any) => void;
  const promise = new Promise<T>((resolveFn, rejectFn) => {
    resolve = resolveFn;
    reject = rejectFn;
  });

  return {
    promise,
    resolve,
    reject,
  };
};
