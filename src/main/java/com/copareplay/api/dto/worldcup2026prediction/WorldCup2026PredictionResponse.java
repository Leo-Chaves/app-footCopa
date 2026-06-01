package com.copareplay.api.dto.worldcup2026prediction;

import com.copareplay.api.dto.worldcup2026.WorldCup2026ResultResponse;
import java.time.LocalDateTime;

public record WorldCup2026PredictionResponse(
        Long id,
        WorldCup2026ResultResponse worldCup2026Result,
        Integer predictedHomeScore,
        Integer predictedAwayScore,
        String note,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
