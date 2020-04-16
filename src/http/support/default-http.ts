import { errMsg } from '../error_dict';
import { Http } from '../http';
import { Handler } from '../handler';
import { HttpParams, DefaultHttpParams } from '../params';
import { RequestOption, UploadFileOption, Option, DownloadFileOption } from '../option';
import { DefaultHandler } from './default-handler';

export class DefaultHttp implements Http {
  private _handlers: Handler[] = new Array<Handler>();

  private _debug: boolean = false;

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
  request(option: Option): Promise<any> {
    // 将全局参数和本次请求参数合并，优先级：本次请求参数 > 全局参数
    this.prepare(option);
    return new Promise((resolve, reject) => {
      this.fetch(option, resolve, reject);
      let task = null;
      if (this.isRequestOption(option)) {
        task = wx.request(option as RequestOption);
      } else if (this.isUploadFileOption(option)) {
        task = wx.uploadFile(option as UploadFileOption);
      } else {
        task = wx.downloadFile(option as DownloadFileOption);
      }
      option.task = task;
    })
  }

  private isRequestOption(option: Option): option is RequestOption {
    return (option as RequestOption).data !== undefined;
  }
  private isUploadFileOption(option: Option): option is UploadFileOption {
    return (option as UploadFileOption).name !== undefined;
  }
  // private isDownloadFileOption(option: Option): option is DownloadFileOption {
  //   return (option as DownloadFileOption).filePath !== undefined;
  // }

  private prepare(option: Option) {
    Object.assign(option, this.params, option);
    if (this.handlers?.length > 0) {
      for (const handler of this.handlers) {
        if (handler.preHandler && !handler.preHandler(option)) {
          break
        }
      }
    }
  }

  /**
   * 发送服务
   * @param resolve
   * @param reject
   */
  private fetch(option: Option, resolve: (value?: any) => void, reject: (reason?: any) => void): void {
    option.success = (result: WechatMiniprogram.RequestSuccessCallbackResult) => { // 请求成功
      if (this.debug) {
        if (this.isRequestOption(option)) {
          console.log("==>" + option?.method + " " + option.url + "\n<==" + JSON.stringify(result));
        } else if (this.isUploadFileOption(option)) {
          console.log("==>" + option?.filePath + " upload to " + option.url + "\n<==" + JSON.stringify(result));
        } else {
          console.log("==>download for " + option.url + "\n<==" + JSON.stringify(result));
        }
        // console.log("==>" + JSON.stringify(option));
      }
      if (result.statusCode !== 200) {
        this.failHandler(result, option)
        reject(result)
        return;
      }
      const res: any = result.data
      if (!res) {
        this.successHandler(res, option);
        resolve(result)
        return;
      }
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
    }
    option.fail = (res: WechatMiniprogram.GeneralCallbackResult) => { // 请求失败
      // 主动取消
      if (res.errMsg.endsWith('abort')) {
        if (option.failRetry) {
          option.failRetry.retry = 0
        }
      }
      // TODO 重试还存在问题
      if (option.failRetry && option.failRetry.retry-- > 0) {
        console.log("retry：" + (option.failRetry.retry + 1));
        const delay = option.failRetry.delay;
        // if (delay > 0) {
        // }
        return this.fetch(option, resolve, reject);
      }
      this.failHandler(res, option)
      const sysError: any = {};
      if (option.codeFieldName) {
        sysError[option.codeFieldName] = -1;
      }
      // 翻译错误信息
      if (option.msgFieldName) {
        sysError[option.msgFieldName] = errMsg.get(res.errMsg) || res.errMsg;
      }
      reject(sysError)
    }
    option.complete = (res: WechatMiniprogram.GeneralCallbackResult) => {
      if (this.handlers?.length > 0) {
        for (const handler of this.handlers) {
          if (handler.postHandler && !handler.postHandler(res)) {
            break
          }
        }
      }
    }
  }

  /**
   * 交易成功处理
   *
   * @private
   * @param {*} resp
   * @memberof Http
   */
  private successHandler(resp: any, option?: Option) {
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
  private failHandler(res: any, option: Option) {
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

  /**
   * 将本地资源上传到服务器
   * @param url 开发者服务器地址
   * @param filePath 要上传文件资源的路径 (本地路径)
   * @param name 文件对应的 key，开发者在服务端可以通过这个 key 获取文件的二进制内容
   * @param formData HTTP 请求中其他额外的 form data
   */
  upload(url: string, filePath: string, name: string, formData?: any): Promise<any> {
    return this.request({
      url,
      filePath,
      name,
      formData
    })
  }

  /**
   * 下载文件资源到本地
   * @param url 下载地址
   */
  download(url: string): Promise<any> {
    return this.request({
      url
    })
  }

}
