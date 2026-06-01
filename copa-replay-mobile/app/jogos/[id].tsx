import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { AppButton } from "../../src/components/AppButton";
import { LoadingState } from "../../src/components/LoadingState";
import { scoreLabel } from "../../src/components/MatchCard";
import { ScreenContainer } from "../../src/components/ScreenContainer";
import { matchService } from "../../src/services/matchService";
import { useAuthStore } from "../../src/store/authStore";
import { colors } from "../../src/styles/colors";
import { globalStyles } from "../../src/styles/global";
import { Match } from "../../src/types/match";

export default function MatchDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const response = await matchService.get(Number(id));
        setMatch(response);
      } catch (error) {
        Alert.alert("Erro ao buscar jogo", error instanceof Error ? error.message : "Tente novamente.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  function openChallenge() {
    if (!isAuthenticated) {
      Alert.alert("Login necessário", "Entre para jogar o desafio.");
      router.push("/login");
      return;
    }
    router.push({ pathname: "/desafio/jogar", params: { mode: "single", matchId: id } } as never);
  }

  if (loading) {
    return (
      <ScreenContainer>
        <LoadingState />
      </ScreenContainer>
    );
  }

  if (!match) {
    return (
      <ScreenContainer>
        <Text style={globalStyles.title}>Jogo não encontrado</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.scoreboard}>
        <Text style={styles.stage}>{match.stage}</Text>
        <Text style={styles.teams}>{match.homeTeam?.name} x {match.awayTeam?.name}</Text>
        <Text style={styles.score}>{scoreLabel(match)}</Text>
        <Text style={styles.cup}>{match.worldCup?.name}</Text>
      </View>

      <View style={globalStyles.card}>
        <Info label="Grupo" value={match.groupName || "Não informado"} />
        <Info label="Estádio" value={match.stadium || "Não informado"} />
        <Info label="Cidade" value={match.city || "Não informada"} />
        <Info label="Data" value={match.matchDate ? new Date(match.matchDate).toLocaleDateString("pt-BR") : "Não informada"} />
      </View>

      <AppButton title="Jogar com esta partida" onPress={openChallenge} />
    </ScreenContainer>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scoreboard: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    padding: 20
  },
  stage: {
    color: colors.primaryDark,
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 8,
    textTransform: "uppercase"
  },
  teams: {
    color: colors.text,
    fontSize: 23,
    fontWeight: "900",
    lineHeight: 30
  },
  score: {
    color: colors.primaryDark,
    fontSize: 38,
    fontWeight: "900",
    marginVertical: 10
  },
  cup: {
    color: colors.grayText,
    fontSize: 15,
    fontWeight: "700"
  },
  infoRow: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    paddingVertical: 10
  },
  infoLabel: {
    color: colors.grayText,
    fontSize: 13,
    fontWeight: "700"
  },
  infoValue: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800",
    marginTop: 4
  }
});
