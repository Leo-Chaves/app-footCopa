import { StyleSheet, Text, View } from "react-native";
import { colors } from "../styles/colors";
import { globalStyles } from "../styles/global";

type ImportStatusCardProps = {
  total: number;
  importing: boolean;
};

export function ImportStatusCard({ total, importing }: ImportStatusCardProps) {
  const totalLabel = total === 1 ? "1 jogo disponível" : `${total} jogos disponíveis`;

  return (
    <View style={globalStyles.card}>
      <Text style={styles.title}>Jogos da Copa 2026</Text>
      <Text style={styles.total}>{importing ? "Atualizando calendário da Copa 2026..." : totalLabel}</Text>
      {!importing ? <Text style={styles.helper}>Calendário atualizado automaticamente.</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 6
  },
  total: {
    color: colors.grayText,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20,
    marginTop: 4
  },
  helper: {
    color: colors.primaryDark,
    fontSize: 13,
    fontWeight: "800",
    marginTop: 8
  }
});
