import { StyleSheet, Text, View } from "react-native";
import { colors } from "../styles/colors";
import { radii } from "../styles/spacing";
import { AppButton } from "./AppButton";

type EmptyStateProps = {
  title: string;
  message?: string;
  actionTitle?: string;
  onAction?: () => void;
};

export function EmptyState({ title, message, actionTitle, onAction }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>!</Text>
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {actionTitle && onAction ? <AppButton title={actionTitle} variant="outline" onPress={onAction} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: 8,
    padding: 22
  },
  icon: {
    backgroundColor: colors.white,
    borderRadius: 18,
    color: colors.primaryDark,
    fontSize: 20,
    fontWeight: "900",
    height: 36,
    lineHeight: 36,
    textAlign: "center",
    width: 36
  },
  title: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "800",
    textAlign: "center"
  },
  message: {
    color: colors.grayText,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center"
  }
});
