import { Dimensions } from "react-native";

const ratioHeightBasedOniPhoneX = (val: number) => {
  const screenHeight = Dimensions.get("window").height;
  return screenHeight * (val / 812);
  // return val;
};

const ratioWidthBasedOniPhoneX = (val: number) => {
  const screenWidth = Dimensions.get("window").width;
  return screenWidth * (val / 375);
  // return val;
};

export { ratioHeightBasedOniPhoneX, ratioWidthBasedOniPhoneX };
