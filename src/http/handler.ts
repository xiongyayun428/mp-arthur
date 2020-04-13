import { RequestOption } from './option'
import { HttpParams } from './params'

/**
 * 处理程序
 *
 * @export
 * @interface Handler
 */
export interface Handler {
  /**
   * 交易前置处理
   * @param option
   * @param params
   */
  preHandler?(option: RequestOption, params: HttpParams): boolean;
  /**
   * 交易后置处理
   * @param resp
   */
  postHandler?(resp: WechatMiniprogram.GeneralCallbackResult): boolean;
  /**
   * 交易成功
   * @param result
   * @param option
   */
  successHandler?(result: WechatMiniprogram.RequestSuccessCallbackResult, option?: RequestOption): boolean;
  /**
   * 交易失败
   * @param res
   * @param option
   * @param params
   */
  failHandler?(
    res: WechatMiniprogram.GeneralCallbackResult | WechatMiniprogram.RequestSuccessCallbackResult | any,
    option: RequestOption,
    params: HttpParams,
  ): boolean;
}
