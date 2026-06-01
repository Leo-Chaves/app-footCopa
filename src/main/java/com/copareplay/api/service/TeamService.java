package com.copareplay.api.service;

import com.copareplay.api.dto.team.TeamResponse;
import com.copareplay.api.entity.Team;
import com.copareplay.api.exception.ResourceNotFoundException;
import com.copareplay.api.repository.TeamRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TeamService {

    private final TeamRepository teamRepository;
    private final DtoMapper mapper;

    @Transactional(readOnly = true)
    public List<TeamResponse> findAll() {
        return teamRepository.findAll().stream()
                .map(mapper::toTeamResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public TeamResponse findById(Long id) {
        return mapper.toTeamResponse(getTeam(id));
    }

    public Team getTeam(Long id) {
        return teamRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Selecao nao encontrada"));
    }
}
