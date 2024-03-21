import { useContext, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  Keyboard,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemeContext } from "../../Networking/themeContext";
import colors, { dark, light } from "../../colors";
import MainHeaderView from "../../MainHeaderView";
import React from "react";
import { TextInput } from "react-native-paper";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "../../Extension/ScreenUtils";
import WealthidoFonts from "../../Helpers/WealthidoFonts";
import validation from "../../RegisterScreen/validation";
import AddImage from "../../assets/images/AddImage.svg";
import ActionSheet from "react-native-custom-actionsheet";
import { PERMISSIONS, RESULTS, request } from "react-native-permissions";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import DocumentPicker from "react-native-document-picker";
import { Dropdown } from "react-native-element-dropdown";
import ViewEye from "../../assets/images/ViewEye.svg";
import DeleteImage from "../../assets/images/DeleteImage.svg";
import Modal from "react-native-modal";
import serverCommunication from "../../Networking/serverCommunication";
import URLConstants from "../../Networking/URLConstants";
import HTTPStatusCode from "../../Networking/HttpStatusCode";
import {
  ReplyTicketRaiseRequestModel,
  TicketRaiseRequestModel,
} from "../Model/TicketRaiseRequestModel";
import Loader from "../../Loader";
import { TicketRaiseModel } from "../Model/TicketRaiseModel";
import {
  NavigationProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { TicketUploadModel } from "../Model/TicketUploadModel";
import ShowAlertMessage from "../../Popup/showAlertMessage";
import Add from "../../assets/images/Add.svg";
import FastImage from "react-native-fast-image";
import strings from "../../Extension/strings";
export type TicketDetailsParams = {
  id?: number;
  title: string;
  ticketTitle: string;
  category: string;
};

export type ImageUploadDataModel = {
  id?: string;
  image?: string;
  type?: string;
  fileType?: string;
  imageType?: string;
};

const TicketRaise = () => {
  const { theme } = useContext(ThemeContext);
  const route = useRoute();
  const params = route.params as TicketDetailsParams;
  const actionSheetRef = useRef();
  const [title, setTitle] = useState<string>("");
  const [titleError, setTitleError] = useState("");
  const [DescriptionNotes, setDescriptionNotes] = useState("");
  const [DescriptionNotesError, setDescriptionNotesError] = useState("");
  const [Category, setCategory] = useState("");
  const [CategoryNotesError, setCategoryError] = useState("");
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [selectedError, setSelectedError] = useState("");
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const colored = theme === "dark" ? dark : light;
  const [selectedtype, setSelectedType] = useState<ImageUploadDataModel | null>(
    null
  );
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupTitle, setPopupTitle] = useState("");
  const navigation: NavigationProp<any> = useNavigation();
  const options = ["Camera", "Gallery", "Document", "Cancel"];
  const [isCategory, setIsCaegory] = useState(false);
  const [isCategoryTitle, setIsCategoryTitle] = useState(false);
  const [isTitle, setIsTitle] = useState(false);
  const [isDescription, setIsDescription] = useState(false);
  const [updatedDataList, SetupdatedDataList] = useState([
    { id: "1", image: "", type: "0", fileType: "", imageType: "" },
  ]);

  const data = [
    { label: "Digital Chit", value: "Digital Chit" },
    { label: "Digital Gold", value: "Digital Gold" },
    { label: "Other", value: "Other" },
  ];

  const showTextPopup = async (title: string, message: string) => {
    setPopupVisible(true);
    setPopupTitle(title);
    setPopupMessage(message);
    return true;
  };

  const showActionSheet = (item: ImageUploadDataModel) => {
    setSelectedType(item);

    actionSheetRef?.current?.show(
      {
        options: ["Camera", "Gallery", "Document", "Cancel"],
        cancelButtonIndex: 3,
        destructiveButtonIndex: 1,
        tintColor: "blue",
        title: "Choose an option",
        message: "This is an optional message",
      },

      (index: any) => handleOptionSelected(index)
    );
  };

  const renderLabel = () => {
    if (selectedValue || isCategory) {
      return (
        <Text
          style={[
            styles.label,
            isCategory && {
              color: colors.lightGreen,
            },
          ]}
        >
          {"Category"}
        </Text>
      );
    }
    return null;
  };

  const handleOptionSelected = async (index: any) => {
    const type = selectedtype;
    switch (index) {
      case 0:
        await requestCameraPermission(type);
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

  const requestCameraPermission = async (type: string | null) => {
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
        const options: any = {
          cameraType: "photo",
          saveToPhotos: false,
        };

        const result = await launchCamera(options);
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

  const handleImageUpload = async (
    result: any,
    imageType: string,
    fileType: string | null | undefined
  ) => {
    setLoading(true);
    try {
      await serverCommunication.uploadImage(
        URLConstants.ticketUpload,
        result,
        fileType,
        "file",
        async (status, data: TicketUploadModel, error: any) => {
          if (!error) {
            const imageUrl = data?.data?.image;
            if (imageUrl) {
              const maxId = Math.max(
                ...updatedDataList.map((item) => parseInt(item.id))
              );
              const newId = maxId === -Infinity ? 1 : maxId + 1;
              const newData = {
                id: newId.toString(),
                image: imageUrl || "",
                type: "1",
                fileType: data?.data?.fileType || "",
                imageType: imageType,
              };
              SetupdatedDataList([...updatedDataList, newData]);
            }
          } else {
            showTextPopup(strings.error, error?.message ?? "");
          }
        }
      );
    } catch (error) {
      showTextPopup(strings.error, strings.defaultError);
    } finally {
      setLoading(false);
    }
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

  const selectedCategoryText = (text: string | null) => {
    if (text == null) {
      setSelectedError("Please select category item");
    } else if (text !== null) {
      setSelectedError("");
    }
  };

  const showModal = (item: ImageUploadDataModel) => {
    setIsAlertVisible(true);
    setSelectedType(item);
  };

  const hideModal = () => {
    setIsAlertVisible(false);
  };

  const TicketRaise = async () => {
    setLoading(true);
    const SelectedCategory =
      selectedValue != "Other" ? selectedValue : Category;
    const TicketRaiseRequest = new TicketRaiseRequestModel(
      title?.trim(),
      SelectedCategory?.trim(),
      DescriptionNotes?.trim(),
      {
        file:
          updatedDataList[1]?.image !== undefined
            ? updatedDataList[1].image
            : null,
        fileType:
          updatedDataList[1]?.fileType !== undefined
            ? updatedDataList[1].fileType
            : null,
      },
      {
        file:
          updatedDataList[2]?.image !== undefined
            ? updatedDataList[2].image
            : null,
        fileType:
          updatedDataList[2]?.fileType !== undefined
            ? updatedDataList[2].fileType
            : null,
      },
      {
        file:
          updatedDataList[3]?.image !== undefined
            ? updatedDataList[3].image
            : null,
        fileType:
          updatedDataList[3]?.fileType !== undefined
            ? updatedDataList[3].fileType
            : null,
      }
    );

    try {
      await serverCommunication.postApi(
        URLConstants.createTicket,
        TicketRaiseRequest,
        (statusCode: number, responseData: any, error: any) => {
          if (statusCode == HTTPStatusCode.ok) {
            showTextPopup(strings.success, responseData?.message ?? "");
          } else {
            showTextPopup(strings.error, responseData?.message ?? "");
          }
        }
      );
    } catch (error) {
      console.error("Error object:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTicketReply = async () => {
    setLoading(true);
    const TicketRaiseRequest = new ReplyTicketRaiseRequestModel(
      DescriptionNotes?.trim(),
      {
        file:
          updatedDataList[1]?.image !== undefined
            ? updatedDataList[1].image
            : null,
        fileType:
          updatedDataList[1]?.fileType !== undefined
            ? updatedDataList[1].fileType
            : null,
      },
      {
        file:
          updatedDataList[2]?.image !== undefined
            ? updatedDataList[2].image
            : null,
        fileType:
          updatedDataList[2]?.fileType !== undefined
            ? updatedDataList[2].fileType
            : null,
      },
      {
        file:
          updatedDataList[3]?.image !== undefined
            ? updatedDataList[3].image
            : null,
        fileType:
          updatedDataList[3]?.fileType !== undefined
            ? updatedDataList[3].fileType
            : null,
      }
    );
    try {
      await serverCommunication.postApi(
        `${URLConstants.ticketReply}${params?.id}`,
        TicketRaiseRequest,
        (statusCode: number, responseData: any, error: any) => {
          if (statusCode == HTTPStatusCode.ok) {
            showTextPopup(strings.success, responseData?.message ?? "");
          } else {
            showTextPopup(strings.error, responseData?.message ?? "");
          }
        }
      );
    } catch (error) {
      console.error("Error object:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitButton = () => {
    const titleError = validation.validateTitle(title);
    const descriptionError =
      validation.validateDescriptionNotes(DescriptionNotes);
    const categoryError = validation.validateCategory(Category);

    if (
      (title != "" &&
        titleError == "" &&
        DescriptionNotes != "" &&
        DescriptionNotesError == "" &&
        selectedValue == "Other" &&
        Category != "" &&
        categoryError == "") ||
      (selectedValue != "Other" &&
        selectedValue != null &&
        selectedError == "" &&
        title != "" &&
        titleError == "" &&
        DescriptionNotes != "" &&
        DescriptionNotesError == "") ||
      (params?.id != undefined &&
        DescriptionNotes != "" &&
        DescriptionNotesError == "")
    ) {
      params?.id == undefined ? TicketRaise() : getTicketReply();
    } else {
      selectedValue != "Other" && params?.id == undefined
        ? selectedCategoryText(selectedValue)
        : setCategoryError(categoryError);
      params?.id == undefined && setTitleError(titleError);
      setDescriptionNotesError(descriptionError);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colored.headerColor,
    },

    input: {
      backgroundColor: colored.headerColor,
      borderRadius: ratioHeightBasedOniPhoneX(5),
      height: ratioHeightBasedOniPhoneX(40),
      paddingHorizontal: ratioWidthBasedOniPhoneX(2),
      marginTop: ratioHeightBasedOniPhoneX(15),
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(14)),
    },

    Descriptioninput: {
      backgroundColor: colored.headerColor,
      borderRadius: ratioHeightBasedOniPhoneX(5),
      height: ratioHeightBasedOniPhoneX(80),
      marginTop: ratioHeightBasedOniPhoneX(15),
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
    UploadText: {
      color: colored.textColor,
      marginTop: ratioHeightBasedOniPhoneX(24),
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(14)),
    },
    boxContainer: {
      width: ratioWidthBasedOniPhoneX(168),
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
      elevation: 5,
    },
    iosShadowAddImage: {
      shadowColor: colors.black,
      shadowOffset: { width: 1, height: 1 },
      direction: "inherit",
      shadowOpacity: 0.2,
      shadowRadius: 3,
    },
    androidShadowAddImage: {
      shadowColor: colors.black,
      elevation: 2,
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
    ButtonContainer: {
      height:
        Platform.OS == "android"
          ? ratioHeightBasedOniPhoneX(80)
          : ratioHeightBasedOniPhoneX(100),
      backgroundColor:
        theme === "light" ? colored.headerColor : colored.darkheaderColor,
      alignItems: "center",
      justifyContent: "center",
      marginTop: "auto",
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
    loadingContainer: {
      justifyContent: "center",
      alignContent: "center",
      alignItems: "center",
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
    selectedImageStyleContainer: {
      height: ratioHeightBasedOniPhoneX(90),
      width: ratioWidthBasedOniPhoneX(80),
      resizeMode: "contain",
    },
    selectedImageStyle: {
      height: ratioHeightBasedOniPhoneX(90),
      width: ratioWidthBasedOniPhoneX(80),
      resizeMode: "contain",
    },
    pdfImageStyle: {
      height: ratioHeightBasedOniPhoneX(35),
      width: ratioWidthBasedOniPhoneX(35),
      marginTop: ratioHeightBasedOniPhoneX(22),
      marginLeft: ratioHeightBasedOniPhoneX(22),
      resizeMode: "contain",
    },
    selectedImageRow: {
      flexDirection: "row",
      gap: ratioWidthBasedOniPhoneX(10),
      marginHorizontal: ratioWidthBasedOniPhoneX(5),
      position: "absolute",
      alignItems: "center",
      marginRight: ratioHeightBasedOniPhoneX(22),
      marginTop: ratioHeightBasedOniPhoneX(25),
      alignSelf: "center",
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
  });

  const renderItem = (item: ImageUploadDataModel, index: number) => {
    const isImagePresent = item.image !== "";
    const isAndroid = Platform.OS === "android";
    const pdf = item.imageType === "Document";
    const renderImageSection = () => {
      const imageSource =
        item.imageType === "Document"
          ? require("../../assets/images/pdf.png")
          : {
              uri: `${URLConstants.Image_URL}${item.image}`,
              priority: FastImage.priority.high,
            };

      return (
        <View
          style={[
            styles.boxContainer,
            {
              backgroundColor: theme === "light" ? colors.chartdata : "#E0E0E0",
              opacity: 1.2,
              marginHorizontal: ratioWidthBasedOniPhoneX(8),
              marginRight: index % 2 ? ratioWidthBasedOniPhoneX(8) : 0,
            },
            isAndroid ? styles.androidShadow : styles.iosShadow,
          ]}
        >
          <View
            style={[
              styles.selectedImageStyleContainer,
              { position: "absolute" },
            ]}
          >
            <FastImage
              source={imageSource}
              style={[
                styles.selectedImageStyle,
                pdf ? styles.pdfImageStyle : null,
              ]}
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
        onPress={() => showActionSheet(item)}
        style={[
          styles.boxContainer,
          {
            backgroundColor: colored.cardBackGround,
            marginHorizontal: ratioWidthBasedOniPhoneX(8),
            marginRight: index % 2 ? ratioWidthBasedOniPhoneX(8) : 0,
          },
          isAndroid ? styles.androidShadowAddImage : styles.iosShadowAddImage,
        ]}
      >
        {index == 0 ? <AddImage /> : <Add />}
        <Text style={styles.imageText}>Add Image</Text>
      </TouchableOpacity>
    );

    return isImagePresent
      ? renderImageSection()
      : index < 3 && renderAddImageSection(item, index);
  };
  return (
    <View style={styles.container}>
      <MainHeaderView
        title={params?.title}
        showImage={false}
        closeApp={false}
        bottomBorderLine={false}
        whiteTextColor={false}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            marginHorizontal: ratioWidthBasedOniPhoneX(20),
            marginTop: ratioHeightBasedOniPhoneX(8),
          }}
        >
          {params.id == undefined && (
            <>
              {renderLabel()}
              <Dropdown
                style={[
                  styles.dropdown,
                  {
                    borderColor: isCategory
                      ? colors.lightGreen
                      : colors.inactivegrey,
                  },
                ]}
                selectedTextStyle={styles.selectedTextStyle}
                showsVerticalScrollIndicator={false}
                placeholder="Category"
                maxHeight={ratioHeightBasedOniPhoneX(120)}
                data={data ?? []}
                placeholderStyle={{
                  color: colors.lightblack,
                  marginHorizontal: ratioWidthBasedOniPhoneX(15),
                  ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(14)),
                }}
                itemTextStyle={{
                  color: colored.textColor,
                  ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(14)),
                }}
                itemContainerStyle={{
                  backgroundColor: colored.headerColor,
                }}
                containerStyle={{
                  backgroundColor: colored.headerColor,
                  borderColor: colors.lightblack,
                }}
                activeColor={
                  theme === "light" ? "transparent" : colored.FilterBg
                }
                labelField="label"
                valueField="value"
                value={selectedValue}
                onChange={(item) => {
                  setSelectedValue(item.value);
                  selectedCategoryText(item.value);
                }}
                iconStyle={{ marginRight: ratioWidthBasedOniPhoneX(10) }}
                onFocus={() => setIsCaegory(true)}
                onBlur={() => setIsCaegory(false)}
              />
            </>
          )}

          {selectedValue == "Other" && params.id == undefined && (
            <TextInput
              label="Category Title"
              mode="outlined"
              value={Category}
              onChangeText={(text) => {
                setCategory(text);
                setCategoryError(validation.validateCategory(text));
              }}
              underlineColor={colored.textColor}
              keyboardType="email-address"
              activeUnderlineColor={titleError ? "red" : colors.black}
              style={[styles.input]}
              selectionColor={colored.textColor}
              textColor={colored.textColor}
              outlineColor={colors.inactivegrey}
              outlineStyle={styles.outlineStyle}
              activeOutlineColor={colors.lightGreen}
              onFocus={() => setIsCategoryTitle(true)}
              onBlur={() => setIsCategoryTitle(false)}
            />
          )}

          {selectedValue == "Other" ? (
            CategoryNotesError ? (
              <Text style={styles.error}>{CategoryNotesError}</Text>
            ) : null
          ) : selectedError ? (
            <Text style={styles.error}>{selectedError}</Text>
          ) : null}
          {params.id == undefined && (
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
              activeUnderlineColor={titleError ? "red" : colors.black}
              style={[styles.input]}
              outlineColor={colors.inactivegrey}
              cursorColor={"#FF8001"}
              selectionColor={"#FF8001"}
              textColor={colored.textColor}
              outlineStyle={styles.outlineStyle}
              activeOutlineColor={colors.lightGreen}
              onFocus={() => setIsTitle(true)}
              onBlur={() => setIsTitle(false)}
            />
          )}

          {titleError ? <Text style={styles.error}>{titleError}</Text> : null}
          <TextInput
            label="Description"
            mode="outlined"
            multiline={true}
            numberOfLines={3}
            onSubmitEditing={() => Keyboard.dismiss()}
            blurOnSubmit={true}
            dense={true}
            textAlign={"left"}
            autoCorrect={false}
            value={DescriptionNotes}
            onChangeText={(text) => {
              setDescriptionNotes(text);
              setDescriptionNotesError(
                validation.validateDescriptionNotes(text)
              );
            }}
            activeUnderlineColor={DescriptionNotesError ? "red" : colors.black}
            underlineColor={colors.black}
            keyboardType="email-address"
            style={styles.Descriptioninput}
            selectionColor={colors.orange}
            cursorColor={colors.orange}
            textColor={colored.textColor}
            outlineColor={colors.inactivegrey}
            outlineStyle={styles.outlineStyle}
            activeOutlineColor={colors.lightGreen}
            onFocus={() => setIsDescription(true)}
            onBlur={() => setIsDescription(false)}
          />
          {DescriptionNotesError ? (
            <Text style={styles.error}>{DescriptionNotesError}</Text>
          ) : null}
          <Text style={styles.UploadText}>Upload Image (Maximum 3 File)</Text>
        </View>
        <FlatList
          data={updatedDataList.slice().reverse()}
          renderItem={({ item, index }) => renderItem(item, index)}
          numColumns={2}
          contentContainerStyle={{
            paddingHorizontal: ratioWidthBasedOniPhoneX(8),
            paddingVertical: ratioHeightBasedOniPhoneX(5),
          }}
          keyExtractor={(item) => item.id}
        />
      </ScrollView>
      <View style={[styles.ButtonContainer]}>
        <TouchableOpacity
          onPress={() => {
            handleSubmitButton();
          }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
      <ActionSheet
        ref={actionSheetRef}
        options={options}
        cancelButtonIndex={options.length - 1}
        onPress={(index) => handleOptionSelected(index)}
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
                uri: `${URLConstants.Image_URL}${selectedtype?.image}`,
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
          if (popupMessage == "Ticket created successfully") {
            setPopupVisible(false);
            navigation.goBack();
          } else if (popupMessage == "Replied to ticket successfully") {
            setPopupVisible(false);
            navigation.goBack();
          } else {
            setPopupVisible(false);
          }
        }}
      />
      <Loader loading={loading} />
    </View>
  );
};

export default TicketRaise;
