import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDecay,
  withTiming,
} from "react-native-reanimated";
import { CARD_IMAGES, V_OFFSET } from "../../constants";
import CreditCard from "../CreditCard";
import { GestureDetector, usePanGesture } from "react-native-gesture-handler";
import { useEffect, useRef, useState } from "react";
import { BlurTargetView } from "expo-blur";

const CardList = () => {
  const [cards, setCards] = useState(CARD_IMAGES);
  const blurTargetRef = useRef<View>(null);
  const trY = useSharedValue(0);
  const height = useSharedValue(cards.length * V_OFFSET);
  const selectedCard = useSharedValue<number | null>(null);
  const panEnabled = useDerivedValue(() => selectedCard.value === null);
  const panGesture = usePanGesture({
    onUpdate: ({ changeY }) => {
      trY.value += changeY;
    },
    onDeactivate: ({ velocityY }) => {
      trY.value = withDecay({
        velocity: velocityY,
        rubberBandEffect: true,
        clamp: [-V_OFFSET * cards.length, 0],
      });
    },
    enabled: panEnabled,
  });

  useEffect(() => {
    height.value = cards.length * V_OFFSET;
  }, [cards.length]);

  const rScrollableStyle = useAnimatedStyle(() => ({
    height: withTiming(height.value, { duration: 180 }),
    transform: [
      {
        translateY: trY.value,
      },
    ],
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <BlurTargetView ref={blurTargetRef} style={styles.wrapper}>
        <Animated.View style={[styles.scrollable, rScrollableStyle]}>
          {cards.map((img, idx) => (
            <CreditCard
              listTranslationState={trY}
              index={idx}
              selectedCardIndex={selectedCard}
              blurTargetRef={blurTargetRef}
              src={img}
              key={`card-image-${idx}`}
            />
          ))}
        </Animated.View>
      </BlurTargetView>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  scrollable: {
    position: "absolute",
    width: "100%",
    paddingHorizontal: 16,
  },
});

export default CardList;
