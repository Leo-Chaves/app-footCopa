package com.copareplay.api.service;

import com.copareplay.api.dto.prediction.CreatePredictionRequest;
import com.copareplay.api.dto.prediction.PredictionResponse;
import com.copareplay.api.dto.prediction.UpdatePredictionRequest;
import com.copareplay.api.entity.Match;
import com.copareplay.api.entity.Prediction;
import com.copareplay.api.entity.User;
import com.copareplay.api.exception.ForbiddenOperationException;
import com.copareplay.api.exception.ResourceNotFoundException;
import com.copareplay.api.repository.PredictionRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PredictionService {

    private final PredictionRepository predictionRepository;
    private final AuthService authService;
    private final MatchService matchService;
    private final DtoMapper mapper;

    @Transactional(readOnly = true)
    public List<PredictionResponse> findMine(String email) {
        User user = authService.getUserByEmail(email);
        return predictionRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(mapper::toPredictionResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public PredictionResponse findMineById(String email, Long id) {
        User user = authService.getUserByEmail(email);
        Prediction prediction = predictionRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Palpite nao encontrado"));
        return mapper.toPredictionResponse(prediction);
    }

    @Transactional
    public PredictionResponse create(String email, CreatePredictionRequest request) {
        User user = authService.getUserByEmail(email);
        Match match = matchService.getMatch(request.matchId());

        Prediction prediction = Prediction.builder()
                .user(user)
                .match(match)
                .predictedHomeScore(request.predictedHomeScore())
                .predictedAwayScore(request.predictedAwayScore())
                .note(request.note())
                .build();

        return mapper.toPredictionResponse(predictionRepository.save(prediction));
    }

    @Transactional
    public PredictionResponse update(String email, Long id, UpdatePredictionRequest request) {
        Prediction prediction = getOwnedPrediction(email, id);
        prediction.setPredictedHomeScore(request.predictedHomeScore());
        prediction.setPredictedAwayScore(request.predictedAwayScore());
        prediction.setNote(request.note());
        return mapper.toPredictionResponse(predictionRepository.save(prediction));
    }

    @Transactional
    public void delete(String email, Long id) {
        Prediction prediction = getOwnedPrediction(email, id);
        predictionRepository.delete(prediction);
    }

    private Prediction getOwnedPrediction(String email, Long id) {
        User user = authService.getUserByEmail(email);
        Prediction prediction = predictionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Palpite nao encontrado"));
        if (!prediction.getUser().getId().equals(user.getId())) {
            throw new ForbiddenOperationException("Acesso negado ao palpite informado");
        }
        return prediction;
    }
}
