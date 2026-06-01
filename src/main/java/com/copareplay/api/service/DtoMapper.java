package com.copareplay.api.service;

import com.copareplay.api.dto.auth.UserResponse;
import com.copareplay.api.dto.match.MatchResponse;
import com.copareplay.api.dto.prediction.PredictionResponse;
import com.copareplay.api.dto.team.TeamResponse;
import com.copareplay.api.dto.worldcup.WorldCupResponse;
import com.copareplay.api.dto.worldcup2026.WorldCup2026ResultResponse;
import com.copareplay.api.dto.worldcup2026prediction.WorldCup2026PredictionResponse;
import com.copareplay.api.entity.Match;
import com.copareplay.api.entity.Prediction;
import com.copareplay.api.entity.Team;
import com.copareplay.api.entity.User;
import com.copareplay.api.entity.WorldCup;
import com.copareplay.api.entity.WorldCup2026Prediction;
import com.copareplay.api.entity.WorldCup2026Result;
import org.springframework.stereotype.Component;

@Component
public class DtoMapper {

    public UserResponse toUserResponse(User user) {
        return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getRole());
    }

    public WorldCupResponse toWorldCupResponse(WorldCup worldCup) {
        return new WorldCupResponse(
                worldCup.getId(),
                worldCup.getYear(),
                worldCup.getName(),
                worldCup.getHostCountry(),
                worldCup.getSourceKey()
        );
    }

    public TeamResponse toTeamResponse(Team team) {
        return new TeamResponse(team.getId(), team.getName(), team.getCode(), team.getFlagUrl());
    }

    public MatchResponse toMatchResponse(Match match) {
        return new MatchResponse(
                match.getId(),
                toWorldCupResponse(match.getWorldCup()),
                toTeamResponse(match.getHomeTeam()),
                toTeamResponse(match.getAwayTeam()),
                match.getMatchDate(),
                match.getStage(),
                match.getGroupName(),
                match.getStadium(),
                match.getCity(),
                match.getHomeScore(),
                match.getAwayScore(),
                match.getSourceMatchId()
        );
    }

    public PredictionResponse toPredictionResponse(Prediction prediction) {
        return new PredictionResponse(
                prediction.getId(),
                toMatchResponse(prediction.getMatch()),
                prediction.getPredictedHomeScore(),
                prediction.getPredictedAwayScore(),
                prediction.getNote(),
                prediction.getCreatedAt(),
                prediction.getUpdatedAt()
        );
    }

    public WorldCup2026ResultResponse toWorldCup2026ResultResponse(WorldCup2026Result result) {
        return new WorldCup2026ResultResponse(
                result.getId(),
                result.getHomeTeam(),
                result.getAwayTeam(),
                result.getMatchDate(),
                result.getStage(),
                result.getGroupName(),
                result.getStadium(),
                result.getCity(),
                result.getSourceMatchId(),
                result.getFinished(),
                result.getHomeScore(),
                result.getAwayScore(),
                result.getNote(),
                result.getCreatedAt(),
                result.getUpdatedAt()
        );
    }

    public WorldCup2026PredictionResponse toWorldCup2026PredictionResponse(WorldCup2026Prediction prediction) {
        return new WorldCup2026PredictionResponse(
                prediction.getId(),
                toWorldCup2026ResultResponse(prediction.getWorldCup2026Result()),
                prediction.getPredictedHomeScore(),
                prediction.getPredictedAwayScore(),
                prediction.getNote(),
                prediction.getCreatedAt(),
                prediction.getUpdatedAt()
        );
    }
}
