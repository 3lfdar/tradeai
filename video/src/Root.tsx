import React from 'react';
import {Composition} from 'remotion';
import {TradeAIVideo, TOTAL_SECONDS} from './Video';
import {FORMATS} from './format';

const FPS = 30;
const DURATION = Math.round(TOTAL_SECONDS * FPS);

/**
 * دو خروجی از یک سورس:
 *   npx remotion render Reels    out/reels.mp4     (۱۰۸۰×۱۹۲۰)
 *   npx remotion render YouTube  out/youtube.mp4   (۱۹۲۰×۱۰۸۰)
 */
export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Reels"
      component={TradeAIVideo}
      durationInFrames={DURATION}
      fps={FPS}
      width={FORMATS.reels.width}
      height={FORMATS.reels.height}
      defaultProps={{format: 'reels' as const}}
    />
    <Composition
      id="YouTube"
      component={TradeAIVideo}
      durationInFrames={DURATION}
      fps={FPS}
      width={FORMATS.youtube.width}
      height={FORMATS.youtube.height}
      defaultProps={{format: 'youtube' as const}}
    />
  </>
);
