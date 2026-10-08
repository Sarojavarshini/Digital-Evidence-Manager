package com.forensics.dem.controller;

import com.forensics.dem.entity.CustodyRecord;
import com.forensics.dem.repository.CustodyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/custody")
@CrossOrigin(origins = "*")
public class CustodyController {

    @Autowired
    private CustodyRepository custodyRepository;

    @GetMapping("/{evidenceId}")
    public ResponseEntity<List<CustodyRecord>> getCustodyChainByEvidenceId(@PathVariable Long evidenceId) {
        List<CustodyRecord> records = custodyRepository.findByEvidenceIdOrderByTimestampAsc(evidenceId);
        return ResponseEntity.ok(records);
    }

    @GetMapping("/code/{evidenceCode}")
    public ResponseEntity<List<CustodyRecord>> getCustodyChainByEvidenceCode(@PathVariable String evidenceCode) {
        List<CustodyRecord> records = custodyRepository.findByEvidenceCodeOrderByTimestampAsc(evidenceCode);
        return ResponseEntity.ok(records);
    }
}
