export interface HttpParams {
  withBaseURL: boolean;
  baseURL: string;
  requestTask?: WechatMiniprogram.RequestTask;
  successCode: string[];
  codeFieldName: string;
  msgFieldName: string;
  dataFieldName: string;
}

export class DefaultHttpParams implements HttpParams {
  baseURL = "";
  withBaseURL = false;
  successCode = ["000000"];
  codeFieldName = "rtnCode";
  msgFieldName = "rtnMsg";
  dataFieldName = "rtnData";
}
