package com.forensics.dem;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DigitalEvidenceManagerApplication {

    public static void main(String[] args) {
        SpringApplication.run(DigitalEvidenceManagerApplication.class, args);
        System.out.println("=========================================================");
        System.out.println(" Digital Evidence Manager API Running on http://localhost:8080");
        System.out.println(" Backend SHA-256 Cryptographic Engine: ONLINE (Authoritative)");
        System.out.println("=========================================================");
    }
}
