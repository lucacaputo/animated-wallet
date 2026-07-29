import { Pressable, StyleSheet, Text } from "react-native";
import Animated, { FadeInDown, FadeOutUp } from "react-native-reanimated";
import { pillButtonSurface } from "./pillButtonSurface";

type MenuButtonProps = {
  label: string;
  index: number;
  destructive?: boolean;
  onPress: () => void;
};

const MenuButton = ({
  label,
  index,
  destructive,
  onPress,
}: MenuButtonProps) => (
  <Animated.View
    entering={FadeInDown.delay(index * 100 + 200)}
    exiting={FadeOutUp.delay(index * 100)}
  >
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.menuButton,
        pillButtonSurface.surface,
        pressed && pillButtonSurface.pressed,
      ]}
    >
      <Text
        style={[styles.menuText, destructive && styles.menuTextDestructive]}
      >
        {label}
      </Text>
    </Pressable>
  </Animated.View>
);

const styles = StyleSheet.create({
  menuButton: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
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

export default MenuButton;
