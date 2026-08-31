import React from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import {Background} from '../components/Background';
import {AnimatedChart, PriceLevel} from '../components/AnimatedChart';
import {SignalCard, SignalRow} from '../components/SignalCard';
import {generateCandles, Candle} from '../components/Candles';
import {theme, font} from '../theme';
import {pick, useFormat} from '../format';

export type SignalSceneProps = {
  symbol: string;
  side: 'خرید' | 'فروش';
  timeframe: string;
  entry: number;
  stop: number;
  target: number;
  candles?: Candle[];
};

/**
 * سکانس تحلیل چارت: کندل‌ها می‌آیند، بعد خطوط ورود/حد ضرر/تارگت
 * کشیده می‌شوند و کارت سیگنال بالا می‌آید.
 */
export const SignalScene: React.FC<SignalSceneProps> = ({
  symbol,
  side,
  timeframe,
  entry,
  stop,
  target,
  candles: candlesProp,
}) => {
  const {width, height} = useVideoConfig();
  const format = useFormat();
  const vertical = format === 'reels';

  const candles = candlesProp ?? generateCandles(46, 11, entry * 0.985, entry * 0.012);

  const levels: PriceLevel[] = [
    {price: entry, label: 'ورود', color: theme.blue, at: 62},
    {price: stop, label: 'حد ضرر', color: theme.red, at: 72},
    {price: target, label: 'تارگت', color: theme.green, at: 82},
  ];

  const fmt = (n: number) =>
    n.toLocaleString('en-US', {maximumFractionDigits: n < 100 ? 4 : 2});

  const rr = Math.abs((target - entry) / (entry - stop));
  const rows: SignalRow[] = [
    {label: 'ورود', value: fmt(entry), color: theme.blue},
    {label: 'حد ضرر', value: fmt(stop), color: theme.red},
    {label: 'تارگت', value: fmt(target), color: theme.green},
    {label: 'ریسک به ریوارد', value: `1 : ${rr.toFixed(1)}`, color: theme.gold},
  ];

  const chartW = vertical ? width * 0.92 : width * 0.56;
  const chartH = vertical ? height * 0.42 : height * 0.74;
  const cardScale = vertical ? 1.0 : 0.86;

  return (
    <AbsoluteFill>
      <Background />

      {/* تیتر نماد و تایم‌فریم */}
      <div
        style={{
          position: 'absolute',
          top: pick(format, height * 0.07, height * 0.08),
          width: '100%',
          textAlign: 'center',
          fontFamily: font,
          direction: 'rtl',
        }}
      >
        <div
          style={{
            fontSize: pick(format, 68, 56),
            fontWeight: 800,
            color: theme.text,
            direction: 'ltr',
          }}
        >
          {symbol}
        </div>
        <div
          style={{
            fontSize: pick(format, 34, 30),
            fontWeight: 600,
            color: theme.muted,
            marginTop: 6,
          }}
        >
          تایم‌فریم {timeframe}
        </div>
      </div>

      <AbsoluteFill
        style={{
          flexDirection: vertical ? 'column' : 'row-reverse',
          alignItems: 'center',
          justifyContent: 'center',
          gap: vertical ? height * 0.035 : width * 0.05,
          padding: vertical ? `${height * 0.16}px 0 ${height * 0.06}px` : `${height * 0.12}px 0 0`,
        }}
      >
        <div style={{width: chartW, height: chartH}}>
          <AnimatedChart
            candles={candles}
            levels={levels}
            width={chartW}
            height={chartH}
            startAt={6}
            stagger={1.2}
          />
        </div>

        <SignalCard
          symbol={symbol}
          side={side}
          rows={rows}
          delay={92}
          scale={cardScale}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
