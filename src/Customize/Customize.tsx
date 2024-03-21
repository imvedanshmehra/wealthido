import { useRoute } from "@react-navigation/native";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemeContext } from "../Networking/themeContext";
import { useContext, useState } from "react";
import colors, { dark, light } from "../colors";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import MainHeaderView from "../MainHeaderView";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "../Extension/ScreenUtils";
import WealthidoFonts from "../Helpers/WealthidoFonts";
import BiometricThumb from "../assets/images/biometricThumb.svg";
import { Switch } from "react-native-paper";
import FaceImage from "../assets/images/face_idCustom.svg";
import PushImage from "../assets/images/pushNotification.svg";
import EmailImage from "../assets/images/email_Image.svg";
import serverCommunication from "../Networking/serverCommunication";
import URLConstants from "../Networking/URLConstants";
import HTTPStatusCode from "../Networking/HttpStatusCode";
import { handleResponse } from "../Biometric/BiometricController";
import { BiometricAuthRequestModel } from "../Biometric/Model/BiometricAuthRequestModel";
import Loader from "../Loader";
import FingerprintScanner from "react-native-fingerprint-scanner";
import { LoginResponseModel } from "../LoginScreen/Modal/LoginResponseModel";
import ReactNativeBiometrics from "react-native-biometrics";
import OldDeviceLoginAlert from "../Popup/OldDeviceLoginAlert";
import ShowAlertMessage from "../Popup/showAlertMessage";
import strings from "../Extension/strings";

interface CustomizeParams {
  data: LoginResponseModel;
  type: string;
}

const Customize = () => {
  const route = useRoute();
  const { data, type } = route.params as CustomizeParams;
  const { theme } = useContext(ThemeContext);
  const colored = theme === "dark" ? dark : light;
  const [loading, setLoading] = useState(false);
  const [biometryType, setBiometryType] = useState<string | null>(null);
  const rnBiometrics = new ReactNativeBiometrics();
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupTitle, setPopupTitle] = useState("");
  const [pushNotificationDisable, setPushNotificationDisable] = useState(false);
  const [disableID, setDisableID] = useState(0);
  const [
    pushNotificationDisablePopupMessage,
    setPushNotificationDisablePopupMessage,
  ] = useState("");

  const [dataSet, setDataSet] = useState([
    {
      id: 2,
      customizeText:
        Platform.OS === "ios" && type == "Face ID" ? "Face Id" : "Biometric",
      imageUrl:
        Platform.OS === "ios" && type == "Face ID" ? (
          <FaceImage
            color={theme === "light" ? colors.lightblack : "#C1C3CB"}
          />
        ) : (
          <BiometricThumb color={theme === "light" ? "#151515" : "#C1C3CB"} />
        ),
      selected: data.data?.enableFingerOrFaceLock,
    },
    {
      id: 3,
      customizeText: "Push Notifications",
      imageUrl: (
        <PushImage color={theme === "light" ? colors.lightblack : "#C1C3CB"} />
      ),
      selected: data.data?.enableNotifications,
    },
    {
      id: 4,
      customizeText: "Email Notifications",
      imageUrl: (
        <EmailImage color={theme === "light" ? colors.lightblack : "#C1C3CB"} />
      ),
      selected: data.data?.enableEmailNotification,
    },
  ]);

  const platform = () => {
    return Platform.OS === "ios"
      ? getMessage()
      : "Scan your Biometrics on the device scanner to continue";
  };

  const getMessage = () => {
    return biometryType === "Face ID"
      ? "Scan your Face on the device to continue"
      : "Scan your Fingerprint on the device scanner to continue";
  };

  const Biometric = async (enable: boolean, updatedData: any) => {
    try {
      const type = await FingerprintScanner.isSensorAvailable();
      setBiometryType(type);
      FingerprintScanner.authenticate({
        description: platform(),
      })
        .then(async (value) => {
          const { publicKey } = await rnBiometrics.createKeys();

          const data = new BiometricAuthRequestModel(enable, false, publicKey);
          setDataSet(updatedData);
          handleResponse(data, setLoading, () => setLoading(false));
        })
        .catch((error) => {
          console.log("Fail");
        })
        .finally(() => {
          FingerprintScanner.release();
        });
    } catch (error) {}
  };

  const onToggleSwitch = (id: number) => {
    const updatedDataSet = dataSet.map((item) =>
      item.id === id ? { ...item, selected: !item.selected } : item
    );

    if (id === 2) {
      const filteredData = dataSet.filter((item) => item.id === 2);
      Biometric(!filteredData[0].selected, updatedDataSet);
    } else if (id === 3) {
      const filteredData = dataSet.filter((item) => item.id === 3);
      if (filteredData[0].selected) {
        setDisableID(3);
        showPushNotificationTextPopup(
          "We recommend you to enable this notifications settings to get the important updates"
        );
      } else {
        enableNotifications();
      }
    } else if (id === 4) {
      const filteredData = dataSet.filter((item) => item.id === 4);
      if (filteredData[0].selected) {
        setDisableID(4);
        showPushNotificationTextPopup(
          "We recommend you to enable this notifications settings to get the important updates"
        );
      } else {
        enableEmailNotification();
      }
    }
  };

  const showPushNotificationTextPopup = async (message: string) => {
    setPushNotificationDisable(true);
    return setPushNotificationDisablePopupMessage(message);
  };

  const showTextPopup = async (title: string, message: string) => {
    setPopupVisible(true);
    setPopupTitle(title);
    setPopupMessage(message);
    return true;
  };

  const enableFeature = async (
    url: any,
    id: number,
    property: string | number,
    setFunction: (
      arg0: {
        selected: any;
        id: number;
        customizeText: string;
        imageUrl: React.JSX.Element;
      }[]
    ) => void
  ) => {
    setDisableID(id);
    try {
      await serverCommunication.patchApi(
        url,
        [],
        (
          statusCode: any,
          responseData: { status: number; data: any; message: any },
          error: { message: any }
        ) => {
          if (!error && responseData.status === HTTPStatusCode.ok) {
            const updatedDataSet = dataSet.map((item) =>
              item.id === id
                ? { ...item, selected: responseData.data[property] }
                : item
            );
            setFunction(updatedDataSet);
          } else {
            showTextPopup(strings.error, responseData.message);
          }
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  const pushNotificationDisableButton = async () => {
    if (disableID == 3) {
      enableNotifications();
      setPushNotificationDisable(false);
    } else if (disableID == 4) {
      enableEmailNotification();
      setPushNotificationDisable(false);
    }
  };

  const enableNotifications = async () => {
    await enableFeature(
      URLConstants.enableNotifications,
      3,
      "enableNotifications",
      setDataSet
    );
  };

  const enableEmailNotification = async () => {
    await enableFeature(
      URLConstants.enableEmailNotification,
      4,
      "enableEmailNotification",
      setDataSet
    );
  };

  const renderItem = (
    {
      id,
      customizeText,
      imageUrl,
      selected,
    }: {
      id: any;
      customizeText: any;
      imageUrl: any;
      selected: any;
    },
    index: number
  ) => {
    return (
      <View>
        {id === 3 && <Text style={styles.notificationText}>Notifications</Text>}
        {
          <View style={styles.rowContainer}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              {imageUrl}
              <Text style={styles.subTitle}>{customizeText}</Text>
            </View>
            {Platform.OS == "ios" ? (
              <Switch
                value={selected}
                onValueChange={() => onToggleSwitch(id)}
                color="#FFFFFF"
                trackColor={{ false: "#A4A4A4", true: colors.orange }}
                style={{
                  transform: [{ scaleX: 0.94 }, { scaleY: 0.77 }],
                }}
              />
            ) : (
              <View>
                <TouchableOpacity
                  onPress={() => onToggleSwitch(id)}
                  style={[
                    selected === true
                      ? styles.outer
                      : [styles.outer, { backgroundColor: colors.bgGrey }],
                  ]}
                  activeOpacity={1}
                >
                  <View
                    style={
                      selected === true
                        ? styles.inner
                        : [
                            styles.inner,
                            {
                              backgroundColor: colors.white,
                              marginLeft: ratioHeightBasedOniPhoneX(3),
                            },
                          ]
                    }
                  ></View>
                </TouchableOpacity>
              </View>
            )}
          </View>
        }
      </View>
    );
  };

  const styles = StyleSheet.create({
    main: {
      backgroundColor: colored.blackColor,
      flex: 1,
    },
    container: {
      backgroundColor: colored.cardBackGround,
      flex: 1,
      marginHorizontal: ratioHeightBasedOniPhoneX(20),
      marginTop: ratioHeightBasedOniPhoneX(10),
      marginBottom: ratioHeightBasedOniPhoneX(15),
      paddingBottom: ratioHeightBasedOniPhoneX(20),
      borderRadius: ratioHeightBasedOniPhoneX(10),
    },
    content: {
      padding: ratioHeightBasedOniPhoneX(20),
    },
    title: {
      color: colored.textColor,
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(18)),
    },
    iosShadow: {
      shadowColor: colors.black,
      shadowOffset: { width: 0.2, height: 0.2 },
      shadowOpacity: 0.12,
      shadowRadius: 3,
    },
    androidShadow: {
      elevation: 4,
    },
    rowContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: ratioHeightBasedOniPhoneX(18),
      justifyContent: "space-between",
    },
    subTitle: {
      color: colored.textColor,
      marginLeft: ratioWidthBasedOniPhoneX(8),
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(14)),
    },

    inner: {
      width: ratioHeightBasedOniPhoneX(20),
      height: ratioHeightBasedOniPhoneX(20),
      backgroundColor: colors.white,
      borderRadius: ratioHeightBasedOniPhoneX(30),
      marginTop: ratioHeightBasedOniPhoneX(2),
      marginLeft: ratioHeightBasedOniPhoneX(25),
      elevation: ratioHeightBasedOniPhoneX(8),
      shadowOpacity: ratioHeightBasedOniPhoneX(0.5),
      shadowRadius: ratioHeightBasedOniPhoneX(2),
    },
    outer: {
      width: ratioHeightBasedOniPhoneX(48),
      height: ratioHeightBasedOniPhoneX(24),
      backgroundColor: colors.orange,
      borderRadius: ratioHeightBasedOniPhoneX(30),
    },

    notificationText: {
      color: colored.textColor,
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(18)),
      marginTop: ratioHeightBasedOniPhoneX(20),
    },
  });

  return (
    <SafeAreaView edges={["bottom"]} style={styles.main}>
      <MainHeaderView
        title="Customize"
        showImage={false}
        closeApp={false}
        bottomBorderLine={false}
        whiteTextColor={false}
      />
      <View
        style={[
          styles.container,
          Platform.OS === "ios" ? styles.iosShadow : styles.androidShadow,
        ]}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Security</Text>
          {dataSet.map((item, index) => renderItem(item, index))}
        </View>
      </View>
      <Loader loading={loading} />
      <ShowAlertMessage
        isVisible={popupVisible}
        title={popupTitle}
        message={popupMessage}
        onClose={() => setPopupVisible(false)}
      />
      <OldDeviceLoginAlert
        isVisible={pushNotificationDisable}
        message={pushNotificationDisablePopupMessage}
        onConfirm={pushNotificationDisableButton}
        onClose={() => setPushNotificationDisable(false)}
      />
    </SafeAreaView>
  );
};

export default Customize;
