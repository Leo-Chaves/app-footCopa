package com.copareplay.api.dto.worldcup2026;

import java.time.LocalDateTime;

public record WorldCup2026ResultResponse(
        Long id,
        String homeTeam,
        String awayTeam,
        LocalDateTime matchDate,
        String stage,
        String groupName,
        String stadium,
        String city,
        String sourceMatchId,
        Boolean finished,
        Integer homeScore,
        Integer awayScore,
        String note,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
