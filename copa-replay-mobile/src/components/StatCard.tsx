import { StyleSheet, Text, View } from "react-native";
import { colors } from "../styles/colors";

type StatCardProps = {
  label: string;
  value: string | number;
};

export function StatCard({ label, value }: StatCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.grayLight,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    flex: 1,
    minWidth: 120,
    padding: 14
  },
  value: {
    color: colors.primaryDark,
    fontSize: 24,
    fontWeight: "900"
  },
  label: {
    color: colors.grayText,
    fontSize: 13,
    fontWeight: "800",
    lineHeight: 18,
    marginTop: 4
  }
});
