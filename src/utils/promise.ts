/**
 * 小程序的promise没有finally方法，自己扩展下
 */
if(!Promise.prototype.finally) {
  Promise.prototype.finally = function(onFinally: any) {
    return this.then(
      /* onFulfilled */
      value => Promise.resolve(onFinally()).then(() => value),
      /* onRejected */
      reason => Promise.resolve(onFinally()).then(() => { throw reason; })
    );
  };
}
