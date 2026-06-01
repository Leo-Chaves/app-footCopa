import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { AppButton } from "../../src/components/AppButton";
import { EmptyState } from "../../src/components/EmptyState";
import { LoadingState } from "../../src/components/LoadingState";
import { ScreenContainer } from "../../src/components/ScreenContainer";
import { TeamSearchInput } from "../../src/components/TeamSearchInput";
import { WorldCup2026MatchCard } from "../../src/components/WorldCup2026MatchCard";
import { WorldCup2026PredictionCard } from "../../src/components/WorldCup2026PredictionCard";
import { worldCup2026PredictionService } from "../../src/services/worldCup2026PredictionService";
import { worldCup2026ResultService } from "../../src/services/worldCup2026ResultService";
import { useAuthStore } from "../../src/store/authStore";
import { colors } from "../../src/styles/colors";
import { globalStyles } from "../../src/styles/global";
import { WorldCup2026Prediction } from "../../src/types/worldCup2026Prediction";
import { WorldCup2026Result } from "../../src/types/worldCup2026Result";
import { normalizeSearchText, searchTerms } from "../../src/utils/search";

const ALL_FILTER = "Todos";
const PREDICTIONS_PER_PAGE = 3;
const GROUP_STAGE_CODES = new Set(["3RD", "FINAL", "QF", "R16", "R32", "SF"]);

function matchTime(match: WorldCup2026Result) {
  if (!match.matchDate) return Number.MAX_SAFE_INTEGER;
  const time = new Date(match.matchDate).getTime();
  return Number.isFinite(time) ? time : Number.MAX_SAFE_INTEGER;
}

function sortByDate(a: WorldCup2026Result, b: WorldCup2026Result) {
  return matchTime(a) - matchTime(b);
}

function groupCode(groupName?: string | null) {
  const match = groupName?.trim().match(/^group\s+(.+)$/i);
  return match?.[1]?.trim().toUpperCase() ?? null;
}

function isRealGroup(groupName?: string | null) {
  const code = groupCode(groupName);
  return Boolean(code && !GROUP_STAGE_CODES.has(code));
}

function groupLabel(groupName: string) {
  const code = groupCode(groupName);
  return code ? `Grupo ${code}` : groupName;
}

function stageRank(stage: string) {
  const normalized = normalizeSearchText(stage);
  if (normalized.includes("fase de grupos")) return 1;
  if (normalized === "r32") return 2;
  if (normalized === "r16") return 3;
  if (normalized === "qf") return 4;
  if (normalized === "sf") return 5;
  if (normalized.includes("terceiro")) return 6;
  if (normalized.includes("final")) return 7;
  return 99;
}

function stageLabel(stage: string) {
  const normalized = normalizeSearchText(stage);
  if (normalized.includes("fase de grupos")) return "Grupos";
  if (normalized === "r32") return "16 avos";
  if (normalized === "r16") return "Oitavas";
  if (normalized === "qf") return "Quartas";
  if (normalized === "sf") return "Semifinal";
  if (normalized.includes("terceiro")) return "3º lugar";
  if (normalized.includes("final")) return "Final";
  return stage;
}

function uniqueOptions(values: Array<string | null | undefined>) {
  return Array.from(new Set(values.filter((value): value is string => Boolean(value?.trim()))));
}

function gamesLabel(total: number) {
  return total === 1 ? "1 jogo exibido." : `${total} jogos exibidos.`;
}

export default function WorldCup2026ResultsScreen() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const scrollRef = useRef<ScrollView | null>(null);
  const [searchSectionY, setSearchSectionY] = useState(0);
  const [matches, setMatches] = useState<WorldCup2026Result[]>([]);
  const [predictions, setPredictions] = useState<WorldCup2026Prediction[]>([]);
  const [predictionPage, setPredictionPage] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(ALL_FILTER);
  const [selectedStage, setSelectedStage] = useState(ALL_FILTER);
  const [matchesLoading, setMatchesLoading] = useState(true);
  const [predictionsLoading, setPredictionsLoading] = useState(false);

  const hasActiveSearch = search.trim().length > 0 || selectedGroup !== ALL_FILTER || selectedStage !== ALL_FILTER;
  const totalPredictionPages = Math.max(1, Math.ceil(predictions.length / PREDICTIONS_PER_PAGE));
  const paginatedPredictions = predictions.slice(
    predictionPage * PREDICTIONS_PER_PAGE,
    predictionPage * PREDICTIONS_PER_PAGE + PREDICTIONS_PER_PAGE
  );

  useEffect(() => {
    if (predictionPage > totalPredictionPages - 1) {
      setPredictionPage(Math.max(0, totalPredictionPages - 1));
    }
  }, [predictionPage, totalPredictionPages]);

  const groupOptions = useMemo(() => {
    return uniqueOptions(matches.map((match) => match.groupName))
      .filter(isRealGroup)
      .sort((a, b) => groupLabel(a).localeCompare(groupLabel(b)));
  }, [matches]);

  const stageOptions = useMemo(() => {
    return uniqueOptions(matches.map((match) => match.stage)).sort((a, b) => {
      const rankDiff = stageRank(a) - stageRank(b);
      return rankDiff || stageLabel(a).localeCompare(stageLabel(b));
    });
  }, [matches]);

  const filteredMatches = useMemo(() => {
    if (!hasActiveSearch) return [];

    const terms = searchTerms(search);

    return matches
      .filter((match) => {
        const home = normalizeSearchText(match.homeTeam);
        const away = normalizeSearchText(match.awayTeam);
        const matchesSearch = terms.length === 0 || terms.some((term) => home.includes(term) || away.includes(term));
        const matchesGroup = selectedGroup === ALL_FILTER || match.groupName === selectedGroup;
        const matchesStage = selectedStage === ALL_FILTER || match.stage === selectedStage;

        return matchesSearch && matchesGroup && matchesStage;
      })
      .sort(sortByDate)
      .slice(0, 20);
  }, [hasActiveSearch, matches, search, selectedGroup, selectedStage]);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      async function loadMatches() {
        setMatchesLoading(true);
        try {
          await worldCup2026ResultService.importFixtures();
          const loadedMatches = await worldCup2026ResultService.list();
          if (active) setMatches(loadedMatches);
        } catch (error) {
          try {
            const fallbackMatches = await worldCup2026ResultService.list();
            if (active) setMatches(fallbackMatches);
          } catch {
            Alert.alert("Erro ao carregar Copa 2026", error instanceof Error ? error.message : "Tente novamente.");
          }
        } finally {
          if (active) {
            setMatchesLoading(false);
          }
        }
      }

      async function loadPredictions() {
        if (!isAuthenticated) {
          setPredictions([]);
          setPredictionsLoading(false);
          return;
        }

        setPredictionsLoading(true);
        try {
          const loadedPredictions = await worldCup2026PredictionService.list();
          if (active) {
            setPredictions(loadedPredictions);
            setPredictionPage(0);
          }
        } catch (error) {
          Alert.alert("Erro ao carregar palpites", error instanceof Error ? error.message : "Tente novamente.");
        } finally {
          if (active) setPredictionsLoading(false);
        }
      }

      loadPredictions();
      loadMatches();

      return () => {
        active = false;
      };
    }, [isAuthenticated])
  );

  function addPrediction(match: WorldCup2026Result) {
    if (!isAuthenticated) {
      Alert.alert("Login necessário", "Entre na sua conta para salvar palpites.");
      router.push("/login");
      return;
    }
    router.push(`/resultados-2026/palpite/${match.id}` as never);
  }

  function scrollToSearch() {
    scrollRef.current?.scrollTo({ y: Math.max(searchSectionY - 12, 0), animated: true });
  }

  return (
    <ScreenContainer scrollRef={scrollRef}>
      <Text style={globalStyles.title}>Palpites Copa 2026</Text>
      <Text style={globalStyles.subtitle}>Pesquise jogos por seleção, grupo ou fase e salve seus palpites.</Text>

      <View style={styles.sectionHeader}>
        <Text style={globalStyles.sectionTitle}>Meus palpites 2026</Text>
        <AppButton title="Adicionar palpite" fullWidth={false} onPress={scrollToSearch} style={styles.addButton} />
      </View>

      {!isAuthenticated ? (
        <View style={globalStyles.card}>
          <Text style={styles.cardTitle}>Entre para ver seus palpites</Text>
          <Text style={globalStyles.muted}>Entre na sua conta para salvar e acompanhar palpites da Copa 2026.</Text>
        </View>
      ) : predictionsLoading ? (
        <LoadingState message="Carregando seus palpites..." />
      ) : predictions.length === 0 ? (
        <EmptyState title="Nenhum palpite encontrado" message="Escolha um jogo e adicione seu primeiro palpite." />
      ) : (
        <View style={styles.list}>
          {paginatedPredictions.map((prediction) => (
            <WorldCup2026PredictionCard key={prediction.id} prediction={prediction} />
          ))}
          <View style={styles.pagination}>
            <Pressable
              disabled={predictionPage === 0}
              onPress={() => setPredictionPage((page) => Math.max(page - 1, 0))}
              style={[styles.pageButton, predictionPage === 0 ? styles.pageButtonDisabled : null]}
            >
              <Text style={[styles.pageButtonText, predictionPage === 0 ? styles.pageButtonTextDisabled : null]}>Anterior</Text>
            </Pressable>
            <Text style={styles.pageInfo}>Página {predictionPage + 1} de {totalPredictionPages}</Text>
            <Pressable
              disabled={predictionPage >= totalPredictionPages - 1}
              onPress={() => setPredictionPage((page) => Math.min(page + 1, totalPredictionPages - 1))}
              style={[styles.pageButton, predictionPage >= totalPredictionPages - 1 ? styles.pageButtonDisabled : null]}
            >
              <Text style={[styles.pageButtonText, predictionPage >= totalPredictionPages - 1 ? styles.pageButtonTextDisabled : null]}>Próxima</Text>
            </Pressable>
          </View>
        </View>
      )}

      <View style={globalStyles.card} onLayout={(event) => setSearchSectionY(event.nativeEvent.layout.y)}>
        <Text style={styles.cardTitle}>Buscar jogos</Text>
        <TeamSearchInput value={search} onChangeText={setSearch} />

        <Text style={styles.filterLabel}>Grupo</Text>
        <View style={styles.filterRow}>
          <FilterChip label={ALL_FILTER} selected={selectedGroup === ALL_FILTER} onPress={() => setSelectedGroup(ALL_FILTER)} />
          {groupOptions.map((group) => (
            <FilterChip key={group} label={groupLabel(group)} selected={selectedGroup === group} onPress={() => setSelectedGroup(group)} />
          ))}
        </View>

        <Text style={styles.filterLabel}>Fase</Text>
        <View style={styles.filterRow}>
          <FilterChip label={ALL_FILTER} selected={selectedStage === ALL_FILTER} onPress={() => setSelectedStage(ALL_FILTER)} />
          {stageOptions.map((stage) => (
            <FilterChip key={stage} label={stageLabel(stage)} selected={selectedStage === stage} onPress={() => setSelectedStage(stage)} />
          ))}
        </View>

        <Text style={globalStyles.muted}>
          {hasActiveSearch ? gamesLabel(filteredMatches.length) : "Digite uma seleção ou escolha um filtro para buscar jogos."}
        </Text>
      </View>

      <Text style={globalStyles.sectionTitle}>Jogos filtrados</Text>
      {!hasActiveSearch ? (
        <EmptyState title="Nenhuma busca ativa" message="Use o campo de seleção, grupo ou fase para filtrar os jogos." />
      ) : matchesLoading ? (
        <LoadingState message="Carregando jogos..." />
      ) : filteredMatches.length === 0 ? (
        <EmptyState title="Nenhum jogo encontrado" message="Tente outra seleção, grupo ou fase." />
      ) : (
        <View style={styles.list}>
          {filteredMatches.map((match) => (
            <WorldCup2026MatchCard key={match.id} match={match} onAddPrediction={addPrediction} />
          ))}
        </View>
      )}
    </ScreenContainer>
  );
}

function FilterChip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, selected ? styles.chipSelected : null]}>
      <Text style={[styles.chipText, selected ? styles.chipTextSelected : null]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  addButton: {
    minHeight: 40,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  cardTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 10
  },
  chip: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 36,
    paddingHorizontal: 11,
    paddingVertical: 8
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  chipText: {
    color: colors.grayText,
    fontSize: 13,
    fontWeight: "800"
  },
  chipTextSelected: {
    color: colors.white
  },
  filterLabel: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 8,
    marginTop: 12
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 4
  },
  list: {
    gap: 12
  },
  pageButton: {
    alignItems: "center",
    borderColor: colors.primary,
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 38,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  pageButtonDisabled: {
    borderColor: colors.border
  },
  pageButtonText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "900"
  },
  pageButtonTextDisabled: {
    color: colors.grayText
  },
  pageInfo: {
    color: colors.grayText,
    flex: 1,
    fontSize: 13,
    fontWeight: "800",
    textAlign: "center"
  },
  pagination: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between"
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between"
  }
});
