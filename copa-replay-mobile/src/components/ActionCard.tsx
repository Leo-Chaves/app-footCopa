import { StyleSheet, Text, View } from "react-native";
import { colors } from "../styles/colors";
import { globalStyles } from "../styles/global";
import { typography } from "../styles/typography";
import { AppButton } from "./AppButton";

type ActionCardProps = {
  title: string;
  description: string;
  buttonTitle: string;
  onPress: () => void;
  featured?: boolean;
};

export function ActionCard({ title, description, buttonTitle, onPress, featured = false }: ActionCardProps) {
  return (
    <View style={[globalStyles.card, featured ? styles.featured : null]}>
      {featured ? <Text style={styles.badge}>Desafio Histórico</Text> : null}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <AppButton title={buttonTitle} variant={featured ? "primary" : "outline"} onPress={onPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  featured: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: colors.white,
    borderRadius: 999,
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 10,
    overflow: "hidden",
    paddingHorizontal: 10,
    paddingVertical: 6,
    textTransform: "uppercase"
  },
  title: {
    color: colors.text,
    ...typography.cardTitle,
    marginBottom: 8
  },
  description: {
    color: colors.grayText,
    ...typography.body,
    marginBottom: 14
  }
});
