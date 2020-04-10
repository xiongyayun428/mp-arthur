import { Handler } from "./handler";
import { HttpParams } from "./params";

/**
 * HTTP网络请求
 */
export interface Http {
  readonly debug: boolean;

  /**
   * GET网络请求
   * @param url 请求地址
   * @param data 请求数据
   */
  get(url: string, data?: any): Promise<any>;

  /**
   * POST网络请求
   * @param url 请求地址
   * @param data 请求数据
   */
  post(url: string, data?: any): Promise<any>;

  /**
   * PUT网络请求
   * @param url 请求地址
   * @param data 请求数据
   */
  put(url: string, data?: any): Promise<any>;

  /**
   * DELETE网络请求
   * @param url 请求地址
   * @param data 请求数据
   */
  delete(url: string, data?: any): Promise<any>;

  /**
   * HEAD网络请求
   * @param url 请求地址
   * @param data 请求数据
   */
  head(url: string, data?: any): Promise<any>;

  /**
   * TRACE网络请求
   * @param url 请求地址
   * @param data 请求数据
   */
  trace(url: string, data?: any): Promise<any>;

  /**
   * CONNECT网络请求
   * @param url 请求地址
   * @param data 请求数据
   */
  connect(url: string, data?: any): Promise<any>;

  /**
   * OPTIONS网络请求
   * @param url 请求地址
   * @param data 请求数据
   */
  options(url: string, data?: any): Promise<any>;

}
