import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text, View } from "react-native";
import { CARD_IMAGES } from "./constants";
import CreditCard from "./components/CreditCard";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import CardList from "./components/CardList/CardList";

export default function App() {
  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
          <CardList />
        </SafeAreaView>
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
