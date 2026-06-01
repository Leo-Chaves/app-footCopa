import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { AppButton } from "../../src/components/AppButton";
import { EmptyState } from "../../src/components/EmptyState";
import { LoadingState } from "../../src/components/LoadingState";
import { ScreenContainer } from "../../src/components/ScreenContainer";
import { teamService } from "../../src/services/teamService";
import { colors } from "../../src/styles/colors";
import { globalStyles } from "../../src/styles/global";
import { Team } from "../../src/types/team";

export default function TeamsScreen() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      async function load() {
        setLoading(true);
        try {
          const response = await teamService.list();
          if (active) setTeams(response);
        } catch (error) {
          Alert.alert("Erro ao buscar seleções", error instanceof Error ? error.message : "Tente novamente.");
        } finally {
          if (active) setLoading(false);
        }
      }
      load();
      return () => {
        active = false;
      };
    }, [])
  );

  return (
    <ScreenContainer>
      <Text style={globalStyles.title}>Seleções</Text>
      <Text style={globalStyles.subtitle}>Seleções presentes nas partidas históricas das Copas.</Text>

      {loading ? (
        <LoadingState />
      ) : teams.length === 0 ? (
        <EmptyState title="Nenhuma seleção encontrada" message="As seleções aparecem aqui quando houver partidas disponíveis." />
      ) : (
        <View style={styles.list}>
          {teams.map((team) => (
            <View key={team.id} style={globalStyles.card}>
              <Text style={styles.code}>{team.code}</Text>
              <Text style={styles.name}>{team.name}</Text>
              <AppButton title="Detalhes" variant="outline" onPress={() => router.push(`/times/${team.id}` as never)} />
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
  code: {
    color: colors.primaryDark,
    fontSize: 14,
    fontWeight: "900"
  },
  name: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 14,
    marginTop: 4
  }
});
