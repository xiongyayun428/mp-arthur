/**
 * 小程序的promise没有finally方法，自己扩展下
 */
if(!Promise.prototype.finally) {
  Promise.prototype.finally = function(onFinally: any | undefined | null) {
    return this.then(
      /* onFulfilled */
      value => Promise.resolve(onFinally()).then(() => value),
      /* onRejected */
      reason => Promise.resolve(onFinally()).then(() => { throw reason; })
    );
  };
}

export interface Promise<T> {
  /**
   * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
   * resolved value cannot be modified from the callback.
   * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
   * @returns A Promise for the completion of the callback.
   */
  finally(onfinally?: (() => void) | undefined | null): Promise<T>
}
