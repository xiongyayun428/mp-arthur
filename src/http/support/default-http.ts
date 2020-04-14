import { Http } from '../http';
import { Handler } from '../handler';
import { HttpParams, DefaultHttpParams } from '../params';
import { RequestOption } from '../option';
import { DefaultHandler } from './default-handler';

export class DefaultHttp implements Http {
  private _handlers: Handler[] = new Array<Handler>();

  private _debug: boolean = false;
  // 还存在问题
  public requestTask: WechatMiniprogram.RequestTask | undefined;

  public get handlers(): Handler[] {
    if (!this._handlers || this._handlers.length <= 0) {
      this.handler = new DefaultHandler();
    }
    return this._handlers;
  }
  public set handlers(value: Handler[]) {
    this._handlers = value;
  }
  public set handler(value: Handler) {
    this._handlers.push(value);
  }

  /**
   * 设置网络请求的debug模式 true: 打印请求日志
   */
  set debug(isDebug: boolean) {
    this._debug = isDebug;
  }

  /**
   * 获取网络请求的debug模式
   */
  get debug(): boolean {
    return this._debug;
  }

  /**
   * 网络请求
   * @param params 参数
   */
  constructor(private params: HttpParams = new DefaultHttpParams()) { }

  /**
   * 网络请求
   * @param option 网络请求参数
   */
  request(_option: RequestOption): Promise<any> {
    // 将全局参数和本次请求参数合并，优先级：本次请求参数 > 全局参数
    const option: RequestOption = Object.assign({}, this.params, _option);
    if (this.handlers?.length > 0) {
      for (const handler of this.handlers) {
        if (handler.preHandler && !handler.preHandler(option)) {
          break
        }
      }
    }
    return this.fetch(option);
  }

  private fetch(option: RequestOption): Promise<any> {
    return new Promise((resolve, reject) => {
      const _this = this
      // 发送服务
      _this.requestTask = wx.request({
        url: option.url,
        data: option?.data,
        header: option?.header,
        timeout: option?.timeout,
        method: option?.method,
        dataType: option?.dataType,
        responseType: option?.responseType,
        success: (result: WechatMiniprogram.RequestSuccessCallbackResult) => { // 请求成功
          if (this.debug) {
            console.log("==>" + option?.method + " " + option.url + "\n<==" + JSON.stringify(result));
          }
          const res: any = result.data
          if (!option.successCode || !option.codeFieldName || !option.dataFieldName) { // 配置存在问题
            console.error("请检查配置[successCode, codeFieldName, dataFieldName]");
            this.failHandler(res, option)
            reject(res)
          } else if (option.successCode.indexOf(res[option.codeFieldName]) >= 0) { // 业务成功
            this.successHandler(res[option.dataFieldName], option);
            resolve(res[option.dataFieldName])
          } else { // 业务失败
            this.failHandler(res, option)
            reject(res)
          }
        },
        fail: (res: WechatMiniprogram.GeneralCallbackResult) => { // 请求失败
          // TODO 重试
          if (option.failRetry && option.failRetry.retry-- > 0) {
            console.log("retry：" + (option.failRetry.retry + 1));
            const delay = option.failRetry.delay;
            // if (delay > 0) {
            // }
            return this.fetch(option).then(resolve, reject);
          }
          if (res.errMsg === 'request:fail timeout') {
            res.errMsg = '请求超时，请稍后处理！'
          }
          this.failHandler(res, option)
          const sysError: any = {};
          if (option.codeFieldName) {
            sysError[option.codeFieldName] = -1;
          }
          if (option.msgFieldName) {
            sysError[option.msgFieldName] = res.errMsg;
          }
          reject(sysError)
        },
        complete: (res: WechatMiniprogram.GeneralCallbackResult) => {
          if (this.handlers?.length > 0) {
            for (const handler of this.handlers) {
              if (handler.postHandler && !handler.postHandler(res)) {
                break
              }
            }
          }
        },
      })
    })
  }

  /**
   * 交易成功处理
   *
   * @private
   * @param {*} resp
   * @memberof Http
   */
  private successHandler(resp: any, option?: RequestOption) {
    if (this.handlers?.length > 0) {
      for (const handler of this.handlers) {
        if (handler.successHandler && !handler.successHandler(resp, option)) {
          break
        }
      }
    }
  }

  /**
   * 异常处理
   *
   * @private
   * @param {*} res
   * @memberof Http
   */
  private failHandler(res: any, option: RequestOption) {
    if (this.handlers?.length > 0) {
      for (const handler of this.handlers) {
        if (handler.failHandler && !handler.failHandler(res, option)) {
          break
        }
      }
    }
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


  post(url: string, data?: any) {
    return this.request({
      url,
      method: "POST",
      data
    })
  }

  /**
   * PUT网络请求
   * @param url 请求地址
   * @param data 请求数据
   */
  put(url: string, data?: any) {
    return this.request({
      url,
      method: "PUT",
      data
    })
  }

  /**
   * DELETE网络请求
   * @param url 请求地址
   * @param data 请求数据
   */
  delete(url: string, data?: any) {
    return this.request({
      url,
      method: "DELETE",
      data
    })
  }

  /**
   * HEAD网络请求
   * @param url 请求地址
   * @param data 请求数据
   */
  head(url: string, data?: any) {
    return this.request({
      url,
      method: "HEAD",
      data
    })
  }

  /**
   * TRACE网络请求
   * @param url 请求地址
   * @param data 请求数据
   */
  trace(url: string, data?: any) {
    return this.request({
      url,
      method: "TRACE",
      data
    })
  }

  /**
   * CONNECT网络请求
   * @param url 请求地址
   * @param data 请求数据
   */
  connect(url: string, data?: any) {
    return this.request({
      url,
      method: "CONNECT",
      data
    })
  }

  /**
   * options网络请求
   * @param url 请求地址
   * @param data 请求数据
   */
  options(url: string, data?: any) {
    return this.request({
      url,
      method: "OPTIONS",
      data
    })
  }

}
