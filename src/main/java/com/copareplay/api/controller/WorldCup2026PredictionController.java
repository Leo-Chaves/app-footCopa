package com.copareplay.api.controller;

import com.copareplay.api.dto.worldcup2026prediction.CreateWorldCup2026PredictionRequest;
import com.copareplay.api.dto.worldcup2026prediction.UpdateWorldCup2026PredictionRequest;
import com.copareplay.api.dto.worldcup2026prediction.WorldCup2026PredictionResponse;
import com.copareplay.api.service.WorldCup2026PredictionService;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/world-cup-2026-predictions")
@RequiredArgsConstructor
public class WorldCup2026PredictionController {

    private final WorldCup2026PredictionService service;

    @GetMapping
    public List<WorldCup2026PredictionResponse> findMine(Principal principal) {
        return service.findMine(principal.getName());
    }

    @GetMapping("/{id}")
    public WorldCup2026PredictionResponse findMineById(Principal principal, @PathVariable Long id) {
        return service.findMineById(principal.getName(), id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public WorldCup2026PredictionResponse create(
            Principal principal,
            @Valid @RequestBody CreateWorldCup2026PredictionRequest request
    ) {
        return service.create(principal.getName(), request);
    }

    @PutMapping("/{id}")
    public WorldCup2026PredictionResponse update(
            Principal principal,
            @PathVariable Long id,
            @Valid @RequestBody UpdateWorldCup2026PredictionRequest request
    ) {
        return service.update(principal.getName(), id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(Principal principal, @PathVariable Long id) {
        service.delete(principal.getName(), id);
    }
}
