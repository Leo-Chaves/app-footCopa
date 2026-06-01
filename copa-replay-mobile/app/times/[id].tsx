import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";
import { LoadingState } from "../../src/components/LoadingState";
import { ScreenContainer } from "../../src/components/ScreenContainer";
import { teamService } from "../../src/services/teamService";
import { colors } from "../../src/styles/colors";
import { globalStyles } from "../../src/styles/global";
import { Team } from "../../src/types/team";

export default function TeamDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const response = await teamService.get(Number(id));
        setTeam(response);
      } catch (error) {
        Alert.alert("Erro ao buscar seleção", error instanceof Error ? error.message : "Tente novamente.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <ScreenContainer>
        <LoadingState />
      </ScreenContainer>
    );
  }

  if (!team) {
    return (
      <ScreenContainer>
        <Text style={globalStyles.title}>Seleção não encontrada</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.hero}>
        {team.flagUrl ? <Image source={{ uri: team.flagUrl }} style={styles.flag} /> : null}
        <Text style={styles.code}>{team.code}</Text>
        <Text style={styles.name}>{team.name}</Text>
      </View>

      <View style={globalStyles.card}>
        <Text style={styles.label}>Codigo FIFA</Text>
        <Text style={styles.value}>{team.code}</Text>
        <Text style={styles.label}>Nome</Text>
        <Text style={styles.value}>{team.name}</Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: "center",
    backgroundColor: colors.primaryLight,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    padding: 24
  },
  flag: {
    borderRadius: 8,
    height: 96,
    marginBottom: 14,
    resizeMode: "cover",
    width: 140
  },
  code: {
    color: colors.primaryDark,
    fontSize: 16,
    fontWeight: "900"
  },
  name: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "900",
    marginTop: 6
  },
  label: {
    color: colors.grayText,
    fontSize: 13,
    fontWeight: "800",
    marginTop: 8
  },
  value: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
    marginTop: 4
  }
});
