import React from 'react';
import {AbsoluteFill, Sequence, useVideoConfig} from 'remotion';
import {Intro} from './compositions/Intro';
import {SiteTour} from './compositions/SiteTour';
import {TalkingHead} from './compositions/TalkingHead';
import {Outro} from './compositions/Outro';
import {Format, FormatContext} from './format';
import {useFonts} from './fonts';
import {theme} from './theme';
import * as content from './content';

/** طول هر سکانس بر حسب ثانیه — اینجا ریتم ویدیو را تنظیم کن */
export const TIMELINE = {
  intro: 3,
  /** طول هر سکانس نمایش سایت */
  perSiteShot: 6,
  talkingHead: 8,
  outro: 3,
} as const;

export const TOTAL_SECONDS =
  TIMELINE.intro +
  TIMELINE.perSiteShot * content.siteShots.length +
  TIMELINE.talkingHead +
  TIMELINE.outro;

/**
 * ویدیوی تبلیغاتی. یک سورس، دو نسبت تصویر — چیدمان هر سکانس
 * خودش را با format تطبیق می‌دهد به‌جای اینکه کراپ شود.
 *
 * محتوا از فوتیج واقعی می‌آید: کلیپ‌های ضبط‌شده از سایت
 * (capture/record-site.mjs) و ویدیوی خود ارائه‌دهنده.
 */
export const PromoVideo: React.FC<{format: Format}> = ({format}) => {
  useFonts();
  const {fps} = useVideoConfig();
  const s = (seconds: number) => Math.round(seconds * fps);

  let cursor = 0;
  const at = (seconds: number) => {
    const from = cursor;
    cursor += s(seconds);
    return {from, durationInFrames: s(seconds)};
  };

  const introSeq = at(TIMELINE.intro);
  const siteSeqs = content.siteShots.map(() => at(TIMELINE.perSiteShot));
  const talkSeq = at(TIMELINE.talkingHead);
  const outroSeq = at(TIMELINE.outro);

  return (
    <FormatContext.Provider value={format}>
      <AbsoluteFill style={{backgroundColor: theme.bg}}>
        <Sequence {...introSeq} name="اینترو">
          <Intro headline={content.intro.headline} sub={content.intro.sub} />
        </Sequence>

        {content.siteShots.map((shot, i) => (
          <Sequence key={i} {...siteSeqs[i]} name={`سایت ${i + 1}`}>
            <SiteTour {...shot} siteUrl={content.brand.siteUrl} />
          </Sequence>
        ))}

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

        <Sequence {...outroSeq} name="اوترو">
          <Outro cta={content.outro.cta} handle={content.outro.handle} />
        </Sequence>
      </AbsoluteFill>
    </FormatContext.Provider>
  );
};
