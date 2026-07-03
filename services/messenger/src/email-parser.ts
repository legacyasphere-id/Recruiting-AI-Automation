/**
 * Email body cleaning: strip quoted history and signatures so the classifier
 * sees only the newly written content. Quoted threads are the single biggest
 * source of wasted tokens and misclassification (old intents leak through).
 */

const QUOTE_HEADER_PATTERNS: RegExp[] = [
  /^On .{5,200} wrote:\s*$/,
  /^Le .{5,200} a écrit\s?:\s*$/,
  /^Pada .{5,200} menulis:\s*$/,
  /^-{2,}\s*Original Message\s*-{2,}/i,
  /^-{2,}\s*Forwarded message\s*-{2,}/i,
  /^From:\s.+$/,
  /^Von:\s.+$/,
  /^Dari:\s.+$/,
];

const SIGNATURE_MARKERS: RegExp[] = [
  /^--\s*$/,
  /^__+\s*$/,
  /^Sent from my (iPhone|iPad|Android|Galaxy|mobile)/i,
  /^Get Outlook for (iOS|Android)/i,
  /^Dikirim dari/i,
];

/**
 * Remove quoted reply history and trailing signatures from a plain-text
 * email body. Conservative by design: when in doubt, keep the text.
 */
export function cleanEmailBody(raw: string): string {
  const lines = raw.replace(/\r\n/g, "\n").split("\n");
  const kept: string[] = [];

  for (const line of lines) {
    // A quote header or signature marker ends the "new content" section.
    if (
      QUOTE_HEADER_PATTERNS.some((p) => p.test(line.trim())) ||
      SIGNATURE_MARKERS.some((p) => p.test(line))
    ) {
      break;
    }
    // Skip individual quoted lines that appear inline.
    if (line.trimStart().startsWith(">")) {
      continue;
    }
    kept.push(line);
  }

  const cleaned = kept.join("\n").replace(/\n{3,}/g, "\n\n").trim();
  // If cleaning removed everything (e.g. the whole body was one quote block),
  // fall back to the raw body so the classifier still has something to read.
  return cleaned.length > 0 ? cleaned : raw.trim();
}

/** Extract a display name and address from a "Name <addr@host>" header value. */
export function parseAddress(header: string): { name: string | null; email: string } {
  const match = header.match(/^\s*"?([^"<]*)"?\s*<([^>]+)>\s*$/);
  if (match) {
    const name = match[1].trim();
    return { name: name.length > 0 ? name : null, email: match[2].trim() };
  }
  return { name: null, email: header.trim() };
}

/** Cap body size so a pathological email cannot blow up token spend. */
export function truncateBody(body: string, maxChars = 20_000): string {
  if (body.length <= maxChars) return body;
  return `${body.slice(0, maxChars)}\n\n[truncated — original was ${body.length} characters]`;
}
