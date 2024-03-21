import {
  Alert,
  FlatList,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemeContext } from "../../Networking/themeContext";
import { useContext, useEffect, useRef, useState } from "react";
import colors, { dark, light } from "../../colors";
import React from "react";
import MainHeaderView from "../../MainHeaderView";
import WealthidoFonts from "../../Helpers/WealthidoFonts";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "../../Extension/ScreenUtils";
import strings from "../../Extension/strings";
import ViewEye from "../../assets/images/ViewEye.svg";
import DeleteImage from "../../assets/images/DeleteImage.svg";
import Add from "../../assets/images/Add.svg";
import AddImage from "../../assets/images/AddImage.svg";
import ActionSheet from "react-native-custom-actionsheet";
import Modal from "react-native-modal";
import { Dropdown } from "react-native-element-dropdown";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { PERMISSIONS, RESULTS, request } from "react-native-permissions";
import DocumentPicker from "react-native-document-picker";
import serverCommunication from "../../Networking/serverCommunication";
import URLConstants from "../../Networking/URLConstants";
import Loader from "../../Loader";
import {
  NavigationProp,
  useIsFocused,
  useNavigation,
} from "@react-navigation/native";
import ShowAlertMessage from "../../Popup/showAlertMessage";
import { TextInput } from "react-native-paper";
import validation from "../../RegisterScreen/validation";
import HTTPStatusCode from "../../Networking/HttpStatusCode";
import FastImage from "react-native-fast-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { UploadResponseModel } from "./Model/UploadResponseModel";
import { UploadDocumentsAuthRequest } from "./Model/UploadDocumentsAuthRequest";

export type ImageUploadDataModel = {
  id?: string;
  image?: string;
  type?: string;
  fileType?: string;
  imageType?: string;
  selfie?: boolean;
};

const UploadAllDocument = () => {
  const { theme } = useContext(ThemeContext);
  const colored = theme === "dark" ? dark : light;
  const isFocused = useIsFocused();
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [selectedError, setSelectedError] = useState("");
  const [selectedUploadError, setSelectedUploadError] = useState("");
  const actionSheetRef = useRef();
  const [selectedtype, setSelectedType] = useState<ImageUploadDataModel | null>(
    null
  );
  const [uploadDocumentData, setUploadDoucument] =
    useState<UploadResponseModel | null>(null);
  const [ImageUriSelfie, setImageUriSelfie] = useState<string | undefined>("");
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selfie, setSelfie] = useState(false);
  const options =
    selfie == true
      ? ["Camera", "Cancel"]
      : ["Camera", "Gallery", "Document", "Cancel"];
  const navigation: NavigationProp<any> = useNavigation();
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupTitle, setPopupTitle] = useState("");
  const [title, setTitle] = useState("");
  const [titleNotesError, setTitleError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [isDocument, setIsDocument] = useState(false);
  const [updatedDataList, SetupdatedDataList] = useState([
    {
      id: "1",
      image: "",
      type: "0",
      fileType: "",
    },
  ]);

  // useEffect(() => {
  //   if (!isFocused) return;
  //   setLoading(true);
  //   getUploadedDocument((responseData) => {
  //     setUploadDoucument(responseData);
  //     const { images } = responseData.data;
  //     const maxId = Math.max(
  //       ...updatedDataList.map((item) => parseInt(item.id))
  //     );
  //     const newId = maxId === -Infinity ? 1 : maxId + 1;

  //     const newDataList = [];

  //     for (let i = 1; i <= 4; i++) {
  //       const imageKey = `image${i}`;
  //       if (images[imageKey] !== null) {
  //         newDataList.push({
  //           id: newId.toString(),
  //           image: images[imageKey],
  //           type: "1",
  //           fileType: "",
  //           imageType: "",
  //         });
  //       }
  //     }
  //     SetupdatedDataList([...updatedDataList, ...newDataList]);
  //     setLoading(false);
  //   });
  // }, [isFocused]);

  const data = [
    { label: "Passport", value: "Passport" },
    { label: "Voter ID", value: "Voter ID" },
    { label: "Driving License", value: "Driving License" },
    { label: "Visa", value: "Visa" },
    { label: "Other", value: "Other" },
  ];

  const showTextPopup = async (title: string, message: string) => {
    setPopupVisible(true);
    setPopupTitle(title);
    setPopupMessage(message);
    return true;
  };

  const selectedtitleText = (text: string | null) => {
    if (text == null) {
      setSelectedError("Please Select Document Type");
    } else if (text !== null) {
      setSelectedError("");
    }
  };

  const selectedUploadText = (text: string | undefined) => {
    if (text == "") {
      setSelectedUploadError("Please Upload First Image");
    } else if (text !== undefined || text != "") {
      setSelectedUploadError("");
    }
  };

  const showActionSheet = async (
    item: ImageUploadDataModel | undefined,
    selfie: boolean
  ) => {
    await setSelfie(selfie);
    actionSheetRef?.current?.show(
      {
        options: [
          "Camera",
          selfie == true ? null : "Gallery",
          selfie == true ? null : "Document",
          "Cancel",
        ],
        cancelButtonIndex: 3,
        destructiveButtonIndex: 1,
        tintColor: "blue",
        title: "Choose an option",
        message: "This is an optional message",
      },

      (index: any) => handleOptionSelected(index, selfie)
    );
  };

  const handleOptionSelected = async (index: any, selfie: boolean) => {
    const type = selectedtype;
    switch (index) {
      case 0:
        await requestCameraPermission(type, selfie);
        break;
      case 1:
        await requestMediaPermission(type);
        break;
      case 2:
        await requestDocumentPermission(type);
        break;
      default:
        break;
    }
  };

  const requestCameraPermission = async (type: any, selfie: boolean) => {
    try {
      const cameraPermission =
        Platform.OS === "android"
          ? PERMISSIONS.ANDROID.CAMERA
          : PERMISSIONS.IOS.CAMERA;
      const status = await request(cameraPermission);

      if (status === "blocked") {
        Alert.alert("Permission Denied", "Please grant permission to camera.", [
          { text: "ok", onPress: () => Linking.openSettings() },
        ]);
        return;
      }
      if (status === "granted") {
        console.log("Camera permission granted");
        const options: any = {
          cameraType: selfie == true ? "front" : "photo",
          saveToPhotos: false,
        };

        // Result of capturing an image from the camera.
        const result = await launchCamera(options);
        if (!result?.didCancel) {
          await handleImageUpload(
            result.assets?.[0].uri,
            selfie ? "selfie" : "Image",
            result.assets?.[0].type
          );
        }
      } else {
        console.log("Camera permission denied");
      }
    } catch (error) {
      console.error("Error while requesting camera permission:", error);
    }
  };

  const requestMediaPermission = async (type: any) => {
    try {
      let mediaPermission;
      if (Platform.OS === "android") {
        if (Platform.Version >= 33) {
          mediaPermission = PERMISSIONS.ANDROID.READ_MEDIA_IMAGES;
        } else {
          mediaPermission = PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
        }
      } else {
        mediaPermission = PERMISSIONS.IOS.PHOTO_LIBRARY;
      }

      // Permission status after requesting.
      const status = await request(mediaPermission);

      if (status === "blocked") {
        Alert.alert(
          "Permission Denied",
          "Please grant permission to photos storage.",
          [{ text: "ok", onPress: () => Linking.openSettings() }]
        );
        return;
      }

      if (
        status === "granted" ||
        (Platform.OS == "ios" && status === "limited")
      ) {
        console.log("Medaia permission granted");
        const options: any = {
          mediaType: "photo",
          saveToPhotos: true,
        };
        // Result of capturing an image from the image gallery.
        const result = await launchImageLibrary(options);
        if (!result?.didCancel) {
          await handleImageUpload(
            result.assets?.[0].uri,
            "Image",
            result.assets?.[0].type
          );
        }
      } else {
      }
    } catch (error) {
      console.error("Error while requesting camera permission:", error);
    }
  };

  const requestDocumentPermission = async (type: any) => {
    try {
      if (Platform.OS === "android") {
        const storagePermissionResult = await request(
          Platform.Version >= 33
            ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
            : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
        );

        if (storagePermissionResult !== RESULTS.GRANTED) {
          Alert.alert(
            "Permission Denied",
            "Please grant permission to access storage.",
            [{ text: "ok", onPress: () => Linking.openSettings() }]
          );
          return;
        }
      }

      const documentPickerType =
        Platform.OS === "ios"
          ? [
              DocumentPicker.types.pdf,
              DocumentPicker.types.doc,
              DocumentPicker.types.docx,
            ]
          : [
              "application/pdf",
              "application/msword",
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ];
      const result = await DocumentPicker.pick({
        type: documentPickerType,
        presentationStyle: "fullScreen",
      });
      await handleImageUpload(result[0].uri, "Document", result[0].type);
    } catch (error) {
      console.error("Error while requesting camera permission:", error);
    }
  };

  const renderItem = (
    item: ImageUploadDataModel,
    index: number,
    selfie: boolean
  ) => {
    const isImagePresent = item.image !== "";
    const isAndroid = Platform.OS === "android";
    const renderImageSection = () => {
      const imageSource =
        item.imageType === "Document"
          ? require("../../assets/images/pdf.png")
          : {
              uri: `${item.image}`,
              priority: FastImage.priority.high,
            };

      return (
        <View
          style={[
            styles.boxContainer,
            {
              backgroundColor: theme === "light" ? colors.chartdata : "#E0E0E0",
              opacity: 1.2,
              marginHorizontal: ratioWidthBasedOniPhoneX(4),
              marginRight: ratioWidthBasedOniPhoneX(8),
            },
            isAndroid ? styles.androidShadow : styles.iosShadow,
          ]}
        >
          <View style={[styles.selectedImageStyle, { position: "absolute" }]}>
            <FastImage
              source={imageSource}
              style={[styles.selectedImageStyle]}
            />
            <View style={[styles.selectedImageRow]}>
              <TouchableOpacity onPress={() => showImage(item)}>
                <ViewEye />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteImage(item)}>
                <DeleteImage />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    };

    const handleDeleteImage = (item: ImageUploadDataModel) => {
      const updatedDataListWithoutItem = updatedDataList.filter(
        (dataItem) => dataItem.id !== item.id
      );
      SetupdatedDataList(updatedDataListWithoutItem);
    };

    const renderAddImageSection = (
      item: ImageUploadDataModel,
      index: number
    ) => (
      <TouchableOpacity
        onPress={async () => {
          showActionSheet(item, selfie);
          await setSelfie(selfie);
        }}
        style={[
          styles.boxContainer,
          {
            backgroundColor: colored.cardBackGround,
            marginHorizontal: ratioWidthBasedOniPhoneX(4),
            marginRight: index % 2 ? ratioWidthBasedOniPhoneX(8) : 0,
          },
          isAndroid ? styles.androidShadow : styles.iosShadow,
        ]}
      >
        {index == 0 ? <AddImage /> : <Add />}
        <Text style={styles.imageText}>{index == 0 ? "Upload" : "Add"}</Text>
      </TouchableOpacity>
    );

    return isImagePresent
      ? renderImageSection()
      : index < 4 && renderAddImageSection(item, index);
  };

  const SelfieImageComponent = ({ imageUrl }) => {
    return (
      <View
        style={[
          styles.boxContainer,
          {
            backgroundColor: theme === "light" ? colors.chartdata : "#E0E0E0",
            opacity: 1.2,
            marginHorizontal: ratioWidthBasedOniPhoneX(4),
          },
          Platform.OS == "android" ? styles.androidShadow : styles.iosShadow,
        ]}
      >
        <View style={[styles.selectedImageStyle, { position: "absolute" }]}>
          <FastImage
            source={{
              uri: `${imageUrl}`,
              priority: FastImage.priority.high,
            }}
            style={[styles.selectedImageStyle]}
          />
          <View style={[styles.selectedImageRow]}>
            <TouchableOpacity
              onPress={() => {
                setIsAlertVisible(true);
                setModalVisible(true);
              }}
            >
              <ViewEye />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setImageUriSelfie("");
              }}
            >
              <DeleteImage />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderAddImageSections = (index: number, selfie: boolean) => (
    <TouchableOpacity
      onPress={async () => {
        showActionSheet(undefined, selfie);
        await setSelfie(selfie);
      }}
      style={[
        styles.boxContainer,
        {
          backgroundColor: colored.cardBackGround,
          marginHorizontal: ratioWidthBasedOniPhoneX(4),
          marginRight: index % 2 ? ratioWidthBasedOniPhoneX(8) : 0,
        },
        Platform.OS == "android" ? styles.androidShadow : styles.iosShadow,
      ]}
    >
      <AddImage />
      <Text style={styles.imageText}>Front</Text>
    </TouchableOpacity>
  );

  const showModal = (item: ImageUploadDataModel) => {
    setIsAlertVisible(true);
    setModalVisible(false);
    setSelectedType(item);
  };

  const hideModal = () => {
    setIsAlertVisible(false);
  };

  const showImage = (data: ImageUploadDataModel) => {
    if (data.imageType === "Document") {
      navigateToImageViewer(data);
    } else if (data.imageType === "Image") {
      showModal(data);
    }
  };

  type ImageParams = {
    title: string;
    url?: string; // Make url optional since it's conditionally added
  };

  const navigateToImageViewer = (data: ImageUploadDataModel) => {
    let params: ImageParams = {
      title: "Raise Ticket",
      url: `${URLConstants.Image_URL}${data.image}`,
    };
    {
      data.fileType == "application/pdf"
        ? navigation.navigate("PdfViewer", params)
        : data.fileType == "application/msword"
        ? navigation.navigate("DocumentViewer", params)
        : data.fileType ==
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ? navigation.navigate("DocumentViewer", params)
        : null;
    }
  };

  const handleImageUpload = async (
    result: any,
    imageType: string,
    fileType: string | null | undefined
  ) => {
    setLoading(true);
    const ImageUri = result;
    try {
      await serverCommunication.uploadImage(
        URLConstants.selectedDocuments,
        ImageUri,
        fileType,
        "files",
        async (status, data: any, error: any) => {
          if (!error) {
            const imageUrl = data?.data?.view_url;
            if (imageUrl) {
              const maxId = Math.max(
                ...updatedDataList.map((item) => parseInt(item.id))
              );
              const newId = maxId === -Infinity ? 1 : maxId + 1;
              const newData = {
                id: newId.toString(),
                image: imageUrl || "",
                type: imageType,
                fileType: data?.data?.fileType || "",
              };
              SetupdatedDataList([...updatedDataList, newData]);
            }
          } else {
            showTextPopup(strings.error, error?.message ?? "");
          }
        }
      );
    } catch (error) {
      console.error("Error while uploading image:", error);
    } finally {
      setLoading(false);
    }
  };

  const uploadAllDocuments = async () => {
    const selectedTitle = selectedValue != "Other" ? selectedValue : title;
    const imagesWithType = updatedDataList.slice(1, 5).map((data) => ({
      image: data?.image !== undefined ? data.image : null,
      type: data.type,
    }));
    const UploadRequest = new UploadDocumentsAuthRequest(
      selectedTitle,
      imagesWithType
    );

    try {
      await serverCommunication.postApi(
        URLConstants.uploadAllDocuments,
        UploadRequest,
        (statusCode: number, responseData: any, error: any) => {
          if (statusCode == HTTPStatusCode.ok) {
            showTextPopup(strings.success, responseData?.message ?? "");
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

  const handleVerify = () => {
    const titleError = validation.validateTitle(title);
    if (
      (selectedValue != null &&
        selectedValue != "Other" &&
        selectedError == "" &&
        updatedDataList[1]?.image) ||
      (title != "" &&
        titleNotesError == "" &&
        selectedValue == "Other" &&
        updatedDataList[1]?.image)
    ) {
      uploadAllDocuments();
    } else {
      selectedValue != "Other"
        ? selectedtitleText(selectedValue)
        : setTitleError(titleError);
      selectedUploadText(imageUri || "");
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colored.headerColor,
    },
    tittleText: {
      color: colored.textColor,
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(18)),
    },
    subTitleText: {
      color: theme === "light" ? colors.lightblack : colors.white,
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(14)),
    },
    DocumenttypeContainer: {
      height: ratioHeightBasedOniPhoneX(36),
      width: "auto",
      paddingHorizontal: ratioWidthBasedOniPhoneX(24),
      borderRadius: ratioHeightBasedOniPhoneX(30),
      borderColor: colored.tabBarBorder,
      borderWidth: ratioWidthBasedOniPhoneX(1),
      alignItems: "center",
      justifyContent: "center",
      marginTop: ratioHeightBasedOniPhoneX(8),
    },
    documentText: {
      color: colored.textColor,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(14)),
    },
    subText: {
      marginTop: ratioHeightBasedOniPhoneX(4),
      color: colors.mainlyBlue,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },
    UploadText: {
      color: colored.textColor,
      marginTop: ratioHeightBasedOniPhoneX(24),
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(14)),
    },
    boxContainer: {
      width: ratioWidthBasedOniPhoneX(160),
      height: ratioHeightBasedOniPhoneX(90),
      marginTop: ratioHeightBasedOniPhoneX(16),
      borderRadius: ratioHeightBasedOniPhoneX(8),
      alignItems: "center",
      justifyContent: "center",
    },

    imageText: {
      color: colors.mainlyBlue,
      textAlign: "center",
      marginTop: ratioHeightBasedOniPhoneX(4),
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
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
      elevation: 4,
    },
    selectedImageStyle: {
      height: ratioHeightBasedOniPhoneX(90),
      width: ratioWidthBasedOniPhoneX(88),
      resizeMode: "contain",
    },
    selectedImageRow: {
      flexDirection: "row",
      gap: ratioWidthBasedOniPhoneX(6),
      marginHorizontal: ratioWidthBasedOniPhoneX(5),
      position: "absolute",
      alignItems: "center",
      marginTop: ratioHeightBasedOniPhoneX(22),
    },
    bottomContainer: {
      ...Platform.select({
        ios: {
          shadowColor: colors.black,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
        },
        android: {
          elevation: 8,
          shadowColor: colors.black,
        },
      }),
      height: ratioHeightBasedOniPhoneX(62),
      backgroundColor:
        theme === "light" ? colored.headerColor : colored.darkheaderColor,
      alignItems: "center",
      justifyContent: "center",
      marginTop: "auto",
      borderTopWidth:
        theme !== "dark" ? undefined : ratioHeightBasedOniPhoneX(1),
      borderColor: "#222528",
    },
    button: {
      height: ratioHeightBasedOniPhoneX(40),
      backgroundColor: colors.orange,
      alignItems: "center",
      justifyContent: "center",
      width: ratioWidthBasedOniPhoneX(335),
      borderRadius: ratioHeightBasedOniPhoneX(37),
    },
    buttonText: {
      color: colors.white,
      textAlign: "center",
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
    },
    dropdown: {
      height: ratioHeightBasedOniPhoneX(40),
      borderRadius: ratioHeightBasedOniPhoneX(5),
      backgroundColor: colored.headerColor,
      padding: 0,
      color: colored.textColor,
      marginTop: ratioHeightBasedOniPhoneX(10),
      borderWidth: ratioWidthBasedOniPhoneX(0.5),
    },

    selectedTextStyle: {
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(14)),
      color: colored.textColor,
      marginHorizontal: ratioWidthBasedOniPhoneX(15),
    },

    dropDowncontainer: {
      marginTop: ratioHeightBasedOniPhoneX(15),
      backgroundColor: colored.background,
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
    input: {
      backgroundColor: colored.headerColor,
      borderRadius: ratioHeightBasedOniPhoneX(5),
      height: ratioHeightBasedOniPhoneX(48),
      paddingHorizontal: ratioWidthBasedOniPhoneX(2),
      marginTop: ratioHeightBasedOniPhoneX(24),
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(14)),
    },
    outlineStyle: {
      borderWidth: ratioWidthBasedOniPhoneX(0.5),
      color: colors.black,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(14)),
    },
    error: {
      textAlign: "left",
      paddingTop: ratioHeightBasedOniPhoneX(3),
      color: colors.mainlyRED,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },
    label: {
      position: "absolute",
      backgroundColor: theme === "light" ? colors.white : colors.black,
      left: ratioWidthBasedOniPhoneX(10),
      top: ratioHeightBasedOniPhoneX(2),
      zIndex: 999,
      paddingHorizontal: ratioWidthBasedOniPhoneX(2),
      color: colors.lightGreyColor,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },
  });

  let selfieImage = updatedDataList.filter((data) => data.type == "selfie");
  let uploadDocumentImage = updatedDataList.filter(
    (data) => data.type != "selfie"
  );

  const renderLabel = () => {
    if (isDocument) {
      return (
        <Text
          style={[
            styles.label,
            isDocument && {
              color: colors.lightGreen,
            },
          ]}
        >
          {"Document Type"}
        </Text>
      );
    }
    return null;
  };

  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <MainHeaderView
        title={"Upload All Document"}
        showImage={false}
        closeApp={false}
        bottomBorderLine={false}
        whiteTextColor={false}
      />
      <ScrollView
        style={{ marginHorizontal: ratioWidthBasedOniPhoneX(20) }}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={[
            styles.tittleText,
            { marginTop: ratioHeightBasedOniPhoneX(10) },
          ]}
        >
          Document Info
        </Text>
        <View style={{ marginTop: ratioHeightBasedOniPhoneX(10) }}>
          {renderLabel()}
          <Dropdown
            style={[
              styles.dropdown,
              {
                borderColor: isDocument
                  ? colors.lightGreen
                  : colors.inactivegrey,
              },
            ]}
            selectedTextStyle={styles.selectedTextStyle}
            showsVerticalScrollIndicator={false}
            placeholder="Document Type"
            data={data ?? []}
            placeholderStyle={{
              color: colors.lightblack,
              marginHorizontal: ratioWidthBasedOniPhoneX(15),
              ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(14)),
            }}
            maxHeight={ratioHeightBasedOniPhoneX(120)}
            containerStyle={{
              backgroundColor: colored.headerColor,
              borderColor: colors.lightblack,
            }}
            itemTextStyle={{
              justifyContent: "center",
              alignItems: "center",
              color: colored.textColor,
              marginBottom: ratioHeightBasedOniPhoneX(-10),
              ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
            }}
            itemContainerStyle={{
              justifyContent: "center",
              alignItems: "center",
              height: ratioHeightBasedOniPhoneX(40),
              backgroundColor: colored.headerColor,
            }}
            activeColor={theme === "light" ? "transparent" : colored.FilterBg}
            labelField="label"
            valueField="value"
            value={selectedValue}
            onChange={(item) => {
              setSelectedValue(item.value);
              selectedtitleText(item.value);
            }}
            iconStyle={{ marginRight: ratioWidthBasedOniPhoneX(10) }}
            onFocus={() => setIsDocument(true)}
            onBlur={() => setIsDocument(false)}
          />
        </View>
        {selectedValue == "Other" && (
          <TextInput
            label="Title"
            mode="outlined"
            value={title}
            onChangeText={(text) => {
              setTitle(text);
              setTitleError(validation.validateTitle(text));
            }}
            underlineColor={colored.textColor}
            keyboardType="email-address"
            activeUnderlineColor={titleNotesError ? "red" : colors.black}
            style={[styles.input]}
            selectionColor={colored.textColor}
            textColor={colored.textColor}
            outlineColor={colors.inactivegrey}
            outlineStyle={styles.outlineStyle}
            activeOutlineColor={colored.textColor}
          />
        )}
        {selectedValue == "Other" ? (
          titleNotesError ? (
            <Text style={styles.error}>{titleNotesError}</Text>
          ) : null
        ) : selectedError ? (
          <Text style={styles.error}>{selectedError}</Text>
        ) : null}

        <Text
          style={[
            styles.subTitleText,
            { marginTop: ratioHeightBasedOniPhoneX(12) },
          ]}
        >
          Upload Document
        </Text>
        <Text style={[styles.subText]}>{strings.documentText}</Text>
        <FlatList
          data={uploadDocumentImage.slice().reverse()}
          renderItem={({ item, index }) => renderItem(item, index, false)}
          numColumns={2}
          contentContainerStyle={{
            paddingVertical: ratioHeightBasedOniPhoneX(5),
          }}
          keyExtractor={(item) => item.id}
        />
        {selectedUploadError ? (
          <Text style={styles.error}>{selectedUploadError}</Text>
        ) : null}
        <Text
          style={[
            styles.subTitleText,
            { marginTop: ratioHeightBasedOniPhoneX(15) },
          ]}
        >
          Selfie
        </Text>
        <Text style={styles.subText}>
          Take a selfie and upload a clear image.
        </Text>
        <View
          style={{
            flexDirection: "row",
            gap: ratioWidthBasedOniPhoneX(8),
            marginTop: ratioHeightBasedOniPhoneX(10),
            marginBottom: ratioHeightBasedOniPhoneX(10),
            marginLeft: ratioWidthBasedOniPhoneX(4),
          }}
        >
          {selfieImage &&
          selfieImage.length > 0 &&
          selfieImage[0].image != undefined ? (
            <SelfieImageComponent
              imageUrl={
                uploadDocumentData?.data?.images?.image5 != null
                  ? uploadDocumentData?.data?.images?.image5
                  : selfieImage[0].image
              }
            />
          ) : (
            renderAddImageSections(10, true)
          )}
        </View>
      </ScrollView>
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          onPress={() => {
            handleVerify();
          }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Verify</Text>
        </TouchableOpacity>
      </View>
      <ActionSheet
        ref={actionSheetRef}
        options={options}
        cancelButtonIndex={options.length - 1}
        onPress={(index) => handleOptionSelected(index, selfie)}
      />
      <Modal isVisible={isAlertVisible} backdropOpacity={0.5}>
        <TouchableOpacity
          style={styles.modalTouchable}
          onPress={hideModal}
          activeOpacity={1}
        >
          <View style={styles.imageView}>
            <FastImage
              source={{
                uri:
                  ImageUriSelfie != "" && modalVisible == true
                    ? `${ImageUriSelfie}`
                    : `${selectedtype?.image}`,
                priority: FastImage.priority.high,
              }}
              style={{ width: "100%", height: "100%" }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
      <ShowAlertMessage
        isVisible={isPopupVisible}
        title={popupTitle}
        message={popupMessage}
        onClose={() => {
          if (popupMessage == "files updated successfully") {
            setPopupVisible(false);
            navigation.goBack();
          } else {
            setPopupVisible(false);
          }
        }}
      />
      <Loader loading={loading} />
    </SafeAreaView>
  );
};
export default UploadAllDocument;
