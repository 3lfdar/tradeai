import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

/** عدد که از صفر تا مقدار نهایی بالا می‌رود (برای آمار و نتایج) */
export const CountUp: React.FC<{
  to: number;
  delay?: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}> = ({to, delay = 0, duration = 30, decimals = 0, prefix = '', suffix = ''}) => {
  const frame = useCurrentFrame();
  const value = interpolate(frame - delay, [0, duration], [0, to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });

  return (
    <span style={{direction: 'ltr', display: 'inline-block'}}>
      {prefix}
      {value.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
};

/** کارت آماری برای بخش نتایج معاملات */
export const StatTile: React.FC<{
  label: string;
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  color: string;
  delay?: number;
  scale?: number;
}> = ({label, value, decimals, prefix, suffix, color, delay = 0, scale = 1}) => {
  const {fps} = useVideoConfig();
  const frame = useCurrentFrame();
  const appear = interpolate(frame - delay, [0, fps * 0.4], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        direction: 'rtl',
        background: `linear-gradient(160deg, rgba(15,24,41,0.95), rgba(12,18,32,0.95))`,
        border: `1px solid ${color}44`,
        borderRadius: 24 * scale,
        padding: `${26 * scale}px ${30 * scale}px`,
        width: '100%',
        boxSizing: 'border-box',
        opacity: appear,
        transform: `translateY(${interpolate(appear, [0, 1], [30, 0])}px)`,
      }}
    >
      <div style={{fontSize: 26 * scale, color: '#64748b', fontWeight: 500}}>{label}</div>
      <div
        style={{
          fontSize: 68 * scale,
          fontWeight: 800,
          color,
          marginTop: 8 * scale,
          lineHeight: 1.1,
        }}
      >
        <CountUp
          to={value}
          delay={delay + 4}
          decimals={decimals}
          prefix={prefix}
          suffix={suffix}
        />
      </div>
    </div>
  );
};
