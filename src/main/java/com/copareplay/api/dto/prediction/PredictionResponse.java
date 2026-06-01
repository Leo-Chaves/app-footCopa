package com.copareplay.api.dto.prediction;

import com.copareplay.api.dto.match.MatchResponse;
import java.time.LocalDateTime;

public record PredictionResponse(
        Long id,
        MatchResponse match,
        Integer predictedHomeScore,
        Integer predictedAwayScore,
        String note,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
