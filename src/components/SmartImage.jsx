import { toWebp } from '../lib/images';

function SmartImage({ src, alt, className, onError, eager = false, ...rest }) {
  const webp = toWebp(src);
  const img = (
    <img
      src={src}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      {/* camelCase: React mengabaikan `fetchpriority` huruf kecil */ ...(eager ? { fetchPriority: 'high' } : {})}
      onError={onError}
      className={className}
      {...rest}
    />
  );
  // Tanpa versi WebP, cukup kembalikan <img> apa adanya
  if (!webp) return img;
  return (
    <picture>
      <source srcSet={webp} type="image/webp" />
      {img}
    </picture>
  );
}

export { SmartImage };
