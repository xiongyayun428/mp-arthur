import { Option } from './option'

/**
 * HTTP网络请求
 */
export interface Http {
  /**
   * 是否debug模式
   */
  readonly debug: boolean

  /**
   * 网络请求（普通请求、上传请求、下载请求）
   * @param option 请求参数：RequestOption | UploadFileOption | DownloadFileOption
   */
  request(option: Option): Promise<any>

  /**
   * GET网络请求
   * @param url 请求地址
   * @param data 请求数据
   */
  get(url: string, data?: any): Promise<any>

  /**
   * POST网络请求
   * @param url 请求地址
   * @param data 请求数据
   */
  post(url: string, data?: any): Promise<any>

  /**
   * PUT网络请求
   * @param url 请求地址
   * @param data 请求数据
   */
  put(url: string, data?: any): Promise<any>

  /**
   * DELETE网络请求
   * @param url 请求地址
   * @param data 请求数据
   */
  delete(url: string, data?: any): Promise<any>

  /**
   * HEAD网络请求
   * @param url 请求地址
   * @param data 请求数据
   */
  head(url: string, data?: any): Promise<any>

  /**
   * TRACE网络请求
   * @param url 请求地址
   * @param data 请求数据
   */
  trace(url: string, data?: any): Promise<any>

  /**
   * CONNECT网络请求
   * @param url 请求地址
   * @param data 请求数据
   */
  connect(url: string, data?: any): Promise<any>

  /**
   * OPTIONS网络请求
   * @param url 请求地址
   * @param data 请求数据
   */
  options(url: string, data?: any): Promise<any>
  /**
   * 将本地资源上传到服务器
   * @param url 开发者服务器地址
   * @param filePath 要上传文件资源的路径 (本地路径)
   * @param name 文件对应的 key，开发者在服务端可以通过这个 key 获取文件的二进制内容
   * @param formData HTTP 请求中其他额外的 form data
   */
  upload(url: string, filePath: string, name: string, formData?: any): Promise<any>

  /**
   * 下载文件资源到本地
   * @param url 下载地址
   */
  download(url: string): Promise<any>
}
