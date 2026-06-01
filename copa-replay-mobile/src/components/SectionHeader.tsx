import { StyleSheet, Text, View } from "react-native";
import { colors } from "../styles/colors";
import { typography } from "../styles/typography";

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
};

export function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 4
  },
  title: {
    color: colors.text,
    ...typography.sectionTitle
  },
  subtitle: {
    color: colors.grayText,
    ...typography.helper
  }
});
