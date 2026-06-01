import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { authService } from "../services/authService";
import { LoginRequest, SignupRequest, User } from "../types/auth";

const TOKEN_KEY = "@copaReplay:token";
const USER_KEY = "@copaReplay:user";

type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginRequest) => Promise<void>;
  signup: (payload: SignupRequest) => Promise<void>;
  logout: () => Promise<void>;
  loadStoredAuth: () => Promise<void>;
  setUser: (user: User | null) => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  async login(payload) {
    const response = await authService.login(payload);
    await AsyncStorage.setItem(TOKEN_KEY, response.token);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(response.user));
    set({ token: response.token, user: response.user, isAuthenticated: true });
  },

  async signup(payload) {
    const response = await authService.signup(payload);
    await AsyncStorage.setItem(TOKEN_KEY, response.token);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(response.user));
    set({ token: response.token, user: response.user, isAuthenticated: true });
  },

  async logout() {
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
    set({ token: null, user: null, isAuthenticated: false });
  },

  async loadStoredAuth() {
    try {
      const [token, userJson] = await Promise.all([
        AsyncStorage.getItem(TOKEN_KEY),
        AsyncStorage.getItem(USER_KEY)
      ]);
      if (!token || !userJson) {
        set({ token: null, user: null, isAuthenticated: false, isLoading: false });
        return;
      }
      set({ token, user: JSON.parse(userJson) as User, isAuthenticated: true, isLoading: false });
    } catch {
      await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
      set({ token: null, user: null, isAuthenticated: false, isLoading: false });
    }
  },

  async setUser(user) {
    if (user) {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      await AsyncStorage.removeItem(USER_KEY);
    }
    set({ user, isAuthenticated: Boolean(user) });
  }
}));
