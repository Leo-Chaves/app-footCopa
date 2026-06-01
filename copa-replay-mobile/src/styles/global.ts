import { StyleSheet } from "react-native";
import { colors } from "./colors";
import { radii, spacing } from "./spacing";
import { shadows } from "./shadows";
import { typography } from "./typography";

export const globalStyles = StyleSheet.create({
  title: {
    color: colors.text,
    ...typography.title
  },
  subtitle: {
    color: colors.grayText,
    ...typography.body
  },
  sectionTitle: {
    color: colors.text,
    ...typography.sectionTitle,
    marginBottom: spacing.md
  },
  card: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    padding: spacing.card,
    ...shadows.card
  },
  muted: {
    color: colors.grayText,
    ...typography.helper
  }
});
