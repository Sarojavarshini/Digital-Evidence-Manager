package com.forensics.dem.util;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

public class AESUtil {

    private static final String ALGORITHM = "AES";
    // 16-byte Secret key for AES-128 or 32-byte for AES-256
    private static final String DEFAULT_KEY = "DEMVaultAES256Key"; 

    public static String encrypt(String valueToEnc) {
        try {
            byte[] keyBytes = padKey(DEFAULT_KEY);
            SecretKeySpec key = new SecretKeySpec(keyBytes, ALGORITHM);
            Cipher c = Cipher.getInstance(ALGORITHM);
            c.init(Cipher.ENCRYPT_MODE, key);
            byte[] encValue = c.doFinal(valueToEnc.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(encValue);
        } catch (Exception e) {
            return valueToEnc; // Fallback if encryption fails
        }
    }

    public static String decrypt(String encryptedValue) {
        try {
            byte[] keyBytes = padKey(DEFAULT_KEY);
            SecretKeySpec key = new SecretKeySpec(keyBytes, ALGORITHM);
            Cipher c = Cipher.getInstance(ALGORITHM);
            c.init(Cipher.DECRYPT_MODE, key);
            byte[] decordedValue = Base64.getDecoder().decode(encryptedValue);
            byte[] decValue = c.doFinal(decordedValue);
            return new String(decValue, StandardCharsets.UTF_8);
        } catch (Exception e) {
            return encryptedValue; // Fallback if decryption fails
        }
    }

    private static byte[] padKey(String keyStr) {
        byte[] keyBytes = new byte[16];
        byte[] strBytes = keyStr.getBytes(StandardCharsets.UTF_8);
        System.arraycopy(strBytes, 0, keyBytes, 0, Math.min(strBytes.length, keyBytes.length));
        return keyBytes;
    }
}
