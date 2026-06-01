import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../styles/colors";
import { globalStyles } from "../styles/global";
import { Match } from "../types/match";
import { AppButton } from "./AppButton";

export function scoreLabel(match: Match) {
  const home = match.homeScore ?? "-";
  const away = match.awayScore ?? "-";
  return `${home} x ${away}`;
}

export function matchTitle(match: Match) {
  return `${match.homeTeam?.name ?? "Mandante"} x ${match.awayTeam?.name ?? "Visitante"}`;
}

export function MatchCard({ match, buttonTitle = "Detalhes" }: { match: Match; buttonTitle?: string }) {
  return (
    <View style={globalStyles.card}>
      <Text style={styles.stage}>{match.stage || "Jogo histórico"}</Text>
      <Text style={styles.title}>{matchTitle(match)}</Text>
      <Text style={styles.score}>{scoreLabel(match)}</Text>
      <Text style={styles.meta}>
        {match.worldCup?.year ?? ""} {match.city ? `- ${match.city}` : ""}
      </Text>
      <AppButton title={buttonTitle} variant="outline" onPress={() => router.push(`/jogos/${match.id}`)} />
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 8,
    textTransform: "uppercase"
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
    lineHeight: 24
  },
  score: {
    color: colors.primaryDark,
    fontSize: 26,
    fontWeight: "900",
    marginVertical: 8
  },
  meta: {
    color: colors.grayText,
    fontSize: 14,
    marginBottom: 14
  }
});
