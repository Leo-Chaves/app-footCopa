import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../styles/colors";
import { globalStyles } from "../styles/global";
import { WorldCup2026Result } from "../types/worldCup2026Result";
import { AppButton } from "./AppButton";

export function WorldCup2026ResultCard({ result }: { result: WorldCup2026Result }) {
  return (
    <View style={globalStyles.card}>
      <Text style={styles.stage}>{result.stage}{result.groupName ? ` - ${result.groupName}` : ""}</Text>
      <Text style={[styles.status, result.finished ? styles.finished : styles.scheduled]}>
        {result.finished ? "Finalizado" : "Agendado"}
      </Text>
      <Text style={styles.teams}>{result.homeTeam} x {result.awayTeam}</Text>
      <Text style={styles.score}>{result.homeScore} x {result.awayScore}</Text>
      <Text style={styles.meta}>
        {[result.stadium, result.city, result.matchDate ? new Date(result.matchDate).toLocaleDateString("pt-BR") : null]
          .filter(Boolean)
          .join(" - ") || "Copa 2026"}
      </Text>
      <AppButton title="Detalhes" variant="outline" onPress={() => router.push(`/resultados-2026/${result.id}` as never)} />
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 8,
    textTransform: "uppercase"
  },
  status: {
    alignSelf: "flex-start",
    borderRadius: 8,
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 8,
    overflow: "hidden",
    paddingHorizontal: 9,
    paddingVertical: 5
  },
  finished: {
    backgroundColor: colors.primary,
    color: colors.white
  },
  scheduled: {
    backgroundColor: colors.primaryLight,
    color: colors.primaryDark
  },
  teams: {
    color: colors.text,
    fontSize: 19,
    fontWeight: "900",
    lineHeight: 25
  },
  score: {
    color: colors.primaryDark,
    fontSize: 30,
    fontWeight: "900",
    marginVertical: 8
  },
  meta: {
    color: colors.grayText,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 14
  }
});
