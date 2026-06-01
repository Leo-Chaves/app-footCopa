import { Link, router } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { AppButton } from "../src/components/AppButton";
import { AppInput } from "../src/components/AppInput";
import { ScreenContainer } from "../src/components/ScreenContainer";
import { useAuthStore } from "../src/store/authStore";
import { colors } from "../src/styles/colors";
import { globalStyles } from "../src/styles/global";

export default function SignupScreen() {
  const signup = useAuthStore((state) => state.signup);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    if (!name || !email || password.length < 6) {
      Alert.alert("Revise os dados", "Informe nome, e-mail e senha com pelo menos 6 caracteres.");
      return;
    }
    setLoading(true);
    try {
      await signup({ name, email, password });
      router.replace("/");
    } catch (error) {
      Alert.alert("Erro ao criar conta", error instanceof Error ? error.message : "Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer>
      <Text style={globalStyles.title}>Criar conta</Text>
      <Text style={globalStyles.subtitle}>Crie sua conta para jogar o Desafio Histórico e salvar seus resultados.</Text>
      <View style={globalStyles.card}>
        <AppInput label="Nome" value={name} onChangeText={setName} placeholder="Leo" />
        <AppInput label="E-mail" value={email} onChangeText={setEmail} placeholder="leo@email.com" keyboardType="email-address" autoCapitalize="none" />
        <AppInput label="Senha" value={password} onChangeText={setPassword} placeholder="Mínimo de 6 caracteres" secureTextEntry helperText="Use pelo menos 6 caracteres." />
        <AppButton title="Criar conta" loading={loading} onPress={handleSignup} />
      </View>
      <Link href="/login" style={styles.link}>
        Já tenho conta
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
