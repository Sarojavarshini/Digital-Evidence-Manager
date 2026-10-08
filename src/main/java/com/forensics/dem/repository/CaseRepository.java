package com.forensics.dem.repository;

import com.forensics.dem.entity.CaseFile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CaseRepository extends JpaRepository<CaseFile, Long> {
    Optional<CaseFile> findByCaseCode(String caseCode);
    List<CaseFile> findByInvestigatorName(String investigatorName);
    List<CaseFile> findByStatus(String status);
    List<CaseFile> findByType(String type);
}
