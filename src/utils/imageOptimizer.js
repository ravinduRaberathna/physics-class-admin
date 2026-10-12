/**
 * Cloudinary High-Performance Image Optimization Utility
 * 
 * Injects Cloudinary's dynamic CDN transformations:
 * - f_auto: Serves modern formats (AVIF / WebP) based on browser support (80-90% smaller)
 * - q_auto: Intelligent perceptual quality compression with zero visible degradation
 * - w_<width>,c_limit: Scales images to exact container dimensions (prevents downloading 4K/multi-MB originals)
 * - dpr_auto: Adapts to user's screen density (Retina / standard)
 * 
 * Reduces image weight from ~3MB-6MB down to ~20KB-60KB,
 * allowing instant, zero-delay rendering on web page load.
 */

export const optimizeImage = (url, options = {}) => {
  if (!url || typeof url !== 'string') return url;

  const trimmedUrl = url.trim();

  // If not a Cloudinary delivery URL, return as-is
  if (!trimmedUrl.includes('res.cloudinary.com')) {
    return trimmedUrl;
  }

  // Cloudinary standard upload pattern: /image/upload/...
  const uploadIndex = trimmedUrl.indexOf('/image/upload/');
  if (uploadIndex === -1) {
    return trimmedUrl;
  }

  const {
    width,
    quality = 'auto',
    format = 'auto',
    crop = 'limit',
    dpr = 'auto',
  } = options;

  // Build transformation string
  const transforms = [];
  if (format) transforms.push(`f_${format}`);
  if (quality) transforms.push(`q_${quality}`);
  if (dpr) transforms.push(`dpr_${dpr}`);
  if (width) {
    transforms.push(`w_${width}`);
    if (crop) transforms.push(`c_${crop}`);
  }

  const transformString = transforms.join(',');

  const prefix = trimmedUrl.substring(0, uploadIndex + '/image/upload/'.length);
  let rest = trimmedUrl.substring(uploadIndex + '/image/upload/'.length);

  // If the URL already has transformations directly after /image/upload/
  // E.g. /image/upload/f_auto,q_auto/... or /image/upload/w_500/...
  // We strip old transformations and replace with the tailored ones
  if (
    rest.startsWith('f_auto') ||
    rest.startsWith('q_auto') ||
    rest.startsWith('w_') ||
    rest.startsWith('c_')
  ) {
    const slashIdx = rest.indexOf('/');
    if (slashIdx !== -1) {
      rest = rest.substring(slashIdx + 1);
    }
  }

  return `${prefix}${transformString}/${rest}`;
};

/**
 * Preload high-priority images into browser memory cache ahead of render
 */
export const preloadImage = (url, options = {}) => {
  if (!url || typeof window === 'undefined') return;
  const optimizedUrl = optimizeImage(url, options);
  const img = new Image();
  img.src = optimizedUrl;
};

// Preset helpers for different UI components
export const getOptimizedProfileImage = (url) => optimizeImage(url, { width: 900 });
export const getOptimizedCardImage = (url) => optimizeImage(url, { width: 800 });
export const getOptimizedBlogBanner = (url) => optimizeImage(url, { width: 1200 });
export const getOptimizedAvatar = (url) => optimizeImage(url, { width: 160 });
export const getOptimizedThumbnail = (url) => optimizeImage(url, { width: 350 });

export default optimizeImage;
