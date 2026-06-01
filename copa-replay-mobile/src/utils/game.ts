import { Match } from "../types/match";
import { Prediction } from "../types/prediction";

export type Outcome = "HOME" | "AWAY" | "DRAW";
export type ResultType = "EXACT_SCORE" | "CORRECT_OUTCOME" | "WRONG";

export type PredictionResult = {
  points: number;
  resultType: ResultType;
  message: string;
};

export type UserStats = {
  totalPoints: number;
  totalAttempts: number;
  exactScores: number;
  correctOutcomes: number;
  wrongResults: number;
  accuracyRate: number;
};

export function getOutcome(homeScore: number, awayScore: number): Outcome {
  if (homeScore > awayScore) return "HOME";
  if (awayScore > homeScore) return "AWAY";
  return "DRAW";
}

export function calculatePredictionResult(
  match: Match,
  prediction: Pick<Prediction, "predictedHomeScore" | "predictedAwayScore">
): PredictionResult {
  const homeScore = match.homeScore ?? 0;
  const awayScore = match.awayScore ?? 0;

  if (prediction.predictedHomeScore === homeScore && prediction.predictedAwayScore === awayScore) {
    return {
      points: 3,
      resultType: "EXACT_SCORE",
      message: "Você acertou o placar exato! +3 pontos"
    };
  }

  if (getOutcome(prediction.predictedHomeScore, prediction.predictedAwayScore) === getOutcome(homeScore, awayScore)) {
    return {
      points: 1,
      resultType: "CORRECT_OUTCOME",
      message: "Você acertou o resultado! +1 ponto"
    };
  }

  return {
    points: 0,
    resultType: "WRONG",
    message: "Não foi dessa vez. +0 pontos"
  };
}

export function calculatePoints(match: Match, prediction: Prediction) {
  return calculatePredictionResult(match, prediction).points;
}

export function formatResultType(resultType: ResultType) {
  if (resultType === "EXACT_SCORE") return "Placar exato";
  if (resultType === "CORRECT_OUTCOME") return "Acertou vencedor";
  return "Errou";
}

export function getResultLabel(resultType: ResultType) {
  return formatResultType(resultType);
}

export function totalScore(predictions: Prediction[]) {
  return predictions.reduce((sum, prediction) => sum + calculatePoints(prediction.match, prediction), 0);
}

export function calculateUserStats(predictions: Prediction[]): UserStats {
  const results = predictions.map((prediction) => calculatePredictionResult(prediction.match, prediction));
  const totalAttempts = predictions.length;
  const exactScores = results.filter((result) => result.resultType === "EXACT_SCORE").length;
  const correctOutcomes = results.filter((result) => result.resultType === "CORRECT_OUTCOME").length;
  const wrongResults = results.filter((result) => result.resultType === "WRONG").length;
  const successfulAttempts = exactScores + correctOutcomes;

  return {
    totalPoints: results.reduce((sum, result) => sum + result.points, 0),
    totalAttempts,
    exactScores,
    correctOutcomes,
    wrongResults,
    accuracyRate: totalAttempts === 0 ? 0 : Math.round((successfulAttempts / totalAttempts) * 100)
  };
}

export function shuffleMatches(matches: Match[]) {
  return [...matches].sort(() => Math.random() - 0.5);
}

export function roundSummaryMessage(points: number) {
  if (points === 0) return "Rodada difícil. Tente novamente.";
  if (points <= 5) return "Bom começo!";
  if (points <= 10) return "Boa rodada!";
  return "Você entende de Copa!";
}
