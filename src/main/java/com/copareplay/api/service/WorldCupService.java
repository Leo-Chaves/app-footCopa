package com.copareplay.api.service;

import com.copareplay.api.dto.match.MatchResponse;
import com.copareplay.api.dto.worldcup.WorldCupResponse;
import com.copareplay.api.entity.WorldCup;
import com.copareplay.api.exception.ResourceNotFoundException;
import com.copareplay.api.repository.MatchRepository;
import com.copareplay.api.repository.WorldCupRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class WorldCupService {

    private final WorldCupRepository worldCupRepository;
    private final MatchRepository matchRepository;
    private final DtoMapper mapper;

    @Transactional(readOnly = true)
    public List<WorldCupResponse> findAll() {
        return worldCupRepository.findAll().stream()
                .map(mapper::toWorldCupResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public WorldCupResponse findById(Long id) {
        return mapper.toWorldCupResponse(getWorldCup(id));
    }

    @Transactional(readOnly = true)
    public List<MatchResponse> findMatches(Long id) {
        if (!worldCupRepository.existsById(id)) {
            throw new ResourceNotFoundException("Copa nao encontrada");
        }
        return matchRepository.findByWorldCupId(id).stream()
                .map(mapper::toMatchResponse)
                .toList();
    }

    public WorldCup getWorldCup(Long id) {
        return worldCupRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Copa nao encontrada"));
    }
}
