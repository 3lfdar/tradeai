#!/usr/bin/env bash
#
# ساخت دنباله‌ی فریم از یک ویدیو.
#
#   ./build-frames.sh hero.mp4
#   ./build-frames.sh hero.mp4 --no-interpolate     # فقط فریم‌های واقعی
#
set -euo pipefail

IN="${1:?ویدیوی ورودی را بده: ./build-frames.sh hero.mp4}"
MODE="${2:-}"

# ffmpeg کامل لازم است
command -v ffmpeg >/dev/null || { echo "ffmpeg نصب نیست."; exit 1; }

# ۲۴fps ورودی را با درون‌یابی حرکت به ۴۸ می‌رساند.
# نصف فریم‌ها ساختگی می‌شوند — روی حرکت نرم تمیز درمی‌آید،
# روی حرکت تند ممکن است کشیده شود. با --no-interpolate خاموشش کن.
INTERP="minterpolate=fps=48:mi_mode=mci:mc_mode=aobmc:vsbmc=1,"
[ "$MODE" = "--no-interpolate" ] && INTERP=""

# اگر ویدیوی تو واترمارک ندارد، این را خالی بگذار.
# مختصات برای کادر ۷۲۰×۱۲۸۰ تنظیم شده است.
DELOGO="delogo=x=602:y=1230:w=112:h=36,"

echo "▸ فریم‌های دسکتاپ (۶۶۰ پیکسل)…"
rm -rf frames && mkdir frames
ffmpeg -v error -y -i "$IN" \
  -vf "${DELOGO}${INTERP}scale=660:-2" \
  -c:v libwebp -quality 64 frames/f%03d.webp

echo "▸ فریم‌های موبایل (۳۸۰ پیکسل)…"
rm -rf frames-mobile && mkdir frames-mobile
ffmpeg -v error -y -i "$IN" \
  -vf "${DELOGO}${INTERP}scale=380:-2" \
  -c:v libwebp -quality 62 frames-mobile/f%03d.webp

N=$(ls frames | wc -l)
echo
echo "✓ $N فریم ساخته شد."
echo "  حالا در hero.js مقدار count را روی $N بگذار."
