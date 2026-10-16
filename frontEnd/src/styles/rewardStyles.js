import { StyleSheet } from "react-native";
import { COLORS } from "./theme";

export const rewardStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    padding: 12,
  },

  card: {
    backgroundColor: COLORS.white,
    width: "48%",
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },

  image: {
    width: "100%",
    height: 110,
    marginBottom: 8,
    borderRadius: 8,
  },

  name: {
    color: COLORS.text,
    fontSize: 13,
    marginBottom: 4,
  },

  points: {
    color: COLORS.primary,
    fontWeight: "600",
  },

  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    backgroundColor: COLORS.white,
    width: "85%",
    padding: 20,
    borderRadius: 12,
  },

  modalTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },

  modalText: {
    color: COLORS.textSecondary,
    marginBottom: 20,
  },

  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 20,
  },

  confirm: {
    color: COLORS.primary,
    fontWeight: "600",
  },

  cancel: {
    color: COLORS.textMuted,
  },

  input: {
    backgroundColor: COLORS.inputBg,
    color: COLORS.text,
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  pickImage: {
    color: COLORS.primary,
    marginBottom: 14,
    fontWeight: "500",
  },
});
