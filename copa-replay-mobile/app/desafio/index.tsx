import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { EmptyState } from "../../src/components/EmptyState";
import { LoadingState } from "../../src/components/LoadingState";
import { ModeCard } from "../../src/components/ModeCard";
import { ScreenContainer } from "../../src/components/ScreenContainer";
import { worldCupService } from "../../src/services/worldCupService";
import { useAuthStore } from "../../src/store/authStore";
import { globalStyles } from "../../src/styles/global";
import { WorldCup } from "../../src/types/worldCup";

export default function ChallengeModeScreen() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [worldCups, setWorldCups] = useState<WorldCup[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (!isAuthenticated) {
        Alert.alert("Login necessário", "Entre para jogar o Desafio Histórico.");
        router.replace("/login");
        return;
      }

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
    }, [isAuthenticated])
  );

  return (
    <ScreenContainer>
      <Text style={globalStyles.title}>Escolha seu desafio</Text>
      <Text style={globalStyles.subtitle}>Jogue uma rodada rápida ou desafie seus conhecimentos em uma Copa específica.</Text>

      <ModeCard
        title="Rodada rápida"
        description="5 partidas aleatórias. Até 15 pontos."
        meta="Modo clássico"
        buttonTitle="Começar"
        onPress={() => router.push({ pathname: "/desafio/jogar", params: { mode: "quick" } } as never)}
      />

      <Text style={globalStyles.sectionTitle}>Escolher Copa</Text>
      {loading ? (
        <LoadingState />
      ) : worldCups.length === 0 ? (
        <EmptyState title="Nenhuma Copa encontrada" message="As Copas históricas aparecem aqui quando estiverem disponíveis." />
      ) : (
        <View style={styles.list}>
          {worldCups.map((cup) => (
            <ModeCard
              key={cup.id}
              title={cup.name}
              description={`Jogue apenas partidas de ${cup.hostCountry}.`}
              meta={String(cup.year)}
              buttonTitle="Jogar esta Copa"
              onPress={() => router.push({ pathname: "/desafio/jogar", params: { mode: "cup", worldCupId: String(cup.id) } } as never)}
            />
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
