import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../styles/colors";
import { globalStyles } from "../styles/global";
import { WorldCup2026Prediction } from "../types/worldCup2026Prediction";
import { AppButton } from "./AppButton";

export function WorldCup2026PredictionCard({ prediction }: { prediction: WorldCup2026Prediction }) {
  const match = prediction.worldCup2026Result;

  return (
    <View style={globalStyles.card}>
      <Text style={styles.stage}>{match.stage}{match.groupName ? ` - ${match.groupName}` : ""}</Text>
      <Text style={styles.teams}>{match.homeTeam} x {match.awayTeam}</Text>
      <Text style={styles.guess}>Seu palpite: {prediction.predictedHomeScore} x {prediction.predictedAwayScore}</Text>
      <Text style={styles.line}>Status: {match.finished ? `Finalizado (${match.homeScore} x ${match.awayScore})` : "Aguardando resultado"}</Text>
      <Text style={styles.line}>Data: {match.matchDate ? new Date(match.matchDate).toLocaleDateString("pt-BR") : "Não informada"}</Text>
      <AppButton title="Detalhes" variant="outline" onPress={() => router.push(`/resultados-2026/palpites/${prediction.id}` as never)} />
    </View>
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
    fontSize: 18,
    fontWeight: "900",
    lineHeight: 24,
    marginBottom: 10
  },
  line: {
    color: colors.grayText,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 21
  },
  guess: {
    color: colors.primaryDark,
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 6
  }
});
