import { StyleSheet, Text, View } from "react-native";
import { colors } from "../styles/colors";
import { Match } from "../types/match";
import { matchTitle, scoreLabel } from "./MatchCard";

type GameMatchCardProps = {
  match: Match;
  revealed?: boolean;
};

export function GameMatchCard({ match, revealed = false }: GameMatchCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.eyebrow}>{match.worldCup?.name ?? "Copa do Mundo"}</Text>
      <Text style={styles.title}>{matchTitle(match)}</Text>
      <Text style={styles.meta}>{[match.stage, match.groupName].filter(Boolean).join(" - ")}</Text>
      <View style={styles.scoreBox}>
        <Text style={styles.score}>{revealed ? scoreLabel(match) : "? x ?"}</Text>
        <Text style={styles.scoreLabel}>{revealed ? "Resultado real" : "Placar escondido"}</Text>
      </View>
      <Text style={styles.details}>
        {[match.stadium, match.city, match.matchDate ? new Date(match.matchDate).toLocaleDateString("pt-BR") : null]
          .filter(Boolean)
          .join(" - ")}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderColor: colors.primary,
    borderRadius: 16,
    borderWidth: 1,
    padding: 18
  },
  eyebrow: {
    color: colors.primaryDark,
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 8,
    textTransform: "uppercase"
  },
  title: {
    color: colors.text,
    fontSize: 23,
    fontWeight: "900",
    lineHeight: 30
  },
  meta: {
    color: colors.grayText,
    fontSize: 15,
    fontWeight: "700",
    marginTop: 8
  },
  scoreBox: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 16,
    padding: 14
  },
  score: {
    color: colors.primaryDark,
    fontSize: 34,
    fontWeight: "900",
    textAlign: "center"
  },
  scoreLabel: {
    color: colors.grayText,
    fontSize: 13,
    fontWeight: "800",
    marginTop: 4,
    textAlign: "center"
  },
  details: {
    color: colors.grayText,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 12
  }
});
