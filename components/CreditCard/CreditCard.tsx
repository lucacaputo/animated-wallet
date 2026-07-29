import { type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";
import Image from "@d11/react-native-fast-image";
import Animated, {
  cancelAnimation,
  measure,
  SharedValue,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { GestureDetector, useTapGesture } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { V_OFFSET } from "../../constants";

type CreditCardProps = {
  src: string;
  index: number;
  style?: StyleProp<ViewStyle>;
  selectedCardIndex: SharedValue<number | null>;
  listTranslationState: SharedValue<number>;
};

const CreditCard = ({
  src,
  style,
  index,
  selectedCardIndex,
  listTranslationState,
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
  const { top: topInset } = useSafeAreaInsets();
  const translation = useSharedValue(-index * (250 - V_OFFSET));
  const wrapperRef = useAnimatedRef<View>();
  useAnimatedReaction(
    () => selectedCardIndex.value,
    (curr) => {
      if (curr === null) {
        // noting selected, proceed as a normal scrollview
        translation.value = -index * (250 - V_OFFSET);
        return;
      }
      cancelAnimation(listTranslationState);
      if (curr === index) {
        // a card has been selected, here we handle the selected card
        const currentPosition = measure(wrapperRef) ?? { pageY: 0 };
        const finalPosition = { pageY: topInset };
        translation.value =
          translation.value - currentPosition.pageY + finalPosition.pageY;
        return;
      }
      // when a card is selected, we handle here the other cards
      translation.value =
        -index * (250 - V_OFFSET / 2) + 400 - listTranslationState.value;
    },
  );

  const rCardStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: withSpring(translation.value) }],
  }));

  return (
    <GestureDetector gesture={tapGesture}>
      <Animated.View
        style={[styles.cardWrapper, style, rCardStyle]}
        ref={wrapperRef}
      >
        <Image
          source={{
            uri: src,
          }}
          resizeMode={Image.resizeMode.cover}
          style={{ flex: 1 }}
        />
      </Animated.View>
    </GestureDetector>
  );
};
//style={{ transform: [{ translateY: -idx * (250 - V_OFFSET) }] }}

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
