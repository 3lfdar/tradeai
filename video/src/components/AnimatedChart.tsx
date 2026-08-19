import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {theme, font} from '../theme';
import {Candle, candleBounds} from './Candles';

export type PriceLevel = {
  price: number;
  label: string;
  color: string;
  /** فریمی که خط شروع به کشیده‌شدن می‌کند */
  at: number;
};

type Props = {
  candles: Candle[];
  levels?: PriceLevel[];
  width: number;
  height: number;
  /** کندل‌ها از این فریم شروع به ظاهر شدن می‌کنند */
  startAt?: number;
  /** فاصله‌ی فریمی بین ظاهر شدن هر کندل */
  stagger?: number;
};

/**
 * چارت کندلی که کندل‌ها یکی‌یکی بالا می‌آیند و خطوط ورود/حد ضرر/تارگت
 * با انیمیشن روی آن کشیده می‌شوند.
 */
export const AnimatedChart: React.FC<Props> = ({
  candles,
  levels = [],
  width,
  height,
  startAt = 0,
  stagger = 1.6,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const padLeft = width * 0.04;
  const padRight = width * 0.16; // جا برای برچسب قیمت‌ها
  const padY = height * 0.08;
  const plotW = width - padLeft - padRight;
  const plotH = height - padY * 2;

  const {max, min} = candleBounds(
    candles,
    levels.map((l) => l.price)
  );
  const y = (price: number) =>
    padY + ((max - price) / (max - min)) * plotH;

  const slot = plotW / candles.length;
  const bodyW = Math.max(2, slot * 0.62);

  return (
    <svg width={width} height={height} style={{overflow: 'visible'}}>
      {/* خطوط راهنمای افقی */}
      {[0, 0.25, 0.5, 0.75, 1].map((t) => (
        <line
          key={t}
          x1={padLeft}
          x2={padLeft + plotW}
          y1={padY + t * plotH}
          y2={padY + t * plotH}
          stroke={theme.border}
          strokeWidth={1}
        />
      ))}

      {candles.map((candle, i) => {
        const appear = spring({
          frame: frame - startAt - i * stagger,
          fps,
          config: {damping: 200, mass: 0.4},
        });
        if (appear <= 0) return null;

        const up = candle.c >= candle.o;
        const color = up ? theme.green : theme.red;
        const cx = padLeft + slot * i + slot / 2;

        const yOpen = y(candle.o);
        const yClose = y(candle.c);
        const top = Math.min(yOpen, yClose);
        const fullH = Math.max(2, Math.abs(yClose - yOpen));

        // کندل از خط باز شدن رشد می‌کند
        const grownH = fullH * appear;
        const grownTop = up ? yOpen - grownH : yOpen;

        return (
          <g key={i} opacity={appear}>
            <line
              x1={cx}
              x2={cx}
              y1={interpolate(appear, [0, 1], [yOpen, y(candle.h)])}
              y2={interpolate(appear, [0, 1], [yOpen, y(candle.l)])}
              stroke={color}
              strokeWidth={Math.max(1, bodyW * 0.16)}
            />
            <rect
              x={cx - bodyW / 2}
              y={grownTop}
              width={bodyW}
              height={grownH}
              fill={color}
              rx={Math.min(2, bodyW * 0.15)}
            />
          </g>
        );
      })}

      {/* خطوط ورود / حد ضرر / تارگت */}
      {levels.map((level, i) => {
        const progress = spring({
          frame: frame - level.at,
          fps,
          config: {damping: 200, mass: 0.6},
        });
        if (progress <= 0) return null;

        const ly = y(level.price);
        const labelW = width * 0.145;

        return (
          <g key={i}>
            <line
              x1={padLeft}
              x2={padLeft + (plotW + padRight * 0.2) * progress}
              y1={ly}
              y2={ly}
              stroke={level.color}
              strokeWidth={3}
              strokeDasharray="10 8"
              opacity={0.9}
            />
            <g opacity={interpolate(progress, [0.6, 1], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            })}>
              <rect
                x={width - labelW - 4}
                y={ly - height * 0.032}
                width={labelW}
                height={height * 0.064}
                rx={height * 0.014}
                fill={level.color}
              />
              <text
                x={width - labelW / 2 - 4}
                y={ly + height * 0.014}
                textAnchor="middle"
                fontFamily={font}
                fontWeight={800}
                fontSize={height * 0.038}
                fill={theme.bg}
              >
                {level.label}
              </text>
            </g>
          </g>
        );
      })}
    </svg>
  );
};
