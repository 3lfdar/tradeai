import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Background} from '../components/Background';
import {StatTile} from '../components/CountUp';
import {theme, font} from '../theme';
import {pick, useFormat} from '../format';

export type Stat = {
  label: string;
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  color: string;
};

/** سکانس نتایج و ریپورت معاملات — اعداد کانت‌آپ می‌شوند */
export const StatsScene: React.FC<{title: string; stats: Stat[]}> = ({
  title,
  stats,
}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const format = useFormat();
  const vertical = format === 'reels';
  const titleEnter = spring({frame, fps, config: {damping: 18}});

  return (
    <AbsoluteFill>
      <Background />
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          gap: pick(format, 50, 46),
          padding: `${height * 0.1}px ${width * 0.06}px`,
        }}
      >
        <div
          style={{
            direction: 'rtl',
            fontFamily: font,
            fontWeight: 800,
            fontSize: pick(format, 76, 64),
            color: theme.text,
            textAlign: 'center',
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [30, 0])}px)`,
          }}
        >
          {title}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: vertical ? '1fr 1fr' : `repeat(${Math.min(stats.length, 4)}, 1fr)`,
            gap: pick(format, 26, 32),
            width: vertical ? '88%' : 'auto',
          }}
        >
          {stats.map((stat, i) => (
            <StatTile
              key={stat.label}
              {...stat}
              color={stat.color}
              delay={16 + i * 7}
              scale={pick(format, 1.25, 0.95)}
            />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
