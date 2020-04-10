import { RequestOption } from "./option";
import { HttpParams, DefaultHttpParams } from "./params";
import { Store } from '../utils/store';

/**
 * HTTP网络请求
 */
export class Http {
  private store = new Store();
  private _debug: boolean = false;
  // 还存在问题
  public requestTask: WechatMiniprogram.RequestTask | undefined;

  set debug(isDebug: boolean) {
    this._debug = isDebug;
  }

  get debug(): boolean {
    return this._debug;
  }

  /**
   * 网络请求
   * @param _params 参数
   */
  constructor(private params: HttpParams = new DefaultHttpParams(),
              private showToastParams: any = {
                mask: true,
                duration: 3000,
                icon: 'none',
              }
  ) { }

  request(options: RequestOption): Promise<any> {
    if (options.loading === undefined) {
      options.loading = true;
    }
    if (options.toast === undefined) {
      options.toast = true;
    }
    return new Promise((resolve, reject) => {
      if (options.loading) {
        wx.showLoading({
          title: '加载中...',
        })
      }
      const _this = this
      let _url = options?.url
      if (this.params.withBaseURL) {
        _url = this.reasonableUrl(this.params.baseURL, options?.url)
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
      const header = Object.assign({
        "Client-Info": JSON.stringify(clientInfo)
      }, options?.header);

      // 发送服务
      _this.requestTask = wx.request({
        url: _url,
        data: options?.data,
        header,
        timeout: options?.timeout,
        method: options?.method,
        dataType: options?.dataType,
        responseType: options?.responseType,
        success: (result) => { // 请求成功
          if (this.debug) {
            console.log("==>" + options?.method + " " + _url + "\n<==" + JSON.stringify(result));
          }
          const res: any = result.data
          // 业务成功
          if (_this.params.successCode.indexOf(res[_this.params.codeFieldName]) >= 0) {
            if (options?.loading) {
              wx.hideLoading()
            }
            resolve(res[_this.params.dataFieldName])
          } else { // 业务失败
            if (options?.toast) {
              wx.showToast(Object.assign({title: res[_this.params.msgFieldName]}, this.showToastParams))
            } else {
              if (options?.loading) {
                wx.hideLoading()
              }
            }
            reject(res)
          }
        },
        fail: (e) => { // 请求失败
          let msg = e.errMsg
          if (msg === 'request:fail timeout') {
            msg = '请求超时，请稍后处理！'
          }
          if (options?.toast) {
            wx.showToast(Object.assign({title: msg}, this.showToastParams))
          }
          reject({ code: -1, msg })
        },
        complete: () => {
          // console.log('complete!')
        },
      })
    })
  }

  /**
   * GET网络请求
   * @param url 请求地址
   * @param data 请求数据
   */
  get(url: string, data?: any) {
    let _url = url;
    if (data) {
      const _data = Object.keys(data)
            .map(key => data[key] && `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
            .join('&');
      if (url.indexOf("?") < 0) {
        _url += "?"
      }
      _url += _data;
    }
    return this.request({
      url: _url,
      method: "GET"
    })
  }

  /**
   * POST网络请求
   * @param url 请求地址
   * @param data 请求数据
   */
  post(url: string, data?: any) {
    return this.request({
      url,
      method: "POST",
      data
    })
  }

  put(url: string, data?: any) {
    return this.request({
      url,
      method: "PUT",
      data
    })
  }

  delete(url: string, data?: any) {
    return this.request({
      url,
      method: "DELETE",
      data
    })
  }

  head(url: string, data?: any) {
    return this.request({
      url,
      method: "HEAD",
      data
    })
  }

  trace(url: string, data?: any) {
    return this.request({
      url,
      method: "TRACE",
      data
    })
  }

  connect(url: string, data?: any) {
    return this.request({
      url,
      method: "CONNECT",
      data
    })
  }

  options(url: string, data?: any) {
    return this.request({
      url,
      method: "OPTIONS",
      data
    })
  }

  private reasonableUrl(baseUrl: string, url: string) {
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
