import { User } from "./auth";
import { Match } from "./match";

export type Prediction = {
  id: number;
  user?: User;
  match: Match;
  predictedHomeScore: number;
  predictedAwayScore: number;
  points?: number;
  resultType?: "EXACT_SCORE" | "CORRECT_OUTCOME" | "WRONG";
  createdAt: string;
  updatedAt: string;
};

export type CreatePredictionPayload = {
  matchId: number;
  predictedHomeScore: number;
  predictedAwayScore: number;
};

export type UpdatePredictionPayload = {
  predictedHomeScore: number;
  predictedAwayScore: number;
};
