import React from 'react';

export type Format = 'reels' | 'youtube';

export const FORMATS: Record<Format, {width: number; height: number}> = {
  /** اینستاگرام ریلز / یوتیوب شورتس / تیک‌تاک */
  reels: {width: 1080, height: 1920},
  /** یوتیوب افقی */
  youtube: {width: 1920, height: 1080},
};

export const FormatContext = React.createContext<Format>('reels');

export const useFormat = () => React.useContext(FormatContext);

export const useIsVertical = () => useFormat() === 'reels';

/**
 * انتخاب مقدار بر اساس نسبت تصویر — تا یک سورس، دو خروجی درست بدهد
 * و متن‌ها در حالت عمودی بزرگ‌تر و خواناتر باشند.
 */
export const pick = <T,>(format: Format, vertical: T, horizontal: T): T =>
  format === 'reels' ? vertical : horizontal;
