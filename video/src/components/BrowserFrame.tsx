import React from 'react';
import {theme} from '../theme';

/**
 * قاب مرورگر دور فوتیج سایت. در حالت ۹:۱۶ باعث می‌شود کلیپ ۱۶:۹
 * به‌جای کراپ‌شدن، تمیز داخل کادر بنشیند.
 */
export const BrowserFrame: React.FC<{
  width: number;
  url?: string;
  children: React.ReactNode;
}> = ({width, url, children}) => {
  const barHeight = width * 0.032;
  const dot = barHeight * 0.26;

  return (
    <div
      style={{
        width,
        borderRadius: width * 0.014,
        overflow: 'hidden',
        border: `1px solid ${theme.border2}`,
        boxShadow: `0 40px 120px rgba(0,0,0,0.75), 0 0 ${width * 0.1}px rgba(56,189,248,0.18)`,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          height: barHeight,
          background: theme.bg3,
          display: 'flex',
          alignItems: 'center',
          gap: dot * 0.7,
          padding: `0 ${barHeight * 0.5}px`,
          borderBottom: `1px solid ${theme.border}`,
        }}
      >
        {['#f43f5e', '#f5a623', '#22d3a0'].map((c) => (
          <div key={c} style={{width: dot, height: dot, borderRadius: 999, background: c}} />
        ))}
        {url ? (
          <div
            style={{
              marginInlineStart: barHeight * 0.6,
              flex: 1,
              height: barHeight * 0.58,
              borderRadius: 999,
              background: theme.bg,
              color: theme.muted,
              fontSize: barHeight * 0.36,
              display: 'flex',
              alignItems: 'center',
              paddingInline: barHeight * 0.5,
              direction: 'ltr',
              fontFamily: 'monospace',
            }}
          >
            {url}
          </div>
        ) : null}
      </div>
      <div style={{lineHeight: 0, background: theme.bg}}>{children}</div>
    </div>
  );
};
