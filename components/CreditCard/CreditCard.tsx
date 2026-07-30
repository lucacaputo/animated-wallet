import { type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";
import Image from "@d11/react-native-fast-image";
import Animated, {
  cancelAnimation,
  Easing,
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
import { useState } from "react";
import { scheduleOnRN } from "react-native-worklets";
import { Portal } from "react-native-teleport";
import CardMenu, { type CardMenuAction } from "./CardMenu";
import * as Haptics from "expo-haptics";

type CreditCardProps = {
  src: string;
  index: number;
  style?: StyleProp<ViewStyle>;
  selectedCardIndex: SharedValue<number | null>;
  listTranslationState: SharedValue<number>;
};

const AnimatedImage = Animated.createAnimatedComponent(Image);

const CreditCard = ({
  src,
  style,
  index,
  selectedCardIndex,
  listTranslationState,
}: CreditCardProps) => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isOverlayVisible, setOverlayVisible] = useState(false);
  const openMenu = () => {
    setOverlayVisible(true);
    setMenuOpen(true);
  };
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
  const isSelected = useDerivedValue(() => selectedCardIndex.value === index);
  const lonPressGesture = useLongPressGesture({
    enabled: isSelected,
    block: tapGesture,
    onBegin: () => {
      scaleValue.value = withTiming(0.9, {
        duration: 500,
        easing: Easing.linear,
      });
    },
    onActivate: () => {
      scaleValue.value = withSpring(1, { stiffness: 1000, damping: 25 });
      scheduleOnRN(Haptics.impactAsync, Haptics.ImpactFeedbackStyle.Rigid);
      scheduleOnRN(openMenu);
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
    transform: [{ translateY: withSpring(translation.value) }],
  }));
  const rCardImageStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
    flex: 1,
  }));

  const menuActions: CardMenuAction[] = [
    {
      label: "Delete",
      destructive: true,
      onPress: () => console.log("pressed", "Delete"),
    },
    {
      label: "Other action",
      onPress: () => console.log("pressed", "Other action"),
    },
    {
      label: "Another action",
      onPress: () => console.log("pressed", "Another action"),
    },
  ];

  return (
    <>
      <GestureDetector gesture={gesture}>
        <Animated.View
          style={[styles.cardWrapper, style, rCardStyle]}
          ref={wrapperRef}
        >
          <Portal
            hostName={isOverlayVisible ? "card" : undefined}
            style={{ flex: 1 }}
          >
            <AnimatedImage
              source={{
                uri: src,
              }}
              resizeMode={Image.resizeMode.cover}
              style={[styles.cardImage, rCardImageStyle]}
            />
          </Portal>
        </Animated.View>
      </GestureDetector>
      <CardMenu
        isOverlayVisible={isOverlayVisible}
        isMenuOpen={isMenuOpen}
        actions={menuActions}
        onRequestClose={() => setMenuOpen(false)}
        onExited={() => setOverlayVisible(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    width: "100%",
    height: 250,
    overflow: "hidden",
  },
  cardImage: {
    borderRadius: 16,
  },
});

export default CreditCard;
