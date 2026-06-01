import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Switch, Text, View } from "react-native";
import { AppButton } from "../../src/components/AppButton";
import { AppInput } from "../../src/components/AppInput";
import { LoadingState } from "../../src/components/LoadingState";
import { ScreenContainer } from "../../src/components/ScreenContainer";
import { worldCup2026ResultService } from "../../src/services/worldCup2026ResultService";
import { useAuthStore } from "../../src/store/authStore";
import { colors } from "../../src/styles/colors";
import { globalStyles } from "../../src/styles/global";

export default function NewWorldCup2026ResultScreen() {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === "ADMIN";
  const [saving, setSaving] = useState(false);
  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");
  const [stage, setStage] = useState("Fase de grupos");
  const [groupName, setGroupName] = useState("");
  const [stadium, setStadium] = useState("");
  const [city, setCity] = useState("");
  const [matchDate, setMatchDate] = useState("");
  const [homeScore, setHomeScore] = useState("");
  const [awayScore, setAwayScore] = useState("");
  const [finished, setFinished] = useState(false);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!isAdmin) {
      router.replace("/resultados-2026" as never);
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <ScreenContainer>
        <LoadingState message="Voltando para Copa 2026..." />
      </ScreenContainer>
    );
  }

  async function createResult() {
    const home = Number(homeScore);
    const away = Number(awayScore);
    if (!homeTeam.trim() || !awayTeam.trim() || !stage.trim() || homeScore === "" || awayScore === "" || home < 0 || away < 0) {
      Alert.alert("Revise os dados", "Informe seleções, fase e placares válidos.");
      return;
    }

    setSaving(true);
    try {
      await worldCup2026ResultService.create({
        homeTeam,
        awayTeam,
        stage,
        groupName,
        stadium,
        city,
        matchDate: matchDate ? `${matchDate}T00:00:00` : null,
        finished,
        homeScore: home,
        awayScore: away,
        note
      });
      Alert.alert("Jogo salvo", "A partida da Copa 2026 foi salva.");
      router.replace("/resultados-2026" as never);
    } catch (error) {
      Alert.alert("Erro ao salvar", error instanceof Error ? error.message : "Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScreenContainer>
      <Text style={globalStyles.title}>Nova partida 2026</Text>
      <Text style={globalStyles.subtitle}>Adicione uma partida que ainda não aparece na lista.</Text>

      <View style={globalStyles.card}>
        <AppInput label="Mandante" value={homeTeam} onChangeText={setHomeTeam} placeholder="Brasil" />
        <AppInput label="Visitante" value={awayTeam} onChangeText={setAwayTeam} placeholder="Argentina" />
        <View style={styles.row}>
          <View style={styles.flex}>
            <AppInput label="Placar mandante" value={homeScore} onChangeText={setHomeScore} keyboardType="number-pad" placeholder="0" />
          </View>
          <View style={styles.flex}>
            <AppInput label="Placar visitante" value={awayScore} onChangeText={setAwayScore} keyboardType="number-pad" placeholder="0" />
          </View>
        </View>
        <AppInput label="Fase" value={stage} onChangeText={setStage} placeholder="Fase de grupos" />
        <AppInput label="Grupo" value={groupName} onChangeText={setGroupName} placeholder="Grupo A" />
        <AppInput label="Data" value={matchDate} onChangeText={setMatchDate} placeholder="2026-06-11" />
        <AppInput label="Estádio" value={stadium} onChangeText={setStadium} placeholder="Estádio" />
        <AppInput label="Cidade" value={city} onChangeText={setCity} placeholder="Cidade" />
        <View style={styles.switchRow}>
          <Text style={styles.switchText}>Jogo finalizado</Text>
          <Switch
            value={finished}
            onValueChange={setFinished}
            trackColor={{ false: colors.grayLight, true: colors.primaryLight }}
            thumbColor={finished ? colors.primary : colors.grayText}
          />
        </View>
        <AppInput label="Observação" value={note} onChangeText={setNote} multiline />
        <AppButton title="Salvar jogo" loading={saving} onPress={createResult} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 12
  },
  flex: {
    flex: 1
  },
  switchRow: {
    alignItems: "center",
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  switchText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "800"
  }
});
