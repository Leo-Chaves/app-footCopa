import { Team } from "../types/team";
import { api } from "./api";

export const teamService = {
  async list(): Promise<Team[]> {
    const { data } = await api.get<Team[]>("/api/teams");
    return data ?? [];
  },

  async get(id: number): Promise<Team> {
    const { data } = await api.get<Team>(`/api/teams/${id}`);
    return data;
  }
};
