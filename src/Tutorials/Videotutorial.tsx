import React, { useContext, useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemeContext } from "../Networking/themeContext";
import colors, { dark, light } from "../colors";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "../Extension/ScreenUtils";
import { useIsFocused } from "@react-navigation/native";
import {
  TutorialModelResponse,
  TutorialModelResponseDatum,
} from "./TutorialModel";
import serverCommunication from "../Networking/serverCommunication";
import URLConstants from "../Networking/URLConstants";
import HTTPStatusCode from "../Networking/HttpStatusCode";
import Loader from "../Loader";
import { Divider } from "react-native-paper";
import WealthidoFonts from "../Helpers/WealthidoFonts";
import ShowAlertMessage from "../Popup/showAlertMessage";
import strings from "../Extension/strings";

/**
 * React functional component that displays a list of tutorial videos or blog posts based on the `status` prop.
 * It fetches the data from a server and renders the list using a `FlatList` component.
 * It also handles loading state and displays a loader component while fetching the data.
 *
 * @component
 * @example
 * <VideoTutorial status="Blog" />
 *
 * @param {string} status - The status of the tutorial content to fetch. It can be either "Blog" or "Video".
 * @returns {ReactElement} The rendered component
 */
const VideoTutorial: React.FC<{ status: string }> = ({ status }) => {
  const { theme } = useContext(ThemeContext);
  const colored = theme === "dark" ? dark : light;
  const isFocused = useIsFocused();
  const [tutorialResoponse, setTutorialResponse] =
    useState<TutorialModelResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupTitle, setPopupTitle] = useState("");

  const showTextPopup = async (title: string, message: string) => {
    setPopupVisible(true);
    setPopupTitle(title);
    setPopupMessage(message);
    return true;
  };

  useEffect(() => {
    if (isFocused) {
      const getTutorialList = async () => {
        const dataVideo = {
          category: "VIDEO",
        };
        const dataBlog = {
          category: "BLOG",
        };
        setLoading(true);
        try {
          await serverCommunication.postApi(
            URLConstants.getTutorial,
            status == "Blog" ? dataBlog : dataVideo,
            (
              statusCode: number,
              responseData: TutorialModelResponse,
              error: any
            ) => {
              if (!error) {
                if (responseData.status == HTTPStatusCode.ok) {
                  setTutorialResponse(responseData);
                }
              } else {
                showTextPopup(strings.error, responseData?.message ?? "");
              }
            }
          );
        } catch (error) {
          showTextPopup(strings.error, strings.defaultError);
        } finally {
          setLoading(false);
        }
      };
      getTutorialList();
    }
  }, [isFocused]);

  const renderItem = (data: TutorialModelResponseDatum, index: number) => {
    const isLastItem = index === tutorialResoponse?.data.length - 1;
    return (
      <View
        style={{
          justifyContent: "center",
          marginBottom: ratioHeightBasedOniPhoneX(16),
        }}
      >
        <TouchableOpacity
          style={styles.row}
          onPress={() => {
            Linking.openURL(data.link);
          }}
        >
          <Text style={styles.titleText}>{data.title ? data.title : "-"}</Text>
          <Image
            source={require("../assets/images/external_link.png")}
            style={styles.image}
          />
        </TouchableOpacity>
        {isLastItem ? null : (
          <View style={styles.divider}>
            <Divider />
          </View>
        )}
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colored.background,
    },
    subcontainer: {
      marginTop: ratioHeightBasedOniPhoneX(15),
      marginHorizontal: ratioWidthBasedOniPhoneX(20),
      height: "auto",
      flex: 1,
      backgroundColor: colored.headerColor,
      paddingHorizontal: ratioWidthBasedOniPhoneX(24),
      paddingVertical: ratioHeightBasedOniPhoneX(24),
      borderRadius: ratioHeightBasedOniPhoneX(8),
      marginBottom: ratioHeightBasedOniPhoneX(17),
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    titleText: {
      color: colored.textColor,
      width: ratioWidthBasedOniPhoneX(267),
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(14)),
    },
    image: {
      height: ratioHeightBasedOniPhoneX(20),
      width: ratioWidthBasedOniPhoneX(20),
      resizeMode: "contain",
    },
    divider: {
      position: "relative",
      marginTop: ratioHeightBasedOniPhoneX(15),
      color: colored.shadowColor,
      height: ratioHeightBasedOniPhoneX(2),
    },
    NoData: {
      color: colored.black,
      textAlign: "center",
      alignContent: "center",
      marginTop: ratioHeightBasedOniPhoneX(130),
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(20)),
    },
    iosShadow: {
      shadowColor: colors.black,
      shadowOffset: { width: 1, height: 1 },
      direction: "inherit",
      shadowOpacity: 0.2,
      shadowRadius: 3,
    },
    androidShadow: {
      shadowColor: colors.black,
      elevation: 1,
    },
    containeriosShadow: {
      shadowColor: colors.black,
      shadowOffset: { width: 1, height: 2 },
      direction: "inherit",
      shadowOpacity: 0.23,
      shadowRadius: 3,
    },
    containeandroidShadow: {
      shadowColor: colors.black,
      elevation: 8,
    },
  });

  return (
    <>
      {
        <View style={styles.container}>
          <View
            style={[
              styles.subcontainer,
              Platform.OS == "android"
                ? styles.containeandroidShadow
                : styles.containeriosShadow,
            ]}
          >
            {tutorialResoponse?.data && tutorialResoponse.data.length == 0 ? (
              <Text style={styles.NoData}>No Data</Text>
            ) : (
              <FlatList
                data={tutorialResoponse?.data}
                renderItem={({ item, index }) => renderItem(item, index)}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.id.toString()}
              ></FlatList>
            )}
          </View>
          <ShowAlertMessage
            isVisible={isPopupVisible}
            title={popupTitle}
            message={popupMessage}
            onClose={() => setPopupVisible(false)}
          />
          <Loader loading={loading} />
        </View>
      }
    </>
  );
};

export default VideoTutorial;
