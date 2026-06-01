import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { AppButton } from "../../src/components/AppButton";
import { EmptyState } from "../../src/components/EmptyState";
import { LoadingState } from "../../src/components/LoadingState";
import { ScreenContainer } from "../../src/components/ScreenContainer";
import { worldCup2026ResultService } from "../../src/services/worldCup2026ResultService";
import { useAuthStore } from "../../src/store/authStore";
import { colors } from "../../src/styles/colors";
import { globalStyles } from "../../src/styles/global";
import { WorldCup2026Result } from "../../src/types/worldCup2026Result";

export default function ManageWorldCup2026ResultsScreen() {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === "ADMIN";
  const [matches, setMatches] = useState<WorldCup2026Result[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (!isAdmin) {
        router.replace("/resultados-2026" as never);
        return;
      }

      let active = true;
      async function load() {
        setLoading(true);
        try {
          const response = await worldCup2026ResultService.list();
          if (active) setMatches(response);
        } catch (error) {
          Alert.alert("Erro ao buscar jogos", error instanceof Error ? error.message : "Tente novamente.");
        } finally {
          if (active) setLoading(false);
        }
      }
      load();
      return () => {
        active = false;
      };
    }, [isAdmin])
  );

  if (!isAdmin) {
    return (
      <ScreenContainer>
        <LoadingState message="Voltando para Copa 2026..." />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Text style={globalStyles.title}>Partidas 2026</Text>
      <Text style={globalStyles.subtitle}>Acompanhe partidas e atualize placares da Copa 2026.</Text>

      {loading ? (
        <LoadingState />
      ) : matches.length === 0 ? (
        <EmptyState title="Nenhum jogo encontrado" message="Os jogos da Copa 2026 aparecem aqui assim que estiverem disponíveis." />
      ) : (
        <View style={styles.list}>
          {matches.map((match) => (
            <View key={match.id} style={globalStyles.card}>
              <Text style={styles.stage}>{match.stage}{match.groupName ? ` - ${match.groupName}` : ""}</Text>
              <Text style={styles.teams}>{match.homeTeam} x {match.awayTeam}</Text>
              <Text style={globalStyles.muted}>
                {match.finished ? `${match.homeScore} x ${match.awayScore}` : "Aguardando resultado"}
              </Text>
              <AppButton title="Detalhes" variant="outline" onPress={() => router.push(`/resultados-2026/${match.id}` as never)} />
            </View>
          ))}
        </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 12
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
    fontSize: 18,
    fontWeight: "900",
    lineHeight: 24,
    marginBottom: 8
  }
});
