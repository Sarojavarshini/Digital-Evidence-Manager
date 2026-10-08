package com.forensics.dem.repository;

import com.forensics.dem.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findAllByOrderByTimestampDesc();
    List<AuditLog> findByUsernameOrderByTimestampDesc(String username);
    List<AuditLog> findByActionOrderByTimestampDesc(String action);
}
