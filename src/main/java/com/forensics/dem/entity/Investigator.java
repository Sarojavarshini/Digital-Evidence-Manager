package com.forensics.dem.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "investigators")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Investigator {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "investigator_code", nullable = false, unique = true)
    private String investigatorCode;

    @Column(name = "user_id")
    private Long userId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    private String department;

    private String role; // 'Lead Cyber Investigator', 'Senior Analyst', etc.

    @Column(name = "assigned_cases_count")
    private Integer assignedCasesCount;

    private String status; // 'ACTIVE' or 'DISABLED'

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (assignedCasesCount == null) {
            assignedCasesCount = 0;
        }
        if (status == null) {
            status = "ACTIVE";
        }
    }
}
