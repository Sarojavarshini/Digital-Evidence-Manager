package com.forensics.dem.repository;

import com.forensics.dem.entity.CustodyRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CustodyRepository extends JpaRepository<CustodyRecord, Long> {
    List<CustodyRecord> findByEvidenceIdOrderByTimestampAsc(Long evidenceId);
    List<CustodyRecord> findByEvidenceCodeOrderByTimestampAsc(String evidenceCode);
}
