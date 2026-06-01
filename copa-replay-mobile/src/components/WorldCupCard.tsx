import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../styles/colors";
import { globalStyles } from "../styles/global";
import { WorldCup } from "../types/worldCup";
import { AppButton } from "./AppButton";

export function WorldCupCard({ worldCup }: { worldCup: WorldCup }) {
  return (
    <View style={globalStyles.card}>
      <View style={styles.row}>
        <Text style={styles.year}>{worldCup.year}</Text>
        <Text style={styles.host}>{worldCup.hostCountry}</Text>
      </View>
      <Text style={styles.name}>{worldCup.name}</Text>
      <AppButton title="Ver jogos" variant="outline" onPress={() => router.push(`/copas/${worldCup.id}`)} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10
  },
  year: {
    color: colors.primaryDark,
    fontSize: 24,
    fontWeight: "900"
  },
  host: {
    color: colors.grayText,
    fontSize: 14,
    fontWeight: "700"
  },
  name: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 14
  }
});
