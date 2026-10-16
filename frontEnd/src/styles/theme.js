import { StyleSheet } from "react-native";

// White and Green theme
export const COLORS = {
  bg: "#FAFAFA",
  card: "#FFFFFF",
  cardBorder: "#E8F5E9",
  primary: "#2E7D32",       // Deep green
  primaryLight: "#4CAF50",  // Medium green
  primaryDark: "#1B5E20",   // Dark green
  accent: "#66BB6A",        // Light green accent
  accentLight: "#C8E6C9",   // Very light green
  text: "#1A1A1A",
  textSecondary: "#616161",
  textMuted: "#9E9E9E",
  white: "#FFFFFF",
  surface: "#F1F8E9",       // Very light green surface
  surfaceAlt: "#E8F5E9",
  border: "#C8E6C9",
  danger: "#D32F2F",
  overlay: "rgba(0,0,0,0.5)",
  tabBg: "#FFFFFF",
  tabIndicator: "#2E7D32",
  inputBg: "#F5F5F5",
  shadow: "#000",
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    padding: 10,
  },
  header: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: "bold",
  },

  tabBar: {
    flexDirection: "row",
    marginVertical: 15,
  },
  tab: {
    flex: 1,
    padding: 10,
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    color: COLORS.text,
    fontWeight: "bold",
  },

  card: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  taskName: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "600",
  },
  subText: {
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  points: {
    color: COLORS.primary,
    fontWeight: "bold",
  },

  addButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 50,
    alignItems: "center",
  },
  addText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
  },

  modalBg: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: "center",
  },
  modal: {
    backgroundColor: COLORS.white,
    margin: 20,
    padding: 20,
    borderRadius: 15,
  },

  input: {
    backgroundColor: COLORS.inputBg,
    color: COLORS.text,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  dateBtn: {
    backgroundColor: COLORS.surfaceAlt,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dateText: {
    color: COLORS.text,
  },

  typeRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  typeBtn: {
    flex: 1,
    padding: 10,
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: "center",
  },
  activeType: {
    backgroundColor: COLORS.primary,
  },
  typeText: {
    color: COLORS.text,
    fontWeight: "600",
  },

  saveBtn: {
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  saveText: {
    color: COLORS.white,
    fontWeight: "bold",
  },

  closeBtn: {
    marginTop: 10,
    alignItems: "center",
  },
  closeText: {
    color: COLORS.textMuted,
  },
  doneButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 80,
  },

  doneButtonText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 14,
  },

  progressHeading: {
    color: COLORS.text,
    textAlign: "center",
    fontSize: 19,
    fontWeight: "600",
    marginBottom: 10,
    letterSpacing: 0.5,
  },

  ProgressBar: {
    height: 8,
    backgroundColor: COLORS.accentLight,
    borderRadius: 4,
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
});
