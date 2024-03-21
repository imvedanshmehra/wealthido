import messaging from "@react-native-firebase/messaging";
import PushNotification from "react-native-push-notification";

/**
 * Sets up notification listeners for a React Native app.
 */
export const setupNotificationListeners = (): void => {
  messaging().onMessage(async (remoteMessage) => {
    const { title, body } = remoteMessage.notification;
    showLocalNotification(title, body);
  });

  messaging().setBackgroundMessageHandler(async (remoteMessage) => {});

  messaging().onNotificationOpenedApp((remoteMessage) => {});

  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      if (remoteMessage) {
      }
    });
};

export const showLocalNotification = (title, body) => {
  PushNotification.localNotification({
    title: title,
    message: body,
  });
};
