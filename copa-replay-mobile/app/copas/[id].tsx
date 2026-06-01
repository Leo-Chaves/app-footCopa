import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { EmptyState } from "../../src/components/EmptyState";
import { LoadingState } from "../../src/components/LoadingState";
import { MatchCard } from "../../src/components/MatchCard";
import { ScreenContainer } from "../../src/components/ScreenContainer";
import { worldCupService } from "../../src/services/worldCupService";
import { globalStyles } from "../../src/styles/global";
import { Match } from "../../src/types/match";

export default function WorldCupMatchesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const response = await worldCupService.matches(Number(id));
        setMatches(response);
      } catch (error) {
        Alert.alert("Erro ao buscar jogos", error instanceof Error ? error.message : "Tente novamente.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const cup = matches[0]?.worldCup;

  return (
    <ScreenContainer>
      <Text style={globalStyles.title}>{cup ? cup.name : "Jogos da Copa"}</Text>
      <Text style={globalStyles.subtitle}>Partidas históricas desta edição.</Text>

      {loading ? (
        <LoadingState />
      ) : matches.length === 0 ? (
        <EmptyState title="Sem jogos encontrados" message="Esta edição ainda não tem partidas disponíveis." />
      ) : (
        <View style={styles.list}>
          {matches.map((match) => (
            <MatchCard key={match.id} match={match} buttonTitle="Abrir jogo" />
          ))}
        </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 12
  }
});
