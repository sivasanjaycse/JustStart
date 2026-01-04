import { ProgressBarAndroidBase, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0507",
    padding: 10,
  },
  header: {
    color: "#F5F5F5",
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
    backgroundColor: "#141012",
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  activeTab: {
    backgroundColor: "#8B0000",
  },
  tabText: {
    color: "#F5F5F5",
    fontWeight: "bold",
  },

  card: {
    backgroundColor: "#1C0F13",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
  },
  taskName: {
    color: "#F5F5F5",
    fontSize: 18,
  },
  subText: {
    color: "#DADADA",
  },
  points: {
    color: "#C1121F",
    fontWeight: "bold",
  },

  addButton: {
    backgroundColor: "#C1121F",
    padding: 16,
    borderRadius: 50,
    alignItems: "center",
  },
  addText: {
    color: "#F5F5F5",
    fontSize: 16,
  },

  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
  },
  modal: {
    backgroundColor: "#141012",
    margin: 20,
    padding: 20,
    borderRadius: 15,
  },

  input: {
    backgroundColor: "#1C0F13",
    color: "#F5F5F5",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },

  dateBtn: {
    backgroundColor: "#2A2A2A",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  dateText: {
    color: "#F5F5F5",
  },

  typeRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  typeBtn: {
    flex: 1,
    padding: 10,
    backgroundColor: "#2A2A2A",
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: "center",
  },
  activeType: {
    backgroundColor: "#6D0F1B",
  },
  typeText: {
    color: "#F5F5F5",
  },

  saveBtn: {
    backgroundColor: "#C1121F",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  saveText: {
    color: "#F5F5F5",
    fontWeight: "bold",
  },

  closeBtn: {
    marginTop: 10,
    alignItems: "center",
  },
  closeText: {
    color: "#A8A8A8",
  },
  doneButton: {
    backgroundColor: "#C1121F", // Primary Button
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 80,
  },

  doneButtonText: {
    color: "#F5F5F5", // Primary Text White
    fontWeight: "600",
    fontSize: 14,
  },

  progressHeading: {
    color: "#F5F5F5",
    textAlign: "center",
    fontSize: 19,
    fontWeight: "600",
    marginBottom: 10,
    letterSpacing: 0.5,
  },

  ProgressBar: {
    height: 8,
    backgroundColor: "#1A1A1A",
    borderRadius: 4,
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
});
