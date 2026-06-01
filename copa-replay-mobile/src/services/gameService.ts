import { Match } from "../types/match";
import { CreatePredictionPayload, Prediction } from "../types/prediction";
import { calculatePredictionResult, totalScore } from "../utils/game";
import { matchService } from "./matchService";
import { predictionService } from "./predictionService";

export const gameService = {
  async getRandomMatch(matchId?: number): Promise<Match> {
    if (matchId) {
      return matchService.get(matchId);
    }
    const matches = await matchService.list();
    const playableMatches = matches.filter((match) => match.homeScore != null && match.awayScore != null);
    if (playableMatches.length === 0) {
      throw new Error("Nenhuma partida disponível para o desafio.");
    }
    return playableMatches[Math.floor(Math.random() * playableMatches.length)];
  },

  async submitGuess(payload: CreatePredictionPayload): Promise<Prediction> {
    return predictionService.create(payload);
  },

  async getHistory(): Promise<Prediction[]> {
    return predictionService.list();
  },

  async getScore(): Promise<number> {
    return totalScore(await predictionService.list());
  },

  calculateResult(match: Match, prediction: Pick<Prediction, "predictedHomeScore" | "predictedAwayScore">) {
    return calculatePredictionResult(match, prediction);
  }
};
