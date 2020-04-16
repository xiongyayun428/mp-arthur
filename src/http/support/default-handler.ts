import { Handler } from "../handler";
import { RequestOption } from "../option";
import { Store } from "../../utils/store";

export class DefaultHandler implements Handler {
  private store = new Store();
  private loadingTimeout: number = 0;

  constructor(private showToastParams: any = {
    mask: true,
    duration: 3000,
    icon: 'none',
  }) { }

  preHandler?(option: RequestOption): boolean {
    if (!!option.loading) {
      clearTimeout(this.loadingTimeout);
      if (typeof option.loading === 'object') {
        const loading = option.loading;
        this.loadingTimeout = setTimeout(() => {
          wx.showLoading({
            title: loading.title || '加载中...',
          })
        }, loading.delay || 100);
      } else {
        this.loadingTimeout = setTimeout(() => {
          wx.showLoading({
            title: '加载中...',
          })
        }, 100);
      }
    }
    if (option.withBaseURL) {
      option.url = this.reasonableUrl(option.baseURL, option?.url)
    }
    const systemInfo = this.store.getSystemInfo();
    const clientInfo = {
      "clientType": "mp",
      // 设备型号
      "model": systemInfo.model,
      // 操作系统及版本
      "os": systemInfo.system,
      // 微信版本号
      "version": systemInfo.version,
      // 屏幕
      "screen": systemInfo.screenWidth + "px * " + systemInfo.screenHeight + "px",
      "channel": "miniprogram"
    }
    option.header = Object.assign({
      "Client-Info": JSON.stringify(clientInfo)
    }, option?.header);
    return true;
  }

  failHandler?(res: WechatMiniprogram.GeneralCallbackResult | WechatMiniprogram.RequestSuccessCallbackResult | any, option: RequestOption): boolean {
    if (option?.toast) {
      wx.showToast(Object.assign({title: res.errMsg || (option.msgFieldName && res[option.msgFieldName])}, this.showToastParams))
    } else {
      if (!!option?.loading) {
        wx.hideLoading()
      }
    }
    return true;
  }

  successHandler?(result: WechatMiniprogram.RequestSuccessCallbackResult, option?: RequestOption): boolean {
    if (!!option?.loading) {
      wx.hideLoading()
    }
    return true;
  }

  postHandler?(resp: WechatMiniprogram.GeneralCallbackResult): boolean {
    clearTimeout(this.loadingTimeout);
    return true;
  }

  private reasonableUrl(baseUrl: string = "", url: string = "") {
    if (url.indexOf("://") < 0) {
      // 不是http://和https://和ws://之类的开头
      return this.mergeUrl(baseUrl, url);
    }
    return url;
  }

  /**
   * 合并URL
   * @param urlPrefix 前缀
   * @param urlSuffix 后缀
   */
  private mergeUrl(urlPrefix: string, urlSuffix: string) {
    if (urlPrefix == null && urlSuffix != null) {
      return urlSuffix
    }
    if (urlPrefix != null && urlSuffix == null) {
      return urlPrefix
    }
    if (typeof urlPrefix !== 'string') {
      throw new Error('merge the url error. use string, now: ' + JSON.stringify(urlPrefix))
    }
    if (typeof urlSuffix !== 'string') {
      throw new Error('merge the url error. use string, now: ' + JSON.stringify(urlSuffix))
    }
    if (urlPrefix.endsWith('/') && urlSuffix.startsWith('/')) {
      return urlPrefix + urlSuffix.substr(1)
    }
    if (urlPrefix.endsWith('/') || urlSuffix.startsWith('/')) {
      return urlPrefix + urlSuffix
    }
    return urlPrefix + '/' + urlSuffix
  }

}
