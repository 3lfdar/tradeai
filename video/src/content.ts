/**
 * ═══════════════════════════════════════════════════════════
 *  محتوای ویدیو — برای هر ویدیوی جدید فقط این فایل را عوض کن
 * ═══════════════════════════════════════════════════════════
 */
import {theme} from './theme';
import type {SubtitleCue} from './components/Subtitles';
import type {Stat} from './compositions/StatsScene';

export const brand = {
  handle: '@tradeai.pro',
  presenter: 'علی دهقان',
  presenterTitle: 'تحلیل‌گر بازار · TradeAI Pro',
};

export const intro = {
  headline: 'این ستاپ رو\nاز دست نده',
  sub: 'تحلیل کامل در ۶۰ ثانیه',
};

export const signal = {
  symbol: 'BTC/USDT',
  side: 'خرید' as const,
  timeframe: '۴ ساعته',
  entry: 64200,
  stop: 62400,
  target: 69500,
};

export const app = {
  title: 'با TradeAI Pro',
  features: [
    'تشخیص خودکار الگو',
    'هشدار لحظه‌ای ورود',
    'مدیریت ریسک هوشمند',
    'ژورنال معاملات',
  ],
  /** اسکرین‌ریکورد اپ را در public/footage/ بگذار و اینجا مسیرش را بنویس */
  screenSrc: undefined as string | undefined,
};

export const stats: Stat[] = [
  {label: 'بازدهی ماه', value: 18.4, decimals: 1, suffix: '%', color: theme.green},
  {label: 'نرخ برد', value: 71, suffix: '%', color: theme.blue},
  {label: 'تعداد معامله', value: 34, color: theme.gold},
  {label: 'بیشترین افت', value: 4.2, decimals: 1, suffix: '%', color: theme.red},
];

export const talkingHead = {
  /** فوتیج خودت را در public/footage/ بگذار، مثلاً 'footage/talking-head.mp4' */
  src: undefined as string | undefined,
  startFromSeconds: 0,
  /** اگر افقی گرفتی و صورتت وسط نیست، این را بین ۰ تا ۱ تنظیم کن */
  focusX: 0.5,
};

/** زیرنویس فارسی — زمان‌ها بر حسب ثانیه، نسبت به شروع سکانس توک‌هد */
export const cues: SubtitleCue[] = [
  {from: 0.0, to: 2.2, text: 'سلام رفقا، امروز میریم سراغ بیت‌کوین'},
  {from: 2.2, to: 5.0, text: 'یه ستاپ تمیز روی تایم‌فریم ۴ ساعته داریم'},
  {from: 5.0, to: 8.0, text: 'ناحیه‌ی حمایت رو سه بار تست کرده و نشکسته'},
];

export const outro = {
  cta: 'فالو کن تا\nستاپ بعدی رو نبینی از دست بدی',
  handle: brand.handle,
};
