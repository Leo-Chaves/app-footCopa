package com.copareplay.api.controller;

import com.copareplay.api.dto.prediction.CreatePredictionRequest;
import com.copareplay.api.dto.prediction.PredictionResponse;
import com.copareplay.api.dto.prediction.UpdatePredictionRequest;
import com.copareplay.api.service.PredictionService;
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
@RequestMapping("/api/predictions")
@RequiredArgsConstructor
public class PredictionController {

    private final PredictionService predictionService;

    @GetMapping
    public List<PredictionResponse> findMine(Principal principal) {
        return predictionService.findMine(principal.getName());
    }

    @GetMapping("/{id}")
    public PredictionResponse findMineById(Principal principal, @PathVariable Long id) {
        return predictionService.findMineById(principal.getName(), id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PredictionResponse create(Principal principal, @Valid @RequestBody CreatePredictionRequest request) {
        return predictionService.create(principal.getName(), request);
    }

    @PutMapping("/{id}")
    public PredictionResponse update(
            Principal principal,
            @PathVariable Long id,
            @Valid @RequestBody UpdatePredictionRequest request
    ) {
        return predictionService.update(principal.getName(), id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(Principal principal, @PathVariable Long id) {
        predictionService.delete(principal.getName(), id);
    }
}
