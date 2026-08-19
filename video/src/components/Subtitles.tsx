import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {theme, font} from '../theme';

export type SubtitleCue = {
  /** ثانیه‌ی شروع و پایان نسبت به ابتدای ویدیو */
  from: number;
  to: number;
  text: string;
};

/**
 * زیرنویس فارسی. کیوها را در src/content.ts بنویس یا از فایل SRT بساز
 * (اسکریپت scripts/srt-to-cues.mjs).
 */
export const Subtitles: React.FC<{
  cues: SubtitleCue[];
  fps: number;
  scale?: number;
}> = ({cues, fps, scale = 1}) => {
  const frame = useCurrentFrame();
  const t = frame / fps;
  const active = cues.find((c) => t >= c.from && t < c.to);
  if (!active) return null;

  const localFrame = frame - active.from * fps;
  const fade = interpolate(localFrame, [0, 4], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        direction: 'rtl',
        fontFamily: font,
        fontWeight: 800,
        fontSize: 52 * scale,
        lineHeight: 1.45,
        color: theme.text,
        textAlign: 'center',
        maxWidth: '86%',
        margin: '0 auto',
        opacity: fade,
        transform: `translateY(${interpolate(fade, [0, 1], [14, 0])}px)`,
        textShadow: '0 4px 24px rgba(0,0,0,0.9), 0 2px 6px rgba(0,0,0,0.9)',
      }}
    >
      {active.text}
    </div>
  );
};
