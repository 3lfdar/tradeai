# استودیو ویدیوی تبلیغاتی

ساخت ویدیوی اینستاگرام و یوتیوب از **فوتیج واقعی**: کلیپ ضبط‌شده از سایت + ویدیوی خودت.
یک سورس → دو خروجی (۹:۱۶ و ۱۶:۹).

> **قانون این پروژه:** هیچ عدد، آمار یا ادعایی ساختگی وارد ویدیو نمی‌شود.
> هر چیزی در `src/content.ts` باید از سایت واقعی یا دیتای واقعی آمده باشد.
> مقدارهای `TODO` عمداً آنجا هستند تا پرشان کنی.

---

## پیش‌نیاز

```bash
cd video
npm install
```

ffmpeg کامل (با libx264) هم لازم است:

```bash
sudo apt-get install -y ffmpeg   # لینوکس
brew install ffmpeg              # مک
winget install ffmpeg            # ویندوز
```

---

## قدم ۱ — از سایت فیلم بگیر

آدرس و سناریوی ضبط در `capture/site.config.json` است. بعد:

```bash
node capture/record-site.mjs
```

خروجی در `public/footage/site/` — یک `mp4` و یک `png` برای هر شات.
**اسکرین‌شات‌ها را نگاه کن** تا مطمئن شوی سایت درست لود شده (نه صفحه‌ی خالی، نه صفحه‌ی لاگین).

### سناریوی ضبط

هر شات یک کلیپ جداست. قدم‌های موجود:

| action | کارش | پارامترها |
|---|---|---|
| `wait` | مکث | `ms` |
| `click` | کلیک روی المان | `selector`, `settleMs` |
| `hover` | بردن موس روی المان | `selector`, `settleMs` |
| `type` | تایپ آهسته در یک فیلد | `selector`, `text`, `delay` |
| `scrollTo` | اسکرول تا یک المان | `selector` |
| `scrollTour` | اسکرول نرم تا انتها | `durationMs`, `selector` (اختیاری) |

نمونه:

```json
{
  "name": "signal-flow",
  "steps": [
    {"action": "click", "selector": "button.analyze"},
    {"action": "wait", "ms": 2500},
    {"action": "scrollTo", "selector": "#results"}
  ]
}
```

> اگر اپ تمام‌صفحه است و `body` اسکرول ندارد، به `scrollTour` یک `selector` بده
> تا پنل داخلی را اسکرول کند. اسکریپت اگر چیزی برای اسکرول نبود هشدار می‌دهد
> و به‌جایش همان مدت صفحه را نگه می‌دارد، پس کلیپ خالی نمی‌ماند.

مرورگر را ببین برای دیباگ: `node capture/record-site.mjs --headed`

---

## قدم ۲ — فوتیج خودت را آماده کن

```bash
./scripts/prep-footage.sh raw/clip.mp4 public/footage/talking-head.mp4 --cut-silence
```

صدا را روی سطح استاندارد پلتفرم‌ها می‌آورد و سکوت‌ها را می‌برد.

**نکات ضبط:** صدا با میکروفون جدا · اگر افقی می‌گیری کمی خارج از مرکز بایست و بعد
`focusX` را در `content.ts` تنظیم کن تا در کراپ ۹:۱۶ درست بیفتی.

---

## قدم ۳ — محتوا را بنویس

`src/content.ts` را باز کن و همه‌ی `TODO`ها را پر کن — تیترها را **از روی خود سایت** بردار.
مسیر کلیپ‌های ضبط‌شده را هم در `siteShots` بگذار (مثلاً `'footage/site/hero.mp4'`).

زیرنویس آماده داری؟

```bash
node scripts/srt-to-cues.mjs subs.srt
```

ریتم سکانس‌ها: `src/Video.tsx` → `TIMELINE`.

---

## قدم ۴ — پیش‌نمایش و رندر

```bash
npm run studio        # پیش‌نمایش زنده با تایم‌لاین
./scripts/render.sh   # هر دو خروجی
```

- `out/instagram-reels.mp4` — ۱۰۸۰×۱۹۲۰
- `out/youtube.mp4` — ۱۹۲۰×۱۰۸۰

فقط یکی: `./scripts/render.sh reels` یا `./scripts/render.sh youtube`

---

## سکانس‌ها

| سکانس | فایل | محتوا |
|---|---|---|
| اینترو | `compositions/Intro.tsx` | لوگو + تیتر قلاب |
| نمایش سایت | `compositions/SiteTour.tsx` | کلیپ واقعی سایت داخل قاب مرورگر + تیتر |
| توک‌هد | `compositions/TalkingHead.tsx` | فوتیج خودت + زیرنویس + لوئر ثرد |
| اوترو | `compositions/Outro.tsx` | کال‌تو‌اکشن |

تعداد سکانس‌های سایت از طول آرایه‌ی `siteShots` می‌آید — کم و زیادش کن، تایم‌لاین خودش تنظیم می‌شود.

### کامپوننت‌های آماده ولی خارج از تایم‌لاین

`AnimatedChart`، `SignalCard`، `StatsScene`، `DeviceMockup` ساخته شده‌اند ولی در ویدیوی
پیش‌فرض نیستند — چون با دیتای ساختگی پر می‌شدند. اگر **دیتای واقعی** داری
(معاملات واقعی، آمار واقعی) می‌توانی برشان گردانی: در `Video.tsx` یک `<Sequence>` اضافه کن.

---

## چند نکته

**رنگ‌ها** در `src/theme.ts`‌اند. **نام برند** در `content.ts` → `brand.logo`.

**فونت:** وزیرمتن لوکال در `public/fonts/` — رندر بدون اینترنت هم کار می‌کند.

**رندر سریع برای تست:** `npx remotion render Reels out/t.mp4 --frames=0-90`

**فوتیج در گیت نمی‌رود** — `public/footage/` در `.gitignore` است.

---

## سایتی که لاگین می‌خواهد

لاگین یک مرحله‌ی **جدا** از ضبط است — عمداً. اینطوری صفحه‌ی ورود در فوتیج
تبلیغاتی نمی‌افتد و رمز روی ویدیو نمی‌رود.

در `capture/site.config.json` یک بلوک `auth` اضافه کن:

```json
{
  "url": "https://gryffin.uk/dashboard",
  "auth": {
    "url": "https://gryffin.uk/login",
    "successSelector": "#dashboard",
    "storageStatePath": ".auth/state.json",
    "steps": [
      {"action": "type",  "selector": "#email",    "text": "${GRYFFIN_USER}"},
      {"action": "type",  "selector": "#password", "text": "${GRYFFIN_PASSWORD}"},
      {"action": "click", "selector": "button[type=submit]"},
      {"action": "waitForSelector", "selector": "#dashboard"}
    ]
  }
}
```

اجرا:

```bash
GRYFFIN_USER=you@example.com GRYFFIN_PASSWORD=... node capture/record-site.mjs
```

- **رمز هرگز در کانفیگ نوشته نمی‌شود.** فقط `${ENV_VAR}`. اگر مقدار خام بنویسی
  اسکریپت جلویت را می‌گیرد و اجرا نمی‌شود — چون آن فایل در گیت می‌رود.
  (مقدار غیرمحرمانه؟ `"secret": false` بگذار.)
- سشن در `.auth/` ذخیره می‌شود (در `.gitignore` است) و دفعات بعد دوباره
  استفاده می‌شود. ورود دوباره: `--login`
- `successSelector` تأیید می‌کند واقعاً وارد شده‌ای. اگر پیدا نشود، اسکریپت
  با اسکرین‌شات `login-failed.png` متوقف می‌شود تا ببینی چه شد.

---

## یک محدودیت که باید بدانی

**ضبط مرورگر فقط وقتی فریم می‌سازد که تصویر تغییر کند.** دوره‌های ساکن
(انتظار برای لود، مکث بین حرکت‌ها) تقریباً هیچ فریمی تولید نمی‌کنند.

نتیجه‌ی عملی: کلیپ معمولاً از اولین حرکت شروع می‌شود، نه از لحظه‌ای که
انتظار داری، و طول فایل با ساعت دیواری دقیقاً یکی نیست. برای همین برش
خودکار ابتدای کلیپ **عمداً پیاده‌سازی نشده** — با تایم‌استمپ‌های نامطمئن،
دقت الکی بدتر از نبودنش است.

پس:

1. **کلیپ را ببین** قبل از اینکه در ویدیو استفاده‌اش کنی
2. اگر ابتدایش را می‌خواهی ببری، در همان شات `trimStartSeconds` بگذار:
   ```json
   {"name": "hero", "trimStartSeconds": 1.2, "steps": [...]}
   ```
3. برای سایت‌هایی که مدام حرکت دارند (چارت زنده، انیمیشن) این مشکل
   خیلی کمتر است، چون فریم‌ها پیوسته تولید می‌شوند
