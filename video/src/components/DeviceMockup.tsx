import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {theme} from '../theme';

/**
 * قاب دستگاه برای نمایش اسکرین‌ریکورد اپ TradeAI.
 * children می‌تواند <Video>، <Img> یا <IFrame> باشد.
 */
export const DeviceMockup: React.FC<{
  variant?: 'phone' | 'desktop';
  width: number;
  delay?: number;
  children: React.ReactNode;
}> = ({variant = 'phone', width, delay = 0, children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame: frame - delay, fps, config: {damping: 16, mass: 0.8}});

  const isPhone = variant === 'phone';
  const height = isPhone ? width * (19.5 / 9) : width * (10 / 16);
  const radius = isPhone ? width * 0.09 : width * 0.02;
  const bezel = isPhone ? width * 0.022 : width * 0.012;

  return (
    <div
      style={{
        width,
        height,
        flexShrink: 0,
        borderRadius: radius,
        padding: bezel,
        background: `linear-gradient(150deg, ${theme.border2}, ${theme.bg3})`,
        boxShadow: `0 40px 120px rgba(0,0,0,0.7), 0 0 ${width * 0.15}px rgba(56,189,248,0.2)`,
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [70, 0])}px) scale(${interpolate(
          enter,
          [0, 1],
          [0.92, 1]
        )})`,
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: radius - bezel,
          overflow: 'hidden',
          background: theme.bg,
          position: 'relative',
        }}
      >
        {children}
        {isPhone ? (
          <div
            style={{
              position: 'absolute',
              top: width * 0.022,
              left: '50%',
              transform: 'translateX(-50%)',
              width: width * 0.26,
              height: width * 0.055,
              borderRadius: 999,
              background: '#000',
            }}
          />
        ) : null}
      </div>
    </div>
  );
};
