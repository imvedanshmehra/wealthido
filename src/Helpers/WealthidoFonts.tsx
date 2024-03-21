const WealthidoFonts = {
  fonts: {
    Regular: "Manrope-Regular",
    Medium: "Manrope-Medium",
    SemiBold: "Manrope-SemiBold",
    ExtraBold: "Manrope-ExtraBold",
    Bold: "Manrope-Bold",
    Light: "Manrope-Light",
    ExtraLight: "Manrope-ExtraLight",
    OCRAExtended: "OCR A Extended Regular",
    GeorgiaBold: "Georgia Bold",
  },

  getFontStyle: (font: any, size = 20) => {
    return {
      fontFamily: font,
      fontSize: size,
    };
  },

  regularFont: (size = 20) => {
    return WealthidoFonts.getFontStyle(WealthidoFonts.fonts.Regular, size);
  },

  mediumFont: (size = 20) => {
    return WealthidoFonts.getFontStyle(WealthidoFonts.fonts.Medium, size);
  },

  semiBoldFont: (size = 20) => {
    return WealthidoFonts.getFontStyle(WealthidoFonts.fonts.SemiBold, size);
  },

  extraBoldFont: (size = 20) => {
    return WealthidoFonts.getFontStyle(WealthidoFonts.fonts.ExtraBold, size);
  },

  boldFont: (size = 20) => {
    return WealthidoFonts.getFontStyle(WealthidoFonts.fonts.Bold, size);
  },

  lightFont: (size = 20) => {
    return WealthidoFonts.getFontStyle(WealthidoFonts.fonts.Light, size);
  },

  extraLightFont: (size = 20) => {
    return WealthidoFonts.getFontStyle(WealthidoFonts.fonts.ExtraLight, size);
  },
  ocrAExtended: (size = 20) => {
    return WealthidoFonts.getFontStyle(WealthidoFonts.fonts.OCRAExtended, size);
  },
  georgiaBold: (size = 20) => {
    return WealthidoFonts.getFontStyle(WealthidoFonts.fonts.GeorgiaBold, size);
  },
};

export default WealthidoFonts;
