#!/usr/bin/env node
/**
 * فایل SRT را به آرایه‌ی کیوهای زیرنویس تبدیل می‌کند تا در src/content.ts بچسبانی.
 *
 *   node scripts/srt-to-cues.mjs subs.srt
 *   node scripts/srt-to-cues.mjs subs.srt --offset 3   # اگر زیرنویس از وسط ویدیو شروع می‌شود
 */
import {readFileSync} from 'node:fs';

const [, , file, ...rest] = process.argv;
if (!file) {
  console.error('استفاده: node scripts/srt-to-cues.mjs <file.srt> [--offset <seconds>]');
  process.exit(1);
}

const offsetIdx = rest.indexOf('--offset');
const offset = offsetIdx === -1 ? 0 : Number(rest[offsetIdx + 1]) || 0;

const toSeconds = (stamp) => {
  const [h, m, s] = stamp.trim().replace(',', '.').split(':');
  return Number(h) * 3600 + Number(m) * 60 + Number(s);
};

const blocks = readFileSync(file, 'utf8')
  .replace(/\r/g, '')
  .trim()
  .split(/\n\n+/);

const cues = blocks.flatMap((block) => {
  const lines = block.split('\n');
  const timeLine = lines.find((l) => l.includes('-->'));
  if (!timeLine) return [];

  const [from, to] = timeLine.split('-->').map(toSeconds);
  const text = lines
    .slice(lines.indexOf(timeLine) + 1)
    .join(' ')
    .trim();
  if (!text) return [];

  return [{from: +(from - offset).toFixed(2), to: +(to - offset).toFixed(2), text}];
}).filter((c) => c.to > 0);

console.log('export const cues: SubtitleCue[] = [');
for (const c of cues) {
  console.log(`  {from: ${c.from}, to: ${c.to}, text: '${c.text.replace(/'/g, "\\'")}'},`);
}
console.log('];');
