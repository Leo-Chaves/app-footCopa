import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { AppButton } from "../../src/components/AppButton";
import { GameMatchCard } from "../../src/components/GameMatchCard";
import { LoadingState } from "../../src/components/LoadingState";
import { ResultBadge } from "../../src/components/ResultBadge";
import { RoundProgress } from "../../src/components/RoundProgress";
import { ScoreInput } from "../../src/components/ScoreInput";
import { ScreenContainer } from "../../src/components/ScreenContainer";
import { StatCard } from "../../src/components/StatCard";
import { gameService } from "../../src/services/gameService";
import { matchService } from "../../src/services/matchService";
import { worldCupService } from "../../src/services/worldCupService";
import { useAuthStore } from "../../src/store/authStore";
import { colors } from "../../src/styles/colors";
import { globalStyles } from "../../src/styles/global";
import { Match } from "../../src/types/match";
import { Prediction } from "../../src/types/prediction";
import { PredictionResult, calculatePredictionResult, roundSummaryMessage, shuffleMatches } from "../../src/utils/game";

type RoundAttempt = {
  match: Match;
  prediction: Prediction;
  result: PredictionResult;
};

export default function PlayChallengeScreen() {
  const { mode, worldCupId, matchId } = useLocalSearchParams<{ mode?: string; worldCupId?: string; matchId?: string }>();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [matches, setMatches] = useState<Match[]>([]);
  const [attempts, setAttempts] = useState<RoundAttempt[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPrediction, setCurrentPrediction] = useState<Prediction | null>(null);
  const [currentResult, setCurrentResult] = useState<PredictionResult | null>(null);
  const [homeScore, setHomeScore] = useState("");
  const [awayScore, setAwayScore] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [finished, setFinished] = useState(false);

  const maxMatches = matches.length;
  const currentMatch = matches[currentIndex] ?? null;
  const summary = useMemo(() => {
    const exactScores = attempts.filter((attempt) => attempt.result.resultType === "EXACT_SCORE").length;
    const correctOutcomes = attempts.filter((attempt) => attempt.result.resultType === "CORRECT_OUTCOME").length;
    const wrongResults = attempts.filter((attempt) => attempt.result.resultType === "WRONG").length;
    const totalPoints = attempts.reduce((sum, attempt) => sum + attempt.result.points, 0);
    return { exactScores, correctOutcomes, wrongResults, totalPoints };
  }, [attempts]);

  useEffect(() => {
    if (!isAuthenticated) {
      Alert.alert("Login necessário", "Entre para jogar o Desafio Histórico.");
      router.replace("/login");
      return;
    }
    loadRound();
  }, [isAuthenticated, mode, worldCupId, matchId]);

  async function loadRound() {
    setLoading(true);
    setAttempts([]);
    setCurrentIndex(0);
    setCurrentPrediction(null);
    setCurrentResult(null);
    setHomeScore("");
    setAwayScore("");
    setFinished(false);

    try {
      let loadedMatches: Match[] = [];
      if (mode === "single" && matchId) {
        loadedMatches = [await matchService.get(Number(matchId))];
      } else if (mode === "cup" && worldCupId) {
        loadedMatches = await worldCupService.matches(Number(worldCupId));
      } else {
        loadedMatches = await matchService.list();
      }

      const playableMatches = loadedMatches.filter((match) => match.homeScore != null && match.awayScore != null);
      setMatches(shuffleMatches(playableMatches).slice(0, mode === "single" ? 1 : 5));
    } catch (error) {
      Alert.alert("Erro ao carregar rodada", error instanceof Error ? error.message : "Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  async function submitGuess() {
    if (!currentMatch) return;
    const predictedHomeScore = Number(homeScore);
    const predictedAwayScore = Number(awayScore);
    if (homeScore === "" || awayScore === "" || predictedHomeScore < 0 || predictedAwayScore < 0) {
      Alert.alert("Revise seu palpite", "Informe placares válidos e sem valores negativos.");
      return;
    }

    setSaving(true);
    try {
      const saved = await gameService.submitGuess({
        matchId: currentMatch.id,
        predictedHomeScore,
        predictedAwayScore
      });
      const result = calculatePredictionResult(currentMatch, saved);
      setCurrentPrediction(saved);
      setCurrentResult(result);
      setAttempts((previous) => [...previous, { match: currentMatch, prediction: saved, result }]);
    } catch (error) {
      Alert.alert("Erro ao confirmar palpite", error instanceof Error ? error.message : "Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  function nextMatch() {
    if (currentIndex + 1 >= maxMatches) {
      setFinished(true);
      return;
    }
    setCurrentIndex((index) => index + 1);
    setCurrentPrediction(null);
    setCurrentResult(null);
    setHomeScore("");
    setAwayScore("");
  }

  if (loading) {
    return (
      <ScreenContainer>
        <LoadingState message="Carregando rodada..." />
      </ScreenContainer>
    );
  }

  if (matches.length === 0) {
    return (
      <ScreenContainer>
        <Text style={globalStyles.title}>Nenhuma partida disponível</Text>
        <Text style={globalStyles.subtitle}>Não encontramos partidas com resultado real para este modo.</Text>
        <AppButton title="Voltar para modos" onPress={() => router.replace("/desafio" as never)} />
      </ScreenContainer>
    );
  }

  if (finished) {
    return (
      <ScreenContainer>
        <Text style={globalStyles.title}>Resumo da rodada</Text>
        <Text style={globalStyles.subtitle}>{roundSummaryMessage(summary.totalPoints)}</Text>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryPoints}>{summary.totalPoints} {summary.totalPoints === 1 ? "ponto" : "pontos"}</Text>
          <Text style={globalStyles.muted}>
            {maxMatches === 1 ? "em 1 partida" : `em ${maxMatches} partidas`}
          </Text>
        </View>
        <View style={styles.statsGrid}>
          <StatCard label="Placares exatos" value={summary.exactScores} />
          <StatCard label="Acertos de vencedor" value={summary.correctOutcomes} />
          <StatCard label="Erros" value={summary.wrongResults} />
        </View>
        <View style={styles.list}>
          {attempts.map((attempt) => (
            <View key={`${attempt.match.id}-${attempt.prediction.id}`} style={globalStyles.card}>
              <Text style={styles.matchTitle}>{attempt.match.homeTeam?.name} x {attempt.match.awayTeam?.name}</Text>
              <Text style={styles.line}>Palpite: {attempt.prediction.predictedHomeScore} x {attempt.prediction.predictedAwayScore}</Text>
              <Text style={styles.line}>Resultado real: {attempt.match.homeScore} x {attempt.match.awayScore}</Text>
              <Text style={styles.points}>+{attempt.result.points} {attempt.result.points === 1 ? "ponto" : "pontos"}</Text>
            </View>
          ))}
        </View>
        <AppButton title="Jogar outra rodada" onPress={() => router.replace("/desafio" as never)} />
        <AppButton title="Ver histórico" variant="outline" onPress={() => router.replace("/historico" as never)} />
        <AppButton title="Voltar para o início" variant="outline" onPress={() => router.replace("/")} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <RoundProgress current={currentIndex + 1} total={maxMatches} />
      <Text style={globalStyles.title}>Qual foi o placar?</Text>
      <Text style={globalStyles.subtitle}>Cada partida vale ate 3 pontos.</Text>

      {currentMatch ? <GameMatchCard match={currentMatch} revealed={Boolean(currentResult)} /> : null}

      {!currentResult && currentMatch ? (
        <View style={globalStyles.card}>
          <Text style={styles.formTitle}>Seu palpite</Text>
          <ScoreInput
            homeScore={homeScore}
            awayScore={awayScore}
            onHomeScoreChange={setHomeScore}
            onAwayScoreChange={setAwayScore}
            homeLabel={currentMatch.homeTeam?.name ?? "Mandante"}
            awayLabel={currentMatch.awayTeam?.name ?? "Visitante"}
          />
          <AppButton title="Confirmar palpite" loading={saving} onPress={submitGuess} />
        </View>
      ) : null}

      {currentResult && currentPrediction ? (
        <View style={styles.resultCard}>
          <ResultBadge resultType={currentResult.resultType} />
          <Text style={styles.resultMessage}>{currentResult.message}</Text>
          <Text style={styles.line}>Seu palpite: {currentPrediction.predictedHomeScore} x {currentPrediction.predictedAwayScore}</Text>
          <Text style={styles.line}>Resultado real: {currentMatch?.homeScore} x {currentMatch?.awayScore}</Text>
          <AppButton title={currentIndex + 1 >= maxMatches ? "Ver resumo" : "Próxima partida"} onPress={nextMatch} />
        </View>
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  formTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 8
  },
  resultCard: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
    padding: 18
  },
  resultMessage: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900",
    lineHeight: 26
  },
  line: {
    color: colors.grayText,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 21
  },
  points: {
    color: colors.primaryDark,
    fontSize: 16,
    fontWeight: "900",
    marginTop: 8
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  list: {
    gap: 12
  },
  summaryCard: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
    borderRadius: 16,
    borderWidth: 1,
    padding: 20
  },
  summaryPoints: {
    color: colors.primaryDark,
    fontSize: 34,
    fontWeight: "900"
  },
  matchTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
    lineHeight: 24,
    marginBottom: 8
  }
});
