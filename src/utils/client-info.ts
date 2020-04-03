export class ClientInfo {
  private _systemInfo: WechatMiniprogram.GetSystemInfoSyncResult;
  constructor() {
    this._systemInfo = wx.getSystemInfoSync();
  }

  // get systemInfo() {
  //   return this._systemInfo
  // }

}
