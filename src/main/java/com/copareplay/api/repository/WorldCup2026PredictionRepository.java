package com.copareplay.api.repository;

import com.copareplay.api.entity.WorldCup2026Prediction;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorldCup2026PredictionRepository extends JpaRepository<WorldCup2026Prediction, Long> {

    List<WorldCup2026Prediction> findByUserIdOrderByCreatedAtDesc(Long userId);

    Optional<WorldCup2026Prediction> findByIdAndUserId(Long id, Long userId);
}
