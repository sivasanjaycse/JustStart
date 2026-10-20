import { StyleSheet } from "react-native";
import { COLORS } from "./theme";

export const rewardStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    paddingHorizontal: 16,
    paddingTop: 10,
  },

  card: {
    backgroundColor: COLORS.white,
    width: "48%",
    borderRadius: 18,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    justifyContent: "space-between",
  },

  imageContainer: {
    width: "100%",
    height: 116,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceAlt,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  image: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },

  name: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 18,
    marginBottom: 8,
    minHeight: 36,
  },

  pointsBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.accentLight,
    alignSelf: "flex-start",
    gap: 4,
  },

  points: {
    color: COLORS.primaryDark,
    fontWeight: "800",
    fontSize: 12,
  },

  fab: {
    position: "absolute",
    right: 20,
    bottom: 24,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  modalBox: {
    backgroundColor: COLORS.white,
    width: "100%",
    maxWidth: 360,
    padding: 22,
    borderRadius: 22,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },

  modalTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.3,
    marginBottom: 10,
  },

  modalText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },

  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },

  confirm: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 14,
    textAlign: "center",
    overflow: "hidden",
  },

  cancel: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    color: COLORS.textMuted,
    fontWeight: "600",
    fontSize: 14,
    textAlign: "center",
  },

  input: {
    backgroundColor: COLORS.inputBg,
    color: COLORS.text,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    fontSize: 14,
  },

  pickImage: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 16,
    gap: 8,
  },
  pickImageText: {
    color: COLORS.primary,
    fontWeight: "700",
    fontSize: 14,
  },
});
