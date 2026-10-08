package com.forensics.dem.repository;

import com.forensics.dem.entity.Investigator;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface InvestigatorRepository extends JpaRepository<Investigator, Long> {
    Optional<Investigator> findByInvestigatorCode(String investigatorCode);
    Optional<Investigator> findByEmail(String email);
}
