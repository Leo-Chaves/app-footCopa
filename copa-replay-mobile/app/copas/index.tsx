import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { EmptyState } from "../../src/components/EmptyState";
import { LoadingState } from "../../src/components/LoadingState";
import { ScreenContainer } from "../../src/components/ScreenContainer";
import { WorldCupCard } from "../../src/components/WorldCupCard";
import { worldCupService } from "../../src/services/worldCupService";
import { globalStyles } from "../../src/styles/global";
import { WorldCup } from "../../src/types/worldCup";

export default function WorldCupsScreen() {
  const [worldCups, setWorldCups] = useState<WorldCup[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      async function load() {
        setLoading(true);
        try {
          const response = await worldCupService.list();
          if (active) setWorldCups(response);
        } catch (error) {
          Alert.alert("Erro ao buscar Copas", error instanceof Error ? error.message : "Tente novamente.");
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
      <Text style={globalStyles.title}>Explorar Copas</Text>
      <Text style={globalStyles.subtitle}>Escolha uma edição para explorar jogos históricos.</Text>

      {loading ? (
        <LoadingState />
      ) : worldCups.length === 0 ? (
        <EmptyState title="Nenhuma Copa encontrada" message="Ainda não há edições disponíveis para explorar." />
      ) : (
        <View style={styles.list}>
          {worldCups.map((worldCup) => (
            <WorldCupCard key={worldCup.id} worldCup={worldCup} />
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
