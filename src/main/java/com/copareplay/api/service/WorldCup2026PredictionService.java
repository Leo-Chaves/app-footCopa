package com.copareplay.api.service;

import com.copareplay.api.dto.worldcup2026prediction.CreateWorldCup2026PredictionRequest;
import com.copareplay.api.dto.worldcup2026prediction.UpdateWorldCup2026PredictionRequest;
import com.copareplay.api.dto.worldcup2026prediction.WorldCup2026PredictionResponse;
import com.copareplay.api.entity.User;
import com.copareplay.api.entity.WorldCup2026Prediction;
import com.copareplay.api.entity.WorldCup2026Result;
import com.copareplay.api.exception.ForbiddenOperationException;
import com.copareplay.api.exception.ResourceNotFoundException;
import com.copareplay.api.repository.WorldCup2026PredictionRepository;
import com.copareplay.api.repository.WorldCup2026ResultRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class WorldCup2026PredictionService {

    private final WorldCup2026PredictionRepository predictionRepository;
    private final WorldCup2026ResultRepository resultRepository;
    private final AuthService authService;
    private final DtoMapper mapper;

    @Transactional(readOnly = true)
    public List<WorldCup2026PredictionResponse> findMine(String email) {
        User user = authService.getUserByEmail(email);
        return predictionRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(mapper::toWorldCup2026PredictionResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public WorldCup2026PredictionResponse findMineById(String email, Long id) {
        User user = authService.getUserByEmail(email);
        WorldCup2026Prediction prediction = predictionRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Palpite 2026 nao encontrado"));
        return mapper.toWorldCup2026PredictionResponse(prediction);
    }

    @Transactional
    public WorldCup2026PredictionResponse create(String email, CreateWorldCup2026PredictionRequest request) {
        User user = authService.getUserByEmail(email);
        WorldCup2026Result result = resultRepository.findById(request.worldCup2026ResultId())
                .orElseThrow(() -> new ResourceNotFoundException("Jogo da Copa 2026 nao encontrado"));

        WorldCup2026Prediction prediction = WorldCup2026Prediction.builder()
                .user(user)
                .worldCup2026Result(result)
                .predictedHomeScore(request.predictedHomeScore())
                .predictedAwayScore(request.predictedAwayScore())
                .note(blankToNull(request.note()))
                .build();

        return mapper.toWorldCup2026PredictionResponse(predictionRepository.save(prediction));
    }

    @Transactional
    public WorldCup2026PredictionResponse update(String email, Long id, UpdateWorldCup2026PredictionRequest request) {
        WorldCup2026Prediction prediction = getOwnedPrediction(email, id);
        prediction.setPredictedHomeScore(request.predictedHomeScore());
        prediction.setPredictedAwayScore(request.predictedAwayScore());
        prediction.setNote(blankToNull(request.note()));
        return mapper.toWorldCup2026PredictionResponse(predictionRepository.save(prediction));
    }

    @Transactional
    public void delete(String email, Long id) {
        predictionRepository.delete(getOwnedPrediction(email, id));
    }

    private WorldCup2026Prediction getOwnedPrediction(String email, Long id) {
        User user = authService.getUserByEmail(email);
        WorldCup2026Prediction prediction = predictionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Palpite 2026 nao encontrado"));
        if (!prediction.getUser().getId().equals(user.getId())) {
            throw new ForbiddenOperationException("Acesso negado ao palpite 2026 informado");
        }
        return prediction;
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
