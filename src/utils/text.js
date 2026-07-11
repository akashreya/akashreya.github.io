// Sentence boundaries only: a period followed by whitespace (or at the end),
// or a newline — decimals like "99.2%" stay intact.
export function bullets(text) {
  return (text ?? '')
    .split(/\n+|\.\s+|\.$/)
    .map(s => s.trim())
    .filter(Boolean);
}
