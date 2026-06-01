import { StyleSheet, Text, View } from "react-native";
import { colors } from "../styles/colors";
import { globalStyles } from "../styles/global";
import { WorldCup2026Result } from "../types/worldCup2026Result";
import { AppButton } from "./AppButton";

type WorldCup2026MatchCardProps = {
  match: WorldCup2026Result;
  onAddPrediction: (match: WorldCup2026Result) => void;
};

export function WorldCup2026MatchCard({ match, onAddPrediction }: WorldCup2026MatchCardProps) {
  return (
    <View style={globalStyles.card}>
      <View style={styles.topRow}>
        <Text style={styles.stage}>{match.stage}{match.groupName ? ` - ${match.groupName}` : ""}</Text>
        <Text style={[styles.status, match.finished ? styles.finished : styles.scheduled]}>
          {match.finished ? "Finalizado" : "Agendado"}
        </Text>
      </View>
      <Text style={styles.teams}>{match.homeTeam} x {match.awayTeam}</Text>
      <Text style={styles.result}>{match.finished ? `${match.homeScore} x ${match.awayScore}` : "Aguardando resultado"}</Text>
      <Text style={styles.meta}>
        {[match.matchDate ? new Date(match.matchDate).toLocaleDateString("pt-BR") : null, match.stadium, match.city]
          .filter(Boolean)
          .join(" - ") || "Copa 2026"}
      </Text>
      <View style={styles.actions}>
        <AppButton title="Adicionar palpite" onPress={() => onAddPrediction(match)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
    marginBottom: 10
  },
  stage: {
    color: colors.primary,
    flex: 1,
    fontSize: 13,
    fontWeight: "900",
    lineHeight: 18,
    textTransform: "uppercase"
  },
  status: {
    borderRadius: 8,
    fontSize: 12,
    fontWeight: "900",
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
  result: {
    color: colors.primaryDark,
    fontSize: 18,
    fontWeight: "900",
    marginTop: 8
  },
  meta: {
    color: colors.grayText,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 14,
    marginTop: 8
  },
  actions: {
    gap: 8
  }
});
