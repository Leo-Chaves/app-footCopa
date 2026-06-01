import { User } from "../types/auth";
import { api } from "./api";

export type UpdateProfilePayload = {
  name: string;
};

export type UpdatePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

export const userService = {
  async updateProfile(payload: UpdateProfilePayload): Promise<User> {
    const { data } = await api.put<User>("/api/users/me", payload);
    return data;
  },

  async updatePassword(payload: UpdatePasswordPayload): Promise<void> {
    await api.put("/api/users/me/password", payload);
  }
};
