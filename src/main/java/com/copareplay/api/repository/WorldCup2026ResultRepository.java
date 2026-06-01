package com.copareplay.api.repository;

import com.copareplay.api.entity.WorldCup2026Result;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorldCup2026ResultRepository extends JpaRepository<WorldCup2026Result, Long> {

    List<WorldCup2026Result> findAllByOrderByMatchDateAscIdAsc();

    Optional<WorldCup2026Result> findBySourceMatchId(String sourceMatchId);
}
