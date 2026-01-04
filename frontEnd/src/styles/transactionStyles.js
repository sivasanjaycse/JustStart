import { StyleSheet } from "react-native";

export const transactionStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0507",
    padding: 16,
  },

  section: {
    marginBottom: 24,
  },

  date: {
    color: "#C1121F",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 10,
  },

  item: {
    backgroundColor: "#141012",
    padding: 14,
    borderRadius: 10,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  name: {
    color: "#F5F5F5",
    fontSize: 14,
  },

  points: {
    color: "#8B0000",
    fontWeight: "600",
  },
});
