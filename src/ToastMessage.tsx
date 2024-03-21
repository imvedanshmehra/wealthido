import Toast from "react-native-toast-message";

/**
 * Displays a toast message using the `react-native-toast-message` library.
 *
 * @param message - The message to be displayed in the toast.
 * @returns void
 */
const ToastMessage = (message: string): void => {
  Toast.show({
    type: "error",
    text1: message,
    position: "bottom",
    visibilityTime: 3000,
    autoHide: true, // Auto-hide the toast after the specified visibilityTime
    topOffset: 30, // Offset from the top (useful if you want to show the toast at the bottom)
    bottomOffset: 40,
    props: {
      text1NumberOfLines: 2,
    },
    onShow: () => {},
    onHide: () => {},
  });
};

export default ToastMessage;
