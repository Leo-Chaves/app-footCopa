package com.copareplay.api.service;

public record OpenFootballImportResult(
        int worldCupsCreated,
        int teamsCreated,
        int matchesCreated,
        int matchesUpdated
) {
}
