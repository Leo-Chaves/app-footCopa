import { useState } from "react";
import { KeyboardTypeOptions, StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";
import { colors } from "../styles/colors";
import { radii } from "../styles/spacing";
import { typography } from "../styles/typography";

type AppInputProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  error?: string;
  helperText?: string;
  multiline?: boolean;
} & Pick<TextInputProps, "autoCapitalize" | "autoCorrect">;

export function AppInput({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  error,
  helperText,
  multiline,
  autoCapitalize,
  autoCorrect
}: AppInputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        keyboardType={keyboardType}
        multiline={multiline}
        onBlur={() => setFocused(false)}
        onChangeText={onChangeText}
        onFocus={() => setFocused(true)}
        placeholder={placeholder}
        placeholderTextColor={colors.grayText}
        secureTextEntry={secureTextEntry}
        style={[styles.input, focused ? styles.focused : null, multiline ? styles.multiline : null, error ? styles.errorBorder : null]}
        value={value}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {!error && helperText ? <Text style={styles.helper}>{helperText}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    marginBottom: 14
  },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700"
  },
  input: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    color: colors.text,
    fontSize: 16,
    minHeight: 50,
    paddingHorizontal: 14
  },
  focused: {
    borderColor: colors.primary
  },
  multiline: {
    minHeight: 100,
    paddingTop: 12,
    textAlignVertical: "top"
  },
  errorBorder: {
    borderColor: colors.danger
  },
  error: {
    color: colors.danger,
    ...typography.helper
  },
  helper: {
    color: colors.grayText,
    ...typography.helper
  }
});
