import { RequestOption } from "./option";
import { HttpParams, DefaultHttpParams } from "./params";
import { ClientInfo } from '../utils/client-info';

export class Http {
  private _clientInfo: ClientInfo;
  private parms: HttpParams;

  /**
   * 网络请求
   * @param _parms 参数
   */
  constructor(private _parms?: HttpParams) {
    if (!_parms) {
      this.parms = new DefaultHttpParams();
    } else {
      this.parms = _parms;
    }
    this._clientInfo = new ClientInfo();
  }

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
      if (this.parms.withBaseURL) {
        _url = this.reasonableUrl(this.parms.baseURL, options?.url)
      }
      // let header = options?.header;
      // this._clientInfo.systemInfo.

      // 发送服务
      wx.request({
        url: _url,
        data: options?.data,
        header: options?.header,
        method: options?.method,
        dataType: options?.dataType,
        responseType: options?.responseType,
        success: (result) => {
          const res: any = result.data
          if (_this.parms.successCode.indexOf(res[_this.parms.codeFieldName]) < 0) {
            if (options?.loading) {
              wx.hideLoading()
            }
            resolve(res[_this.parms.dataFieldName])
          } else {
            if (options?.toast) {
              wx.showToast({
                mask: true,
                title: res[_this.parms.msgFieldName],
                icon: 'none',
              })
            } else {
              if (options?.loading) {
                wx.hideLoading()
              }
            }
          }
        },
        fail: (e) => {
          let msg = e.errMsg
          if (msg === 'request:fail timeout') {
            msg = '请求超时，请稍后处理！'
          }
          wx.showToast({
            mask: true,
            title: msg,
            icon: 'none',
          })
          reject({ code: -1, msg })
        },
        complete: () => {
          console.log('complete!')
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


// /**
//  * 小程序的promise没有finally方法，自己扩展下
//  */
// Promise.prototype.finally = function (callback) {
//   var Promise = this.constructor;
//   return this.then(
//     (value) => {
//       Promise.resolve(callback()).then(
//         () =>{
//           return value;
//         }
//       );
//     },
//     (reason) => {
//       Promise.resolve(callback()).then(
//         function () {
//           throw reason;
//         }
//       );
//     }
//   );
// }
