import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useAuthStore } from "../store/authStore";
import { colors } from "../styles/colors";
import { AppButton } from "./AppButton";

export function Header() {
  const { user, isAuthenticated } = useAuthStore();
  const firstName = user?.name.split(" ")[0] ?? "torcedor";

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.brand}>Copa Replay</Text>
        <Text style={styles.caption}>{isAuthenticated ? `Olá, ${firstName}` : "Histórias da Copa"}</Text>
      </View>
      {isAuthenticated ? (
        <AppButton title="Perfil" variant="outline" fullWidth={false} onPress={() => router.push("/perfil")} style={styles.button} />
      ) : (
        <AppButton title="Entrar" variant="outline" fullWidth={false} onPress={() => router.push("/login")} style={styles.button} />
      )}
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
  brand: {
    color: colors.primaryDark,
    fontSize: 18,
    fontWeight: "900"
  },
  caption: {
    color: colors.grayText,
    fontSize: 13,
    marginTop: 2
  },
  button: {
    minHeight: 40,
    paddingHorizontal: 12,
    paddingVertical: 8
  }
});
