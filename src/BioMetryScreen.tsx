import { useState, useEffect } from "react";
import { Platform } from "react-native";
import FingerprintScanner from "react-native-fingerprint-scanner";
import { useNavigation } from "@react-navigation/native";
import RNExitApp from "react-native-exit-app";

const BiometryScreen = () => {
  const [biometryType, setBiometryType] = useState<string | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    checkSensorAvailability();
  }, []);

  const checkSensorAvailability = async () => {
    try {
      const type = await FingerprintScanner.isSensorAvailable();
      setBiometryType(type);
      showAuthenticationDialog();
    } catch (error) {}
  };

  const getMessage = () => {
    return biometryType === "Face ID"
      ? "Scan your Face on the device to continue"
      : "Scan your Fingerprint on the device scanner to continue";
  };

  const platformMessage = () => {
    return Platform.OS === "ios"
      ? getMessage()
      : "Scan your Biometrics on the device scanner to continue";
  };

  const showAuthenticationDialog = async () => {
    FingerprintScanner.authenticate({
      description: platformMessage(),
    })
      .then((value) => {
        navigation.goBack();
      })
      .catch((error) => {
        RNExitApp.exitApp();
      })
      .finally(() => {
        FingerprintScanner.release();
      });
  };
};

export default BiometryScreen;
