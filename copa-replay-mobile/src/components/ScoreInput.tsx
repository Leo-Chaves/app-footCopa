import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../styles/colors";

const MAX_SCORE = 15;

type ScoreInputProps = {
  homeLabel?: string;
  awayLabel?: string;
  homeScore: string;
  awayScore: string;
  onHomeScoreChange: (value: string) => void;
  onAwayScoreChange: (value: string) => void;
  disabled?: boolean;
};

export function ScoreInput({
  homeLabel = "Mandante",
  awayLabel = "Visitante",
  homeScore,
  awayScore,
  onHomeScoreChange,
  onAwayScoreChange,
  disabled = false
}: ScoreInputProps) {
  useEffect(() => {
    if (homeScore === "") {
      onHomeScoreChange("0");
    }
    if (awayScore === "") {
      onAwayScoreChange("0");
    }
  }, [awayScore, homeScore, onAwayScoreChange, onHomeScoreChange]);

  const home = toScore(homeScore);
  const away = toScore(awayScore);

  return (
    <View style={styles.container}>
      <ScoreStepper
        label={homeLabel}
        value={home}
        disabled={disabled}
        onChange={(value) => onHomeScoreChange(String(value))}
      />

      <View style={styles.scoreLine}>
        <Text style={styles.scoreValue}>{home}</Text>
        <Text style={styles.separator}>x</Text>
        <Text style={styles.scoreValue}>{away}</Text>
      </View>

      <ScoreStepper
        label={awayLabel}
        value={away}
        disabled={disabled}
        onChange={(value) => onAwayScoreChange(String(value))}
      />
    </View>
  );
}

function ScoreStepper({
  label,
  value,
  disabled,
  onChange
}: {
  label: string;
  value: number;
  disabled: boolean;
  onChange: (value: number) => void;
}) {
  const canDecrease = !disabled && value > 0;
  const canIncrease = !disabled && value < MAX_SCORE;

  return (
    <View style={styles.teamRow}>
      <Text style={styles.teamName} numberOfLines={2}>{label}</Text>
      <View style={styles.controls}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Diminuir placar de ${label}`}
          disabled={!canDecrease}
          onPress={() => onChange(value - 1)}
          style={({ pressed }) => [
            styles.controlButton,
            !canDecrease ? styles.controlDisabled : null,
            pressed ? styles.pressed : null
          ]}
        >
          <Text style={[styles.controlText, !canDecrease ? styles.controlTextDisabled : null]}>-</Text>
        </Pressable>

        <View style={styles.teamScoreBox}>
          <Text style={styles.teamScore}>{value}</Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Aumentar placar de ${label}`}
          disabled={!canIncrease}
          onPress={() => onChange(value + 1)}
          style={({ pressed }) => [
            styles.controlButton,
            !canIncrease ? styles.controlDisabled : null,
            pressed ? styles.pressed : null
          ]}
        >
          <Text style={[styles.controlText, !canIncrease ? styles.controlTextDisabled : null]}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

function toScore(value: string) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return 0;
  }
  return Math.min(Math.trunc(parsed), MAX_SCORE);
}

const styles = StyleSheet.create({
  container: {
    gap: 14,
    marginBottom: 16
  },
  scoreLine: {
    alignItems: "center",
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 14
  },
  scoreValue: {
    color: colors.primaryDark,
    fontSize: 40,
    fontWeight: "900",
    minWidth: 54,
    textAlign: "center"
  },
  separator: {
    color: colors.primaryDark,
    fontSize: 30,
    fontWeight: "900",
    paddingHorizontal: 8
  },
  teamRow: {
    gap: 8
  },
  teamName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "900",
    lineHeight: 20
  },
  controls: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8
  },
  controlButton: {
    alignItems: "center",
    backgroundColor: colors.white,
    borderColor: colors.primary,
    borderRadius: 12,
    borderWidth: 1,
    height: 48,
    justifyContent: "center",
    width: 52
  },
  controlDisabled: {
    borderColor: colors.border,
    opacity: 0.6
  },
  controlText: {
    color: colors.primaryDark,
    fontSize: 28,
    fontWeight: "900",
    lineHeight: 32
  },
  controlTextDisabled: {
    color: colors.grayText
  },
  teamScoreBox: {
    alignItems: "center",
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    height: 48,
    justifyContent: "center",
    minWidth: 82
  },
  teamScore: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "900"
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }]
  }
});
