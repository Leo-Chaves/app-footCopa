import { router } from "expo-router";
import { useState } from "react";
import { Alert, Text, View } from "react-native";
import { AppButton } from "../../src/components/AppButton";
import { AppInput } from "../../src/components/AppInput";
import { ScreenContainer } from "../../src/components/ScreenContainer";
import { userService } from "../../src/services/userService";
import { useAuthStore } from "../../src/store/authStore";
import { globalStyles } from "../../src/styles/global";

export default function ChangePasswordScreen() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  async function savePassword() {
    if (!isAuthenticated) {
      Alert.alert("Login necessário", "Entre para alterar sua senha.");
      router.replace("/login");
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert("Senha inválida", "A nova senha precisa ter pelo menos 6 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Confirme a senha", "A confirmação precisa ser igual à nova senha.");
      return;
    }

    setSaving(true);
    try {
      await userService.updatePassword({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      Alert.alert("Senha atualizada", "Sua senha foi alterada com sucesso.");
      router.replace("/perfil");
    } catch (error) {
      Alert.alert("Erro ao alterar senha", error instanceof Error ? error.message : "Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScreenContainer>
      <Text style={globalStyles.title}>Alterar senha</Text>
      <Text style={globalStyles.subtitle}>Informe sua senha atual e escolha uma nova senha para sua conta.</Text>

      <View style={globalStyles.card}>
        <AppInput label="Senha atual" value={currentPassword} onChangeText={setCurrentPassword} secureTextEntry />
        <AppInput label="Nova senha" value={newPassword} onChangeText={setNewPassword} secureTextEntry />
        <AppInput label="Confirmar nova senha" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
        <AppButton title="Salvar nova senha" loading={saving} onPress={savePassword} />
      </View>
    </ScreenContainer>
  );
}
