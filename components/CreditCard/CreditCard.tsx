import { type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";
import Image from "@d11/react-native-fast-image";
import { SharedValue } from "react-native-reanimated";
import { GestureDetector, useTapGesture } from "react-native-gesture-handler";

type CreditCardProps = {
  src: string;
  index: number;
  style?: StyleProp<ViewStyle>;
  selectedCardIndex: SharedValue<number | null>;
};

const CreditCard = ({
  src,
  style,
  index,
  selectedCardIndex,
}: CreditCardProps) => {
  const tapGesture = useTapGesture({
    onActivate: () => {
      if (selectedCardIndex.value === index) {
        selectedCardIndex.value = null;
        return;
      }
      selectedCardIndex.value = index;
    },
  });
  return (
    <GestureDetector gesture={tapGesture}>
      <View style={[styles.cardWrapper, style]}>
        <Image
          source={{
            uri: src,
          }}
          resizeMode={Image.resizeMode.cover}
          style={{ flex: 1 }}
        />
      </View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    borderRadius: 16,
    width: "100%",
    height: 250,
    overflow: "hidden",
    borderColor: "#4a4a4a",
    borderWidth: 1,
  },
});

export default CreditCard;
