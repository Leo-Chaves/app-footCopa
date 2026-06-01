import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../styles/colors";
import { globalStyles } from "../styles/global";
import { Prediction } from "../types/prediction";
import { calculatePredictionResult } from "../utils/game";
import { AppButton } from "./AppButton";
import { matchTitle, scoreLabel } from "./MatchCard";
import { ResultBadge } from "./ResultBadge";

export function HistoryCard({ prediction }: { prediction: Prediction }) {
  const result = calculatePredictionResult(prediction.match, prediction);

  return (
    <View style={globalStyles.card}>
      <View style={styles.topRow}>
        <Text style={styles.cup}>{prediction.match.worldCup?.name ?? prediction.match.worldCup?.year ?? "Copa do Mundo"}</Text>
        <ResultBadge resultType={result.resultType} />
      </View>
      <Text style={styles.match}>{matchTitle(prediction.match)}</Text>
      <Text style={styles.line}>Seu palpite: {prediction.predictedHomeScore} x {prediction.predictedAwayScore}</Text>
      <Text style={styles.line}>Resultado real: {scoreLabel(prediction.match)}</Text>
      <Text style={styles.points}>+{result.points} pontos</Text>
      <AppButton title="Detalhes" variant="outline" onPress={() => router.push(`/palpites/${prediction.id}` as never)} />
    </View>
  );
}

const styles = StyleSheet.create({
  topRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10
  },
  cup: {
    color: colors.primaryDark,
    fontSize: 15,
    fontWeight: "900"
  },
  match: {
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
    marginBottom: 4
  },
  points: {
    color: colors.primaryDark,
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 14,
    marginTop: 8
  }
});
