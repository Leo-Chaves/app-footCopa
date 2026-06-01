import {
  CreateWorldCup2026PredictionPayload,
  UpdateWorldCup2026PredictionPayload,
  WorldCup2026Prediction
} from "../types/worldCup2026Prediction";
import { api } from "./api";

export const worldCup2026PredictionService = {
  async list(): Promise<WorldCup2026Prediction[]> {
    const { data } = await api.get<WorldCup2026Prediction[]>("/api/world-cup-2026-predictions");
    return data ?? [];
  },

  async get(id: number): Promise<WorldCup2026Prediction> {
    const { data } = await api.get<WorldCup2026Prediction>(`/api/world-cup-2026-predictions/${id}`);
    return data;
  },

  async create(payload: CreateWorldCup2026PredictionPayload): Promise<WorldCup2026Prediction> {
    const { data } = await api.post<WorldCup2026Prediction>("/api/world-cup-2026-predictions", payload);
    return data;
  },

  async update(id: number, payload: UpdateWorldCup2026PredictionPayload): Promise<WorldCup2026Prediction> {
    const { data } = await api.put<WorldCup2026Prediction>(`/api/world-cup-2026-predictions/${id}`, payload);
    return data;
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/api/world-cup-2026-predictions/${id}`);
  }
};
