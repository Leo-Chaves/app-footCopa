import { Link, router } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { AppButton } from "../src/components/AppButton";
import { AppInput } from "../src/components/AppInput";
import { ScreenContainer } from "../src/components/ScreenContainer";
import { useAuthStore } from "../src/store/authStore";
import { colors } from "../src/styles/colors";
import { globalStyles } from "../src/styles/global";

export default function LoginScreen() {
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert("Campos obrigatórios", "Informe e-mail e senha.");
      return;
    }
    setLoading(true);
    try {
      await login({ email, password });
      router.replace("/");
    } catch (error) {
      Alert.alert("Erro ao entrar", error instanceof Error ? error.message : "Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer>
      <Text style={globalStyles.title}>Entrar</Text>
      <Text style={globalStyles.subtitle}>Entre para jogar rodadas, salvar palpites e acompanhar sua pontuação.</Text>
      <View style={globalStyles.card}>
        <AppInput label="E-mail" value={email} onChangeText={setEmail} placeholder="seuemail@exemplo.com" keyboardType="email-address" autoCapitalize="none" />
        <AppInput label="Senha" value={password} onChangeText={setPassword} placeholder="Sua senha" secureTextEntry />
        <AppButton title="Entrar" loading={loading} onPress={handleLogin} />
      </View>
      <Link href="/signup" style={styles.link}>
        Criar uma conta
      </Link>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  link: {
    color: colors.primaryDark,
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center"
  }
});
