/** Strip accidental wrapping quotes / trailing %22 from stored message content (e.g. image URLs). */
export function sanitizeChatMessageContent(raw: string): string {
  let s = raw.trim();
  while (s.length > 0) {
    if (s.endsWith('%22')) {
      s = s.slice(0, -3).trim();
      continue;
    }
    if (s.endsWith('"') || s.endsWith("'")) {
      s = s.slice(0, -1).trim();
      continue;
    }
    if (s.startsWith('"') || s.startsWith("'")) {
      s = s.slice(1).trim();
      continue;
    }
    break;
  }
  return s;
}
