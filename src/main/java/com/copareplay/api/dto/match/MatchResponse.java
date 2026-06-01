package com.copareplay.api.dto.match;

import com.copareplay.api.dto.team.TeamResponse;
import com.copareplay.api.dto.worldcup.WorldCupResponse;
import java.time.LocalDateTime;

public record MatchResponse(
        Long id,
        WorldCupResponse worldCup,
        TeamResponse homeTeam,
        TeamResponse awayTeam,
        LocalDateTime matchDate,
        String stage,
        String groupName,
        String stadium,
        String city,
        Integer homeScore,
        Integer awayScore,
        String sourceMatchId
) {
}
