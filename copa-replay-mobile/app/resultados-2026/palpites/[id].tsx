import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { AppButton } from "../../../src/components/AppButton";
import { DangerZone } from "../../../src/components/DangerZone";
import { LoadingState } from "../../../src/components/LoadingState";
import { ScoreInput } from "../../../src/components/ScoreInput";
import { ScreenContainer } from "../../../src/components/ScreenContainer";
import { worldCup2026PredictionService } from "../../../src/services/worldCup2026PredictionService";
import { colors } from "../../../src/styles/colors";
import { globalStyles } from "../../../src/styles/global";
import { WorldCup2026Prediction } from "../../../src/types/worldCup2026Prediction";
import { confirmAction } from "../../../src/utils/confirmAction";

export default function WorldCup2026PredictionDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [prediction, setPrediction] = useState<WorldCup2026Prediction | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [homeScore, setHomeScore] = useState("");
  const [awayScore, setAwayScore] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const response = await worldCup2026PredictionService.get(Number(id));
        setPrediction(response);
        setHomeScore(String(response.predictedHomeScore));
        setAwayScore(String(response.predictedAwayScore));
      } catch (error) {
        Alert.alert("Erro ao buscar palpite", error instanceof Error ? error.message : "Tente novamente.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  function requestUpdatePrediction() {
    const predictedHomeScore = Number(homeScore);
    const predictedAwayScore = Number(awayScore);
    if (homeScore === "" || awayScore === "" || predictedHomeScore < 0 || predictedAwayScore < 0) {
      Alert.alert("Revise seu palpite", "Informe placares válidos e sem valores negativos.");
      return;
    }

    confirmAction({
      title: "Salvar alterações",
      message: "Deseja atualizar este palpite da Copa 2026?",
      confirmText: "Salvar",
      onConfirm: () => updatePrediction(predictedHomeScore, predictedAwayScore)
    });
  }

  async function updatePrediction(predictedHomeScore: number, predictedAwayScore: number) {
    setSaving(true);
    try {
      const updated = await worldCup2026PredictionService.update(Number(id), {
        predictedHomeScore,
        predictedAwayScore
      });
      setPrediction(updated);
      Alert.alert("Palpite atualizado", "Seu palpite 2026 foi salvo.");
    } catch (error) {
      Alert.alert("Erro ao salvar", error instanceof Error ? error.message : "Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  function confirmDelete() {
    confirmAction({
      title: "Excluir palpite",
      message: "Tem certeza que deseja excluir este palpite da Copa 2026?",
      confirmText: "Excluir",
      destructive: true,
      onConfirm: async () => {
        try {
          await worldCup2026PredictionService.remove(Number(id));
          Alert.alert("Palpite excluído", "O palpite foi removido com sucesso.");
          router.replace("/resultados-2026" as never);
        } catch (error) {
          Alert.alert("Erro ao excluir", error instanceof Error ? error.message : "Tente novamente.");
        }
      }
    });
  }

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
        <Text style={globalStyles.title}>Palpite não encontrado</Text>
      </ScreenContainer>
    );
  }

  const match = prediction.worldCup2026Result;

  return (
    <ScreenContainer>
      <Text style={globalStyles.title}>Detalhe do palpite 2026</Text>
      <View style={globalStyles.card}>
        <Text style={styles.stage}>{match.stage}{match.groupName ? ` - ${match.groupName}` : ""}</Text>
        <Text style={styles.teams}>{match.homeTeam} x {match.awayTeam}</Text>
        <Text style={styles.line}>Status: {match.finished ? `Finalizado (${match.homeScore} x ${match.awayScore})` : "Aguardando resultado"}</Text>
        <Text style={styles.line}>Data: {match.matchDate ? new Date(match.matchDate).toLocaleDateString("pt-BR") : "Não informada"}</Text>
      </View>

      <View style={globalStyles.card}>
        <Text style={globalStyles.sectionTitle}>Editar palpite</Text>
        <ScoreInput
          homeLabel={match.homeTeam}
          awayLabel={match.awayTeam}
          homeScore={homeScore}
          awayScore={awayScore}
          onHomeScoreChange={setHomeScore}
          onAwayScoreChange={setAwayScore}
        />
        <AppButton title="Salvar alterações" loading={saving} onPress={requestUpdatePrediction} />
      </View>

      <DangerZone description="Excluir este palpite remove o registro da sua Copa 2026." buttonTitle="Excluir palpite" onPress={confirmDelete} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  stage: {
    color: colors.primaryDark,
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 8,
    textTransform: "uppercase"
  },
  teams: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "900",
    lineHeight: 29,
    marginBottom: 10
  },
  line: {
    color: colors.grayText,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 21
  }
});
