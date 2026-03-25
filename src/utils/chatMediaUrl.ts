import { BASE_URL } from '../contants/api';
import { sanitizeChatMessageContent } from './sanitizeChatMessageContent';

/** Build full URL for chat images (paths stored relative to API host). */
export function resolveChatMediaUrl(pathOrUrl: string): string {
  if (!pathOrUrl) return '';
  const t = sanitizeChatMessageContent(pathOrUrl);
  if (/^https?:\/\//i.test(t) || t.startsWith('file://') || t.startsWith('content://')) {
    return t;
  }
  const origin = BASE_URL.replace(/\/api\/v1\/?$/i, '').replace(/\/$/, '');
  return `${origin}/${t.replace(/^\//, '')}`;
}
