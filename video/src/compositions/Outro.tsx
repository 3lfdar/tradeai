import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Background} from '../components/Background';
import {Logo} from '../components/Logo';
import {theme, font} from '../theme';
import {pick, useFormat} from '../format';
import {brand} from '../content';

/** اوترو / کال‌تو‌اکشن */
export const Outro: React.FC<{cta: string; handle: string}> = ({cta, handle}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const format = useFormat();

  const ctaEnter = spring({frame: frame - 12, fps, config: {damping: 16}});
  const pulse = 1 + Math.sin(frame / 8) * 0.02;

  return (
    <AbsoluteFill>
      <Background />
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          gap: pick(format, 56, 44),
        }}
      >
        <Logo size={pick(format, 78, 68)} parts={brand.logo} mark={brand.logoMark} />

        <div
          style={{
            direction: 'rtl',
            fontFamily: font,
            fontWeight: 800,
            fontSize: pick(format, 84, 70),
            color: theme.text,
            textAlign: 'center',
            whiteSpace: 'pre-line',
            lineHeight: 1.3,
            opacity: ctaEnter,
            transform: `scale(${pulse})`,
          }}
        >
          {cta}
        </div>

        <div
          style={{
            fontFamily: font,
            fontWeight: 800,
            fontSize: pick(format, 44, 38),
            color: theme.bg,
            background: `linear-gradient(135deg, ${theme.gold}, ${theme.blue})`,
            padding: pick(format, '18px 46px', '16px 42px'),
            borderRadius: 999,
            direction: 'ltr',
            opacity: interpolate(ctaEnter, [0.4, 1], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
          }}
        >
          {handle}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
