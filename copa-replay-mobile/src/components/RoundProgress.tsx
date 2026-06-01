import { DimensionValue, StyleSheet, Text, View } from "react-native";
import { colors } from "../styles/colors";

type RoundProgressProps = {
  current: number;
  total: number;
};

export function RoundProgress({ current, total }: RoundProgressProps) {
  const width = `${Math.min(100, Math.max(0, (current / total) * 100))}%` as DimensionValue;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>Rodada</Text>
        <Text style={styles.value}>{current} de {total}</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  label: {
    color: colors.grayText,
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  value: {
    color: colors.primaryDark,
    fontSize: 13,
    fontWeight: "900"
  },
  track: {
    backgroundColor: colors.border,
    borderRadius: 999,
    height: 8,
    overflow: "hidden"
  },
  fill: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    height: 8
  }
});
