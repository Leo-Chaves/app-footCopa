package com.copareplay.api.controller;

import com.copareplay.api.dto.worldcup2026.WorldCup2026ResultRequest;
import com.copareplay.api.dto.worldcup2026.WorldCup2026ResultResponse;
import com.copareplay.api.service.WorldCup2026ImportResult;
import com.copareplay.api.service.WorldCup2026ResultService;
import jakarta.validation.Valid;
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
@RequestMapping("/api/world-cup-2026-results")
@RequiredArgsConstructor
public class WorldCup2026ResultController {

    private final WorldCup2026ResultService service;

    @GetMapping
    public List<WorldCup2026ResultResponse> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public WorldCup2026ResultResponse findById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public WorldCup2026ResultResponse create(@Valid @RequestBody WorldCup2026ResultRequest request) {
        return service.create(request);
    }

    @PostMapping("/import-fixtures")
    public WorldCup2026ImportResult importFixtures() {
        return service.importFixtures();
    }

    @PutMapping("/{id}")
    public WorldCup2026ResultResponse update(
            @PathVariable Long id,
            @Valid @RequestBody WorldCup2026ResultRequest request
    ) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
