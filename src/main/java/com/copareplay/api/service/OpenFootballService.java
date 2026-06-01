package com.copareplay.api.service;

import com.copareplay.api.entity.Match;
import com.copareplay.api.entity.Team;
import com.copareplay.api.entity.WorldCup;
import com.copareplay.api.exception.BadRequestException;
import com.copareplay.api.repository.MatchRepository;
import com.copareplay.api.repository.TeamRepository;
import com.copareplay.api.repository.WorldCupRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class OpenFootballService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final WorldCupRepository worldCupRepository;
    private final TeamRepository teamRepository;
    private final MatchRepository matchRepository;

    @Value("${openfootball.base-url}")
    private String baseUrl;

    private static final Map<Integer, String> HOST_COUNTRIES = Map.of(
            2014, "Brazil",
            2018, "Russia",
            2022, "Qatar"
    );

    private static final Map<String, String> FIFA_CODES = Map.ofEntries(
            Map.entry("Algeria", "ALG"),
            Map.entry("Argentina", "ARG"),
            Map.entry("Australia", "AUS"),
            Map.entry("Belgium", "BEL"),
            Map.entry("Bosnia and Herzegovina", "BIH"),
            Map.entry("Brazil", "BRA"),
            Map.entry("Cameroon", "CMR"),
            Map.entry("Canada", "CAN"),
            Map.entry("Chile", "CHI"),
            Map.entry("Colombia", "COL"),
            Map.entry("Costa Rica", "CRC"),
            Map.entry("Croatia", "CRO"),
            Map.entry("Denmark", "DEN"),
            Map.entry("Ecuador", "ECU"),
            Map.entry("Egypt", "EGY"),
            Map.entry("England", "ENG"),
            Map.entry("France", "FRA"),
            Map.entry("Germany", "GER"),
            Map.entry("Ghana", "GHA"),
            Map.entry("Greece", "GRE"),
            Map.entry("Honduras", "HON"),
            Map.entry("Iceland", "ISL"),
            Map.entry("Iran", "IRN"),
            Map.entry("Italy", "ITA"),
            Map.entry("Ivory Coast", "CIV"),
            Map.entry("Japan", "JPN"),
            Map.entry("Mexico", "MEX"),
            Map.entry("Morocco", "MAR"),
            Map.entry("Netherlands", "NED"),
            Map.entry("Nigeria", "NGA"),
            Map.entry("Poland", "POL"),
            Map.entry("Portugal", "POR"),
            Map.entry("Qatar", "QAT"),
            Map.entry("Russia", "RUS"),
            Map.entry("Saudi Arabia", "KSA"),
            Map.entry("Senegal", "SEN"),
            Map.entry("Serbia", "SRB"),
            Map.entry("South Korea", "KOR"),
            Map.entry("Spain", "ESP"),
            Map.entry("Switzerland", "SUI"),
            Map.entry("Tunisia", "TUN"),
            Map.entry("United States", "USA"),
            Map.entry("Uruguay", "URU"),
            Map.entry("Wales", "WAL")
    );

    private static final Map<String, String> FLAG_COUNTRY_CODES = Map.ofEntries(
            Map.entry("Algeria", "dz"),
            Map.entry("Argentina", "ar"),
            Map.entry("Australia", "au"),
            Map.entry("Belgium", "be"),
            Map.entry("Bosnia and Herzegovina", "ba"),
            Map.entry("Brazil", "br"),
            Map.entry("Cameroon", "cm"),
            Map.entry("Canada", "ca"),
            Map.entry("Chile", "cl"),
            Map.entry("Colombia", "co"),
            Map.entry("Costa Rica", "cr"),
            Map.entry("Croatia", "hr"),
            Map.entry("Denmark", "dk"),
            Map.entry("Ecuador", "ec"),
            Map.entry("Egypt", "eg"),
            Map.entry("England", "gb-eng"),
            Map.entry("France", "fr"),
            Map.entry("Germany", "de"),
            Map.entry("Ghana", "gh"),
            Map.entry("Greece", "gr"),
            Map.entry("Honduras", "hn"),
            Map.entry("Iceland", "is"),
            Map.entry("Iran", "ir"),
            Map.entry("Italy", "it"),
            Map.entry("Ivory Coast", "ci"),
            Map.entry("Japan", "jp"),
            Map.entry("Mexico", "mx"),
            Map.entry("Morocco", "ma"),
            Map.entry("Netherlands", "nl"),
            Map.entry("Nigeria", "ng"),
            Map.entry("Poland", "pl"),
            Map.entry("Portugal", "pt"),
            Map.entry("Qatar", "qa"),
            Map.entry("Russia", "ru"),
            Map.entry("Saudi Arabia", "sa"),
            Map.entry("Senegal", "sn"),
            Map.entry("Serbia", "rs"),
            Map.entry("South Korea", "kr"),
            Map.entry("Spain", "es"),
            Map.entry("Switzerland", "ch"),
            Map.entry("Tunisia", "tn"),
            Map.entry("United States", "us"),
            Map.entry("Uruguay", "uy"),
            Map.entry("Wales", "gb-wls")
    );

    public String fetchWorldCupJson(Integer year) {
        validateSupportedYear(year);
        String url = "%s/%d/worldcup.json".formatted(baseUrl, year);
        return restTemplate.getForObject(url, String.class);
    }

    public OpenFootballImportResult importWorldCup(Integer year) {
        validateSupportedYear(year);
        try {
            JsonNode root = objectMapper.readTree(fetchWorldCupJson(year));
            JsonNode matches = root.path("matches");
            if (!matches.isArray()) {
                throw new BadRequestException("JSON do OpenFootball nao possui lista de jogos valida");
            }

            ImportCounter counter = new ImportCounter();
            WorldCup worldCup = findOrCreateWorldCup(year, root.path("name").asText("World Cup " + year), counter);

            int index = 1;
            for (JsonNode matchNode : matches) {
                importMatch(worldCup, year, index, matchNode, counter);
                index++;
            }

            return new OpenFootballImportResult(
                    counter.worldCupsCreated,
                    counter.teamsCreated,
                    counter.matchesCreated,
                    counter.matchesUpdated
            );
        } catch (BadRequestException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new BadRequestException("Nao foi possivel importar dados do OpenFootball: " + ex.getMessage());
        }
    }

    public void validateSupportedYear(Integer year) {
        if (year == null || (year != 2014 && year != 2018 && year != 2022)) {
            throw new BadRequestException("Importacao disponivel inicialmente apenas para 2014, 2018 e 2022");
        }
    }

    private WorldCup findOrCreateWorldCup(Integer year, String name, ImportCounter counter) {
        return worldCupRepository.findByYear(year).orElseGet(() -> {
            counter.worldCupsCreated++;
            return worldCupRepository.save(WorldCup.builder()
                    .year(year)
                    .name(name)
                    .hostCountry(HOST_COUNTRIES.getOrDefault(year, "Unknown"))
                    .sourceKey("openfootball-worldcup-" + year)
                    .build());
        });
    }

    private void importMatch(WorldCup worldCup, Integer year, int index, JsonNode matchNode, ImportCounter counter) {
        String homeName = matchNode.path("team1").asText(null);
        String awayName = matchNode.path("team2").asText(null);
        if (homeName == null || awayName == null) {
            return;
        }

        Team homeTeam = findOrCreateTeam(homeName, counter);
        Team awayTeam = findOrCreateTeam(awayName, counter);
        LocalDateTime matchDate = parseMatchDate(matchNode.path("date").asText(null), matchNode.path("time").asText(null));
        String sourceMatchId = "openfootball-%d-%02d-%s-%s".formatted(
                year,
                index,
                slug(homeName),
                slug(awayName)
        );

        Match match = matchRepository.findBySourceMatchId(sourceMatchId)
                .or(() -> matchRepository.findByWorldCupIdAndHomeTeamIdAndAwayTeamIdAndMatchDate(
                        worldCup.getId(),
                        homeTeam.getId(),
                        awayTeam.getId(),
                        matchDate
                ))
                .orElseGet(() -> {
                    counter.matchesCreated++;
                    return Match.builder()
                            .worldCup(worldCup)
                            .homeTeam(homeTeam)
                            .awayTeam(awayTeam)
                            .build();
                });

        boolean existed = match.getId() != null;
        match.setWorldCup(worldCup);
        match.setHomeTeam(homeTeam);
        match.setAwayTeam(awayTeam);
        match.setMatchDate(matchDate);
        match.setStage(matchNode.path("round").asText("Matchday"));
        match.setGroupName(textOrNull(matchNode, "group"));
        applyGround(match, textOrNull(matchNode, "ground"));
        applyScore(match, matchNode.path("score"));
        match.setSourceMatchId(sourceMatchId);
        matchRepository.save(match);

        if (existed) {
            counter.matchesUpdated++;
        }
    }

    private Team findOrCreateTeam(String name, ImportCounter counter) {
        return teamRepository.findByNameIgnoreCase(name).orElseGet(() -> {
            String code = uniqueTeamCode(name);
            counter.teamsCreated++;
            return teamRepository.save(Team.builder()
                    .name(name)
                    .code(code)
                    .flagUrl(flagUrl(name))
                    .build());
        });
    }

    private String uniqueTeamCode(String name) {
        String preferred = FIFA_CODES.getOrDefault(name, fallbackCode(name));
        Team sameCode = teamRepository.findByCodeIgnoreCase(preferred).orElse(null);
        if (sameCode == null || sameCode.getName().equalsIgnoreCase(name)) {
            return preferred;
        }

        String base = fallbackCode(name);
        for (int i = 0; i < 36; i++) {
            char suffix = Character.toUpperCase(Character.forDigit(i, 36));
            String candidate = (base.substring(0, 2) + suffix).toUpperCase(Locale.ROOT);
            Team existing = teamRepository.findByCodeIgnoreCase(candidate).orElse(null);
            if (existing == null || existing.getName().equalsIgnoreCase(name)) {
                return candidate;
            }
        }
        throw new BadRequestException("Nao foi possivel gerar codigo unico para selecao: " + name);
    }

    private String fallbackCode(String name) {
        String cleaned = name.replaceAll("[^A-Za-z]", "").toUpperCase(Locale.ROOT);
        if (cleaned.length() >= 3) {
            return cleaned.substring(0, 3);
        }
        return (cleaned + "XXX").substring(0, 3);
    }

    private String flagUrl(String name) {
        String countryCode = FLAG_COUNTRY_CODES.get(name);
        if (countryCode == null) {
            return null;
        }
        return "https://flagcdn.com/w320/" + countryCode + ".png";
    }

    private LocalDateTime parseMatchDate(String date, String time) {
        LocalDate localDate = LocalDate.parse(date);
        if (time == null || time.isBlank()) {
            return localDate.atStartOfDay();
        }
        String normalized = time.split(" ")[0];
        return LocalDateTime.of(localDate, LocalTime.parse(normalized));
    }

    private void applyGround(Match match, String ground) {
        if (ground == null || ground.isBlank()) {
            match.setStadium(null);
            match.setCity(null);
            return;
        }

        String[] parts = ground.split(",");
        match.setStadium(parts[0].trim());
        match.setCity(parts.length > 1 ? parts[parts.length - 1].trim() : null);
    }

    private void applyScore(Match match, JsonNode score) {
        JsonNode finalScore = score.path("et").isArray() ? score.path("et") : score.path("ft");
        if (finalScore.isArray() && finalScore.size() >= 2) {
            match.setHomeScore(finalScore.get(0).asInt());
            match.setAwayScore(finalScore.get(1).asInt());
        }
    }

    private String textOrNull(JsonNode node, String field) {
        String value = node.path(field).asText(null);
        return value == null || value.isBlank() ? null : value;
    }

    private String slug(String value) {
        return value.toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("(^-|-$)", "");
    }

    private static class ImportCounter {
        private int worldCupsCreated;
        private int teamsCreated;
        private int matchesCreated;
        private int matchesUpdated;
    }
}
