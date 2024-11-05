import CryptoJS from "crypto-js";

export function encryptMessage(message, key) {
  return CryptoJS.Blowfish.encrypt(message, key).toString();
}

export function decryptMessage(encryptedMessage, key) {
  const bytes = CryptoJS.Blowfish.decrypt(encryptedMessage, key);
  return bytes.toString(CryptoJS.enc.Utf8);
}
