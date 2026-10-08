package com.forensics.dem.controller;

import com.forensics.dem.entity.AuditLog;
import com.forensics.dem.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit-logs")
@CrossOrigin(origins = "*")
public class AuditLogController {

    @Autowired
    private AuditLogRepository auditLogRepository;

    @GetMapping
    public ResponseEntity<List<AuditLog>> getAuditLogs(
            @RequestParam(required = false) String action,
            @RequestParam(required = false) String username
    ) {
        if (action != null && !action.isEmpty()) {
            return ResponseEntity.ok(auditLogRepository.findByActionOrderByTimestampDesc(action));
        }
        if (username != null && !username.isEmpty()) {
            return ResponseEntity.ok(auditLogRepository.findByUsernameOrderByTimestampDesc(username));
        }
        return ResponseEntity.ok(auditLogRepository.findAllByOrderByTimestampDesc());
    }
}
