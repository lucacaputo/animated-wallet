import { StyleSheet } from "react-native";

export const pillButtonSurface = StyleSheet.create({
  surface: {
    backgroundColor: "rgba(30,30,30,0.55)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  pressed: {
    backgroundColor: "rgba(30,30,30,0.7)",
    transform: [{ scale: 0.97 }],
  },
});
