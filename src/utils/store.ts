export class Store {
  /**
   * 设置缓存值
   * @param key        主键
   * @param value      数据：需要存储的内容。只支持原生类型、Date、及能够通过JSON.stringify序列化的对象。
   * @param expires    过期时间的秒数(作用为最外层key)
   */
  public set(key: string, value: any, expires?: number): boolean {
    try {
      const obj: any = {}
      obj.data = value
      obj.expires = expires ? (new Date().getTime() + expires * 1000) : 0
      wx.setStorageSync(key, obj)
    } catch (error) {
      return false;
    }
    return true;
  }

  /**
   * 获取缓存值
   * @param key 键值
   */
  public get(key: string): any {
    return this.getValidData(key)
  }

  /**
   * 删除缓存值
   * @param key 键值
   */
  public remove(key: string): boolean {
    try {
      wx.removeStorageSync(key)
    } catch (e) {
      return false;
    }
    return true;
  }

  private getValidData(key: string) {
    const value = wx.getStorageSync(key)
    try {
      if (value) {
        if (value.expires == null || value.expires >= new Date().getTime()) {
          return value.data
        } else {
          // 数据已过期
          this.remove(key)
        }
      }
      return null
    } catch (error) {
      return value
    }
  }

  getSystemInfo(): WechatMiniprogram.GetSystemInfoSyncResult {
    return wx.getSystemInfoSync()
  }
}
