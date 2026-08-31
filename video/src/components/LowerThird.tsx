import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {theme, font} from '../theme';

/** لوئر ثرد: نام و عنوان، با نوار طلایی برند */
export const LowerThird: React.FC<{
  name: string;
  title: string;
  delay?: number;
  scale?: number;
}> = ({name, title, delay = 0, scale = 1}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame: frame - delay, fps, config: {damping: 18}});

  return (
    <div
      style={{
        direction: 'rtl',
        fontFamily: font,
        display: 'inline-flex',
        alignItems: 'stretch',
        gap: 18 * scale,
        background: 'rgba(12,18,32,0.92)',
        backdropFilter: 'blur(14px)',
        border: `1px solid ${theme.border2}`,
        borderRadius: 18 * scale,
        padding: `${18 * scale}px ${26 * scale}px`,
        opacity: enter,
        transform: `translateX(${interpolate(enter, [0, 1], [-80, 0])}px)`,
      }}
    >
      <div
        style={{
          width: 6 * scale,
          borderRadius: 999,
          background: `linear-gradient(${theme.gold}, ${theme.blue})`,
        }}
      />
      <div>
        <div style={{fontSize: 40 * scale, fontWeight: 800, color: theme.text}}>
          {name}
        </div>
        <div style={{fontSize: 26 * scale, fontWeight: 500, color: theme.blue, marginTop: 4 * scale}}>
          {title}
        </div>
      </div>
    </div>
  );
};
