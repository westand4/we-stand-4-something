/** Helpers shared by pages and components. */
import wixMedia from '../data/wix-media.json';

/** Link to a page or file inside this site, respecting the deploy base path. */
export function url(path: string = ''): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}/${path.replace(/^\//, '')}`;
}

/**
 * Copies of Wix images and documents stored in this repository (public/media/), keyed by their Wix link.
 * Filled in by scripts/download-wix-media.mjs; anything not listed still loads from Wix.
 */
const LOCAL_COPIES: Record<string, string> = wixMedia;

/** A Wix link, swapped for this site's own copy when one has been downloaded. */
export const localize = (link: string): string => (LOCAL_COPIES[link] ? url(LOCAL_COPIES[link]) : link);

/** An image from the original Wix site, e.g. wix('996292_…~mv2.png/v1/fill/w_180,…/logo.png'). */
export const wix = (path: string): string => localize(`https://static.wixstatic.com/media/${path}`);

/** Full page title, e.g. "About us | We Stand 4 Something". */
export const pageTitle = (title?: string): string =>
  title ? `${title} | We Stand 4 Something` : 'We Stand 4 Something';
