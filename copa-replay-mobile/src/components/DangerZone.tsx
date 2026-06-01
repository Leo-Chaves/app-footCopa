import { StyleSheet, Text, View } from "react-native";
import { colors } from "../styles/colors";
import { shadows } from "../styles/shadows";
import { radii, spacing } from "../styles/spacing";
import { typography } from "../styles/typography";
import { AppButton } from "./AppButton";

type DangerZoneProps = {
  title?: string;
  description: string;
  buttonTitle: string;
  onPress: () => void;
};

export function DangerZone({ title = "Zona de perigo", description, buttonTitle, onPress }: DangerZoneProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <AppButton title={buttonTitle} variant="danger" onPress={onPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderColor: colors.danger,
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.card,
    ...shadows.soft
  },
  title: {
    color: colors.danger,
    ...typography.cardTitle
  },
  description: {
    color: colors.grayText,
    ...typography.helper
  }
});
