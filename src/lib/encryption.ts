import CryptoJS from "crypto-js";

const SECRET = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "pc_center_secure_key_2026";

export function encryptData(data: unknown): string {
  if (data === undefined || data === null) return "";
  try {
    const jsonStr = JSON.stringify(data);
    return CryptoJS.AES.encrypt(jsonStr, SECRET).toString();
  } catch {
    return "";
  }
}

export function decryptData(encoded: string | null): unknown {
  if (!encoded) return null;
  try {
    // If it's already plain JSON (legacy data), just parse it
    if (encoded.startsWith("{") || encoded.startsWith("[")) {
      return JSON.parse(encoded);
    }

    // Decrypt using crypto-js
    const bytes = CryptoJS.AES.decrypt(encoded, SECRET);
    const decryptedStr = bytes.toString(CryptoJS.enc.Utf8);

    if (!decryptedStr) {
      // If decryption fails (e.g., it was the old base64 format)
      return legacyDecrypt(encoded);
    }

    return JSON.parse(decryptedStr);
  } catch {
    return legacyDecrypt(encoded);
  }
}

// Fallback for the previously used base64 encryption
function legacyDecrypt(encoded: string): unknown {
  try {
    const decodedStr = decodeURIComponent(atob(encoded));
    return JSON.parse(decodedStr);
  } catch {
    try {
      return JSON.parse(encoded);
    } catch {
      return null;
    }
  }
}
