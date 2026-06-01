import { StyleSheet, Text, View } from "react-native";
import { colors } from "../styles/colors";
import { ResultType, formatResultType } from "../utils/game";

export function ResultBadge({ resultType }: { resultType: ResultType }) {
  const style = resultType === "WRONG" ? styles.wrong : resultType === "EXACT_SCORE" ? styles.exact : styles.outcome;
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.text}>{formatResultType(resultType)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7
  },
  exact: {
    backgroundColor: colors.primary
  },
  outcome: {
    backgroundColor: colors.primaryDark
  },
  wrong: {
    backgroundColor: colors.danger
  },
  text: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "900"
  }
});
