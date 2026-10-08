/**
 * Web Crypto API SHA-256 Calculator.
 * Used for instant client-side hash previews in the UI.
 * Note: The Spring Boot Java backend is the official authoritative source for stored hashes.
 */
export async function calculateClientSHA256(file) {
  if (!file) return '';
  try {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  } catch (err) {
    console.error("Web Crypto SHA-256 error:", err);
    return 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
  }
}

export function formatHash(hash, length = 16) {
  if (!hash) return '';
  if (hash.length <= length) return hash;
  return `${hash.substring(0, 8)}...${hash.substring(hash.length - 8)}`;
}
