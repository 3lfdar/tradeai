import React from 'react';
import {continueRender, delayRender, staticFile} from 'remotion';

const WEIGHTS = [400, 600, 800] as const;

/**
 * وزیرمتن به‌صورت لوکال از public/fonts لود می‌شود تا رندر بدون اینترنت هم کار کند.
 * باید داخل کامپوننت صدا زده شود — delayRender در سطح ماژول کار نمی‌کند.
 */
export const useFonts = () => {
  const [handle] = React.useState(() => delayRender('loading Vazirmatn'));

  React.useEffect(() => {
    let cancelled = false;

    Promise.all(
      WEIGHTS.map((weight) =>
        new FontFace(
          'Vazirmatn',
          `url(${staticFile(`fonts/Vazirmatn-${weight}.woff2`)}) format('woff2')`,
          {weight: String(weight), style: 'normal'}
        )
          .load()
          .then((face) => {
            document.fonts.add(face);
          })
      )
    )
      .catch(() => undefined)
      .then(() => {
        if (!cancelled) continueRender(handle);
      });

    return () => {
      cancelled = true;
      continueRender(handle);
    };
  }, [handle]);
};
