import { type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";
import Image from "@d11/react-native-fast-image";
import Animated, {
  cancelAnimation,
  Easing,
  Extrapolation,
  interpolate,
  measure,
  SharedValue,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import {
  GestureDetector,
  useLongPressGesture,
  useTapGesture,
  useCompetingGestures,
} from "react-native-gesture-handler";
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
  const scaleValue = useSharedValue(1);
  const tapGesture = useTapGesture({
    onActivate: () => {
      if (selectedCardIndex.value === index) {
        selectedCardIndex.value = null;
        return;
      }
      selectedCardIndex.value = index;
    },
  });
  const lonPressGesture = useLongPressGesture({
    block: tapGesture,
    onBegin: () => {
      scaleValue.value = withTiming(0.9, {
        duration: 500,
        easing: Easing.linear,
      });
    },
    onActivate: () => {
      scaleValue.value = withSpring(1);
    },
    onFinalize: () => {
      cancelAnimation(scaleValue);
      scaleValue.value = withSpring(1);
    },
  });
  const gesture = useCompetingGestures(lonPressGesture, tapGesture);
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
        -index * (250 - V_OFFSET / 3) + 400 - listTranslationState.value;
    },
  );

  const rCardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: withSpring(translation.value) },
      { scale: scaleValue.value },
    ],
  }));

  return (
    <GestureDetector gesture={gesture}>
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
