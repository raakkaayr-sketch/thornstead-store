import { siteConfig } from './config';

/**
 * True only for a real profile URL. A bare platform homepage (instagram.com)
 * is worse than no link at all — Google treats placeholder social links as a
 * trust signal against the merchant.
 */
export function isRealProfileUrl(url: string | undefined): boolean {
  if (!url?.trim()) return false;
  try {
    const parsed = new URL(url);
    const path = parsed.pathname.replace(/\/$/, '');
    return path.length > 1;
  } catch {
    return false;
  }
}

export function getRealSocialUrls(): string[] {
  return Object.values(siteConfig.social).filter(isRealProfileUrl);
}
