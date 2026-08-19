#!/usr/bin/env node
/**
 * ضبط ویدیو از سایت واقعی با مرورگر.
 *
 *   node capture/record-site.mjs                      # از capture/site.config.json می‌خواند
 *   node capture/record-site.mjs --url https://x.com  # آدرس را دستی بده
 *   node capture/record-site.mjs --headed             # مرورگر را ببین (برای دیباگ)
 *
 * خروجی: یک فایل mp4 برای هر شات در outDir، به‌علاوه screenshots برای بازبینی.
 */
import {chromium} from 'playwright';
import {readFileSync, mkdirSync, existsSync, readdirSync, renameSync, rmSync} from 'node:fs';
import {join, dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? undefined : args[i + 1];
};
const has = (name) => args.includes(`--${name}`);

const config = JSON.parse(
  readFileSync(flag('config') ?? join(root, 'capture/site.config.json'), 'utf8')
);
const url = flag('url') ?? config.url;
const outDir = resolve(root, config.outDir ?? 'public/footage/site');
const viewport = config.viewport ?? {width: 1600, height: 900};

if (!url || url.includes('example.com')) {
  console.error('آدرس سایت را در capture/site.config.json بنویس یا با --url بده.');
  process.exit(1);
}

mkdirSync(outDir, {recursive: true});

/** کرومیوم محلی را پیدا کن تا دانلود لازم نشود */
const findChromium = () => {
  if (process.env.CHROMIUM_PATH) return process.env.CHROMIUM_PATH;
  const base = '/opt/pw-browsers';
  if (!existsSync(base)) return undefined; // playwright خودش پیدا می‌کند
  const dir = readdirSync(base).find((d) => /^chromium-\d+$/.test(d));
  return dir ? join(base, dir, 'chrome-linux', 'chrome') : undefined;
};

const findFfmpeg = () => {
  for (const candidate of [process.env.FFMPEG_PATH, 'ffmpeg']) {
    if (!candidate) continue;
    try {
      const out = execFileSync(candidate, ['-hide_banner', '-encoders'], {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      });
      if (out.includes('libx264')) return candidate;
    } catch {
      /* بعدی را امتحان کن */
    }
  }
  return undefined;
};

/** طول یک فایل ویدیویی بر حسب ثانیه */
const probeDuration = (ffmpegPath, file) => {
  // ffprobe همیشه کنار ffmpeg نیست؛ از خروجی خود ffmpeg می‌خوانیم
  try {
    execFileSync(ffmpegPath, ['-i', file], {stdio: ['ignore', 'ignore', 'pipe']});
  } catch (err) {
    const match = /Duration: (\d+):(\d+):([\d.]+)/.exec(err.stderr?.toString() ?? '');
    if (match) {
      const [, h, m, sec] = match;
      return Number(h) * 3600 + Number(m) * 60 + Number(sec);
    }
  }
  return 0;
};

/** اجرای یک قدم از سناریوی شات */
const runStep = async (page, step) => {
  switch (step.action) {
    case 'wait':
      await page.waitForTimeout(step.ms ?? 1000);
      break;

    case 'click':
      await page.click(step.selector, {timeout: step.timeout ?? 8000});
      await page.waitForTimeout(step.settleMs ?? 1200);
      break;

    case 'hover':
      await page.hover(step.selector, {timeout: step.timeout ?? 8000});
      await page.waitForTimeout(step.settleMs ?? 900);
      break;

    case 'type':
      await page.click(step.selector, {timeout: step.timeout ?? 8000});
      // تایپ آهسته تا در ویدیو طبیعی به نظر برسد
      await page.type(step.selector, step.text, {delay: step.delay ?? 90});
      await page.waitForTimeout(step.settleMs ?? 1000);
      break;

    case 'scrollTo':
      await page.locator(step.selector).scrollIntoViewIfNeeded({timeout: step.timeout ?? 8000});
      await page.waitForTimeout(step.settleMs ?? 1200);
      break;

    case 'scrollTour': {
      // اسکرول نرم تا انتها — حرکت یکنواخت، نه پرشی.
      // selector اختیاری: برای اپ‌هایی که body اسکرول ندارد و پنل داخلی اسکرول می‌شود.
      const duration = step.durationMs ?? 8000;
      const scrolled = await page.evaluate(
        async ({ms, selector}) => {
          const el = selector ? document.querySelector(selector) : null;
          if (selector && !el) return 'missing';

          const total = el
            ? el.scrollHeight - el.clientHeight
            : document.body.scrollHeight - window.innerHeight;
          if (total <= 2) return 'nothing-to-scroll';

          const start = performance.now();
          await new Promise((done) => {
            const tick = (now) => {
              const t = Math.min(1, (now - start) / ms);
              // easing ملایم در ابتدا و انتها
              const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
              const y = total * eased;
              if (el) el.scrollTop = y;
              else window.scrollTo(0, y);
              if (t < 1) requestAnimationFrame(tick);
              else done();
            };
            requestAnimationFrame(tick);
          });
          return 'ok';
        },
        {ms: duration, selector: step.selector ?? null}
      );

      if (scrolled !== 'ok') {
        // صفحه اسکرول ندارد (اپ تمام‌صفحه) — به‌جای کلیپ یک‌ثانیه‌ای، همان مدت را نگه دار
        console.warn(
          `  ⚠ اسکرول ممکن نبود (${scrolled}) — به‌جایش ${duration}ms صفحه نگه داشته شد.` +
            (step.selector ? '' : ' برای پنل داخلی، selector بده.')
        );
        await page.waitForTimeout(duration);
      }
      await page.waitForTimeout(600);
      break;
    }

    default:
      console.warn(`قدم ناشناخته: ${step.action}`);
  }
};

const chromiumPath = findChromium();
const browser = await chromium.launch({
  headless: !has('headed'),
  ...(chromiumPath ? {executablePath: chromiumPath} : {}),
});

const shots = config.shots?.length
  ? config.shots
  : [{name: 'auto-tour', steps: [{action: 'scrollTour', durationMs: 9000}]}];

const ffmpeg = findFfmpeg();
const produced = [];

for (const shot of shots) {
  console.log(`▸ ضبط شات «${shot.name}»…`);

  const rawDir = join(outDir, `.raw-${shot.name}`);
  const contextStart = Date.now();
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: 1,
    recordVideo: {dir: rawDir, size: viewport},
  });
  const page = await context.newPage();

  try {
    await page.goto(url, {waitUntil: 'networkidle', timeout: 60000});
  } catch {
    // بعضی سایت‌ها هیچ‌وقت networkidle نمی‌شوند (چارت زنده، وب‌سوکت)
    await page.goto(url, {waitUntil: 'domcontentloaded', timeout: 60000});
  }
  await page.waitForTimeout(config.waitAfterLoad ?? 3000);

  // از اینجا محتوای مفید شروع می‌شود؛ قبلش فقط لود شدن صفحه است
  const contentStart = (Date.now() - contextStart) / 1000;

  for (const step of shot.steps ?? []) {
    try {
      await runStep(page, step);
    } catch (err) {
      console.warn(`  ⚠ قدم ${step.action} رد شد: ${err.message.split('\n')[0]}`);
    }
  }

  const contentEnd = (Date.now() - contextStart) / 1000;

  await page.screenshot({path: join(outDir, `${shot.name}.png`)});
  await context.close(); // ویدیو در همین لحظه نوشته می‌شود

  const webm = readdirSync(rawDir).find((f) => f.endsWith('.webm'));
  if (!webm) {
    console.warn(`  ⚠ ویدیویی برای «${shot.name}» ساخته نشد`);
    continue;
  }

  const webmPath = join(rawDir, webm);
  if (ffmpeg) {
    const mp4Path = join(outDir, `${shot.name}.mp4`);
    // بخش لود شدن صفحه بریده می‌شود تا کلیپ از محتوای واقعی شروع کند.
    // تایم‌لاین webm با ساعت دیواری یکی نیست، پس از انتهای فایل برش می‌زنیم:
    // محتوای شات همیشه آخرین بخش ضبط است.
    const webmDuration = probeDuration(ffmpeg, webmPath);
    const contentLength = contentEnd - contentStart + (shot.leadInSeconds ?? 0.4);
    const trim = Math.max(0, webmDuration - contentLength);
    execFileSync(ffmpeg, [
      '-y',
      '-ss', trim.toFixed(2),
      '-i', webmPath,
      '-c:v', 'libx264', '-preset', 'medium', '-crf', '18',
      '-pix_fmt', 'yuv420p', '-r', '30',
      '-an',
      mp4Path,
    ], {stdio: 'ignore'});
    rmSync(rawDir, {recursive: true, force: true});
    produced.push(mp4Path);
    console.log(`  ✓ ${mp4Path}`);
  } else {
    // بدون ffmpeg هم چیزی از دست نمی‌رود — webm را نگه دار
    const keep = join(outDir, `${shot.name}.webm`);
    renameSync(webmPath, keep);
    rmSync(rawDir, {recursive: true, force: true});
    produced.push(keep);
    console.log(`  ✓ ${keep} (ffmpeg نبود، webm نگه داشته شد)`);
  }
}

await browser.close();

console.log(`\nتمام. ${produced.length} کلیپ در ${outDir}`);
console.log('اسکرین‌شات‌ها را ببین تا مطمئن شوی سایت درست لود شده، بعد مسیر کلیپ‌ها را در src/content.ts بگذار.');
