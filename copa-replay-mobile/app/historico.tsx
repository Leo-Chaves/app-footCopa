import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { AppButton } from "../src/components/AppButton";
import { EmptyState } from "../src/components/EmptyState";
import { HistoryCard } from "../src/components/HistoryCard";
import { LoadingState } from "../src/components/LoadingState";
import { ScoreBadge } from "../src/components/ScoreBadge";
import { ScreenContainer } from "../src/components/ScreenContainer";
import { StatCard } from "../src/components/StatCard";
import { gameService } from "../src/services/gameService";
import { useAuthStore } from "../src/store/authStore";
import { globalStyles } from "../src/styles/global";
import { Prediction } from "../src/types/prediction";
import { calculatePredictionResult, calculateUserStats, formatResultType } from "../src/utils/game";

export default function HistoryScreen() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (!isAuthenticated) {
        Alert.alert("Login necessário", "Entre para ver seu histórico.");
        router.replace("/login");
        return;
      }

      let active = true;
      async function load() {
        setLoading(true);
        try {
          const response = await gameService.getHistory();
          if (active) setPredictions(response);
        } catch (error) {
          Alert.alert("Erro ao buscar histórico", error instanceof Error ? error.message : "Tente novamente.");
        } finally {
          if (active) setLoading(false);
        }
      }
      load();
      return () => {
        active = false;
      };
    }, [isAuthenticated])
  );

  const stats = calculateUserStats(predictions);
  const bestResult = predictions
    .map((prediction) => calculatePredictionResult(prediction.match, prediction))
    .sort((a, b) => b.points - a.points)[0];

  return (
    <ScreenContainer>
      <Text style={globalStyles.title}>Meu Desempenho</Text>
      <Text style={globalStyles.subtitle}>Pontuação, tentativas e histórico do Desafio Histórico.</Text>

      <View style={styles.summary}>
        <ScoreBadge points={stats.totalPoints} />
        <View style={styles.summaryText}>
          <Text style={globalStyles.sectionTitle}>
            {stats.totalAttempts === 1 ? "1 tentativa" : `${stats.totalAttempts} tentativas`}
          </Text>
          <Text style={globalStyles.muted}>
            Melhor resultado: {bestResult ? formatResultType(bestResult.resultType) : "nenhuma tentativa ainda"}.
          </Text>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <StatCard label="Placares exatos" value={stats.exactScores} />
        <StatCard label="Acertos de vencedor" value={stats.correctOutcomes} />
        <StatCard label="Erros" value={stats.wrongResults} />
        <StatCard label="Taxa de acerto" value={`${stats.accuracyRate}%`} />
      </View>

      <AppButton title="Jogar nova rodada" onPress={() => router.push("/desafio" as never)} />

      {loading ? (
        <LoadingState />
      ) : predictions.length === 0 ? (
        <EmptyState title="Nenhuma tentativa ainda" message="Jogue uma rodada para criar seu primeiro palpite." actionTitle="Jogar agora" onAction={() => router.push("/desafio" as never)} />
      ) : (
        <View style={styles.list}>
          {predictions.map((prediction) => (
            <HistoryCard key={prediction.id} prediction={prediction} />
          ))}
        </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  summary: {
    alignItems: "center",
    flexDirection: "row",
    gap: 14
  },
  summaryText: {
    flex: 1
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  list: {
    gap: 12
  }
});
