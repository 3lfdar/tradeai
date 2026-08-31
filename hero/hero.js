/**
 * هیروی فریم‌به‌فریم — ویدیو با اسکرول جلو و عقب می‌رود.
 *
 * تگ <video> در کار نیست. دنباله‌ای از تصویر روی <canvas> کشیده می‌شود و
 * موقعیت اسکرول شماره‌ی فریم را تعیین می‌کند. برای همین می‌شود وسط حرکت
 * ایستاد یا برگشت عقب — کاری که با seek کردن ویدیو روان درنمی‌آید.
 *
 * استفاده:
 *   <div class="hero-track"><div class="hero-pin"><canvas></canvas></div></div>
 *   <script src="hero.js"></script>
 *   <script>heroScroll({ track: '.hero-track' });</script>
 */
function heroScroll(options = {}) {
  const cfg = {
    track: '.hero-track',
    canvas: 'canvas',
    /** پوشه‌ی فریم‌ها و الگوی نام‌گذاری */
    dir: 'frames',
    dirMobile: 'frames-mobile',
    /** زیر این عرض، نسخه‌ی سبک استفاده می‌شود */
    mobileBreakpoint: 700,
    count: 479,
    ext: 'webp',
    pad: 3,
    /** رنگ پشت کادر — باید با پس‌زمینه‌ی خود ویدیو یکی باشد */
    background: '#000',
    /** ۰ تا ۱ — هرچه کمتر، حرکت نرم‌تر و کمی کندتر دنبال اسکرول می‌آید */
    smoothing: 0.18,
    /** چند فریم اول قبل از نمایش لود شود */
    eager: 24,
    ...options,
  };

  const track = document.querySelector(cfg.track);
  if (!track) return;
  const canvas = track.querySelector(cfg.canvas);
  if (!canvas) return;

  const ctx = canvas.getContext('2d', {alpha: false});
  ctx.imageSmoothingQuality = 'high';

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const dir = innerWidth < cfg.mobileBreakpoint ? cfg.dirMobile : cfg.dir;
  const src = (i) => `${dir}/f${String(i + 1).padStart(cfg.pad, '0')}.${cfg.ext}`;

  const images = new Array(cfg.count);

  const load = (i) => new Promise((res) => {
    if (images[i]) return res();
    const img = new Image();
    img.decoding = 'async';
    img.onload = img.onerror = () => { images[i] = img; res(); };
    img.src = src(i);
  });

  /** اگر فریم هدف هنوز نرسیده، نزدیک‌ترین فریم موجود کشیده می‌شود */
  const nearest = (i) => {
    if (images[i]?.naturalWidth) return images[i];
    for (let d = 1; d < cfg.count; d++) {
      if (images[i - d]?.naturalWidth) return images[i - d];
      if (images[i + d]?.naturalWidth) return images[i + d];
    }
    return null;
  };

  let shown = -1;

  const draw = (i, force) => {
    if (i === shown && !force) return;
    const img = nearest(i);
    if (!img) return;
    shown = i;

    // کل فریم باید دیده شود، پس با کوچک‌ترین ضریب جا داده می‌شود.
    // اطرافش با رنگ پس‌زمینه پر می‌شود که با مشکیِ خود ویدیو یکی است.
    const iw = img.naturalWidth, ih = img.naturalHeight;
    const s = Math.min(canvas.width / iw, canvas.height / ih);
    const w = iw * s, h = ih * s;

    ctx.fillStyle = cfg.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
  };

  const resize = () => {
    // سقف چگالی پیکسل: بالاتر از این، بوم از منبع بزرگ‌تر می‌شود و
    // تصویر بی‌دلیل کش می‌آید.
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(canvas.clientWidth * dpr);
    canvas.height = Math.round(canvas.clientHeight * dpr);
    draw(shown < 0 ? 0 : shown, true);
  };

  const progress = () => {
    const r = track.getBoundingClientRect();
    const total = r.height - innerHeight;
    return total <= 0 ? 0 : Math.min(1, Math.max(0, -r.top / total));
  };

  // فریم هدف فوراً عوض می‌شود، فریم نمایشی نرم دنبالش می‌رود.
  // روانیِ حرکت بیشتر از اینجا می‌آید تا از تعداد فریم.
  let smooth = 0;
  const tick = () => {
    const target = progress() * (cfg.count - 1);
    smooth += (target - smooth) * (reduced ? 1 : cfg.smoothing);
    draw(Math.round(smooth));
    requestAnimationFrame(tick);
  };

  addEventListener('resize', resize);

  (async () => {
    // چند فریم اول را زود می‌آوریم تا صفحه از همان ابتدا تصویر داشته باشد
    await Promise.all(Array.from({length: Math.min(cfg.eager, cfg.count)}, (_, i) => load(i)));
    resize();
    requestAnimationFrame(tick);

    // بقیه به ترتیب و دسته‌دسته، تا رشته‌ی اصلی قفل نشود
    for (let i = cfg.eager; i < cfg.count; i += 16) {
      await Promise.all(
        Array.from({length: Math.min(16, cfg.count - i)}, (_, k) => load(i + k))
      );
    }
  })();
}
