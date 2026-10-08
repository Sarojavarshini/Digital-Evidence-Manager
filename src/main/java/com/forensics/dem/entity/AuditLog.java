package com.forensics.dem.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime timestamp;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String role;

    @Column(nullable = false)
    private String action; // LOGIN, LOGOUT, UPLOAD, VIEW, DOWNLOAD, VERIFY, TRANSFER, UPDATE, DELETE, INTEGRITY_ALERT

    @Column(name = "evidence_code")
    private String evidenceCode;

    @Column(name = "case_code")
    private String caseCode;

    @Column(name = "ip_address")
    private String ipAddress;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @PrePersist
    protected void onCreate() {
        if (timestamp == null) {
            timestamp = LocalDateTime.now();
        }
        if (ipAddress == null) {
            ipAddress = "192.168.1.104";
        }
    }
}
