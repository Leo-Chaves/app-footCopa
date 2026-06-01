import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { GameMatchCard } from "../../src/components/GameMatchCard";
import { LoadingState } from "../../src/components/LoadingState";
import { ResultBadge } from "../../src/components/ResultBadge";
import { ScreenContainer } from "../../src/components/ScreenContainer";
import { predictionService } from "../../src/services/predictionService";
import { useAuthStore } from "../../src/store/authStore";
import { colors } from "../../src/styles/colors";
import { globalStyles } from "../../src/styles/global";
import { Prediction } from "../../src/types/prediction";
import { calculatePredictionResult } from "../../src/utils/game";

export default function PredictionDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user, isAuthenticated } = useAuthStore();
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      Alert.alert("Login necessário", "Entre para ver suas tentativas.");
      router.replace("/login");
      return;
    }

    async function load() {
      try {
        const response = await predictionService.get(Number(id));
        setPrediction(response);
      } catch (error) {
        Alert.alert("Erro ao buscar tentativa", error instanceof Error ? error.message : "Tente novamente.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, isAuthenticated]);

  if (loading) {
    return (
      <ScreenContainer>
        <LoadingState />
      </ScreenContainer>
    );
  }

  if (!prediction) {
    return (
      <ScreenContainer>
        <Text style={globalStyles.title}>Tentativa não encontrada</Text>
      </ScreenContainer>
    );
  }

  const result = calculatePredictionResult(prediction.match, prediction);

  return (
    <ScreenContainer>
      <Text style={globalStyles.title}>Detalhe da Tentativa</Text>
      <GameMatchCard match={prediction.match} revealed />

      <View style={styles.resultCard}>
        <ResultBadge resultType={result.resultType} />
        <Text style={styles.resultMessage}>{result.message}</Text>
        <Text style={styles.line}>Seu palpite: {prediction.predictedHomeScore} x {prediction.predictedAwayScore}</Text>
        <Text style={styles.line}>Usuário: {user?.name ?? prediction.user?.name ?? "Usuário logado"}</Text>
        <Text style={styles.line}>
          Data da tentativa: {prediction.createdAt ? new Date(prediction.createdAt).toLocaleDateString("pt-BR") : "Não informada"}
        </Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  resultCard: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
    padding: 18
  },
  resultMessage: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900",
    lineHeight: 26
  },
  line: {
    color: colors.grayText,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 21
  }
});
