export interface PromiseContext<T> {
  resolve: (t: T) => void;
  promise: Promise<T>;
}

export function getPromise<T>(): PromiseContext<T> {
  let resolve: (t: T) => void = () => {};
  const promise = new Promise<T>(r => {
    resolve = r;
  });
  return {
    resolve,
    promise,
  };
}
