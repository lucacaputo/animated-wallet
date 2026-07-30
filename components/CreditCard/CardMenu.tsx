import { StyleSheet, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { Portal, PortalHost } from "react-native-teleport";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MenuButton from "./MenuButton";
import CloseButton from "./CloseButton";
import { type RefObject } from "react";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export type CardMenuAction = {
  label: string;
  destructive?: boolean;
  onPress: () => void;
};

type CardMenuProps = {
  isOverlayVisible: boolean;
  isMenuOpen: boolean;
  actions: CardMenuAction[];
  blurTargetRef: RefObject<View | null>;
  onRequestClose: () => void;
  onExited: () => void;
};

const CardMenu = ({
  isOverlayVisible,
  isMenuOpen,
  actions,
  blurTargetRef,
  onRequestClose,
  onExited,
}: CardMenuProps) => {
  const { top: topInset } = useSafeAreaInsets();

  if (!isOverlayVisible) {
    return null;
  }

  return (
    <Portal hostName="overlay">
      {isMenuOpen && (
        <AnimatedBlurView
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)
            .delay(450)
            .withCallback((finished) => {
              if (finished) {
                scheduleOnRN(onExited);
              }
            })}
          style={styles.overlayWrapper}
          blurMethod="dimezisBlurViewSdk31Plus"
          intensity={50}
          blurTarget={blurTargetRef}
        />
      )}

      <View style={[styles.teleportedCardWrapper, { paddingTop: topInset }]}>
        <PortalHost name="card" style={styles.teleportedCard} />
        <View style={styles.menuWrapper}>
          {isMenuOpen &&
            actions.map((action, idx) => (
              <MenuButton
                key={`button-${idx}`}
                index={idx}
                label={action.label}
                destructive={action.destructive}
                onPress={action.onPress}
              />
            ))}
          {isMenuOpen && <CloseButton onPress={onRequestClose} />}
        </View>
      </View>
    </Portal>
  );
};

const styles = StyleSheet.create({
  overlayWrapper: {
    flex: 1,
  },
  teleportedCard: {
    zIndex: 11,
    width: "100%",
    height: 250,
    paddingHorizontal: 16,
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
});

export default CardMenu;
