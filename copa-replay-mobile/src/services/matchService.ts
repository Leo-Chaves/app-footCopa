import { Match } from "../types/match";
import { api } from "./api";

export const matchService = {
  async list(): Promise<Match[]> {
    const { data } = await api.get<Match[]>("/api/matches");
    return data ?? [];
  },

  async get(id: number): Promise<Match> {
    const { data } = await api.get<Match>(`/api/matches/${id}`);
    return data;
  }
};
