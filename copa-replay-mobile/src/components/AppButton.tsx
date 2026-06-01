import { ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle } from "react-native";
import { colors } from "../styles/colors";
import { radii } from "../styles/spacing";
import { typography } from "../styles/typography";

type AppButtonProps = {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger" | "outline" | "ghost";
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
};

export function AppButton({
  title,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
  fullWidth = true,
  style
}: AppButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        fullWidth ? styles.fullWidth : null,
        pressed && !isDisabled ? styles.pressed : null,
        isDisabled ? styles.disabled : null,
        style
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === "outline" || variant === "ghost" ? colors.primary : colors.white} />
      ) : (
        <Text style={[styles.text, variant === "outline" || variant === "ghost" ? styles.outlineText : null]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    borderRadius: radii.md,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 50,
    paddingHorizontal: 18,
    paddingVertical: 13
  },
  fullWidth: {
    width: "100%"
  },
  primary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  secondary: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primaryDark
  },
  danger: {
    backgroundColor: colors.danger,
    borderColor: colors.danger
  },
  outline: {
    backgroundColor: colors.white,
    borderColor: colors.primary
  },
  ghost: {
    backgroundColor: "transparent",
    borderColor: "transparent"
  },
  pressed: {
    opacity: 0.86,
    transform: [{ scale: 0.99 }]
  },
  disabled: {
    opacity: 0.55
  },
  text: {
    color: colors.white,
    ...typography.button,
    textAlign: "center"
  },
  outlineText: {
    color: colors.primary
  }
});
