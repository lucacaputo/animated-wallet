import { type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";
import Image from "@d11/react-native-fast-image";

type CreditCardProps = {
  src: string;
  style?: StyleProp<ViewStyle>;
};

const CreditCard = ({ src, style }: CreditCardProps) => {
  return (
    <View style={[styles.cardWrapper, style]}>
      <Image
        source={{
          uri: src,
        }}
        resizeMode={Image.resizeMode.cover}
        style={{ flex: 1 }}
      />
    </View>
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
