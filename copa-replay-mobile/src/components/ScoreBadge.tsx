import { StyleSheet, Text, View } from "react-native";
import { colors } from "../styles/colors";

export function ScoreBadge({ points, label = "pontos" }: { points: number; label?: string }) {
  return (
    <View style={styles.container}>
      <Text style={styles.points}>{points}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: colors.white,
    borderColor: colors.warning,
    borderRadius: 16,
    borderWidth: 1,
    minWidth: 82,
    paddingHorizontal: 14,
    paddingVertical: 10
  },
  points: {
    color: colors.warning,
    fontSize: 26,
    fontWeight: "900"
  },
  label: {
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: "800"
  }
});
