import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LoadingState } from "../src/components/LoadingState";
import { useAuthStore } from "../src/store/authStore";
import { colors } from "../src/styles/colors";

export default function RootLayout() {
  const { isLoading, loadStoredAuth } = useAuthStore();

  useEffect(() => {
    loadStoredAuth();
  }, [loadStoredAuth]);

  if (isLoading) {
    return (
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <LoadingState message="Carregando sua sessão..." />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.white },
          headerTintColor: colors.primaryDark,
          headerTitleStyle: { fontWeight: "800" },
          contentStyle: { backgroundColor: colors.grayLight }
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ title: "Login" }} />
        <Stack.Screen name="signup" options={{ title: "Cadastro" }} />
        <Stack.Screen name="desafio/index" options={{ title: "Desafio Histórico" }} />
        <Stack.Screen name="desafio/jogar" options={{ title: "Rodada" }} />
        <Stack.Screen name="historico" options={{ title: "Histórico" }} />
        <Stack.Screen name="perfil" options={{ title: "Perfil" }} />
        <Stack.Screen name="perfil/senha" options={{ title: "Alterar senha" }} />
        <Stack.Screen name="resultados-2026/index" options={{ title: "Palpites Copa 2026" }} />
        <Stack.Screen name="resultados-2026/novo" options={{ title: "Nova partida 2026" }} />
        <Stack.Screen name="resultados-2026/gerenciar" options={{ title: "Partidas 2026" }} />
        <Stack.Screen name="resultados-2026/[id]" options={{ title: "Resultado 2026" }} />
        <Stack.Screen name="resultados-2026/palpite/[id]" options={{ title: "Palpite 2026" }} />
        <Stack.Screen name="resultados-2026/palpites/[id]" options={{ title: "Detalhe do Palpite 2026" }} />
        <Stack.Screen name="copas/index" options={{ title: "Explorar Copas" }} />
        <Stack.Screen name="copas/[id]" options={{ title: "Jogos da Copa" }} />
        <Stack.Screen name="jogos/[id]" options={{ title: "Detalhes do Jogo" }} />
        <Stack.Screen name="times/index" options={{ title: "Seleções" }} />
        <Stack.Screen name="times/[id]" options={{ title: "Detalhes da Seleção" }} />
        <Stack.Screen name="palpites/index" options={{ title: "Meus Palpites" }} />
        <Stack.Screen name="palpites/novo" options={{ title: "Novo Palpite" }} />
        <Stack.Screen name="palpites/[id]" options={{ title: "Detalhes do Palpite" }} />
      </Stack>
    </SafeAreaProvider>
  );
}
