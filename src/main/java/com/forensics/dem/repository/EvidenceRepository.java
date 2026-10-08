package com.forensics.dem.repository;

import com.forensics.dem.entity.Evidence;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface EvidenceRepository extends JpaRepository<Evidence, Long> {
    Optional<Evidence> findByEvidenceCode(String evidenceCode);
    List<Evidence> findByCaseId(Long caseId);
    List<Evidence> findByCaseCode(String caseCode);
    List<Evidence> findByCurrentCustodian(String currentCustodian);
    List<Evidence> findByStatus(String status);
}
