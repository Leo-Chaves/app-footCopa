import { LoginRequest, LoginResponse, SignupRequest, User } from "../types/auth";
import { api } from "./api";

export const authService = {
  async login(payload: LoginRequest): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>("/auth/login", payload);
    return data;
  },

  async signup(payload: SignupRequest): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>("/auth/signup", payload);
    return data;
  },

  async me(): Promise<User> {
    const { data } = await api.get<User>("/auth/me");
    return data;
  }
};
