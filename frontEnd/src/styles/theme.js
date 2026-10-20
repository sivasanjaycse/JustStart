import { StyleSheet } from "react-native";

// Modern Emerald & Slate Design System
export const COLORS = {
  bg: "#F8FAFC",           // Modern slate light background
  card: "#FFFFFF",
  cardBorder: "#E2E8F0",   // Subtle slate border
  primary: "#059669",       // Modern vibrant emerald
  primaryLight: "#10B981",  // Crisp emerald accent
  primaryDark: "#065F46",   // Deep forest emerald
  accent: "#34D399",        // Bright mint
  accentLight: "#D1FAE5",   // Soft mint tint
  text: "#0F172A",          // Slate 900 - high contrast modern type
  textSecondary: "#475569", // Slate 600
  textMuted: "#94A3B8",     // Slate 400
  white: "#FFFFFF",
  surface: "#F0FDF4",       // Subtle emerald surface highlight
  surfaceAlt: "#F1F5F9",    // Slate 100 pill background
  border: "#E2E8F0",        // Refined border line
  borderFocus: "#10B981",
  danger: "#EF4444",        // Modern rose red
  dangerLight: "#FEE2E2",
  warning: "#F59E0B",       // Amber
  warningLight: "#FEF3C7",
  overlay: "rgba(15, 23, 42, 0.5)",
  tabBg: "#FFFFFF",
  tabIndicator: "#059669",
  inputBg: "#F8FAFC",
  shadow: "#0F172A",
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  header: {
    color: COLORS.text,
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.5,
  },

  // Segmented Tab Bar
  tabBar: {
    flexDirection: "row",
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: 14,
    padding: 4,
    marginVertical: 14,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  activeTab: {
    backgroundColor: COLORS.white,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  tabText: {
    color: COLORS.textSecondary,
    fontWeight: "600",
    fontSize: 13,
    letterSpacing: 0.1,
  },
  activeTabText: {
    color: COLORS.primaryDark,
    fontWeight: "700",
  },

  // Task & Generic Cards
  card: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  taskName: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  subText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginTop: 4,
    fontWeight: "500",
  },
  points: {
    color: COLORS.primary,
    fontWeight: "800",
    fontSize: 14,
  },

  // Floating Action Button
  addButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 50,
    alignItems: "center",
  },
  addText: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 28,
  },

  // Modals
  modalBg: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: "center",
    padding: 20,
  },
  modal: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 22,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
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

  dateBtn: {
    backgroundColor: COLORS.surfaceAlt,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "500",
  },

  typeRow: {
    flexDirection: "row",
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: 12,
    padding: 4,
    marginBottom: 14,
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 9,
    alignItems: "center",
  },
  activeType: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  typeText: {
    color: COLORS.textSecondary,
    fontWeight: "600",
    fontSize: 13,
  },

  saveBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 6,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  saveText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 15,
    letterSpacing: 0.2,
  },

  closeBtn: {
    marginTop: 12,
    alignItems: "center",
    paddingVertical: 8,
  },
  closeText: {
    color: COLORS.textMuted,
    fontWeight: "600",
    fontSize: 14,
  },

  doneButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 84,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  doneButtonConfirm: {
    backgroundColor: COLORS.warning,
    shadowColor: COLORS.warning,
  },
  doneButtonText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 13,
    letterSpacing: 0.2,
  },

  progressHeading: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.3,
  },

  ProgressBar: {
    height: 8,
    backgroundColor: COLORS.accentLight,
    borderRadius: 4,
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
});
