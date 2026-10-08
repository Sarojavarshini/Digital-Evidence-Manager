package com.forensics.dem.controller;

import com.forensics.dem.repository.CaseRepository;
import com.forensics.dem.repository.EvidenceRepository;
import com.forensics.dem.repository.CustodyRepository;
import com.forensics.dem.repository.AuditLogRepository;
import com.forensics.dem.repository.InvestigatorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {

    @Autowired
    private CaseRepository caseRepository;

    @Autowired
    private EvidenceRepository evidenceRepository;

    @Autowired
    private CustodyRepository custodyRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Autowired
    private InvestigatorRepository investigatorRepository;

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getSummaryStats() {
        long totalCases = caseRepository.count();
        long totalEvidence = evidenceRepository.count();
        long verifiedEvidence = evidenceRepository.findByStatus("VERIFIED").size();
        long integrityAlerts = evidenceRepository.findByStatus("COMPROMISED").size();
        long activeInvestigations = caseRepository.findByStatus("Under Investigation").size() + caseRepository.findByStatus("Active").size();

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalCases", totalCases);
        summary.put("totalEvidence", totalEvidence);
        summary.put("verifiedEvidence", verifiedEvidence);
        summary.put("verificationPercentage", totalEvidence > 0 ? (verifiedEvidence * 100 / totalEvidence) : 100);
        summary.put("integrityAlerts", integrityAlerts);
        summary.put("activeInvestigations", activeInvestigations);
        summary.put("totalInvestigators", investigatorRepository.count());
        summary.put("totalAuditLogs", auditLogRepository.count());

        return ResponseEntity.ok(summary);
    }
}
