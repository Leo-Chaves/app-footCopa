package com.copareplay.api.dto.team;

public record TeamResponse(
        Long id,
        String name,
        String code,
        String flagUrl
) {
}
