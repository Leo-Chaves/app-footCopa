import { WorldCup2026Result, WorldCup2026ResultPayload } from "../types/worldCup2026Result";
import { api } from "./api";

export const worldCup2026ResultService = {
  async list(): Promise<WorldCup2026Result[]> {
    const { data } = await api.get<WorldCup2026Result[]>("/api/world-cup-2026-results");
    return data ?? [];
  },

  async get(id: number): Promise<WorldCup2026Result> {
    const { data } = await api.get<WorldCup2026Result>(`/api/world-cup-2026-results/${id}`);
    return data;
  },

  async create(payload: WorldCup2026ResultPayload): Promise<WorldCup2026Result> {
    const { data } = await api.post<WorldCup2026Result>("/api/world-cup-2026-results", payload);
    return data;
  },

  async update(id: number, payload: WorldCup2026ResultPayload): Promise<WorldCup2026Result> {
    const { data } = await api.put<WorldCup2026Result>(`/api/world-cup-2026-results/${id}`, payload);
    return data;
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/api/world-cup-2026-results/${id}`);
  },

  async importFixtures(): Promise<{ created: number; updated: number }> {
    const { data } = await api.post<{ created: number; updated: number }>("/api/world-cup-2026-results/import-fixtures");
    return data;
  }
};
