import { StyleSheet } from "react-native";
import { COLORS } from "./theme";

export const transactionStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    padding: 16,
  },

  section: {
    marginBottom: 24,
  },

  date: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 10,
  },

  item: {
    backgroundColor: COLORS.white,
    padding: 14,
    borderRadius: 10,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },

  name: {
    color: COLORS.text,
    fontSize: 14,
  },

  points: {
    color: COLORS.danger,
    fontWeight: "600",
  },
});
