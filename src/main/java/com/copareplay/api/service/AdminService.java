package com.copareplay.api.service;

import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final OpenFootballService openFootballService;

    @Transactional
    public Map<String, Object> seed() {
        OpenFootballImportResult result2014 = openFootballService.importWorldCup(2014);
        OpenFootballImportResult result2018 = openFootballService.importWorldCup(2018);
        OpenFootballImportResult result2022 = openFootballService.importWorldCup(2022);

        return Map.of(
                "message", "Seed executado com dados reais do OpenFootball",
                "worldCupsCreated", result2014.worldCupsCreated() + result2018.worldCupsCreated() + result2022.worldCupsCreated(),
                "teamsCreated", result2014.teamsCreated() + result2018.teamsCreated() + result2022.teamsCreated(),
                "matchesCreated", result2014.matchesCreated() + result2018.matchesCreated() + result2022.matchesCreated(),
                "matchesUpdated", result2014.matchesUpdated() + result2018.matchesUpdated() + result2022.matchesUpdated()
        );
    }

    @Transactional
    public Map<String, Object> importWorldCup(Integer year) {
        OpenFootballImportResult result = openFootballService.importWorldCup(year);
        return Map.of(
                "message", "Importacao real do OpenFootball concluida",
                "year", year,
                "worldCupsCreated", result.worldCupsCreated(),
                "teamsCreated", result.teamsCreated(),
                "matchesCreated", result.matchesCreated(),
                "matchesUpdated", result.matchesUpdated()
        );
    }
}
