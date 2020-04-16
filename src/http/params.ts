/**
 * 全局请求参数
 */
export interface HttpParams {
  /**
   * 是否需要在url前面拼接根URL
   */
  withBaseURL?: boolean;
  /**
   * 根URL
   */
  baseURL?: string;
  /**
   * 请求返回成功码
   */
  successCode?: string[];
  /**
   * 请求返回码字段名
   */
  codeFieldName?: string;
  /**
   * 请求返回消息字段名
   */
  msgFieldName?: string;
  /**
   * 请求返回数据字段名
   */
  dataFieldName?: string;
  /**
   * 请求时是否有loading效果
   */
  loading?: boolean | {
    title: string
    /**
     * 延迟的时间，函数的调用会在该延迟之后发生，单位 ms。
     */
    delay: number;
  };
  /**
   * 请求失败时是否需要toast提示错误信息
   */
  toast?: boolean;
  /**
   * 失败重试
   */
  failRetry?: {
    /**
     * 当fail时的重试次数
     */
    retry: number;
    /**
     * 延迟的时间，函数的调用会在该延迟之后发生，单位 ms。
     */
    delay?: number;
  }

}
/**
 * 全局请求默认参数
 */
export class DefaultHttpParams implements HttpParams {
  baseURL = "";
  withBaseURL = false;
  successCode = ["000000"];
  codeFieldName = "rtnCode";
  msgFieldName = "rtnMsg";
  dataFieldName = "rtnData";
  loading = {
    title: "加载中...",
    delay: 100
  };
  toast = true;
  failRetry = {
    retry: 0,
    delay: 100
  }
}
