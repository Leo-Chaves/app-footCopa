import { StyleSheet, Text, View } from "react-native";
import { colors } from "../styles/colors";
import { AppInput } from "./AppInput";

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
  onAwayScoreChange
}: ScoreInputProps) {
  return (
    <View style={styles.row}>
      <View style={styles.input}>
        <AppInput label={homeLabel} value={homeScore} onChangeText={onHomeScoreChange} keyboardType="number-pad" placeholder="0" />
      </View>
      <Text style={styles.separator}>x</Text>
      <View style={styles.input}>
        <AppInput label={awayLabel} value={awayScore} onChangeText={onAwayScoreChange} keyboardType="number-pad" placeholder="0" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12
  },
  input: {
    flex: 1
  },
  separator: {
    color: colors.primaryDark,
    fontSize: 24,
    fontWeight: "900",
    paddingTop: 22
  }
});
