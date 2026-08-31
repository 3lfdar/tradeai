/**
 * ═══════════════════════════════════════════════════════════
 *  محتوای ویدیوی تبلیغاتی — برای هر ویدیو فقط این فایل را عوض کن
 * ═══════════════════════════════════════════════════════════
 *
 *  ⚠️ قانون: هیچ عدد یا ادعایی را از خودت نساز.
 *     هر چیزی که اینجا می‌نویسی باید از سایت واقعی یا از دیتای
 *     واقعی خودت آمده باشد. مقادیر TODO را تا پر نشده‌اند رها نکن.
 */
import type {SubtitleCue} from './components/Subtitles';
import type {SiteShot} from './compositions/SiteTour';

export const brand = {
  /** نام برند در سه بخش: [عادی، آبی، طلایی] — در لوگو استفاده می‌شود */
  logo: ['Gry', 'ffin', ''] as const,
  logoMark: '⚡',
  siteUrl: 'gryffin.uk',
  handle: '@gryffin',
  presenter: 'TODO: اسم خودت',
  presenterTitle: 'TODO: عنوانت',
};

export const intro = {
  headline: 'TODO: جمله‌ی قلاب\nاز روی خود سایت',
  sub: 'TODO: زیرتیتر',
};

/**
 * سکانس‌های نمایش سایت.
 * src ها خروجی `node capture/record-site.mjs` هستند و در
 * public/footage/site/ ساخته می‌شوند.
 */
export const siteShots: SiteShot[] = [
  {
    src: undefined, // 'footage/site/hero.mp4'
    headline: 'TODO: تیتر از روی صفحه‌ی اول سایت',
    sub: 'TODO: توضیح یک‌خطی',
  },
  {
    src: undefined, // 'footage/site/scroll-tour.mp4'
    headline: 'TODO: تیتر بخش دوم',
    sub: 'TODO: توضیح یک‌خطی',
  },
];

export const talkingHead = {
  /** فوتیج خودت را در public/footage/ بگذار، مثلاً 'footage/talking-head.mp4' */
  src: undefined as string | undefined,
  startFromSeconds: 0,
  /** اگر افقی گرفتی و صورتت وسط نیست، بین ۰ تا ۱ تنظیم کن */
  focusX: 0.5,
};

/** زیرنویس فارسی — ثانیه، نسبت به شروع سکانس توک‌هد */
export const cues: SubtitleCue[] = [
  // با `node scripts/srt-to-cues.mjs subs.srt` بساز
];

export const outro = {
  cta: 'TODO: کال‌تو‌اکشن',
  handle: brand.siteUrl,
};
