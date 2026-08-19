import React from 'react';
import {AbsoluteFill, OffthreadVideo, staticFile} from 'remotion';
import {theme, font} from '../theme';

/**
 * جای فوتیج خودت. تا وقتی فایل را در public/ نگذاشته‌ای،
 * یک پلیس‌هولدر نشان می‌دهد تا بشود پیش‌نمایش گرفت.
 *
 * استفاده: <FootageSlot src="footage/talking-head.mp4" />
 */
export const FootageSlot: React.FC<{
  src?: string;
  label?: string;
  startFrom?: number;
  /** برای کراپ ۹:۱۶ از فوتیج افقی: جابه‌جایی افقی سوژه (۰ تا ۱) */
  focusX?: number;
  style?: React.CSSProperties;
}> = ({src, label = 'فوتیج شما اینجا', startFrom, focusX = 0.5, style}) => {
  if (src) {
    return (
      <AbsoluteFill style={style}>
        <OffthreadVideo
          src={staticFile(src)}
          startFrom={startFrom}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: `${focusX * 100}% 50%`,
          }}
        />
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill
      style={{
        ...style,
        background: `repeating-linear-gradient(45deg, ${theme.bg2} 0 22px, ${theme.bg3} 22px 44px)`,
        border: `2px dashed ${theme.border2}`,
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: font,
        color: theme.muted,
        fontSize: 34,
        fontWeight: 600,
        direction: 'rtl',
      }}
    >
      {label}
    </AbsoluteFill>
  );
};
