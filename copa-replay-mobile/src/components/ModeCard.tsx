import { StyleSheet, Text, View } from "react-native";
import { colors } from "../styles/colors";
import { globalStyles } from "../styles/global";
import { AppButton } from "./AppButton";

type ModeCardProps = {
  title: string;
  description: string;
  meta?: string;
  buttonTitle: string;
  onPress: () => void;
};

export function ModeCard({ title, description, meta, buttonTitle, onPress }: ModeCardProps) {
  return (
    <View style={globalStyles.card}>
      {meta ? <Text style={styles.meta}>{meta}</Text> : null}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <AppButton title={buttonTitle} onPress={onPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  meta: {
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 8,
    textTransform: "uppercase"
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 8
  },
  description: {
    color: colors.grayText,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 14
  }
});
