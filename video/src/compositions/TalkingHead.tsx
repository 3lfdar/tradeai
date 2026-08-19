import React from 'react';
import {AbsoluteFill, Sequence, useVideoConfig} from 'remotion';
import {Background} from '../components/Background';
import {FootageSlot} from '../components/FootageSlot';
import {LowerThird} from '../components/LowerThird';
import {Subtitles, SubtitleCue} from '../components/Subtitles';
import {Logo} from '../components/Logo';
import {pick, useFormat} from '../format';
import {brand} from '../content';

/**
 * سکانس توک‌هد: خودت جلوی دوربین + زیرنویس فارسی + لوئر ثرد + واترمارک.
 * فوتیج را در public/footage/ بگذار و مسیرش را بده.
 */
export const TalkingHead: React.FC<{
  src?: string;
  name: string;
  title: string;
  cues: SubtitleCue[];
  /** ثانیه‌ای از فوتیج که شروع می‌شود */
  startFromSeconds?: number;
  /** جای سوژه در کادر افقی وقتی به ۹:۱۶ کراپ می‌شود */
  focusX?: number;
  showLowerThirdUntil?: number;
}> = ({
  src,
  name,
  title,
  cues,
  startFromSeconds = 0,
  focusX = 0.5,
  showLowerThirdUntil = 120,
}) => {
  const {fps, width, height} = useVideoConfig();
  const format = useFormat();

  return (
    <AbsoluteFill>
      <Background glow={false} />

      <FootageSlot
        src={src}
        label="فوتیج توک‌هد"
        startFrom={Math.round(startFromSeconds * fps)}
        focusX={focusX}
      />

      {/* گرادیان پایین برای خوانایی زیرنویس */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(to top, rgba(7,11,20,0.92) 0%, rgba(7,11,20,0.5) 18%, transparent 38%)`,
        }}
      />

      {/* واترمارک */}
      <div
        style={{
          position: 'absolute',
          top: height * 0.045,
          right: width * 0.05,
          opacity: 0.85,
        }}
      >
        <Logo size={pick(format, 34, 30)} parts={brand.logo} mark={brand.logoMark} />
      </div>

      <Sequence durationInFrames={showLowerThirdUntil}>
        <div
          style={{
            position: 'absolute',
            bottom: pick(format, height * 0.26, height * 0.14),
            right: width * 0.05,
          }}
        >
          <LowerThird name={name} title={title} delay={8} scale={pick(format, 1, 0.9)} />
        </div>
      </Sequence>

      <div
        style={{
          position: 'absolute',
          bottom: pick(format, height * 0.12, height * 0.06),
          width: '100%',
        }}
      >
        <Subtitles cues={cues} fps={fps} scale={pick(format, 1, 0.8)} />
      </div>
    </AbsoluteFill>
  );
};
