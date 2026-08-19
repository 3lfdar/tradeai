import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Background} from '../components/Background';
import {DeviceMockup} from '../components/DeviceMockup';
import {FootageSlot} from '../components/FootageSlot';
import {theme, font} from '../theme';
import {pick, useFormat} from '../format';

/** سکانس معرفی اپ: اسکرین‌ریکورد داخل موکاپ + کالوت‌های ویژگی‌ها */
export const AppShowcase: React.FC<{
  title: string;
  features: string[];
  /** مسیر اسکرین‌ریکورد نسبت به public/ — مثلاً footage/app-demo.mp4 */
  screenSrc?: string;
}> = ({title, features, screenSrc}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const format = useFormat();
  const vertical = format === 'reels';

  const titleEnter = spring({frame, fps, config: {damping: 18}});
  const deviceW = vertical ? width * 0.44 : height * 0.42;

  return (
    <AbsoluteFill>
      <Background />

      <div
        style={{
          position: 'absolute',
          top: height * 0.08,
          width: '100%',
          textAlign: 'center',
          direction: 'rtl',
          fontFamily: font,
          fontWeight: 800,
          fontSize: pick(format, 76, 64),
          color: theme.text,
          opacity: titleEnter,
          transform: `translateY(${interpolate(titleEnter, [0, 1], [30, 0])}px)`,
        }}
      >
        {title}
      </div>

      <AbsoluteFill
        style={{
          flexDirection: vertical ? 'column' : 'row-reverse',
          alignItems: 'center',
          justifyContent: 'center',
          gap: vertical ? height * 0.04 : width * 0.06,
          padding: `${height * 0.18}px ${width * 0.06}px ${height * 0.08}px`,
        }}
      >
        <DeviceMockup variant="phone" width={deviceW} delay={10}>
          <FootageSlot src={screenSrc} label="اسکرین‌ریکورد اپ" />
        </DeviceMockup>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: pick(format, 18, 24),
            direction: 'rtl',
          }}
        >
          {features.map((feature, i) => {
            const enter = spring({
              frame: frame - 22 - i * 8,
              fps,
              config: {damping: 18},
            });
            return (
              <div
                key={feature}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  background: 'rgba(15,24,41,0.85)',
                  border: `1px solid ${theme.border2}`,
                  borderRadius: 16,
                  padding: pick(format, '16px 24px', '18px 28px'),
                  fontFamily: font,
                  fontWeight: 600,
                  fontSize: pick(format, 36, 34),
                  color: theme.text,
                  opacity: enter,
                  transform: `translateX(${interpolate(enter, [0, 1], [40, 0])}px)`,
                }}
              >
                <span style={{color: theme.green, fontSize: pick(format, 34, 32)}}>✓</span>
                {feature}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
