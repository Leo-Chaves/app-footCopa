import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { colors } from "../styles/colors";

export function LoadingState({ message = "Carregando..." }: { message?: string }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator color={colors.primary} size="large" />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
    padding: 28
  },
  text: {
    color: colors.grayText,
    fontSize: 15
  }
});
