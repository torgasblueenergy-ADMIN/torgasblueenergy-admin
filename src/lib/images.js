import { NO_WEBP } from '../config';

function toWebp(src) {
  if (!src || typeof src !== 'string') return null;
  if (!/^images\/.+\.(jpe?g|png)$/i.test(src)) return null; // lewati data-URI & aset luar
  if (NO_WEBP.has(src)) return null;
  return src.replace(/\.(jpe?g|png)$/i, '.webp');
}

export { toWebp };
