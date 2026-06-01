package com.copareplay.api.service;

import com.copareplay.api.dto.match.MatchResponse;
import com.copareplay.api.entity.Match;
import com.copareplay.api.exception.ResourceNotFoundException;
import com.copareplay.api.repository.MatchRepository;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MatchService {

    private final MatchRepository matchRepository;
    private final DtoMapper mapper;

    @Transactional(readOnly = true)
    public List<MatchResponse> findAll(Long worldCupId, String teamName, String stage, Integer year) {
        Specification<Match> specification = (root, query, builder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (worldCupId != null) {
                predicates.add(builder.equal(root.get("worldCup").get("id"), worldCupId));
            }
            if (year != null) {
                predicates.add(builder.equal(root.get("worldCup").get("year"), year));
            }
            if (stage != null && !stage.isBlank()) {
                predicates.add(builder.like(builder.lower(root.get("stage")), "%" + stage.toLowerCase() + "%"));
            }
            if (teamName != null && !teamName.isBlank()) {
                String term = "%" + teamName.toLowerCase() + "%";
                predicates.add(builder.or(
                        builder.like(builder.lower(root.get("homeTeam").get("name")), term),
                        builder.like(builder.lower(root.get("awayTeam").get("name")), term)
                ));
            }

            return builder.and(predicates.toArray(Predicate[]::new));
        };

        return matchRepository.findAll(specification).stream()
                .map(mapper::toMatchResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public MatchResponse findById(Long id) {
        return mapper.toMatchResponse(getMatch(id));
    }

    public Match getMatch(Long id) {
        return matchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Jogo nao encontrado"));
    }
}
