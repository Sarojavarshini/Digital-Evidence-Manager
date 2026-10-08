package com.forensics.dem.controller;

import com.forensics.dem.entity.CaseFile;
import com.forensics.dem.repository.CaseRepository;
import com.forensics.dem.repository.AuditLogRepository;
import com.forensics.dem.entity.AuditLog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/cases")
@CrossOrigin(origins = "*")
public class CaseController {

    @Autowired
    private CaseRepository caseRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    @GetMapping
    public ResponseEntity<List<CaseFile>> getAllCases() {
        List<CaseFile> cases = caseRepository.findAll();
        return ResponseEntity.ok(cases);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCaseById(@PathVariable Long id) {
        Optional<CaseFile> caseFile = caseRepository.findById(id);
        if (caseFile.isPresent()) {
            return ResponseEntity.ok(caseFile.get());
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<?> createCase(@RequestBody CaseFile caseFile) {
        if (caseFile.getCaseCode() == null || caseFile.getCaseCode().isEmpty()) {
            caseFile.setCaseCode("CASE-2026-00" + (caseRepository.count() + 1));
        }
        CaseFile savedCase = caseRepository.save(caseFile);

        auditLogRepository.save(AuditLog.builder()
                .username(savedCase.getInvestigatorName())
                .role("INVESTIGATOR")
                .action("UPDATE")
                .caseCode(savedCase.getCaseCode())
                .description("Created new case: " + savedCase.getName() + " (" + savedCase.getType() + ")")
                .build());

        return ResponseEntity.ok(savedCase);
    }
}
