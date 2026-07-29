import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import CardList from "./components/CardList/CardList";
import { PortalHost, PortalProvider } from "react-native-teleport";

export default function App() {
  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <PortalProvider>
          <PortalHost
            style={[StyleSheet.absoluteFill, { zIndex: 10 }]}
            name="overlay"
          />
          <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
            <CardList />
          </SafeAreaView>
        </PortalProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  safeArea: {
    flex: 1,
  },
});
