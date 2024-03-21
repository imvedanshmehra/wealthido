import React, { useEffect, useRef, useState } from "react";
import LottieView from "lottie-react-native";
import { ratioWidthBasedOniPhoneX } from "../Extension/ScreenUtils";
import StorageService from "../StorageService";
import { setupNotificationListeners } from "../PushNotification/PushNotification";
import SplashScreen from "react-native-splash-screen";
import deviceInfo from "react-native-device-info";
import messaging from "@react-native-firebase/messaging";
import { LoginResponseModel } from "../LoginScreen/Modal/LoginResponseModel";
import { useNavigation } from "@react-navigation/native";
import colors from "../colors";
import { PermissionsAndroid, Platform, StatusBar } from "react-native";
import TokenManager from "../TokenManager";

const Splash = () => {
  const animationView = useRef<LottieView>(null);
  const [token, setToken] = useState("");
  const [initialTokenLoaded, setInitialTokenLoaded] = useState(false);
  const initialLoginResponse: LoginResponseModel = {};
  const [response, setResponse] = useState(initialLoginResponse);
  const navigation = useNavigation();

  const playBirdAnimation = () => {
    animationView.current?.play();
  };
  useEffect(() => {
    playBirdAnimation();
  }, []);

  useEffect(() => {
    const getToken = async () => {
      const storedToken = TokenManager.getToken();
      const LoginResponseData = await StorageService.getIsLogin();
      if (LoginResponseData !== null) {
        setResponse(LoginResponseData);
      }

      setToken(storedToken);

      setInitialTokenLoaded(true);
    };

    const fetchDeviceId = async () => {
      const deviceID = await deviceInfo.getUniqueId();
      await StorageService.setIsDeviceId(deviceID);
      SplashScreen.hide();
    };

    const requestPushNotificationPermission = async (): Promise<void> => {
      try {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.NOT_DETERMINED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        if (enabled) {
          await refreshFcmToken();
        }
      } catch (error) {
        console.error("Notification permission error:", error);
      }
    };

    const refreshFcmToken = async () => {
      try {
        const newFcmToken = await messaging().getToken();
        if (newFcmToken) {
          await StorageService.setIsFcmtoken(newFcmToken);
        } else {
        }
      } catch (error) {
        console.error("Error updating token:", error);
      }
    };

    const checkNotificationPermission = async () => {
      if (Platform.OS === "android") {
        try {
          await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
          );
        } catch (error) {}
      }
    };

    requestPushNotificationPermission();
    setupNotificationListeners();
    checkNotificationPermission();
    getToken();
    fetchDeviceId();
  }, []);

  if (!initialTokenLoaded) {
    return null;
  }
  return (
    <>
      <StatusBar
        barStyle={"light-content"}
        backgroundColor={"transparent"}
        translucent={true}
      />
      <LottieView
        ref={animationView}
        style={{
          backgroundColor: colors.white,
          flex: 1,
          width: ratioWidthBasedOniPhoneX(375),
        }}
        source={require("./Finance_Splash.json")}
        enableMergePathsAndroidForKitKatAndAbove
        autoPlay
        loop={false}
        resizeMode={"cover"}
        onAnimationFinish={async (status) => {
          if (status == false) {
            if (token && response.data?.fingerprint === true) {
              navigation.navigate("BioMetryScreens", { tag: "1" });
            } else if (token && response.data?.isVerified === true) {
              navigation.reset({
                index: 0,
                routes: [{ name: "MainTab" }],
              });
            } else {
              const firstTime = await StorageService.getOnboarding();
              if (firstTime == true) {
                if (response.data != null) {
                  navigation.reset({
                    index: 0,
                    routes: [{ name: "BiometricLoginScreen" }],
                  });
                } else {
                  navigation.reset({
                    index: 0,
                    routes: [{ name: "Logins" }],
                  });
                }
              } else {
                navigation.reset({
                  index: 0,
                  routes: [{ name: "OnboardingScreen" }],
                });
              }
            }
          }
        }}
      />
    </>
  );
};

export default Splash;
