/**
 * توکن‌های برند — مستقیماً از :root در index.html اپ گرفته شده
 * تا ویدیو و محصول دقیقاً یک زبان بصری داشته باشند.
 */
export const theme = {
  bg: '#070b14',
  bg2: '#0c1220',
  bg3: '#111827',
  card: '#0f1829',
  gold: '#f5a623',
  blue: '#38bdf8',
  green: '#22d3a0',
  red: '#f43f5e',
  purple: '#818cf8',
  text: '#e2e8f0',
  muted: '#64748b',
  border: '#1e293b',
  border2: '#2d4060',
} as const;

export const font = "'Vazirmatn', system-ui, sans-serif";

/** پس‌زمینه‌ی گرید — همان body::before اپ */
export const gridBackground = {
  backgroundImage: `linear-gradient(rgba(56,189,248,0.025) 1px, transparent 1px),
     linear-gradient(90deg, rgba(56,189,248,0.025) 1px, transparent 1px)`,
  backgroundSize: '50px 50px',
} as const;
