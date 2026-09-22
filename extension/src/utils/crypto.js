// Token encoding and obfuscation helper
export function obfuscateKey(rawKey) {
  if (!rawKey) return "";
  return btoa(rawKey.split("").reverse().join(""));
}

export function deobfuscateKey(obfuscated) {
  if (!obfuscated) return "";
  try {
    return atob(obfuscated).split("").reverse().join("");
  } catch (e) {
    return obfuscated;
  }
}
