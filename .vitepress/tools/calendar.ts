/**
 * 表示农历和公历详细信息的接口
 */
interface LunarInfo {
    lYear: number;
    lMonth: number;
    lDay: number;
    Animal: string;
    IMonthCn: string;
    IDayCn: string;
    cYear: number;
    cMonth: number;
    cDay: number;
    gzYear: string;
    gzMonth: string;
    gzDay: string;
    isToday: boolean;
    isLeap: boolean;
    nWeek: number;
    ncWeek: string;
    isTerm: boolean;
    Term: string | null;
    astro: string;
}

/**
 * 定义日历对象结构
 */
interface Calendar {
    lunarInfo: Readonly<number[]>;
    solarMonth: Readonly<number[]>;
    Gan: Readonly<string[]>;
    Zhi: Readonly<string[]>;
    Animals: Readonly<string[]>;
    solarTerm: Readonly<string[]>;
    sTermInfo: Readonly<string[]>;
    nStr1: Readonly<string[]>;
    nStr2: Readonly<string[]>;
    nStr3: Readonly<string[]>;
    lYearDays: (y: number) => number;
    leapMonth: (y: number) => number;
    leapDays: (y: number) => number;
    monthDays: (y: number, m: number) => number;
    solarDays: (y: number, m: number) => number;
    toGanZhiYear: (lYear: number) => string;
    toAstro: (cMonth: number, cDay: number) => string;
    toGanZhi: (offset: number) => string;
    getTerm: (y: number, n: number) => number;
    toChinaMonth: (m: number) => string;
    toChinaDay: (d: number) => string;
    getAnimal: (y: number) => string;
    solar2lunar: (y?: number, m?: number, d?: number) => LunarInfo;
    lunar2solar: (y: number, m: number, d: number, isLeapMonth?: boolean) => LunarInfo;
}

// ======================================================================
// 常量定义 (Constants Definition)
// ======================================================================

const MILLISECONDS_IN_A_DAY = 86400000;

// 星座名称
const ASTRO_NAMES = [
    "摩羯", "水瓶", "双鱼", "白羊", "金牛", "双子", "巨蟹", 
    "狮子", "处女", "天秤", "天蝎", "射手", "摩羯"
];

// 每个星座的起始日期（临界日）
const ASTRO_CUTOFF_DAYS = [20, 19, 21, 20, 21, 22, 23, 23, 23, 24, 23, 22];


export const calendar: Calendar = {

  /**
    * 农历1900-2100的润大小信息表
    */
  lunarInfo:[0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2,
          0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977,
          0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970,
          0x06566,0x0d4a0,0x0ea50,0x06e95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950,
          0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557,
          0x06ca0,0x0b550,0x15355,0x04da0,0x0a5b0,0x14573,0x052b0,0x0a9a8,0x0e950,0x06aa0,
          0x0aea6,0x0ab50,0x04b60,0x0aae4,0x0a570,0x05260,0x0f263,0x0d950,0x05b57,0x056a0,
          0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250,0x0d558,0x0b540,0x0b6a0,0x195a6,
          0x095b0,0x049b0,0x0a974,0x0a4b0,0x0b27a,0x06a50,0x06d40,0x0af46,0x0ab60,0x09570,
          0x04af5,0x04970,0x064b0,0x074a3,0x0ea50,0x06b58,0x05ac0,0x0ab60,0x096d5,0x092e0,
          0x0c960,0x0d954,0x0d4a0,0x0da50,0x07552,0x056a0,0x0abb7,0x025d0,0x092d0,0x0cab5,
          0x0a950,0x0b4a0,0x0baa4,0x0ad50,0x055d9,0x04ba0,0x0a5b0,0x15176,0x052b0,0x0a930,
          0x07954,0x06aa0,0x0ad50,0x05b52,0x04b60,0x0a6e6,0x0a4e0,0x0d260,0x0ea65,0x0d530,
          0x05aa0,0x076a3,0x096d0,0x04afb,0x04ad0,0x0a4d0,0x1d0b6,0x0d250,0x0d520,0x0dd45,
          0x0b5a0,0x056d0,0x055b2,0x049b0,0x0a577,0x0a4b0,0x0aa50,0x1b255,0x06d20,0x0ada0,
          0x14b63,0x09370,0x049f8,0x04970,0x064b0,0x168a6,0x0ea50, 0x06b20,0x1a6c4,0x0aae0,
          0x0a2e0,0x0d2e3,0x0c960,0x0d557,0x0d4a0,0x0da50,0x05d55,0x056a0,0x0a6d0,0x055d4,
          0x052d0,0x0a9b8,0x0a950,0x0b4a0,0x0b6a6,0x0ad50,0x055a0,0x0aba4,0x0a5b0,0x052b0,
          0x0b273,0x06930,0x07337,0x06aa0,0x0ad50,0x14b55,0x04b60,0x0a570,0x054e4,0x0d160,
          0x0e968,0x0d520,0x0daa0,0x16aa6,0x056d0,0x04ae0,0x0a9d4,0x0a2d0,0x0d150,0x0f252,
          0x0d520],

  /**
    * 公历每个月份的天数
    */
  solarMonth:[31,28,31,30,31,30,31,31,30,31,30,31],

  /**
    * 天干
    */
  Gan:["\u7532","\u4e59","\u4e19","\u4e01","\u620a","\u5df1","\u5e9a","\u8f9b","\u58ec","\u7678"],

  /**
    * 地支
    */
  Zhi:["\u5b50","\u4e11","\u5bc5","\u536f","\u8fb0","\u5df3","\u5348","\u672a","\u7533","\u9149","\u620c","\u4ea5"],

  /**
    * 生肖
    */
  Animals:["\u9f20","\u725b","\u864e","\u5154","\u9f99","\u86c7","\u9a6c","\u7f8a","\u7334","\u9e21","\u72d7","\u732a"],

  /**
    * 24节气
    */
  solarTerm:["\u5c0f\u5bd2","\u5927\u5bd2","\u7acb\u6625","\u96e8\u6c34","\u60ca\u86f0","\u6625\u5206","\u6e05\u660e","\u8c37\u96e8","\u7acb\u590f","\u5c0f\u6ee1","\u8292\u79cd","\u590f\u81f3","\u5c0f\u6691","\u5927\u6691","\u7acb\u79cb","\u5904\u6691","\u767d\u9732","\u79cb\u5206","\u5bd2\u9732","\u971c\u964d","\u7acb\u51ac","\u5c0f\u96ea","\u5927\u96ea","\u51ac\u81f3"],

  /**
    * 1900-2100各年的24节气日期数据
    */
  sTermInfo:['9778397bd097c36b0b6fc9274c91aa','97b6b97bd19801ec9210c965cc920e','97bcf97c3598082c95f8c965cc920f',
            '97bd0b06bdb0722c965ce1cfcc920f','b027097bd097c36b0b6fc9274c91aa','97b6b97bd19801ec9210c965cc920e',
            '97bcf97c359801ec95f8c965cc920f','97bd0b06bdb0722c965ce1cfcc920f','b027097bd097c36b0b6fc9274c91aa',
            '97b6b97bd19801ec9210c965cc920e','97bcf97c359801ec95f8c965cc920f','97bd0b06bdb0722c965ce1cfcc920f',
            'b027097bd097c36b0b6fc9274c91aa','9778397bd19801ec9210c965cc920e','97b6b97bd19801ec95f8c965cc920f',
            '97bd09801d98082c95f8e1cfcc920f','97bd097bd097c36b0b6fc9210c8dc2','9778397bd197c36c9210c9274c91aa',
            '97b6b97bd19801ec95f8c965cc920e','97bd09801d98082c95f8e1cfcc920f','97bd097bd097c36b0b6fc9210c8dc2',
            '9778397bd097c36c9210c9274c91aa','97b6b97bd19801ec95f8c965cc920e','97bcf97c3598082c95f8e1cfcc920f',
            '97bd097bd097c36b0b6fc9210c8dc2','9778397bd097c36c9210c9274c91aa','97b6b97bd19801ec9210c965cc920e',
            '97bcf97c3598082c95f8c965cc920f','97bd097bd097c35b0b6fc920fb0722','9778397bd097c36b0b6fc9274c91aa',
            '97b6b97bd19801ec9210c965cc920e','97bcf97c3598082c95f8c965cc920f','97bd097bd097c35b0b6fc920fb0722',
            '9778397bd097c36b0b6fc9274c91aa','97b6b97bd19801ec9210c965cc920e','97bcf97c359801ec95f8c965cc920f',
            '97bd097bd097c35b0b6fc920fb0722','9778397bd097c36b0b6fc9274c91aa','97b6b97bd19801ec9210c965cc920e',
            '97bcf97c359801ec95f8c965cc920f','97bd097bd097c35b0b6fc920fb0722','9778397bd097c36b0b6fc9274c91aa',
            '97b6b97bd19801ec9210c965cc920e','97bcf97c359801ec95f8c965cc920f','97bd097bd07f595b0b6fc920fb0722',
            '9778397bd097c36b0b6fc9210c8dc2','9778397bd19801ec9210c9274c920e','97b6b97bd19801ec95f8c965cc920f',
            '97bd07f5307f595b0b0bc920fb0722','7f0e397bd097c36b0b6fc9210c8dc2','9778397bd097c36c9210c9274c920e',
            '97b6b97bd19801ec95f8c965cc920f','97bd07f5307f595b0b0bc920fb0722','7f0e397bd097c36b0b6fc9210c8dc2',
            '9778397bd097c36c9210c9274c91aa','97b6b97bd19801ec9210c965cc920e','97bd07f1487f595b0b0bc920fb0722',
            '7f0e397bd097c36b0b6fc9210c8dc2','9778397bd097c36b0b6fc9274c91aa','97b6b97bd19801ec9210c965cc920e',
            '97bcf7f1487f595b0b0bb0b6fb0722','7f0e397bd097c35b0b6fc920fb0722','9778397bd097c36b0b6fc9274c91aa',
            '97b6b97bd19801ec9210c965cc920e','97bcf7f1487f595b0b0bb0b6fb0722','7f0e397bd097c35b0b6fc920fb0722',
            '9778397bd097c36b0b6fc9274c91aa','97b6b97bd19801ec9210c965cc920e','97bcf7f1487f531b0b0bb0b6fb0722',
            '7f0e397bd097c35b0b6fc920fb0722','9778397bd097c36b0b6fc9274c91aa','97b6b97bd19801ec9210c965cc920e',
            '97bcf7f1487f531b0b0bb0b6fb0722','7f0e397bd07f595b0b6fc920fb0722','9778397bd097c36b0b6fc9274c91aa',
            '97b6b97bd19801ec9210c9274c920e','97bcf7f0e47f531b0b0bb0b6fb0722','7f0e397bd07f595b0b0bc920fb0722',
            '9778397bd097c36b0b6fc9210c91aa','97b6b97bd197c36c9210c9274c920e','97bcf7f0e47f531b0b0bb0b6fb0722',
            '7f0e397bd07f595b0b0bc920fb0722','9778397bd097c36b0b6fc9210c8dc2','9778397bd097c36c9210c9274c920e',
            '97b6b7f0e47f531b0723b0b6fb0722','7f0e37f5307f595b0b0bc920fb0722','7f0e397bd097c36b0b6fc9210c8dc2',
            '9778397bd097c36b0b70c9274c91aa','97b6b7f0e47f531b0723b0b6fb0721','7f0e37f1487f595b0b0bb0b6fb0722',
            '7f0e397bd097c35b0b6fc9210c8dc2','9778397bd097c36b0b6fc9274c91aa','97b6b7f0e47f531b0723b0b6fb0721',
            '7f0e27f1487f595b0b0bb0b6fb0722','7f0e397bd097c35b0b6fc920fb0722','9778397bd097c36b0b6fc9274c91aa',
            '97b6b7f0e47f531b0723b0b6fb0721','7f0e27f1487f531b0b0bb0b6fb0722','7f0e397bd097c35b0b6fc920fb0722',
            '9778397bd097c36b0b6fc9274c91aa','97b6b7f0e47f531b0723b0b6fb0721','7f0e27f1487f531b0b0bb0b6fb0722',
            '7f0e397bd097c35b0b6fc920fb0722','9778397bd097c36b0b6fc9274c91aa','97b6b7f0e47f531b0723b0b6fb0721',
            '7f0e27f1487f531b0b0bb0b6fb0722','7f0e397bd07f595b0b0bc920fb0722','9778397bd097c36b0b6fc9274c91aa',
            '97b6b7f0e47f531b0723b0787b0721','7f0e27f0e47f531b0b0bb0b6fb0722','7f0e397bd07f595b0b0bc920fb0722',
            '9778397bd097c36b0b6fc9210c91aa','97b6b7f0e47f149b0723b0787b0721','7f0e27f0e47f531b0723b0b6fb0722',
            '7f0e397bd07f595b0b0bc920fb0722','9778397bd097c36b0b6fc9210c8dc2','977837f0e37f149b0723b0787b0721',
            '7f07e7f0e47f531b0723b0b6fb0722','7f0e37f5307f595b0b0bc920fb0722','7f0e397bd097c35b0b6fc9210c8dc2',
            '977837f0e37f14998082b0787b0721','7f07e7f0e47f531b0723b0b6fb0721','7f0e37f1487f595b0b0bb0b6fb0722',
            '7f0e397bd097c35b0b6fc9210c8dc2','977837f0e37f14998082b0787b06bd','7f07e7f0e47f531b0723b0b6fb0721',
            '7f0e27f1487f531b0b0bb0b6fb0722','7f0e397bd097c35b0b6fc920fb0722','977837f0e37f14998082b0787b06bd',
            '7f07e7f0e47f531b0723b0b6fb0721','7f0e27f1487f531b0b0bb0b6fb0722','7f0e397bd097c35b0b6fc920fb0722',
            '977837f0e37f14998082b0787b06bd','7f07e7f0e47f531b0723b0b6fb0721','7f0e27f1487f531b0b0bb0b6fb0722',
            '7f0e397bd07f595b0b0bc920fb0722','977837f0e37f14998082b0787b06bd','7f07e7f0e47f531b0723b0b6fb0721',
            '7f0e27f1487f531b0b0bb0b6fb0722','7f0e397bd07f595b0b0bc920fb0722','977837f0e37f14998082b0787b06bd',
            '7f07e7f0e47f149b0723b0787b0721','7f0e27f0e47f531b0b0bb0b6fb0722','7f0e397bd07f595b0b0bc920fb0722',
            '977837f0e37f14998082b0723b06bd','7f07e7f0e37f149b0723b0787b0721','7f0e27f0e47f531b0723b0b6fb0722',
            '7f0e397bd07f595b0b0bc920fb0722','977837f0e37f14898082b0723b02d5','7ec967f0e37f14998082b0787b0721',
            '7f07e7f0e47f531b0723b0b6fb0722','7f0e37f1487f595b0b0bb0b6fb0722','7f0e37f0e37f14898082b0723b02d5',
            '7ec967f0e37f14998082b0787b0721','7f07e7f0e47f531b0723b0b6fb0722','7f0e37f1487f531b0b0bb0b6fb0722',
            '7f0e37f0e37f14898082b0723b02d5','7ec967f0e37f14998082b0787b06bd','7f07e7f0e47f531b0723b0b6fb0721',
            '7f0e37f1487f531b0b0bb0b6fb0722','7f0e37f0e37f14898082b072297c35','7ec967f0e37f14998082b0787b06bd',
            '7f07e7f0e47f531b0723b0b6fb0721','7f0e27f1487f531b0b0bb0b6fb0722','7f0e37f0e37f14898082b072297c35',
            '7ec967f0e37f14998082b0787b06bd','7f07e7f0e47f531b0723b0b6fb0721','7f0e27f1487f531b0b0bb0b6fb0722',
            '7f0e37f0e366aa89801eb072297c35','7ec967f0e37f14998082b0787b06bd','7f07e7f0e47f149b0723b0787b0721',
            '7f0e27f1487f531b0b0bb0b6fb0722','7f0e37f0e366aa89801eb072297c35','7ec967f0e37f14998082b0723b06bd',
            '7f07e7f0e47f149b0723b0787b0721','7f0e27f0e47f531b0723b0b6fb0722','7f0e37f0e366aa89801eb072297c35',
            '7ec967f0e37f14998082b0723b06bd','7f07e7f0e37f14998083b0787b0721','7f0e27f0e47f531b0723b0b6fb0722',
            '7f0e37f0e366aa89801eb072297c35','7ec967f0e37f14898082b0723b02d5','7f07e7f0e37f14998082b0787b0721',
            '7f07e7f0e47f531b0723b0b6fb0722','7f0e36665b66aa89801e9808297c35','665f67f0e37f14898082b0723b02d5',
            '7ec967f0e37f14998082b0787b0721','7f07e7f0e47f531b0723b0b6fb0722','7f0e36665b66a449801e9808297c35',
            '665f67f0e37f14898082b0723b02d5','7ec967f0e37f14998082b0787b06bd','7f07e7f0e47f531b0723b0b6fb0721',
            '7f0e36665b66a449801e9808297c35','665f67f0e37f14898082b072297c35','7ec967f0e37f14998082b0787b06bd',
            '7f07e7f0e47f531b0723b0b6fb0721','7f0e26665b66a449801e9808297c35','665f67f0e37f1489801eb072297c35',
            '7ec967f0e37f14998082b0787b06bd','7f07e7f0e47f531b0723b0b6fb0721','7f0e27f1487f531b0b0bb0b6fb0722'],
  
  /**
    * 数字转中文
    */
  nStr1:["\u65e5","\u4e00","\u4e8c","\u4e09","\u56db","\u4e94","\u516d","\u4e03","\u516b","\u4e5d","\u5341"],

  /**
    * 日期转农历称呼
    */
  nStr2:["\u521d","\u5341","\u5eff","\u5345"],

  /**
    * 月份转农历称呼
    */
  nStr3:["\u6b63","\u4e8c","\u4e09","\u56db","\u4e94","\u516d","\u4e03","\u516b","\u4e5d","\u5341","\u51ac","\u814a"],

  lYearDays: function(y) {
      let sum = 348;
      for(let i=0x8000; i>0x8; i>>=1) { 
          sum += (this.lunarInfo[y-1900] & i) ? 1: 0; 
      }
      return sum + this.leapDays(y);
  },

  leapMonth: function(y) {
      return this.lunarInfo[y-1900] & 0xf;
  },

  leapDays: function(y) {
      if(this.leapMonth(y))  {
          return (this.lunarInfo[y-1900] & 0x10000) ? 30: 29;
      }
      return 0;
  },

  monthDays: function(y,m) {
      if (m < 1 || m > 12) {
          throw new Error("Month must be between 1 and 12.");
      }
      return (this.lunarInfo[y-1900] & (0x10000 >> m)) ? 30: 29;
  },

  solarDays: function(y,m) {
      if (m < 1 || m > 12) {
          throw new Error("Month must be between 1 and 12.");
      }
      const monthIndex = m - 1;
      if(monthIndex === 1) { // February
          return ((y % 4 === 0 && y % 100 !== 0) || y % 400 === 0) ? 29 : 28;
      } else {
          return this.solarMonth[monthIndex];
      }
  },

  toGanZhiYear: function(lYear) {
      const ganKey = (lYear - 3) % 10 || 10;
      const zhiKey = (lYear - 3) % 12 || 12;
      return this.Gan[ganKey-1] + this.Zhi[zhiKey-1];
  },

  toAstro: function(cMonth, cDay) {
    const index = cMonth - 1;
    const astroIndex = cDay < ASTRO_CUTOFF_DAYS[index] ? index : index + 1;
    return ASTRO_NAMES[astroIndex] + "座";
  },

  toGanZhi: function(offset) {
      return this.Gan[offset%10] + this.Zhi[offset%12];
  },

  getTerm: function(y, n) {
      if(y < 1900 || y > 2100) throw new Error("Year out of range (1900-2100).");
      if(n < 1 || n > 24) throw new Error("Solar term number out of range (1-24).");
      
      const table = this.sTermInfo[y - 1900];
      const termData: number[] = [];

      // This logic relies on string parsing of hex-encoded data, which is complex.
      // The original implementation, while verbose, is explicit. We'll stick to a cleaned-up version of it.
      const infoStrs: string[] = [];
      for (let i = 0; i < 6; i++) {
        infoStrs.push(parseInt('0x' + table.substr(i * 5, 5)).toString());
      }
      
      const calday: number[] = [];
      infoStrs.forEach(str => {
          // Pad string to ensure substr works correctly if a leading zero was dropped by parseInt.
          const paddedStr = str.padStart(6, '0');
          calday.push(parseInt(paddedStr.substr(0, 1)));
          calday.push(parseInt(paddedStr.substr(1, 2)));
          calday.push(parseInt(paddedStr.substr(3, 1)));
          calday.push(parseInt(paddedStr.substr(4, 2)));
      });

      return calday[n-1];
  },

  toChinaMonth: function(m) {
      if(m < 1 || m > 12) throw new Error("Month out of range (1-12).");
      return this.nStr3[m-1] + "月";
  },

  toChinaDay: function(d){
      let s;
      switch (d) {
          case 10: s = '初十'; break;
          case 20: s = '二十'; break;
          case 30: s = '三十'; break;
          default:
              s = this.nStr2[Math.floor(d/10)];
              s += this.nStr1[d%10];
      }
      return s;
  },

  getAnimal: function(y) {
      return this.Animals[(y - 4) % 12];
  },

  solar2lunar: function (y, m, d) {
      let solarDate: Date;
      if (y === undefined || m === undefined || d === undefined) {
          solarDate = new Date();
      } else {
          solarDate = new Date(y, m - 1, d);
      }

      const cYear = solarDate.getFullYear();
      const cMonth = solarDate.getMonth() + 1;
      const cDay = solarDate.getDate();

      if (cYear < 1900 || cYear > 2100) {
          throw new Error("Date out of range (1900-2100).");
      }
      if (cYear === 1900 && cMonth === 1 && cDay < 31) {
          throw new Error("Date out of range (min 1900-01-31).");
      }

      let offset = (Date.UTC(cYear, cMonth - 1, cDay) - Date.UTC(1900, 0, 31)) / MILLISECONDS_IN_A_DAY;
      
      let i = 1900;
      let temp = 0;
      for(; i < 2101 && offset > 0; i++) {
          temp = this.lYearDays(i);
          offset -= temp;
      }
      if(offset < 0) {
          offset += temp; 
          i--;
      }

      const lYear = i;
      const leap = this.leapMonth(lYear);
      let isLeap = false;
      
      for(i=1; i<13 && offset>0; i++) {
          if(leap > 0 && i === (leap + 1) && !isLeap) {
              --i; 
              isLeap = true; 
              temp = this.leapDays(lYear);
          } else {
              temp = this.monthDays(lYear, i);
          }

          if(isLeap && i === (leap + 1)) { 
              isLeap = false; 
          }
          offset -= temp;
      }

      if(offset === 0 && leap > 0 && i === leap + 1) {
          if(isLeap) {
              isLeap = false;
          } else {
              isLeap = true; 
              --i;
          }
      }
      if(offset < 0){ 
          offset += temp; 
          --i;
      }

      const lMonth = i;
      const lDay = offset + 1;

      const sm = cMonth - 1;
      const firstNode = this.getTerm(cYear, (cMonth * 2 - 1));
      const secondNode = this.getTerm(cYear, (cMonth * 2));

      let gzM = this.toGanZhi((cYear - 1900) * 12 + cMonth + 11);
      if (cDay >= firstNode) {
          gzM = this.toGanZhi((cYear - 1900) * 12 + cMonth + 12);
      }
      
      let Term: string | null = null;
      if (firstNode === cDay) Term = this.solarTerm[cMonth * 2 - 2];
      if (secondNode === cDay) Term = this.solarTerm[cMonth * 2 - 1];

      const dayCyclical = Date.UTC(cYear, sm, 1, 0, 0, 0, 0) / MILLISECONDS_IN_A_DAY + 25567 + 10;
      const gzD = this.toGanZhi(dayCyclical + cDay - 1);

      const today = new Date();
      const isToday = today.getFullYear() === cYear && today.getMonth() + 1 === cMonth && today.getDate() === cDay;
      
      let nWeek = solarDate.getDay();
      const ncWeek = "星期" + this.nStr1[nWeek];
      if (nWeek === 0) nWeek = 7;

      return {
          lYear, lMonth, lDay,
          Animal: this.getAnimal(lYear),
          IMonthCn: (isLeap ? "闰" : "") + this.toChinaMonth(lMonth),
          IDayCn: this.toChinaDay(lDay),
          cYear, cMonth, cDay,
          gzYear: this.toGanZhiYear(lYear),
          gzMonth: gzM,
          gzDay: gzD,
          isToday, isLeap,
          nWeek,
          ncWeek: ncWeek,
          isTerm: Term !== null,
          Term,
          astro: this.toAstro(cMonth, cDay)
      };
  },

  lunar2solar: function(y, m, d, isLeapMonth = false) {
      const leapMonth = this.leapMonth(y);
      const daysInMonth = isLeapMonth ? this.leapDays(y) : this.monthDays(y, m);

      if (y < 1900 || y > 2100) throw new Error("Lunar year out of range (1900-2100).");
      if (isLeapMonth && leapMonth !== m) throw new Error(`Year ${y} does not have a leap month for month ${m}.`);
      if (d < 1 || d > daysInMonth) throw new Error("Day is out of range for the given lunar month.");
      if (y === 1900 && m === 1 && d < 31) throw new Error("Date out of range (min 1900-01-31).");
      if (y === 2100 && m === 12 && d > 1) throw new Error("Date out of range (max 2100-12-01).");
      
      let offset = 0;
      for(let i = 1900; i < y; i++) {
          offset += this.lYearDays(i);
      }

      let hasAddedLeapMonth = false;
      for(let i = 1; i < m; i++) {
          const currentLeapMonth = this.leapMonth(y);
          if(!hasAddedLeapMonth && currentLeapMonth > 0 && currentLeapMonth <= i) {
              offset += this.leapDays(y);
              hasAddedLeapMonth = true;
          }
          offset += this.monthDays(y,i);
      }

      if(isLeapMonth) {
          offset += this.monthDays(y, m);
      }
      
      const startDateUTC = Date.UTC(1900, 0, 31); // 1900年农历正月初一为公历1月31日
      const targetDate = new Date(startDateUTC + (offset + d - 1) * MILLISECONDS_IN_A_DAY);
      
      return this.solar2lunar(targetDate.getUTCFullYear(), targetDate.getUTCMonth() + 1, targetDate.getUTCDate());
  }
};