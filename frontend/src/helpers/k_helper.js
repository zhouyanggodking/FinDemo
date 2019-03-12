// 六位代码00、200、300开头的都是深圳的股票，
// 00开头的是深圳A股，200开头的是深圳B股，300开头的是创业板(创业板都是在深市交易的)。
// 六位代码60、900开头的是上海的股票，60开头的都是上海A股，900开头的是上海B股。

export default class KHelper {
  // code
  // type: min, daily, weekly, monthly
  static getKChartUrl(code, type) {
    const tradeCenter = KHelper.getTradeCenter(code);
    return `http://image.sinajs.cn/newchart/${type}/n/${tradeCenter}${code}.gif`;
  }

  static getTradeCenter(code) {
    if (/^[023]/.test(code)) {
      return 'sz';
    }
    return 'sh';
  }
}
