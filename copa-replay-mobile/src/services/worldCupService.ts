import { Match } from "../types/match";
import { WorldCup } from "../types/worldCup";
import { api } from "./api";

export const worldCupService = {
  async list(): Promise<WorldCup[]> {
    const { data } = await api.get<WorldCup[]>("/api/world-cups");
    return data ?? [];
  },

  async get(id: number): Promise<WorldCup> {
    const { data } = await api.get<WorldCup>(`/api/world-cups/${id}`);
    return data;
  },

  async matches(id: number): Promise<Match[]> {
    const { data } = await api.get<Match[]>(`/api/world-cups/${id}/matches`);
    return data ?? [];
  }
};
