package com.copareplay.api.controller;

import com.copareplay.api.dto.match.MatchResponse;
import com.copareplay.api.dto.worldcup.WorldCupResponse;
import com.copareplay.api.service.WorldCupService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/world-cups")
@RequiredArgsConstructor
public class WorldCupController {

    private final WorldCupService worldCupService;

    @GetMapping
    public List<WorldCupResponse> findAll() {
        return worldCupService.findAll();
    }

    @GetMapping("/{id}")
    public WorldCupResponse findById(@PathVariable Long id) {
        return worldCupService.findById(id);
    }

    @GetMapping("/{id}/matches")
    public List<MatchResponse> findMatches(@PathVariable Long id) {
        return worldCupService.findMatches(id);
    }
}
