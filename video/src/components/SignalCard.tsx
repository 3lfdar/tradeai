import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {theme, font} from '../theme';

export type SignalRow = {label: string; value: string; color: string};

type Props = {
  symbol: string;
  side: 'خرید' | 'فروش';
  rows: SignalRow[];
  delay?: number;
  scale?: number;
};

/** کارت سیگنال: نماد، جهت، ورود / حد ضرر / تارگت */
export const SignalCard: React.FC<Props> = ({
  symbol,
  side,
  rows,
  delay = 0,
  scale = 1,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame: frame - delay, fps, config: {damping: 16}});
  const isLong = side === 'خرید';

  return (
    <div
      style={{
        direction: 'rtl',
        fontFamily: font,
        background: `linear-gradient(160deg, ${theme.card}, ${theme.bg2})`,
        border: `1px solid ${theme.border2}`,
        borderRadius: 28 * scale,
        padding: `${30 * scale}px ${34 * scale}px`,
        minWidth: 620 * scale,
        boxShadow: '0 30px 80px rgba(0,0,0,0.55)',
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [50, 0])}px) scale(${interpolate(
          enter,
          [0, 1],
          [0.94, 1]
        )})`,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: 20 * scale,
          borderBottom: `1px solid ${theme.border}`,
        }}
      >
        <div
          style={{
            fontSize: 40 * scale,
            fontWeight: 800,
            color: theme.text,
            direction: 'ltr',
          }}
        >
          {symbol}
        </div>
        <div
          style={{
            fontSize: 28 * scale,
            fontWeight: 800,
            color: theme.bg,
            background: isLong ? theme.green : theme.red,
            padding: `${8 * scale}px ${24 * scale}px`,
            borderRadius: 999,
          }}
        >
          {side}
        </div>
      </div>

      {rows.map((row, i) => {
        const rowEnter = spring({
          frame: frame - delay - 8 - i * 5,
          fps,
          config: {damping: 18},
        });
        return (
          <div
            key={row.label}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 20 * scale,
              opacity: rowEnter,
              transform: `translateX(${interpolate(rowEnter, [0, 1], [-24, 0])}px)`,
            }}
          >
            <span style={{fontSize: 28 * scale, color: theme.muted, fontWeight: 500}}>
              {row.label}
            </span>
            <span
              style={{
                fontSize: 36 * scale,
                fontWeight: 800,
                color: row.color,
                direction: 'ltr',
              }}
            >
              {row.value}
            </span>
          </div>
        );
      })}
    </div>
  );
};
