import { BASE_URL } from '../contants/api';

/** Build full URL for chat images (paths stored relative to API host). */
export function resolveChatMediaUrl(pathOrUrl: string): string {
  if (!pathOrUrl) return '';
  const t = pathOrUrl.trim();
  if (/^https?:\/\//i.test(t) || t.startsWith('file://') || t.startsWith('content://')) {
    return t;
  }
  const origin = BASE_URL.replace(/\/api\/v1\/?$/i, '').replace(/\/$/, '');
  return `${origin}/${t.replace(/^\//, '')}`;
}
