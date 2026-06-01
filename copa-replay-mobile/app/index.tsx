import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { AppButton } from "../src/components/AppButton";
import { Header } from "../src/components/Header";
import { ScreenContainer } from "../src/components/ScreenContainer";
import { gameService } from "../src/services/gameService";
import { worldCup2026PredictionService } from "../src/services/worldCup2026PredictionService";
import { useAuthStore } from "../src/store/authStore";
import { colors } from "../src/styles/colors";
import { WorldCup2026Prediction } from "../src/types/worldCup2026Prediction";
import { UserStats, calculateUserStats } from "../src/utils/game";

const emptyStats: UserStats = {
  totalPoints: 0,
  totalAttempts: 0,
  exactScores: 0,
  correctOutcomes: 0,
  wrongResults: 0,
  accuracyRate: 0
};

export default function HomeScreen() {
  const { isAuthenticated } = useAuthStore();
  const [stats, setStats] = useState<UserStats>(emptyStats);
  const [predictions2026, setPredictions2026] = useState<WorldCup2026Prediction[]>([]);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      async function loadHomeData() {
        if (!isAuthenticated) {
          setStats(emptyStats);
          setPredictions2026([]);
          return;
        }

        try {
          const [history, predictions] = await Promise.all([
            gameService.getHistory(),
            worldCup2026PredictionService.list()
          ]);

          if (active) {
            setStats(calculateUserStats(history));
            setPredictions2026(predictions);
          }
        } catch {
          if (active) {
            setStats(emptyStats);
            setPredictions2026([]);
          }
        }
      }

      loadHomeData();
      return () => {
        active = false;
      };
    }, [isAuthenticated])
  );

  function requireAuth(path: "/desafio" | "/historico") {
    if (!isAuthenticated) {
      Alert.alert("Login necessário", "Entre para jogar o Desafio Histórico.");
      router.push("/login");
      return;
    }
    router.push(path as never);
  }

  return (
    <ScreenContainer>
      <Header />

      {isAuthenticated ? (
        <View style={styles.pointsCard}>
          <View>
            <Text style={styles.pointsLabel}>Sua pontuação</Text>
            <Text style={styles.pointsHelper}>
              {stats.totalAttempts === 1 ? "1 tentativa registrada" : `${stats.totalAttempts} tentativas registradas`}
            </Text>
          </View>
          <View style={styles.pointsPill}>
            <Text style={styles.pointsValue}>{stats.totalPoints}</Text>
            <Text style={styles.pointsText}>pontos</Text>
          </View>
        </View>
      ) : null}

      <View style={styles.hero}>
        <Text style={styles.title}>Quanto você lembra das Copas?</Text>
        <Text style={styles.subtitle}>Jogue uma rodada rápida com 5 partidas históricas.</Text>
        <AppButton title="Jogar agora" onPress={() => requireAuth("/desafio")} />
      </View>

      <View style={styles.quickGrid}>
        <ShortcutCard title="Copa 2026" description="Palpites e jogos" onPress={() => router.push("/resultados-2026" as never)} />
        <ShortcutCard title="Copas" description="Edições históricas" onPress={() => router.push("/copas")} />
        <ShortcutCard title="Seleções" description="Times nacionais" onPress={() => router.push("/times" as never)} />
        <ShortcutCard title="Histórico" description="Tentativas e pontos" onPress={() => requireAuth("/historico")} />
      </View>

      <View style={styles.predictionsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Meus palpites 2026</Text>
          <Pressable onPress={() => router.push("/resultados-2026" as never)}>
            <Text style={styles.sectionAction}>Ver todos</Text>
          </Pressable>
        </View>

        {!isAuthenticated ? (
          <View style={styles.emptyPanel}>
            <Text style={styles.emptyTitle}>Entre para salvar palpites</Text>
            <Text style={styles.emptyText}>Seus palpites da Copa 2026 aparecem aqui.</Text>
          </View>
        ) : predictions2026.length === 0 ? (
          <View style={styles.emptyPanel}>
            <Text style={styles.emptyTitle}>Nenhum palpite ainda</Text>
            <Text style={styles.emptyText}>Escolha um jogo da Copa 2026 e registre seu placar.</Text>
          </View>
        ) : (
          <View style={styles.predictionList}>
            {predictions2026.slice(0, 3).map((prediction) => (
              <PredictionPreview key={prediction.id} prediction={prediction} />
            ))}
          </View>
        )}
      </View>
    </ScreenContainer>
  );
}

function ShortcutCard({ title, description, onPress }: { title: string; description: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.shortcutCard, pressed ? styles.pressed : null]}>
      <Text style={styles.shortcutTitle}>{title}</Text>
      <Text style={styles.shortcutDescription}>{description}</Text>
    </Pressable>
  );
}

function PredictionPreview({ prediction }: { prediction: WorldCup2026Prediction }) {
  const match = prediction.worldCup2026Result;

  return (
    <Pressable
      onPress={() => router.push(`/resultados-2026/palpites/${prediction.id}` as never)}
      style={({ pressed }) => [styles.predictionCard, pressed ? styles.pressed : null]}
    >
      <Text style={styles.predictionStage}>{match.stage}{match.groupName ? ` - ${match.groupName}` : ""}</Text>
      <Text style={styles.predictionTeams}>{match.homeTeam} x {match.awayTeam}</Text>
      <Text style={styles.predictionScore}>Seu palpite: {prediction.predictedHomeScore} x {prediction.predictedAwayScore}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hero: {
    gap: 14,
    paddingVertical: 8
  },
  title: {
    color: colors.primaryDark,
    fontSize: 34,
    fontWeight: "900",
    lineHeight: 40
  },
  subtitle: {
    color: colors.text,
    fontSize: 17,
    lineHeight: 24
  },
  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  shortcutCard: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    flexBasis: "48%",
    flexGrow: 1,
    minHeight: 92,
    padding: 14
  },
  shortcutTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "900",
    lineHeight: 22
  },
  shortcutDescription: {
    color: colors.grayText,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
    marginTop: 6
  },
  predictionsSection: {
    gap: 10
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 21,
    fontWeight: "900"
  },
  sectionAction: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "900"
  },
  predictionList: {
    gap: 10
  },
  predictionCard: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    padding: 14
  },
  predictionStage: {
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 6,
    textTransform: "uppercase"
  },
  predictionTeams: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "900",
    lineHeight: 23
  },
  predictionScore: {
    color: colors.grayText,
    fontSize: 14,
    fontWeight: "800",
    marginTop: 8
  },
  emptyPanel: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    padding: 14
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "900"
  },
  emptyText: {
    color: colors.grayText,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20,
    marginTop: 6
  },
  pressed: {
    opacity: 0.84,
    transform: [{ scale: 0.99 }]
  },
  pointsCard: {
    alignItems: "center",
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16
  },
  pointsLabel: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "900"
  },
  pointsHelper: {
    color: colors.grayText,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 4
  },
  pointsPill: {
    alignItems: "center",
    borderColor: colors.warning,
    borderRadius: 14,
    borderWidth: 1,
    minWidth: 86,
    paddingHorizontal: 14,
    paddingVertical: 9
  },
  pointsValue: {
    color: colors.warning,
    fontSize: 28,
    fontWeight: "900",
    lineHeight: 32
  },
  pointsText: {
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: "900"
  }
});
