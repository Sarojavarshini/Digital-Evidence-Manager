package com.forensics.dem.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "evidence")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Evidence {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "evidence_code", nullable = false, unique = true)
    private String evidenceCode;

    @Column(name = "case_id", nullable = false)
    private Long caseId;

    @Column(name = "case_code", nullable = false)
    private String caseCode;

    @Column(nullable = false)
    private String name;

    @Column(name = "file_type", nullable = false)
    private String fileType; // Image, Video, Audio, Document, Email, Log File, Archive, Other

    @Column(name = "file_size", nullable = false)
    private Long fileSize;

    /**
     * Authoritative backend Java MessageDigest SHA-256 hash.
     */
    @Column(name = "sha256_hash", nullable = false, length = 64)
    private String sha256Hash;

    @Column(name = "original_sha256_hash", nullable = false, length = 64)
    private String originalSha256Hash;

    @Column(name = "uploaded_by", nullable = false)
    private String uploadedBy;

    @Column(name = "upload_date")
    private LocalDateTime uploadDate;

    @Column(name = "source_device", nullable = false)
    private String sourceDevice;

    @Column(name = "collection_location", nullable = false)
    private String collectionLocation;

    @Column(name = "current_custodian", nullable = false)
    private String currentCustodian;

    private String status; // VERIFIED, UNVERIFIED, COMPROMISED, TRANSFERRED

    @Column(name = "file_path")
    private String filePath;

    @PrePersist
    protected void onCreate() {
        if (uploadDate == null) {
            uploadDate = LocalDateTime.now();
        }
        if (status == null) {
            status = "VERIFIED";
        }
        if (originalSha256Hash == null) {
            originalSha256Hash = sha256Hash;
        }
    }
}
