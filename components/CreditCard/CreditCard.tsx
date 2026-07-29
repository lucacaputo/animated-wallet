import {
  Pressable,
  type StyleProp,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from "react-native";
import Image from "@d11/react-native-fast-image";
import Animated, {
  cancelAnimation,
  Easing,
  FadeIn,
  FadeInDown,
  FadeOut,
  FadeOutUp,
  measure,
  SharedValue,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedStyle,
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
import { Portal, PortalHost } from "react-native-teleport";
import { BlurView } from "expo-blur";
import Svg, { Path } from "react-native-svg";

type CreditCardProps = {
  src: string;
  index: number;
  style?: StyleProp<ViewStyle>;
  selectedCardIndex: SharedValue<number | null>;
  listTranslationState: SharedValue<number>;
};

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);
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
              style={rCardImageStyle}
            />
          </Portal>
        </Animated.View>
      </GestureDetector>
      {isOverlayVisible && (
        <Portal hostName="overlay">
          {isMenuOpen && (
            <AnimatedBlurView
              entering={FadeIn.duration(200)}
              exiting={FadeOut.duration(200)
                .delay(450)
                .withCallback((finished) => {
                  if (finished) {
                    scheduleOnRN(setOverlayVisible, false);
                  }
                })}
              style={styles.overlayWrapper}
            />
          )}
          <View
            style={[styles.teleportedCardWrapper, { paddingTop: topInset }]}
          >
            <PortalHost name="card" style={styles.teleportedCard} />
            <View style={styles.menuWrapper}>
              {isMenuOpen &&
                ["Delete", "Other action", "Another action"].map(
                  (text, idx) => (
                    <Animated.View
                      key={`button-${idx}`}
                      entering={FadeInDown.delay(idx * 100 + 200)}
                      exiting={FadeOutUp.delay(idx * 100)}
                    >
                      <Pressable
                        onPress={() => {
                          console.log("pressed", text);
                        }}
                        style={({ pressed }) => [
                          styles.menuButton,
                          pressed && styles.menuButtonPressed,
                        ]}
                      >
                        <Text
                          style={[
                            styles.menuText,
                            text === "Delete" && styles.menuTextDestructive,
                          ]}
                        >
                          {text}
                        </Text>
                      </Pressable>
                    </Animated.View>
                  ),
                )}
              {isMenuOpen && (
                <Animated.View
                  entering={FadeInDown.delay(3 * 100 + 200)}
                  exiting={FadeOutUp.delay(3 * 100)}
                  style={styles.closeButtonWrapper}
                >
                  <Pressable
                    onPress={() => {
                      setMenuOpen(false);
                    }}
                    style={({ pressed }) => [
                      styles.closeButton,
                      pressed && styles.menuButtonPressed,
                    ]}
                  >
                    <Svg width={20} height={20} viewBox="0 0 24 24">
                      <Path
                        d="M6 6L18 18M18 6L6 18"
                        stroke="#fff"
                        strokeWidth={2.5}
                        strokeLinecap="round"
                      />
                    </Svg>
                  </Pressable>
                </Animated.View>
              )}
            </View>
          </View>
        </Portal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    borderRadius: 16,
    width: "100%",
    height: 250,
    overflow: "hidden",
  },
  overlayWrapper: {
    flex: 1,
  },
  teleportedCard: {
    zIndex: 11,
    width: "100%",
    height: 250,
    borderRadius: 16,
    paddingHorizontal: 16,
    overflow: "hidden",
  },
  teleportedCardWrapper: {
    position: "absolute",
    width: "100%",
    paddingHorizontal: 16,
  },

  menuWrapper: {
    flexDirection: "column",
    gap: 12,
    marginTop: 24,
    width: "100%",
  },
  menuButton: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(30,30,30,0.55)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  menuButtonPressed: {
    backgroundColor: "rgba(30,30,30,0.7)",
    transform: [{ scale: 0.97 }],
  },
  closeButtonWrapper: {
    alignItems: "center",
    marginTop: 4,
  },
  closeButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(30,30,30,0.55)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  menuText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#fff",
  },
  menuTextDestructive: {
    color: "#ff453a",
  },
});

export default CreditCard;
