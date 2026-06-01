import { router, useLocalSearchParams } from "expo-router";
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
import { WorldCup2026Result } from "../../src/types/worldCup2026Result";

export default function WorldCup2026ResultDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === "ADMIN";
  const [result, setResult] = useState<WorldCup2026Result | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");
  const [stage, setStage] = useState("");
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
      return;
    }

    async function load() {
      try {
        const response = await worldCup2026ResultService.get(Number(id));
        setResult(response);
        setHomeTeam(response.homeTeam);
        setAwayTeam(response.awayTeam);
        setStage(response.stage);
        setGroupName(response.groupName ?? "");
        setStadium(response.stadium ?? "");
        setCity(response.city ?? "");
        setMatchDate(response.matchDate ? response.matchDate.slice(0, 10) : "");
        setHomeScore(String(response.homeScore));
        setAwayScore(String(response.awayScore));
        setFinished(response.finished);
        setNote(response.note ?? "");
      } catch (error) {
        Alert.alert("Erro ao buscar resultado", error instanceof Error ? error.message : "Tente novamente.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, isAdmin]);

  async function updateResult() {
    if (!isAdmin) {
      router.replace("/resultados-2026" as never);
      return;
    }

    const home = Number(homeScore);
    const away = Number(awayScore);
    if (!homeTeam.trim() || !awayTeam.trim() || !stage.trim() || homeScore === "" || awayScore === "" || home < 0 || away < 0) {
      Alert.alert("Revise os dados", "Informe seleções, fase e placares válidos.");
      return;
    }

    setSaving(true);
    try {
      const updated = await worldCup2026ResultService.update(Number(id), {
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
      setResult(updated);
      Alert.alert("Resultado atualizado", "As alterações foram salvas.");
    } catch (error) {
      Alert.alert("Erro ao atualizar", error instanceof Error ? error.message : "Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  function confirmDelete() {
    if (!isAdmin) {
      router.replace("/resultados-2026" as never);
      return;
    }

    Alert.alert("Excluir resultado", "Tem certeza que deseja excluir este resultado da Copa 2026?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await worldCup2026ResultService.remove(Number(id));
            router.replace("/resultados-2026" as never);
          } catch (error) {
            Alert.alert("Erro ao excluir", error instanceof Error ? error.message : "Tente novamente.");
          }
        }
      }
    ]);
  }

  if (loading) {
    return (
      <ScreenContainer>
        <LoadingState />
      </ScreenContainer>
    );
  }

  if (!result) {
    return (
      <ScreenContainer>
        <Text style={globalStyles.title}>Resultado não encontrado</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.stage}>{result.stage}</Text>
        <Text style={styles.title}>{result.homeTeam} x {result.awayTeam}</Text>
        <Text style={styles.score}>{result.homeScore} x {result.awayScore}</Text>
      </View>

      <View style={globalStyles.card}>
        <Text style={globalStyles.sectionTitle}>Editar resultado 2026</Text>
        <AppInput label="Mandante" value={homeTeam} onChangeText={setHomeTeam} />
        <AppInput label="Visitante" value={awayTeam} onChangeText={setAwayTeam} />
        <View style={styles.row}>
          <View style={styles.flex}>
            <AppInput label="Placar mandante" value={homeScore} onChangeText={setHomeScore} keyboardType="number-pad" />
          </View>
          <View style={styles.flex}>
            <AppInput label="Placar visitante" value={awayScore} onChangeText={setAwayScore} keyboardType="number-pad" />
          </View>
        </View>
        <AppInput label="Fase" value={stage} onChangeText={setStage} />
        <AppInput label="Grupo" value={groupName} onChangeText={setGroupName} />
        <AppInput label="Data" value={matchDate} onChangeText={setMatchDate} placeholder="2026-06-11" />
        <AppInput label="Estádio" value={stadium} onChangeText={setStadium} />
        <AppInput label="Cidade" value={city} onChangeText={setCity} />
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
        <AppButton title="Salvar alterações" loading={saving} onPress={updateResult} />
      </View>

      <AppButton title="Excluir resultado" variant="danger" onPress={confirmDelete} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    padding: 18
  },
  stage: {
    color: colors.primaryDark,
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 8,
    textTransform: "uppercase"
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "900",
    lineHeight: 29
  },
  score: {
    color: colors.primaryDark,
    fontSize: 36,
    fontWeight: "900",
    marginTop: 10
  },
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
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  switchText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "800"
  }
});
