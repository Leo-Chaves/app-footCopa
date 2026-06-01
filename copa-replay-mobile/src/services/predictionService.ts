import { CreatePredictionPayload, Prediction, UpdatePredictionPayload } from "../types/prediction";
import { api } from "./api";

export const predictionService = {
  async list(): Promise<Prediction[]> {
    const { data } = await api.get<Prediction[]>("/api/predictions");
    return data ?? [];
  },

  async get(id: number): Promise<Prediction> {
    const { data } = await api.get<Prediction>(`/api/predictions/${id}`);
    return data;
  },

  async create(payload: CreatePredictionPayload): Promise<Prediction> {
    const { data } = await api.post<Prediction>("/api/predictions", payload);
    return data;
  },

  async update(id: number, payload: UpdatePredictionPayload): Promise<Prediction> {
    const { data } = await api.put<Prediction>(`/api/predictions/${id}`, payload);
    return data;
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/api/predictions/${id}`);
  }
};
