#!/usr/bin/env bash
#
# رندر هر دو خروجی + انکود نهایی مخصوص هر پلتفرم.
#
# استفاده:
#   ./scripts/render.sh            # هر دو
#   ./scripts/render.sh reels      # فقط اینستاگرام
#   ./scripts/render.sh youtube    # فقط یوتیوب
#
source "$(dirname "$0")/lib.sh"
cd "$(dirname "$0")/.."

WHICH="${1:-both}"
mkdir -p out

# اگر کرومیوم محلی هست، همان را استفاده کن تا دانلود لازم نشود
if [ -z "${REMOTION_BROWSER_EXECUTABLE:-}" ]; then
  LOCAL_SHELL=$(ls -d /opt/pw-browsers/chromium_headless_shell-*/chrome-linux/headless_shell 2>/dev/null | head -1 || true)
  [ -n "$LOCAL_SHELL" ] && export REMOTION_BROWSER_EXECUTABLE="$LOCAL_SHELL"
fi

render_reels() {
  log "رندر ریلز (۱۰۸۰×۱۹۲۰)…"
  npx remotion render Reels out/reels-raw.mp4 --concurrency=4

  log "انکود نهایی برای اینستاگرام…"
  # اینستاگرام H.264 High profile، ۳۰fps، AAC می‌خواهد
  "$FFMPEG" -y -i out/reels-raw.mp4 \
    -c:v libx264 -profile:v high -level 4.1 -preset slow -crf 20 \
    -pix_fmt yuv420p -r 30 -movflags +faststart \
    -c:a aac -b:a 192k -ar 48000 \
    out/instagram-reels.mp4
  log "✓ out/instagram-reels.mp4"
}

render_youtube() {
  log "رندر یوتیوب (۱۹۲۰×۱۰۸۰)…"
  npx remotion render YouTube out/youtube-raw.mp4 --concurrency=4

  log "انکود نهایی برای یوتیوب…"
  # یوتیوب بیت‌ریت بالاتر را نگه می‌دارد، پس crf پایین‌تر
  "$FFMPEG" -y -i out/youtube-raw.mp4 \
    -c:v libx264 -profile:v high -preset slow -crf 18 \
    -pix_fmt yuv420p -r 30 -movflags +faststart \
    -c:a aac -b:a 256k -ar 48000 \
    out/youtube.mp4
  log "✓ out/youtube.mp4"
}

case "$WHICH" in
  reels)   render_reels ;;
  youtube) render_youtube ;;
  both)    render_reels; render_youtube ;;
  *) echo "استفاده: $0 [reels|youtube|both]" >&2; exit 1 ;;
esac

log "تمام. خروجی‌ها در out/"
