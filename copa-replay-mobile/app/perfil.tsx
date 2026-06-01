import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { AppButton } from "../src/components/AppButton";
import { AppInput } from "../src/components/AppInput";
import { ProfileCard } from "../src/components/ProfileCard";
import { ScreenContainer } from "../src/components/ScreenContainer";
import { StatCard } from "../src/components/StatCard";
import { gameService } from "../src/services/gameService";
import { userService } from "../src/services/userService";
import { useAuthStore } from "../src/store/authStore";
import { colors } from "../src/styles/colors";
import { globalStyles } from "../src/styles/global";
import { UserStats, calculateUserStats } from "../src/utils/game";

const emptyStats: UserStats = {
  totalPoints: 0,
  totalAttempts: 0,
  exactScores: 0,
  correctOutcomes: 0,
  wrongResults: 0,
  accuracyRate: 0
};

export default function ProfileScreen() {
  const { user, isAuthenticated, logout, setUser } = useAuthStore();
  const [stats, setStats] = useState<UserStats>(emptyStats);
  const [name, setName] = useState(user?.name ?? "");
  const [savingName, setSavingName] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setName(user?.name ?? "");
      let active = true;
      async function loadScore() {
        if (!isAuthenticated) return;
        try {
          const history = await gameService.getHistory();
          if (active) setStats(calculateUserStats(history));
        } catch {
          if (active) setStats(emptyStats);
        }
      }
      loadScore();
      return () => {
        active = false;
      };
    }, [isAuthenticated, user?.name])
  );

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  async function saveName() {
    if (!name.trim()) {
      Alert.alert("Nome obrigatório", "Informe um nome para seu perfil.");
      return;
    }
    setSavingName(true);
    try {
      const updated = await userService.updateProfile({ name: name.trim() });
      await setUser(updated);
      Alert.alert("Perfil atualizado", "Seu nome foi salvo.");
    } catch (error) {
      Alert.alert("Erro ao editar nome", error instanceof Error ? error.message : "Tente novamente.");
    } finally {
      setSavingName(false);
    }
  }

  if (!isAuthenticated || !user) {
    return (
      <ScreenContainer>
        <Text style={globalStyles.title}>Perfil</Text>
        <Text style={globalStyles.subtitle}>Entre para jogar, salvar tentativas e acompanhar sua pontuação.</Text>
        <AppButton title="Entrar" onPress={() => router.push("/login")} />
        <AppButton title="Criar conta" variant="outline" onPress={() => router.push("/signup")} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Text style={globalStyles.title}>Perfil</Text>
      <ProfileCard user={user} points={stats.totalPoints} />

      <View style={styles.statsGrid}>
        <StatCard label="Tentativas" value={stats.totalAttempts} />
        <StatCard label="Placares exatos" value={stats.exactScores} />
        <StatCard label="Taxa de acerto" value={`${stats.accuracyRate}%`} />
      </View>

      <View style={globalStyles.card}>
        <Text style={styles.cardTitle}>Editar nome</Text>
        <AppInput label="Nome" value={name} onChangeText={setName} />
        <AppButton title="Salvar nome" loading={savingName} onPress={saveName} />
      </View>

      <AppButton title="Alterar senha" variant="outline" onPress={() => router.push("/perfil/senha" as never)} />

      <AppButton title="Sair" variant="danger" onPress={handleLogout} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  cardTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 10
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  }
});
