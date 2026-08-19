import React from 'react';
import {AbsoluteFill, Sequence, useVideoConfig} from 'remotion';
import {Intro} from './compositions/Intro';
import {SignalScene} from './compositions/SignalScene';
import {AppShowcase} from './compositions/AppShowcase';
import {TalkingHead} from './compositions/TalkingHead';
import {StatsScene} from './compositions/StatsScene';
import {Outro} from './compositions/Outro';
import {Format, FormatContext} from './format';
import {useFonts} from './fonts';
import {theme} from './theme';
import * as content from './content';

/** طول هر سکانس بر حسب ثانیه — اینجا ریتم ویدیو را تنظیم کن */
export const TIMELINE = {
  intro: 3,
  signal: 7,
  talkingHead: 8,
  app: 6,
  stats: 5,
  outro: 3,
} as const;

export const TOTAL_SECONDS = Object.values(TIMELINE).reduce((a, b) => a + b, 0);

/**
 * ویدیوی کامل. یک سورس، دو نسبت تصویر — چیدمان هر سکانس
 * خودش را با format تطبیق می‌دهد.
 */
export const TradeAIVideo: React.FC<{format: Format}> = ({format}) => {
  useFonts();
  const {fps} = useVideoConfig();
  const s = (seconds: number) => Math.round(seconds * fps);

  // شروع هر سکانس، تجمعی
  let cursor = 0;
  const at = (seconds: number) => {
    const from = cursor;
    cursor += s(seconds);
    return {from, durationInFrames: s(seconds)};
  };

  const introSeq = at(TIMELINE.intro);
  const signalSeq = at(TIMELINE.signal);
  const talkSeq = at(TIMELINE.talkingHead);
  const appSeq = at(TIMELINE.app);
  const statsSeq = at(TIMELINE.stats);
  const outroSeq = at(TIMELINE.outro);

  return (
    <FormatContext.Provider value={format}>
      <AbsoluteFill style={{backgroundColor: theme.bg}}>
        <Sequence {...introSeq} name="اینترو">
          <Intro headline={content.intro.headline} sub={content.intro.sub} />
        </Sequence>

        <Sequence {...signalSeq} name="تحلیل سیگنال">
          <SignalScene {...content.signal} />
        </Sequence>

        <Sequence {...talkSeq} name="توک‌هد">
          <TalkingHead
            src={content.talkingHead.src}
            startFromSeconds={content.talkingHead.startFromSeconds}
            focusX={content.talkingHead.focusX}
            name={content.brand.presenter}
            title={content.brand.presenterTitle}
            cues={content.cues}
          />
        </Sequence>

        <Sequence {...appSeq} name="معرفی اپ">
          <AppShowcase
            title={content.app.title}
            features={content.app.features}
            screenSrc={content.app.screenSrc}
          />
        </Sequence>

        <Sequence {...statsSeq} name="نتایج">
          <StatsScene title="نتایج این ماه" stats={content.stats} />
        </Sequence>

        <Sequence {...outroSeq} name="اوترو">
          <Outro cta={content.outro.cta} handle={content.outro.handle} />
        </Sequence>
      </AbsoluteFill>
    </FormatContext.Provider>
  );
};
