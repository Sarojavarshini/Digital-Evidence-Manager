package com.forensics.dem.util;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

public class AESUtil {

    private static final String ALGORITHM = "AES";
    private static final String DEFAULT_KEY = "DEMVaultAES256Key";

    private static byte[] getKeyBytes() {
        String envKey = System.getenv("APP_AES_SECRET_KEY");

        if (envKey == null || envKey.isBlank()) {
            return padKey(DEFAULT_KEY);
        }

        byte[] keyBytes = Base64.getDecoder().decode(envKey);

        if (keyBytes.length != 16) {
            throw new IllegalArgumentException(
                "AES key must decode to exactly 16 bytes"
            );
        }

        return keyBytes;
    }

    public static String encrypt(String valueToEnc) {
        try {
            byte[] keyBytes = getKeyBytes();
            SecretKeySpec key = new SecretKeySpec(keyBytes, ALGORITHM);

            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.ENCRYPT_MODE, key);

            byte[] encryptedBytes = cipher.doFinal(
                valueToEnc.getBytes(StandardCharsets.UTF_8)
            );

            return Base64.getEncoder().encodeToString(encryptedBytes);

        } catch (Exception e) {
            throw new IllegalStateException("Encryption failed", e);
        }
    }

    public static String decrypt(String encryptedValue) {
        try {
            byte[] keyBytes = getKeyBytes();
            SecretKeySpec key = new SecretKeySpec(keyBytes, ALGORITHM);

            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.DECRYPT_MODE, key);

            byte[] decodedBytes = Base64.getDecoder().decode(encryptedValue);
            byte[] decryptedBytes = cipher.doFinal(decodedBytes);

            return new String(decryptedBytes, StandardCharsets.UTF_8);

        } catch (Exception e) {
            throw new IllegalStateException("Decryption failed", e);
        }
    }

    private static byte[] padKey(String keyStr) {
        byte[] keyBytes = new byte[16];
        byte[] strBytes = keyStr.getBytes(StandardCharsets.UTF_8);

        System.arraycopy(
            strBytes, 0, keyBytes, 0,
            Math.min(strBytes.length, keyBytes.length)
        );
        return keyBytes;
    }
}