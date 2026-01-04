import { StyleSheet } from "react-native";

export const rewardStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0507",
    padding: 12,
  },

  card: {
    backgroundColor: "#141012",
    width: "48%",
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
  },

  image: {
    width: "100%",
    height: 110,
    marginBottom: 8,
  },

  name: {
    color: "#F5F5F5",
    fontSize: 13,
    marginBottom: 4,
  },

  points: {
    color: "#C1121F",
    fontWeight: "600",
  },

  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#C1121F",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    backgroundColor: "#141012",
    width: "85%",
    padding: 20,
    borderRadius: 12,
  },

  modalTitle: {
    color: "#F5F5F5",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },

  modalText: {
    color: "#DADADA",
    marginBottom: 20,
  },

  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 20,
  },

  confirm: {
    color: "#C1121F",
    fontWeight: "600",
  },

  cancel: {
    color: "#A8A8A8",
  },

  input: {
    backgroundColor: "#1C0F13",
    color: "#F5F5F5",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },

  pickImage: {
    color: "#C1121F",
    marginBottom: 14,
  },
});
