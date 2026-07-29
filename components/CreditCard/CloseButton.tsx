import { Pressable, StyleSheet } from "react-native";
import Animated, { FadeInDown, FadeOutUp } from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";
import { pillButtonSurface } from "./pillButtonSurface";

// Matches the stagger of the 3 MenuButton rows (index 0-2) so it animates in/out last.
const CLOSE_BUTTON_INDEX = 3;

type CloseButtonProps = {
  onPress: () => void;
};

const CloseButton = ({ onPress }: CloseButtonProps) => (
  <Animated.View
    entering={FadeInDown.delay(CLOSE_BUTTON_INDEX * 100 + 200)}
    exiting={FadeOutUp.delay(CLOSE_BUTTON_INDEX * 100)}
    style={styles.wrapper}
  >
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.closeButton,
        pillButtonSurface.surface,
        pressed && pillButtonSurface.pressed,
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
);

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    marginTop: 4,
  },
  closeButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default CloseButton;
