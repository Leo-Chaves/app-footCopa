package com.copareplay.api.dto.worldcup;

public record WorldCupResponse(
        Long id,
        Integer year,
        String name,
        String hostCountry,
        String sourceKey
) {
}
