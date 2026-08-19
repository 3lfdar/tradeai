import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Background} from '../components/Background';
import {Logo} from '../components/Logo';
import {theme, font} from '../theme';
import {pick, useFormat} from '../format';

/** اینترو: لوگو + تیتر قلاب (hook) */
export const Intro: React.FC<{headline: string; sub?: string}> = ({
  headline,
  sub,
}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const format = useFormat();

  const headlineEnter = spring({frame: frame - 14, fps, config: {damping: 16}});
  const subEnter = spring({frame: frame - 24, fps, config: {damping: 18}});
  const exit = interpolate(
    frame,
    [durationInFrames - 10, durationInFrames],
    [1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  return (
    <AbsoluteFill style={{opacity: exit}}>
      <Background />
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          gap: pick(format, 60, 46),
          padding: pick(format, 90, 120),
        }}
      >
        <Logo size={pick(format, 86, 74)} />

        <div
          style={{
            direction: 'rtl',
            fontFamily: font,
            fontWeight: 800,
            fontSize: pick(format, 108, 92),
            lineHeight: 1.25,
            whiteSpace: 'pre-line',
            color: theme.text,
            textAlign: 'center',
            opacity: headlineEnter,
            transform: `translateY(${interpolate(headlineEnter, [0, 1], [40, 0])}px)`,
          }}
        >
          {headline}
        </div>

        {sub ? (
          <div
            style={{
              direction: 'rtl',
              fontFamily: font,
              fontWeight: 600,
              fontSize: pick(format, 46, 40),
              color: theme.gold,
              textAlign: 'center',
              opacity: subEnter,
              transform: `translateY(${interpolate(subEnter, [0, 1], [24, 0])}px)`,
            }}
          >
            {sub}
          </div>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
