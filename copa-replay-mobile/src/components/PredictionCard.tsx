import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../styles/colors";
import { globalStyles } from "../styles/global";
import { Prediction } from "../types/prediction";
import { AppButton } from "./AppButton";
import { matchTitle } from "./MatchCard";

export function PredictionCard({ prediction }: { prediction: Prediction }) {
  return (
    <View style={globalStyles.card}>
      <Text style={styles.match}>{matchTitle(prediction.match)}</Text>
      <Text style={styles.score}>
        Palpite: {prediction.predictedHomeScore} x {prediction.predictedAwayScore}
      </Text>
      <AppButton title="Detalhes" variant="outline" onPress={() => router.push(`/palpites/${prediction.id}`)} />
    </View>
  );
}

const styles = StyleSheet.create({
  match: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "900",
    lineHeight: 23
  },
  score: {
    color: colors.primaryDark,
    fontSize: 18,
    fontWeight: "800",
    marginTop: 8
  }
});
