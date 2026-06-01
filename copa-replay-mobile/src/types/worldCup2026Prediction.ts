import { WorldCup2026Result } from "./worldCup2026Result";

export type WorldCup2026Prediction = {
  id: number;
  worldCup2026Result: WorldCup2026Result;
  predictedHomeScore: number;
  predictedAwayScore: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateWorldCup2026PredictionPayload = {
  worldCup2026ResultId: number;
  predictedHomeScore: number;
  predictedAwayScore: number;
};

export type UpdateWorldCup2026PredictionPayload = {
  predictedHomeScore: number;
  predictedAwayScore: number;
};
