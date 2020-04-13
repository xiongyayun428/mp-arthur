/**
 * 请求参数
 */
export interface HttpParams {
  withBaseURL: boolean;
  baseURL: string;
  requestTask?: WechatMiniprogram.RequestTask;
  successCode: string[];
  codeFieldName: string;
  msgFieldName: string;
  dataFieldName: string;
}
/**
 * 请求默认参数
 */
export class DefaultHttpParams implements HttpParams {
  baseURL = "";
  withBaseURL = false;
  successCode = ["000000"];
  codeFieldName = "rtnCode";
  msgFieldName = "rtnMsg";
  dataFieldName = "rtnData";
}
