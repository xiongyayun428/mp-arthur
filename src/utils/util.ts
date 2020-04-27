export class Util {
  /**
   * 合并两个对象
   * @param obj1
   * @param obj2
   */
  static merge(obj1: any, obj2: any) {
    Object.keys(obj2).forEach(key => {
      if (Array.isArray(obj1[key]) && Array.isArray(obj2[key])) {
        obj1[key] = obj1[key].concat(obj2[key])
      } else if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
        obj1[key] = Object.assign(obj1[key], obj2[key])
      } else {
        obj1[key] = obj2[key]
      }
    })

    return obj1
  }

  /**
   * 比较数组是否相等
   * @param arr1
   * @param arr2
   */
  static compareArray(arr1: any[], arr2: any[]) {
    if (!Array.isArray(arr1) || !Array.isArray(arr2)) return false
    if (arr1.length !== arr2.length) return false

    for (let i = 0, len = arr1.length; i < len; i++) {
      if (arr1[i] !== arr2[i]) return false
    }

    return true
  }

}
