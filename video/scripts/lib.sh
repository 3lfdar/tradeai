#!/usr/bin/env bash
# توابع مشترک اسکریپت‌ها
set -euo pipefail

# ffmpeg کامل لازم است (با libx264 و aac).
# نسخه‌ی همراه playwright بریده است و انکود نمی‌کند، پس رد می‌شود.
find_ffmpeg() {
  local candidate tmp
  tmp=$(mktemp)
  trap "rm -f $tmp" RETURN
  for candidate in "${FFMPEG_PATH:-}" "$(command -v ffmpeg 2>/dev/null || true)"; do
    [ -n "$candidate" ] || continue
    # نکته: grep -q با pipefail باعث SIGPIPE می‌شود، پس خروجی را اول می‌گیریم
    if [ -x "$candidate" ] && "$candidate" -hide_banner -encoders 2>/dev/null > "$tmp" && grep -q libx264 "$tmp"; then
      echo "$candidate"
      return
    fi
  done

  cat >&2 <<'MSG'
ffmpeg کامل (با libx264) پیدا نشد.

  لینوکس:  sudo apt-get install -y ffmpeg
  مک:      brew install ffmpeg
  ویندوز:  winget install ffmpeg

اگر ffmpeg جای غیرمعمولی نصب است:  export FFMPEG_PATH=/path/to/ffmpeg
MSG
  exit 1
}

FFMPEG=$(find_ffmpeg)

log() { printf '\033[36m▸\033[0m %s\n' "$*"; }
