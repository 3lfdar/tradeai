import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {theme, font} from '../theme';

/** لوگوی TradeAI Pro — همان چیدمان هدر اپ، با ورود انیمیشنی */
export const Logo: React.FC<{size?: number; delay?: number}> = ({
  size = 90,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const enter = spring({
    frame: frame - delay,
    fps,
    config: {damping: 14, mass: 0.7},
  });
  const markSpin = interpolate(enter, [0, 1], [-90, 0]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: size * 0.22,
        fontFamily: font,
        fontWeight: 800,
        fontSize: size,
        letterSpacing: '-0.02em',
        color: theme.text,
        opacity: enter,
        transform: `scale(${interpolate(enter, [0, 1], [0.8, 1])})`,
        direction: 'ltr',
      }}
    >
      <div
        style={{
          width: size * 1.15,
          height: size * 1.15,
          borderRadius: size * 0.3,
          background: `linear-gradient(135deg, ${theme.blue}, ${theme.purple})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: size * 0.62,
          boxShadow: `0 0 ${size * 0.7}px rgba(56,189,248,0.45)`,
          transform: `rotate(${markSpin}deg)`,
        }}
      >
        ⚡
      </div>
      <span>
        Trade
        <span style={{color: theme.blue, fontStyle: 'italic'}}>AI</span>
        <span style={{color: theme.gold}}> Pro</span>
      </span>
    </div>
  );
};
