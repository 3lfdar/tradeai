#!/usr/bin/env bash
#
# آماده‌سازی فوتیج خام برای Remotion
#   ۱. نرمال‌سازی صدا (سطح یکنواخت، استاندارد پلتفرم‌ها)
#   ۲. حذف بخش‌های سکوت (اختیاری)
#   ۳. تبدیل به فرمتی که Remotion سریع می‌خواند
#
# استفاده:
#   ./scripts/prep-footage.sh raw/my-clip.mp4 public/footage/talking-head.mp4
#   ./scripts/prep-footage.sh raw/my-clip.mp4 public/footage/talking-head.mp4 --cut-silence
#
source "$(dirname "$0")/lib.sh"

IN="${1:?ورودی را بده: ./prep-footage.sh <input> <output> [--cut-silence]}"
OUT="${2:?خروجی را بده}"
CUT_SILENCE="${3:-}"

mkdir -p "$(dirname "$OUT")"

if [ "$CUT_SILENCE" = "--cut-silence" ]; then
  log "حذف سکوت‌ها (زیر ۳۵- دسی‌بل و بلندتر از ۰٫۶ ثانیه)…"
  # silenceremove روی صدا، و ویدیو با آن هماهنگ می‌شود
  "$FFMPEG" -y -i "$IN" \
    -af "silenceremove=start_periods=1:start_duration=0.3:start_threshold=-35dB:detection=peak,\
aformat=dblp,areverse,\
silenceremove=start_periods=1:start_duration=0.3:start_threshold=-35dB:detection=peak,\
aformat=dblp,areverse,\
loudnorm=I=-16:TP=-1.5:LRA=11" \
    -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p \
    -c:a aac -b:a 192k \
    "$OUT"
else
  log "نرمال‌سازی صدا و انکود…"
  "$FFMPEG" -y -i "$IN" \
    -af "loudnorm=I=-16:TP=-1.5:LRA=11" \
    -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p \
    -c:a aac -b:a 192k \
    "$OUT"
fi

log "آماده شد: $OUT"
log "حالا مسیرش را در src/content.ts بنویس (نسبت به public/)."
