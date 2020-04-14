interface Promise<T> {
  readonly constructor: PromiseConstructor;
}
/**
 * 小程序的promise没有finally方法，自己扩展下
 */
if (!Promise.prototype.finally) {
  Promise.prototype.finally = function <T>(this: Promise<T>, onfinally?: (() => void) | undefined | null): Promise<T> {
      if (onfinally) {
          const P = this.constructor;
          return this.then(
              value => P.resolve(onfinally()).then(() => value),
              reason => P.resolve(onfinally()).then(() => { throw reason; })
          );
      } else {
          return this;
      }
  };
}
