import { Asset } from "expo-asset";
import { ImageSourcePropType } from "react-native";

import card01 from "./assets/images/cards/card_01.png";
import card02 from "./assets/images/cards/card_02.png";
import card03 from "./assets/images/cards/card_03.png";
import card04 from "./assets/images/cards/card_04.png";
import card05 from "./assets/images/cards/card_05.png";
import card06 from "./assets/images/cards/card_06.png";
import card07 from "./assets/images/cards/card_07.png";
import card08 from "./assets/images/cards/card_08.png";
import card09 from "./assets/images/cards/card_09.png";
import card10 from "./assets/images/cards/card_10.png";
import card11 from "./assets/images/cards/card_11.png";
import card12 from "./assets/images/cards/card_12.png";
import card13 from "./assets/images/cards/card_13.png";
import card14 from "./assets/images/cards/card_14.png";
import card15 from "./assets/images/cards/card_15.png";
import card16 from "./assets/images/cards/card_16.png";
import card17 from "./assets/images/cards/card_17.png";
import card18 from "./assets/images/cards/card_18.png";
import card19 from "./assets/images/cards/card_19.png";
import card20 from "./assets/images/cards/card_20.png";
import card21 from "./assets/images/cards/card_21.png";
import card22 from "./assets/images/cards/card_22.png";
import card23 from "./assets/images/cards/card_23.png";

const CARD_IMAGE_MODULES = [
  card01,
  card02,
  card03,
  card04,
  card05,
  card06,
  card07,
  card08,
  card09,
  card10,
  card11,
  card12,
  card13,
  card14,
  card15,
  card16,
  card17,
  card18,
  card19,
  card20,
  card21,
  card22,
  card23,
] as const satisfies ImageSourcePropType[];

const CARD_IMAGES: string[] = CARD_IMAGE_MODULES.map((module) => {
  const mod = Asset.fromModule(module);
  return mod.localUri ?? mod.uri;
});

const V_OFFSET = 45;

export { CARD_IMAGES, V_OFFSET };
