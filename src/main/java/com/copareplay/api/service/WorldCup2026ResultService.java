package com.copareplay.api.service;

import com.copareplay.api.dto.worldcup2026.WorldCup2026ResultRequest;
import com.copareplay.api.dto.worldcup2026.WorldCup2026ResultResponse;
import com.copareplay.api.entity.WorldCup2026Result;
import com.copareplay.api.exception.BadRequestException;
import com.copareplay.api.exception.ResourceNotFoundException;
import com.copareplay.api.repository.WorldCup2026ResultRepository;
import com.fasterxml.jackson.databind.JsonNode;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.StreamSupport;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class WorldCup2026ResultService {

    private final WorldCup2026ResultRepository repository;
    private final RestTemplate restTemplate;

    @Value("${worldcup2026.base-url}")
    private String worldCup2026BaseUrl;

    private static final DateTimeFormatter EXTERNAL_DATE_FORMAT = DateTimeFormatter.ofPattern("MM/dd/yyyy HH:mm");

    @Transactional(readOnly = true)
    public List<WorldCup2026ResultResponse> findAll() {
        return repository.findAllByOrderByMatchDateAscIdAsc().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public WorldCup2026ResultResponse findById(Long id) {
        return toResponse(getResult(id));
    }

    @Transactional
    public WorldCup2026ResultResponse create(WorldCup2026ResultRequest request) {
        WorldCup2026Result result = WorldCup2026Result.builder().build();
        apply(result, request);
        return toResponse(repository.save(result));
    }

    @Transactional
    public WorldCup2026ResultResponse update(Long id, WorldCup2026ResultRequest request) {
        WorldCup2026Result result = getResult(id);
        apply(result, request);
        return toResponse(repository.save(result));
    }

    @Transactional
    public void delete(Long id) {
        repository.delete(getResult(id));
    }

    @Transactional
    public WorldCup2026ImportResult importFixtures() {
        try {
            JsonNode stadiumsRoot = restTemplate.getForObject(worldCup2026BaseUrl + "/get/stadiums", JsonNode.class);
            JsonNode gamesRoot = restTemplate.getForObject(worldCup2026BaseUrl + "/get/games", JsonNode.class);
            Map<String, JsonNode> stadiumsById = toStadiumMap(stadiumsRoot.path("stadiums"));

            int created = 0;
            int updated = 0;
            for (JsonNode game : gamesRoot.path("games")) {
                String externalId = text(game, "id").orElse(text(game, "_id").orElse(null));
                if (externalId == null) {
                    continue;
                }

                String sourceMatchId = "worldcup26-ir-" + externalId;
                WorldCup2026Result result = repository.findBySourceMatchId(sourceMatchId).orElseGet(() -> {
                    WorldCup2026Result newResult = WorldCup2026Result.builder().sourceMatchId(sourceMatchId).build();
                    return newResult;
                });

                boolean existed = result.getId() != null;
                applyExternalGame(result, game, stadiumsById.get(text(game, "stadium_id").orElse("")));
                result.setSourceMatchId(sourceMatchId);
                repository.save(result);

                if (existed) {
                    updated++;
                } else {
                    created++;
                }
            }
            return new WorldCup2026ImportResult(created, updated);
        } catch (Exception ex) {
            throw new BadRequestException("Nao foi possivel importar fixtures 2026: " + ex.getMessage());
        }
    }

    private WorldCup2026Result getResult(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resultado da Copa 2026 nao encontrado"));
    }

    private void apply(WorldCup2026Result result, WorldCup2026ResultRequest request) {
        result.setHomeTeam(request.homeTeam().trim());
        result.setAwayTeam(request.awayTeam().trim());
        result.setMatchDate(request.matchDate());
        result.setStage(request.stage().trim());
        result.setGroupName(blankToNull(request.groupName()));
        result.setStadium(blankToNull(request.stadium()));
        result.setCity(blankToNull(request.city()));
        result.setFinished(request.finished() != null ? request.finished() : false);
        result.setHomeScore(request.homeScore());
        result.setAwayScore(request.awayScore());
        result.setNote(blankToNull(request.note()));
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    private WorldCup2026ResultResponse toResponse(WorldCup2026Result result) {
        return new WorldCup2026ResultResponse(
                result.getId(),
                result.getHomeTeam(),
                result.getAwayTeam(),
                result.getMatchDate(),
                result.getStage(),
                result.getGroupName(),
                result.getStadium(),
                result.getCity(),
                result.getSourceMatchId(),
                result.getFinished(),
                result.getHomeScore(),
                result.getAwayScore(),
                result.getNote(),
                result.getCreatedAt(),
                result.getUpdatedAt()
        );
    }

    private Map<String, JsonNode> toStadiumMap(JsonNode stadiums) {
        if (!stadiums.isArray()) {
            return Map.of();
        }
        return StreamSupport.stream(stadiums.spliterator(), false).collect(Collectors.toMap(
                stadium -> text(stadium, "id").orElse(""),
                stadium -> stadium,
                (first, ignored) -> first
        ));
    }

    private void applyExternalGame(WorldCup2026Result result, JsonNode game, JsonNode stadium) {
        result.setHomeTeam(text(game, "home_team_name_en").orElse("Team " + text(game, "home_team_id").orElse("TBD")));
        result.setAwayTeam(text(game, "away_team_name_en").orElse("Team " + text(game, "away_team_id").orElse("TBD")));
        result.setMatchDate(parseExternalDate(text(game, "local_date").orElse(null)));
        result.setStage(stageLabel(text(game, "type").orElse("group")));
        result.setGroupName(text(game, "group").map(group -> "Group " + group).orElse(null));
        result.setStadium(stadium != null ? text(stadium, "fifa_name").orElse(text(stadium, "name_en").orElse(null)) : null);
        result.setCity(stadium != null ? text(stadium, "city_en").orElse(null) : null);
        result.setHomeScore(parseScore(text(game, "home_score").orElse("0")));
        result.setAwayScore(parseScore(text(game, "away_score").orElse("0")));
        result.setFinished("TRUE".equalsIgnoreCase(text(game, "finished").orElse("false"))
                || "true".equalsIgnoreCase(text(game, "finished").orElse("false")));
        result.setNote("Importado de worldcup26.ir");
    }

    private LocalDateTime parseExternalDate(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return LocalDateTime.parse(value, EXTERNAL_DATE_FORMAT);
    }

    private int parseScore(String value) {
        try {
            return Integer.parseInt(value);
        } catch (NumberFormatException ex) {
            return 0;
        }
    }

    private String stageLabel(String type) {
        return switch (type.toLowerCase()) {
            case "group" -> "Fase de grupos";
            case "round32" -> "Oitavas preliminares";
            case "round16" -> "Oitavas de final";
            case "quarter" -> "Quartas de final";
            case "semi" -> "Semifinal";
            case "third" -> "Disputa de terceiro lugar";
            case "final" -> "Final";
            default -> type;
        };
    }

    private Optional<String> text(JsonNode node, String field) {
        JsonNode value = node.path(field);
        if (value.isMissingNode() || value.isNull()) {
            return Optional.empty();
        }
        String text = value.asText();
        return text == null || text.isBlank() || "null".equalsIgnoreCase(text) ? Optional.empty() : Optional.of(text);
    }
}
