import { AppRegistry, Platform } from "react-native";
import { name as appName } from "./app.json";
import App from "./src/App";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from "react-native-push-notification";
import { Provider as PaperProvider } from "react-native-paper";

if (Platform.OS === "ios") {
  // Must be outside of any component LifeCycle (such as `componentDidMount`).
  PushNotification.configure({
    onNotification: function (notification) {
      console.log("NOTIFICATION:", notification);
      const { foreground, userInteraction, title, message } = notification;
      if (foreground && (title || message) && !userInteraction)
        PushNotification.localNotification(notification);
      notification.finish(PushNotificationIOS.FetchResult.NoData);
    },
  });
}

export default function Main() {
  return (
    <PaperProvider>
      <App />
    </PaperProvider>
  );
}

AppRegistry.registerComponent(appName, () => Main);
