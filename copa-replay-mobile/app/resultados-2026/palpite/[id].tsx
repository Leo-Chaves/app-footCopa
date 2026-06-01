import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { AppButton } from "../../../src/components/AppButton";
import { LoadingState } from "../../../src/components/LoadingState";
import { ScoreInput } from "../../../src/components/ScoreInput";
import { ScreenContainer } from "../../../src/components/ScreenContainer";
import { worldCup2026PredictionService } from "../../../src/services/worldCup2026PredictionService";
import { worldCup2026ResultService } from "../../../src/services/worldCup2026ResultService";
import { colors } from "../../../src/styles/colors";
import { globalStyles } from "../../../src/styles/global";
import { WorldCup2026Result } from "../../../src/types/worldCup2026Result";

export default function NewWorldCup2026PredictionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [match, setMatch] = useState<WorldCup2026Result | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [homeScore, setHomeScore] = useState("");
  const [awayScore, setAwayScore] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setMatch(await worldCup2026ResultService.get(Number(id)));
      } catch (error) {
        Alert.alert("Erro ao buscar jogo", error instanceof Error ? error.message : "Tente novamente.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function savePrediction() {
    if (!match) return;
    const predictedHomeScore = Number(homeScore);
    const predictedAwayScore = Number(awayScore);
    if (homeScore === "" || awayScore === "" || predictedHomeScore < 0 || predictedAwayScore < 0) {
      Alert.alert("Revise seu palpite", "Informe placares válidos e sem valores negativos.");
      return;
    }

    setSaving(true);
    try {
      await worldCup2026PredictionService.create({
        worldCup2026ResultId: match.id,
        predictedHomeScore,
        predictedAwayScore
      });
      Alert.alert("Palpite salvo", "Seu palpite para a Copa 2026 foi salvo.");
      router.replace("/resultados-2026" as never);
    } catch (error) {
      Alert.alert("Erro ao salvar palpite", error instanceof Error ? error.message : "Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <ScreenContainer>
        <LoadingState />
      </ScreenContainer>
    );
  }

  if (!match) {
    return (
      <ScreenContainer>
        <Text style={globalStyles.title}>Jogo não encontrado</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Text style={globalStyles.title}>Palpite Copa 2026</Text>
      <View style={globalStyles.card}>
        <Text style={styles.stage}>{match.stage}{match.groupName ? ` - ${match.groupName}` : ""}</Text>
        <Text style={styles.teams}>{match.homeTeam} x {match.awayTeam}</Text>
        <Text style={styles.line}>Data: {match.matchDate ? new Date(match.matchDate).toLocaleDateString("pt-BR") : "Não informada"}</Text>
        <Text style={styles.line}>Estádio: {match.stadium || "Não informado"}</Text>
        <Text style={styles.line}>Cidade: {match.city || "Não informada"}</Text>
        <Text style={styles.line}>Status: {match.finished ? `Finalizado (${match.homeScore} x ${match.awayScore})` : "Agendado"}</Text>
      </View>

      <View style={globalStyles.card}>
        <Text style={globalStyles.sectionTitle}>Seu palpite</Text>
        <ScoreInput
          homeLabel={match.homeTeam}
          awayLabel={match.awayTeam}
          homeScore={homeScore}
          awayScore={awayScore}
          onHomeScoreChange={setHomeScore}
          onAwayScoreChange={setAwayScore}
        />
        <AppButton title="Salvar palpite" loading={saving} onPress={savePrediction} />
        <AppButton title="Cancelar" variant="ghost" onPress={() => router.back()} />
      </View>
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
