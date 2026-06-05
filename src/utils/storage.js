// Per-user storage — keys prefixed with email so students don't share data
export function getKey(email, key) {
  if (!email) return `ewd_${key}`;
  const slug = email.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  return `ewd_${slug}_${key}`;
}

export function getItem(email, key, fallback = null) {
  try {
    const raw = localStorage.getItem(getKey(email, key));
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch { return fallback; }
}

export function setItem(email, key, value) {
  try {
    localStorage.setItem(getKey(email, key), JSON.stringify(value));
    // also dispatch storage event so Dashboard updates
    window.dispatchEvent(new Event('storage'));
  } catch {}
}
