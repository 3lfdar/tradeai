import React from 'react';
import {
  AbsoluteFill,
  OffthreadVideo,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {Background} from '../components/Background';
import {BrowserFrame} from '../components/BrowserFrame';
import {Logo} from '../components/Logo';
import {theme, font} from '../theme';
import {pick, useFormat} from '../format';
import {brand} from '../content';

export type SiteShot = {
  /** مسیر کلیپ ضبط‌شده، نسبت به public/ — خروجی capture/record-site.mjs */
  src?: string;
  /** تیتری که کنار/بالای کلیپ می‌آید */
  headline: string;
  /** یک جمله توضیح، اختیاری */
  sub?: string;
};

/**
 * سکانس نمایش سایت واقعی: کلیپ ضبط‌شده داخل قاب مرورگر،
 * با تیتر و واترمارک برند.
 */
export const SiteTour: React.FC<SiteShot & {siteUrl?: string}> = ({
  src,
  headline,
  sub,
  siteUrl,
}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const format = useFormat();
  const vertical = format === 'reels';

  const enter = spring({frame, fps, config: {damping: 18}});
  // زوم بسیار ملایم تا قاب ثابت به نظر نرسد
  const drift = interpolate(frame, [0, fps * 8], [1, 1.04], {
    extrapolateRight: 'clamp',
  });

  const frameW = vertical ? width * 0.94 : width * 0.66;

  return (
    <AbsoluteFill>
      <Background />

      <AbsoluteFill
        style={{
          flexDirection: vertical ? 'column' : 'row-reverse',
          alignItems: 'center',
          justifyContent: 'center',
          gap: vertical ? height * 0.045 : width * 0.045,
          padding: `${height * 0.1}px ${width * 0.04}px`,
        }}
      >
        <div
          style={{
            opacity: enter,
            transform: `translateY(${interpolate(enter, [0, 1], [50, 0])}px) scale(${drift})`,
          }}
        >
          <BrowserFrame width={frameW} url={siteUrl}>
            {src ? (
              <OffthreadVideo
                src={staticFile(src)}
                muted
                style={{width: '100%', display: 'block'}}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  aspectRatio: '16 / 9',
                  background: `repeating-linear-gradient(45deg, ${theme.bg2} 0 22px, ${theme.bg3} 22px 44px)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: theme.muted,
                  fontFamily: font,
                  fontSize: frameW * 0.035,
                  fontWeight: 600,
                  direction: 'rtl',
                }}
              >
                کلیپ سایت هنوز ضبط نشده
              </div>
            )}
          </BrowserFrame>
        </div>

        <div
          style={{
            direction: 'rtl',
            fontFamily: font,
            textAlign: vertical ? 'center' : 'right',
            maxWidth: vertical ? '92%' : width * 0.26,
            opacity: interpolate(enter, [0.3, 1], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
          }}
        >
          <div
            style={{
              fontSize: pick(format, 68, 58),
              fontWeight: 800,
              color: theme.text,
              lineHeight: 1.3,
              whiteSpace: 'pre-line',
            }}
          >
            {headline}
          </div>
          {sub ? (
            <div
              style={{
                fontSize: pick(format, 36, 32),
                fontWeight: 500,
                color: theme.blue,
                marginTop: pick(format, 14, 16),
                lineHeight: 1.5,
              }}
            >
              {sub}
            </div>
          ) : null}
        </div>
      </AbsoluteFill>

      <div style={{position: 'absolute', top: height * 0.04, right: width * 0.045, opacity: 0.8}}>
        <Logo size={pick(format, 32, 28)} parts={brand.logo} mark={brand.logoMark} />
      </div>
    </AbsoluteFill>
  );
};
