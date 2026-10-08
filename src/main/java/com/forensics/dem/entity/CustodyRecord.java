package com.forensics.dem.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "custody_records")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustodyRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "evidence_id", nullable = false)
    private Long evidenceId;

    @Column(name = "evidence_code", nullable = false)
    private String evidenceCode;

    private LocalDateTime timestamp;

    @Column(name = "user_name", nullable = false)
    private String userName;

    @Column(nullable = false)
    private String action; // Collected, Uploaded, Transferred, Reviewed, Verified, Archived

    @Column(name = "previous_custodian")
    private String previousCustodian;

    @Column(name = "new_custodian")
    private String newCustodian;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    @Column(name = "sha256_stamp", nullable = false, length = 64)
    private String sha256Stamp;

    @PrePersist
    protected void onCreate() {
        if (timestamp == null) {
            timestamp = LocalDateTime.now();
        }
    }
}
