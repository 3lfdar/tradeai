export type Candle = {o: number; h: number; l: number; c: number};

/**
 * تولید کندل‌های شبه‌واقعی و قابل تکرار (seed ثابت → همیشه یک نتیجه).
 * برای وقتی که دیتای واقعی نداری و فقط لوک چارت را می‌خواهی.
 */
export const generateCandles = (
  count: number,
  seed = 7,
  start = 100,
  volatility = 2.4
): Candle[] => {
  let s = seed;
  const rand = () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  };

  const candles: Candle[] = [];
  let price = start;
  // شیب ملایم صعودی تا چارت داستان داشته باشد
  for (let i = 0; i < count; i++) {
    const drift = (i / count) * volatility * 0.9;
    const o = price;
    const move = (rand() - 0.45) * volatility + drift * 0.12;
    const c = o + move;
    const h = Math.max(o, c) + rand() * volatility * 0.5;
    const l = Math.min(o, c) - rand() * volatility * 0.5;
    candles.push({o, h, l, c});
    price = c;
  }
  return candles;
};

export const candleBounds = (candles: Candle[], extra: number[] = []) => {
  const highs = candles.map((c) => c.h).concat(extra);
  const lows = candles.map((c) => c.l).concat(extra);
  const max = Math.max(...highs);
  const min = Math.min(...lows);
  const pad = (max - min) * 0.12;
  return {max: max + pad, min: min - pad};
};
