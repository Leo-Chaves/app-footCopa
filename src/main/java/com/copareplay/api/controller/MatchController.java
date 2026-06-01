package com.copareplay.api.controller;

import com.copareplay.api.dto.match.MatchResponse;
import com.copareplay.api.service.MatchService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/matches")
@RequiredArgsConstructor
public class MatchController {

    private final MatchService matchService;

    @GetMapping
    public List<MatchResponse> findAll(
            @RequestParam(required = false) Long worldCupId,
            @RequestParam(required = false) String teamName,
            @RequestParam(required = false) String stage,
            @RequestParam(required = false) Integer year
    ) {
        return matchService.findAll(worldCupId, teamName, stage, year);
    }

    @GetMapping("/{id}")
    public MatchResponse findById(@PathVariable Long id) {
        return matchService.findById(id);
    }
}
