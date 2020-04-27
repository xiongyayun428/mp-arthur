export class DateUtil {
  /**
   * 时间格式化
   * @param time
   * @param reg
   */
  static format(time: number | string | Date, reg: string) {
    const date = (typeof time === 'string' || typeof time === 'number') ? new Date(time) : time
    const map: any = {}
    map.yyyy = date.getFullYear()
    map.yy = ('' + map.yyyy).substr(2)
    map.M = date.getMonth() + 1
    map.MM = (map.M < 10 ? '0' : '') + map.M
    map.d = date.getDate()
    map.dd = (map.d < 10 ? '0' : '') + map.d
    map.H = date.getHours()
    map.HH = (map.H < 10 ? '0' : '') + map.H
    map.m = date.getMinutes()
    map.mm = (map.m < 10 ? '0' : '') + map.m
    map.s = date.getSeconds()
    map.ss = (map.s < 10 ? '0' : '') + map.s

    return reg.replace(/\byyyy|yy|MM|M|dd|d|HH|H|mm|m|ss|s\b/g, $1 => map[$1])
  }
}
