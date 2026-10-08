package com.forensics.dem.controller;

import com.forensics.dem.entity.Investigator;
import com.forensics.dem.entity.AuditLog;
import com.forensics.dem.repository.InvestigatorRepository;
import com.forensics.dem.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/investigators")
@CrossOrigin(origins = "*")
public class InvestigatorController {

    @Autowired
    private InvestigatorRepository investigatorRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    @GetMapping
    public ResponseEntity<List<Investigator>> getAllInvestigators() {
        return ResponseEntity.ok(investigatorRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<?> addInvestigator(@RequestBody Investigator investigator, @RequestParam(value = "adminEmail", defaultValue = "admin@dem.gov") String adminEmail) {
        if (investigator.getInvestigatorCode() == null || investigator.getInvestigatorCode().isEmpty()) {
            investigator.setInvestigatorCode("INV-" + (8000 + investigatorRepository.count() + 1));
        }
        Investigator saved = investigatorRepository.save(investigator);

        auditLogRepository.save(AuditLog.builder()
                .username(adminEmail)
                .role("ADMIN")
                .action("UPDATE")
                .description("Admin registered new investigator: " + saved.getName() + " (" + saved.getInvestigatorCode() + ")")
                .build());

        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam("status") String status, @RequestParam(value = "adminEmail", defaultValue = "admin@dem.gov") String adminEmail) {
        Optional<Investigator> invOpt = investigatorRepository.findById(id);
        if (invOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Investigator inv = invOpt.get();
        inv.setStatus(status);
        investigatorRepository.save(inv);

        auditLogRepository.save(AuditLog.builder()
                .username(adminEmail)
                .role("ADMIN")
                .action("UPDATE")
                .description("Admin updated investigator " + inv.getName() + " status to " + status)
                .build());

        return ResponseEntity.ok(inv);
    }
}
