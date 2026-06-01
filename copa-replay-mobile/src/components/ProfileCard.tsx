import { StyleSheet, Text, View } from "react-native";
import { colors } from "../styles/colors";
import { globalStyles } from "../styles/global";
import { User } from "../types/auth";
import { ScoreBadge } from "./ScoreBadge";

export function ProfileCard({ user, points }: { user: User; points: number }) {
  return (
    <View style={[globalStyles.card, styles.container]}>
      <View style={styles.textBlock}>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>
      <ScoreBadge points={points} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12
  },
  textBlock: {
    flex: 1
  },
  name: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900"
  },
  email: {
    color: colors.grayText,
    fontSize: 14,
    marginTop: 4
  }
});
