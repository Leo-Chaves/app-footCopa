package com.copareplay.api.repository;

import com.copareplay.api.entity.WorldCup;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorldCupRepository extends JpaRepository<WorldCup, Long> {

    Optional<WorldCup> findByYear(Integer year);

    boolean existsByYear(Integer year);
}
