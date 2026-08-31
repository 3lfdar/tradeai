import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {theme, gridBackground} from '../theme';

/** پس‌زمینه‌ی برند: گرید + هاله‌های نرمِ در حال حرکت */
export const Background: React.FC<{glow?: boolean}> = ({glow = true}) => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 90) * 40;

  return (
    <AbsoluteFill style={{backgroundColor: theme.bg}}>
      {glow ? (
        <>
          <AbsoluteFill
            style={{
              background: `radial-gradient(circle at ${30 + drift / 20}% 20%, rgba(56,189,248,0.16), transparent 55%)`,
            }}
          />
          <AbsoluteFill
            style={{
              background: `radial-gradient(circle at ${75 - drift / 20}% 80%, rgba(245,166,35,0.12), transparent 55%)`,
            }}
          />
        </>
      ) : null}
      <AbsoluteFill style={gridBackground} />
    </AbsoluteFill>
  );
};
