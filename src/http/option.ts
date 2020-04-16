import { HttpParams } from "./params";

/**
 * 请求参数
 */
export interface RequestOption extends WechatMiniprogram.RequestOption, HttpParams {
  /**
   * 网络请求任务对象
   */
  task?: WechatMiniprogram.RequestTask;
}

export interface UploadFileOption extends WechatMiniprogram.UploadFileOption, HttpParams {
  /**
   * 网络上传任务的对象
   */
  task?: WechatMiniprogram.UploadTask;
}

export interface DownloadFileOption extends WechatMiniprogram.DownloadFileOption, HttpParams {
  /**
   * 网络下载任务的对象
   */
  task?: WechatMiniprogram.DownloadTask;
}

export type Option = RequestOption | UploadFileOption | DownloadFileOption
