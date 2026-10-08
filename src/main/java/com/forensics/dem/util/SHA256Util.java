package com.forensics.dem.util;

import java.io.InputStream;
import java.security.MessageDigest;
import java.nio.charset.StandardCharsets;

public class SHA256Util {

    /**
     * Authoritative backend SHA-256 calculation using Java java.security.MessageDigest.
     * Computes 64-character lowercase hex string from byte stream.
     */
    public static String calculateSHA256(InputStream inputStream) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] byteArray = new byte[8192];
            int bytesCount = 0;
            while ((bytesCount = inputStream.read(byteArray)) != -1) {
                digest.update(byteArray, 0, bytesCount);
            }
            byte[] bytes = digest.digest();
            StringBuilder sb = new StringBuilder();
            for (byte b : bytes) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (Exception e) {
            throw new RuntimeException("Error calculating Java SHA-256 hash", e);
        }
    }

    /**
     * Calculate SHA-256 hash of a string payload.
     */
    public static String calculateSHA256(String text) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(text.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            throw new RuntimeException("Error calculating Java SHA-256 string hash", e);
        }
    }
}
