package com.copareplay.api.repository;

import com.copareplay.api.entity.Prediction;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PredictionRepository extends JpaRepository<Prediction, Long> {

    List<Prediction> findByUserIdOrderByCreatedAtDesc(Long userId);

    Optional<Prediction> findByIdAndUserId(Long id, Long userId);
}
