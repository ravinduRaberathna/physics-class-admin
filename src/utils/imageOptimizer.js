/**
 * Utility to optimize Cloudinary and web image delivery.
 * Automatically serves next-gen formats (WebP/AVIF), compresses quality,
 * and limits max resolution to avoid downloading multi-megabyte raw photos.
 *
 * @param {string} url - Original image URL
 * @param {number} [width=800] - Target max display width
 * @param {string} [quality='auto'] - Cloudinary quality mode
 * @returns {string} Optimized image URL
 */
export const optimizeImage = (url, width = 800, quality = 'auto') => {
  if (!url || typeof url !== 'string') return url;

  // Cloudinary on-the-fly transformations
  if (url.includes('res.cloudinary.com') && url.includes('/upload/')) {
    // Avoid duplicating transformations if already present
    if (url.includes('/f_auto') || url.includes('/q_auto')) {
      return url;
    }
    const transform = `f_auto,q_${quality},w_${width},c_limit`;
    return url.replace('/upload/', `/upload/${transform}/`);
  }

  return url;
};

export default optimizeImage;

