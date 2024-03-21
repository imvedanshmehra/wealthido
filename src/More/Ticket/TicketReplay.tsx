import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Platform,
  SafeAreaView,
  Image,
  StatusBar,
} from "react-native";
import {
  NavigationProp,
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { useContext, useEffect, useState } from "react";
import React from "react";
import { Divider } from "react-native-paper";
import ShowAlertMessage from "../../Popup/showAlertMessage";
import { ThemeContext } from "../../Networking/themeContext";
import colors, { dark, light } from "../../colors";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "../../Extension/ScreenUtils";
import WealthidoFonts from "../../Helpers/WealthidoFonts";
import Loader from "../../Loader";
import BackImage from "../../assets/images/back.svg";
import WhiteBackImage from "../../assets/images/WhiteBack.svg";
import serverCommunication from "../../Networking/serverCommunication";
import URLConstants from "../../Networking/URLConstants";
import { TicketResponseModel } from "./Model/TicketResponseModel";
import HTTPStatusCode from "../../Networking/HttpStatusCode";
import {
  TicketResponseImage,
  TicketResponseMessageList,
} from "./Model/TicketResponseData";
import { DateFormatType, DobDate } from "../../Extension/DateFormatType";
import Modal from "react-native-modal";
import FastImage from "react-native-fast-image";
import MainHeaderView from "../../MainHeaderView";
import strings from "../../Extension/strings";

export type TicketDetailsParams = {
  id?: number;
  ticketId?: string;
  status?: string;
  title: string;
  category: string;
};

const TicketReplay = () => {
  const navigation: NavigationProp<any> = useNavigation();
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();
  const { theme } = useContext(ThemeContext);
  const colored = theme === "dark" ? dark : light;
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupTitle, setPopupTitle] = useState("");
  const route = useRoute();
  const params = route.params as TicketDetailsParams;
  const [response, setTicketDetailsResponse] =
    useState<TicketResponseModel | null>(null);
  const [selectedImage, setSelectedItem] =
    useState<TicketResponseMessageList | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const [selectedtype, setSelectedType] = useState<string | null>(null);
  const [isAlertVisible, setIsAlertVisible] = useState(false);

  const showTextPopup = async (title: string, message: string) => {
    setPopupVisible(true);
    setPopupTitle(title);
    setPopupMessage(message);
    return true;
  };

  const showModal = (
    type: string,
    selectedItem: TicketResponseMessageList,
    selectedIndex: number
  ) => {
    setIsAlertVisible(true);
    setSelectedType(type);
    setSelectedItem(selectedItem);
    setSelectedIndex(selectedIndex);
  };

  const hideModal = () => {
    setIsAlertVisible(false);
  };

  useEffect(() => {
    if (isFocused) {
      getTicketDetails();
    }
  }, [isFocused]);

  const getTicketDetails = async () => {
    setLoading(true);
    try {
      await serverCommunication.getApi(
        `${URLConstants.getTicketDetails}${params.id}`,
        (statusCode: any, responseData: TicketResponseModel, error: any) => {
          if (statusCode === HTTPStatusCode.ok) {
            setTicketDetailsResponse(responseData);
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
  type ImageParams = {
    title: string;
    url?: string; // Make url optional since it's conditionally added
  };

  const ImageUpload = (
    image: TicketResponseImage | null
  ): React.ReactNode | null => {
    if (!image || !image.file) {
      // If image is empty or file is null, return null to avoid rendering UI
      return null;
    }
    return (
      <View style={styles.boxContainer}>
        <View style={[styles.selectedImageStyle, { position: "absolute" }]}>
          {image?.fileType == "image/jpeg" || image?.fileType == "image/png" ? (
            <FastImage
              source={{
                uri: `${URLConstants.Image_URL}${image?.file}`,
                priority: FastImage.priority.high,
              }}
              style={styles.selectedImageStyle}
            />
          ) : (
            <Image
              source={require("../../assets/images/pdf.png")}
              style={styles.selectedPdfStyle}
            />
          )}
        </View>
      </View>
    );
  };

  const showImage = (
    item: TicketResponseMessageList,
    selectedIndex: number,
    type: string
  ) => {
    const image = item?.image;

    if (!image || !Array.isArray(image) || image.length === 0) {
      return;
    }

    const selectedImage = image[selectedIndex];
    const fileType = selectedImage?.fileType;

    switch (fileType) {
      case "image/jpeg":
      case "image/png":
        showModal(type, item, selectedIndex);
        break;
      case "application/pdf":
        navigateToPdfViewer(selectedImage.file);
        break;
      case "application/msword":
        navigateToDocumentViewer(selectedImage.file);
        break;
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        navigateToDocumentViewer(selectedImage.file);
        break;
      default:
        navigateToDocumentViewer(selectedImage.file);
    }
  };

  const navigateToPdfViewer = (pdfUrl: string) => {
    let params: ImageParams = {
      title: "Raise Ticket",
      url: `${URLConstants.Image_URL}${pdfUrl}`,
    };
    navigation.navigate("PdfViewer", params);
  };

  const navigateToDocumentViewer = (docUrl: string) => {
    let params: ImageParams = {
      title: "Raise Ticket",
      url: `${URLConstants.Image_URL}${docUrl}`,
    };
    navigation.navigate("DocumentViewer", params);
  };

  const renderItem = (item: TicketResponseMessageList): React.JSX.Element => {
    return (
      <View style={styles.mainCard}>
        <View style={styles.itemCard}>
          <View style={styles.justifyCard}>
            <View style={styles.rowContainer}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={styles.textContainer}>
                  <Text style={styles.textContainerletter}>
                    {item?.username && item.username[0]}
                  </Text>
                </View>
                <Text
                  style={styles.nameText}
                  ellipsizeMode="tail"
                  numberOfLines={1}
                >
                  {item.username}
                </Text>
              </View>
              <Text style={styles.dateText}>
                {item.createdAt?.toString() &&
                  DobDate(item.createdAt.toString(), DateFormatType.emailTime)}
              </Text>
            </View>
            <Text style={styles.descriptionText}>{item.description} </Text>
          </View>
          <View
            style={{ flexDirection: "row", gap: ratioWidthBasedOniPhoneX(4) }}
          >
            {/* Render first two images */}
            {item.image?.slice(0, 2).map((image, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => showImage(item, index, "Image")}
              >
                {ImageUpload(image)}
              </TouchableOpacity>
            ))}
          </View>
          <View
            style={{
              flexDirection: "row",
              gap: ratioWidthBasedOniPhoneX(4),
            }}
          >
            {item.image?.[2] && (
              <TouchableOpacity onPress={() => showImage(item, 2, "Image")}>
                {ImageUpload(item.image[2])}
              </TouchableOpacity>
            )}
          </View>
          <Divider style={{ marginTop: ratioHeightBasedOniPhoneX(15) }} />
        </View>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === "light" ? colored.white : colored.FilterBg,
    },
    headerContent: {
      height: ratioHeightBasedOniPhoneX(50),
      paddingHorizontal: ratioWidthBasedOniPhoneX(16),
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    centerContainer: {
      flex: 1,
    },
    image: {
      height: ratioHeightBasedOniPhoneX(20),
      width: ratioWidthBasedOniPhoneX(20),
    },
    headerTitle: {
      textAlign: "center",
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(16)),
    },

    iconImage: {
      height: ratioHeightBasedOniPhoneX(32),
      width: ratioHeightBasedOniPhoneX(32),
      borderRadius: ratioHeightBasedOniPhoneX(32),
    },
    bodyContainer: {
      padding: ratioHeightBasedOniPhoneX(20),
    },
    listBg: {
      backgroundColor: colored.headerColor,
      flex: 1,
    },
    card: {
      backgroundColor: colored.cardBackGround,
      padding: ratioHeightBasedOniPhoneX(15),
      height: ratioHeightBasedOniPhoneX(90),
      borderRadius: ratioHeightBasedOniPhoneX(5),
      marginHorizontal: ratioHeightBasedOniPhoneX(20),
      marginTop: ratioHeightBasedOniPhoneX(10),
      marginBottom: ratioHeightBasedOniPhoneX(15),
      borderWidth: theme !== "dark" ? undefined : ratioHeightBasedOniPhoneX(1),
      borderColor: "#4C4C55",
    },
    mainCard: {
      marginHorizontal: ratioHeightBasedOniPhoneX(20),
      marginVertical: ratioHeightBasedOniPhoneX(8),
    },
    itemCard: {
      backgroundColor:
        theme === "light" ? colored.cardBackGround : "transparent",
    },
    justifyCard: {
      flex: 1,
      flexDirection: "column",
    },
    cardInner: {
      justifyContent: "space-between",
      flexDirection: "row",
      alignItems: "center",
    },
    cardImage: {
      marginRight: ratioWidthBasedOniPhoneX(10),
    },
    inProgress: {
      width: "auto",
      paddingHorizontal: ratioWidthBasedOniPhoneX(10),
      paddingVertical: ratioHeightBasedOniPhoneX(4),
      borderRadius: ratioHeightBasedOniPhoneX(10),
      overflow: "hidden",
      alignItems: "center",
      color: colors.white,
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(12)),
    },
    subTitle: {
      color: colored.textColor,
      ...WealthidoFonts.extraBoldFont(ratioHeightBasedOniPhoneX(16)),
    },
    category: {
      color: colored.textColor,
      ...WealthidoFonts.extraBoldFont(ratioHeightBasedOniPhoneX(12)),
      marginVertical: ratioHeightBasedOniPhoneX(10),
    },
    subTitleEnd: {
      color: colored.lightText,
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(14)),
    },
    descriptionText: {
      color: colored.dimGray,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },
    button: {
      borderColor: colors.orange,
      borderWidth: ratioHeightBasedOniPhoneX(1),
      height: ratioHeightBasedOniPhoneX(40),
      justifyContent: "center",
      borderRadius: ratioHeightBasedOniPhoneX(24),
      marginTop: ratioHeightBasedOniPhoneX(16),
      padding: ratioHeightBasedOniPhoneX(1),
    },
    buttonText: {
      color: colors.orange,
      textAlign: "center",
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(16)),
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
      shadowColor: "black",
      elevation: 8,
    },
    bottomContainer: {
      flexDirection: "column",
      justifyContent: "space-between",
      width: ratioWidthBasedOniPhoneX(378),
      height: ratioHeightBasedOniPhoneX(80),
      backgroundColor:
        theme === "light" ? colored.headerColor : colored.darkheaderColor,
      paddingHorizontal: ratioWidthBasedOniPhoneX(20),
      borderTopWidth:
        theme !== "dark" ? undefined : ratioHeightBasedOniPhoneX(1),
      borderColor: "#222528",
      ...Platform.select({
        ios: {
          shadowColor: colors.black,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
        },
        android: {
          elevation: 13,
          shadowColor: colors.black,
        },
      }),
    },
    raiseTicketButton: {
      marginVertical: ratioHeightBasedOniPhoneX(16),
      backgroundColor: colors.orange,
      justifyContent: "center",
      borderRadius: ratioHeightBasedOniPhoneX(24),
      height: ratioHeightBasedOniPhoneX(48),
    },
    rowContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      alignContent: "center",
      gap: ratioWidthBasedOniPhoneX(4),
      marginTop: ratioHeightBasedOniPhoneX(6),
      marginBottom: ratioHeightBasedOniPhoneX(16),
    },

    textContainer: {
      overflow: "hidden",
      height: ratioHeightBasedOniPhoneX(30),
      width: ratioWidthBasedOniPhoneX(30),
      borderRadius: ratioHeightBasedOniPhoneX(50),
      backgroundColor: theme === "light" ? colors.bgGrey : colored.cardImagebg,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    textContainerletter: {
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(14)),
      color: theme === "light" ? colors.black : colors.inactivegrey,
    },
    nameText: {
      color: colored.textColor,
      marginTop: ratioHeightBasedOniPhoneX(-3),
      marginLeft: ratioHeightBasedOniPhoneX(5),
      width: "60%",
      overflow: "hidden",
      textAlign: "left",
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(12)),
    },
    dateText: {
      color: colors.dimGray,
      textAlign: "center",
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(10)),
    },
    modalTouchable: {
      flex: 1,
      justifyContent: "center",
    },
    imageView: {
      marginHorizontal: ratioWidthBasedOniPhoneX(50),
      height: ratioHeightBasedOniPhoneX(280),
      width: ratioWidthBasedOniPhoneX(250),
      backgroundColor: "transparent",
      alignItems: "center", // Center the image horizontally
      justifyContent: "center",
    },
    boxContainer: {
      width: ratioWidthBasedOniPhoneX(168),
      height: ratioHeightBasedOniPhoneX(90),
      marginTop: ratioHeightBasedOniPhoneX(16),
      borderRadius: ratioHeightBasedOniPhoneX(8),
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme === "light" ? colored.cardImagebg : "#E0E0E0",
    },
    selectedImageStyle: {
      height: ratioHeightBasedOniPhoneX(90),
      width: ratioWidthBasedOniPhoneX(80),
      resizeMode: "contain",
    },
    selectedPdfStyle: {
      height: ratioHeightBasedOniPhoneX(32),
      width: ratioWidthBasedOniPhoneX(32),
      marginTop: ratioHeightBasedOniPhoneX(30),
      marginLeft: ratioHeightBasedOniPhoneX(22),
      resizeMode: "contain",
      zIndex: 10,
    },
  });

  const renderBottomContainer = () => {
    return (
      <View style={[styles.bottomContainer]}>
        <TouchableOpacity
          style={styles.raiseTicketButton}
          onPress={() =>
            navigation.navigate("TicketRaiseScreen", {
              id: params?.id,
              title: "Reply",
              ticketTitle: params?.title,
              category: params?.category,
            })
          }
        >
          <Text style={[styles.buttonText, { color: colors.white }]}>
            Reply
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
      />
      <MainHeaderView
        title={response?.data?.ticketId ?? ""}
        showImage={false}
        closeApp={false}
        bottomBorderLine={false}
        whiteTextColor={false}
      />
      <View
        style={[
          styles.card,
          Platform.OS === "ios" ? styles.iosShadow : styles.androidShadow,
        ]}
      >
        <View style={styles.justifyCard}>
          <View style={styles.cardInner}>
            <Text style={styles.subTitle}>{response?.data?.title}</Text>
            <Text
              style={[
                styles.inProgress,
                { backgroundColor: colors.borderYellow },
              ]}
            >
              {response?.data?.status}
            </Text>
          </View>
          <Divider
            style={{
              marginTop: ratioHeightBasedOniPhoneX(10),
              backgroundColor: colors.chartdata,
            }}
          />
          <Text style={styles.category}>{response?.data?.category}</Text>
        </View>
      </View>
      <View style={styles.listBg}>
        <FlatList
          data={response?.data?.messageList}
          renderItem={({ item }) => renderItem(item)}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item: any) => item.id}
        ></FlatList>

        {params.status != "Completed" && renderBottomContainer()}
        <Modal isVisible={isAlertVisible} backdropOpacity={0.5}>
          <TouchableOpacity
            style={styles.modalTouchable}
            onPress={hideModal}
            activeOpacity={1}
          >
            <View style={styles.imageView}>
              {selectedImage &&
                selectedImage.image &&
                selectedIndex !== null &&
                selectedIndex >= 0 &&
                selectedIndex < selectedImage.image.length && (
                  <FastImage
                    source={{
                      uri: `${URLConstants.Image_URL}${selectedImage.image[selectedIndex].file}`,
                      priority: FastImage.priority.high,
                    }}
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                  />
                )}
            </View>
          </TouchableOpacity>
        </Modal>

        <Loader loading={loading} />
        <ShowAlertMessage
          isVisible={isPopupVisible}
          title={popupTitle}
          message={popupMessage}
          onClose={() => setPopupVisible(false)}
        />
      </View>
    </View>
  );
};

export default TicketReplay;
