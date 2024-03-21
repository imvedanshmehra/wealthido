import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { Button } from "react-native-paper";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import colors, { dark, light } from "../colors";
import ActionSheet from "react-native-custom-actionsheet";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "../Extension/ScreenUtils";
import serverCommunication from "../Networking/serverCommunication";
import URLConstants from "../Networking/URLConstants";
import { KycResponseModel } from "./Model/KycResponseModel";
import { KycUploadResponseModel } from "./Model/KycUploadResponseModel";
import { KycCreateResponseModel } from "./Model/KycCreateResponseModel";
import { KycAuthRequestModel } from "./Model/KycAuthRequestModel";
import StorageService from "../StorageService";
import { LoginResponseModel } from "../LoginScreen/Modal/LoginResponseModel";
import { SafeAreaView } from "react-native-safe-area-context";
import Modal from "react-native-modal";
import { ThemeContext } from "../Networking/themeContext";
import { Dropdown } from "react-native-element-dropdown";
import { request, PERMISSIONS } from "react-native-permissions";
import Loader from "../Loader";
import WealthidoFonts from "../Helpers/WealthidoFonts";
import ShowAlertMessage from "../Popup/showAlertMessage";
import strings from "../Extension/strings";

const KycUpload = () => {
  let KycDetailsResponse: KycResponseModel = {};
  let KycUploadResponse: KycUploadResponseModel = {};
  let KycCreateResponse: KycCreateResponseModel = {};

  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [kycType, setKycType] = useState("");
  const actionSheetRef: any = useRef();
  const [documentId, setDocumentId] = useState<null | number>(null);
  const [frontImageUrl, setFrontImageUrl] = useState<string | null>(null);
  const [backImageUrl, setBackImageUrl] = useState<string | null>(null);
  const [selfieImageUrl, setSelfieImageUrl] = useState<string | null>(null);
  const [response, setResponse] = useState(KycDetailsResponse);
  const [createKyc, setCreateKyc] = useState(KycCreateResponse);
  const [kycUpload, setKycUpload] = useState(KycUploadResponse);
  const [loading, setLoading] = useState(false);
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [selfieImage, setSelfieImage] = useState<string | null>(null);
  const [selectedDocumentType, setSelectedDocumentType] = useState<string>("");
  const [kycStatus, setKycStatus] = useState<string>("");
  const [kycSubmit, setKycSubmit] = useState<string>("");
  const [getUserResponse, setGetUserResponse] =
    useState<LoginResponseModel | null>(null);
  const [createKycDocu, setCreateKycDocu] = useState<boolean>(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const { theme } = useContext(ThemeContext);
  const colored = theme === "dark" ? dark : light;
  const options =
    kycType === "Selfie"
      ? ["Camera", "Cancel"]
      : ["Camera", "Gallery", "Cancel"];
  const handleBackPress = () => {
    navigation.goBack();
  };
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupTitle, setPopupTitle] = useState("");

  const showTextPopup = async (title: string, message: string) => {
    setPopupVisible(true);
    setPopupTitle(title);
    setPopupMessage(message);
    return true;
  };

  const showModal = () => {
    setIsAlertVisible(true);
  };

  const hideModal = () => {
    setIsAlertVisible(false);
  };

  // Fetches login response data from storage and updates state variables.
  const fetchData = async () => {
    try {
      // Attempt to retrieve login response data from storage
      const loginResponseData = await StorageService.getIsLogin();
      if (loginResponseData !== null) {
        // If login response data is available, update state variables
        setGetUserResponse(loginResponseData);
        setKycStatus(loginResponseData.data?.kycstatus ?? "");
        setKycSubmit(loginResponseData.data?.kycsubmit ?? "");
      }
    } catch (error) {
      // Handle any errors that occur during data fetching
      console.error("Error fetching login response data:", error);
    }
  };

  // Shows an action sheet for selecting an image source (Camera or Gallery).

  const showActionSheet = (imageType: string) => {
    actionSheetRef?.current?.show(
      {
        options: ["Camera", imageType == "Selfie" ? null : "Gallery", "Cancel"],
        cancelButtonIndex: 2,
        destructiveButtonIndex: 1,
        tintColor: "blue",
        title: "Choose an option",
        message: "This is an optional message",
      },

      (index: any) => handleOptionSelected(index, imageType)
    );
  };

  // Handles the selected option from the action sheet and requests the necessary permissions.

  const handleOptionSelected = (index: any, imageType: string) => {
    switch (index) {
      case 0:
        /**
         * Request permission to use the device's camera.
         * @param {string} imageType - The type of image (e.g., "Selfie").
         */
        requestCameraPermission(imageType);
        break;
      case 1:
        /**
         * Request permission to access the device's media (e.g., photo gallery).
         * @param {string} imageType - The type of image (e.g., "Selfie").
         */
        imageType == "Selfie" ? null : requestMediaPermission(imageType);
        break;
      default:
        // Handle other cases if needed
        break;
    }
  };

  /**
   * Handles capturing an image from the device's camera and uploading it.
   *
   * @param {string} imageType - The type of image to capture (e.g., "Selfie").
   * @returns {void}
   */
  const handleCameraCapture = async (imageType: string) => {
    try {
      // Options for capturing an image from the camera.
      const options: any = {
        cameraType: imageType == "Selfie" ? "front" : "photo",
        saveToPhotos: true,
      };

      // Result of capturing an image from the camera.
      const result = await launchCamera(options);
      if (result.assets && result.assets.length > 0 && result.assets[0].uri) {
        const imageUri = result.assets[0].uri;

        setLoading(true);

        await serverCommunication.uploadImage(
          URLConstants.kycUpload,
          imageUri,
          "image/jpeg",
          "file",
          async (status, data: KycUploadResponseModel, error: any) => {
            if (error) {
              showTextPopup(strings.error, error?.message ?? "");
            } else {
              /**
               * URI of the captured image.
               * @type {string}
               */
              setKycUpload(data);
              const imageUrl = data?.data?.image;
              if (imageUrl) {
                if (imageType === "Back") {
                  setBackImageUrl(imageUrl);
                  setBackImage(imageUri);
                } else if (imageType == "Selfie") {
                  setSelfieImageUrl(imageUrl);
                  setSelfieImage(imageUri);
                } else {
                  setFrontImage(imageUri);
                  setFrontImageUrl(imageUrl);
                }
              } else {
                showTextPopup(strings.error, response?.message ?? "");
              }
            }
          }
        );
        setLoading(false);
      }
    } catch (error) {
      console.error("Error while capturing from camera:", error);
    }
  };

  // Handles deleting an image of a specific type.
  const handleDeleteImage = (imageType: string) => {
    if (imageType === "Front") {
      setFrontImageUrl(null);
      setFrontImage(null);
    } else if (imageType == "Selfie") {
      setSelfieImageUrl(null);
      setSelfieImage(null);
    } else {
      setBackImageUrl(null);
      setBackImage(null);
    }
  };

  // Requests permission to access the device's media (e.g., photo gallery).
  const requestMediaPermission = async (imageType: string) => {
    try {
      let MediaPermission;
      if (Platform.OS === "android") {
        const targetSDKVersion = Platform.Version;
        if (targetSDKVersion >= 33) {
          MediaPermission = PERMISSIONS.ANDROID.READ_MEDIA_IMAGES;
        } else {
          MediaPermission = PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
        }
      } else if (Platform.OS === "ios") {
        MediaPermission = PERMISSIONS.IOS.PHOTO_LIBRARY;
      } else {
        return;
      }

      // Permission status after requesting.
      const status = await request(MediaPermission);
      if (status === "granted") {
        handleImageGallerySelect(imageType);
      } else {
      }
    } catch (error) {
      console.error("Error while requesting camera permission:", error);
    }
  };

  // Handles capturing an image from the device's camera and uploading it.
  const handleImageGallerySelect = async (imageType: string) => {
    try {
      // Options for capturing an image from the camera.
      const options: any = {
        mediaType: "photo",
        saveToPhotos: true,
      };
      // Result of capturing an image from the image gallery.
      const result = await launchImageLibrary(options);

      if (result.assets && result.assets.length > 0 && result.assets[0].uri) {
        const imageUri = result.assets[0].uri;
        setLoading(true);
        await serverCommunication.uploadImage(
          URLConstants.kycUpload,
          imageUri,
          "image/jpeg",
          "file",
          async (status, data: KycUploadResponseModel, error: any) => {
            if (error) {
              showTextPopup(strings.error, error?.message ?? "");
            } else {
              // URI of the captured image.
              setKycUpload(data);
              const imageUrl = data?.data?.image;
              if (imageUrl) {
                switch (imageType) {
                  case "Back":
                    setBackImageUrl(imageUrl);
                    setBackImage(imageUri);
                    break;
                  case "Selfie":
                    setSelfieImageUrl(imageUrl);
                    setSelfieImage(imageUri);
                    break;
                  default:
                    setFrontImage(imageUri);
                    setFrontImageUrl(imageUrl);
                    break;
                }
              } else {
                showTextPopup(strings.error, response?.message ?? "");
              }
            }
            setLoading(false);
          }
        );
      }
    } catch (error) {
      setLoading(false);
      console.error("Error while selecting from image gallery:", error);
    }
  };

  // Handles the press event for selecting or capturing an image.
  const handleImagePress = async (imageType: React.SetStateAction<any>) => {
    await setKycType(imageType);
    (kycStatus === "PENDING" && kycSubmit !== "NOT_SUBMIT") ||
    kycStatus === "APPROVED"
      ? showModal()
      : showActionSheet(imageType);
  };

  // Renders the image upload component.
  const renderImageUpload = (imageUri: any, setImage: any, imageType: any) => {
    return (
      <TouchableOpacity
        style={[
          styles.squareView,
          imageUri != null
            ? {
                borderWidth: ratioWidthBasedOniPhoneX(1),
                borderColor: colors.lightGreen,
              }
            : {},
        ]}
        onPress={() => handleImagePress(imageType)}
      >
        {imageUri ? (
          <>
            <View style={styles.topRightButtonContainer}>
              <TouchableOpacity
                style={
                  kycStatus == "APPROVED" ||
                  (kycStatus === "PENDING" && kycSubmit === "SUBMIT")
                    ? null
                    : styles.closeButton
                }
                onPress={() => handleDeleteImage(imageType)}
              >
                <Text style={styles.closeButtonText}>
                  {kycStatus === "APPROVED" ||
                  (kycStatus === "PENDING" && kycSubmit === "SUBMIT")
                    ? ""
                    : "x"}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.rowContainer}>
              <Image source={{ uri: imageUri }} style={styles.circularImage} />
              <Text style={styles.bottomText}>{imageType}</Text>
            </View>
          </>
        ) : (
          <>
            <View style={styles.rowContainer}>
              <Image
                source={require("../assets/images/circleCamera.png")}
                style={styles.circularImage}
              />
              <Text style={styles.bottomText}>{imageType}</Text>
            </View>
          </>
        )}
      </TouchableOpacity>
    );
  };

  //  Retrieves user information.
  const getUserInfo = async () => {
    try {
      await serverCommunication.getApi(
        URLConstants.userInfo,
        (statusCode: any, responseData: LoginResponseModel, error: any) => {
          if (!error) {
            StorageService.setIsLogin(responseData);
            setKycStatus(responseData.data?.kycstatus ?? "");
            setKycSubmit(responseData.data?.kycsubmit ?? "");
          } else {
          }
        }
      );
    } catch (error) {}
  };

  // Requests permission to use the device's camera.
  const requestCameraPermission = async (imageType: string) => {
    try {
      let cameraPermission;
      if (Platform.OS === "android") {
        cameraPermission = PERMISSIONS.ANDROID.CAMERA;
      } else if (Platform.OS === "ios") {
        cameraPermission = PERMISSIONS.IOS.CAMERA;
      } else {
        return;
      }

      // Permission status after requesting.
      const status = await request(cameraPermission);
      if (status === "granted") {
        console.log("Camera permission granted");
        handleCameraCapture(imageType);
        // You can now safely use the camera
      } else {
        console.log("Camera permission denied");
      }
    } catch (error) {
      console.error("Error while requesting camera permission:", error);
    }
  };

  useEffect(() => {
    if (isFocused) {
      const getKycDetails = async () => {
        try {
          await serverCommunication.getApi(
            URLConstants.kycDetails,
            async (
              statusCode: any,
              responseData: KycResponseModel,
              error: any
            ) => {
              if (!error) {
                setResponse(responseData);
              } else {
              }
            }
          );
        } catch (error) {}
      };

      const getKycGet = async () => {
        try {
          await serverCommunication.getApi(
            URLConstants.kycGet,
            async (
              statusCode: any,
              responseData: KycCreateResponseModel | any,
              error: any
            ) => {
              if (!error) {
                const backImageUrl = getFullImageUrl(responseData.data?.back);
                const frontImageUrl = getFullImageUrl(responseData.data?.front);
                const selfieImageUrl = getFullImageUrl(
                  responseData.data?.selfie
                );
                setBackImage(backImageUrl);
                setFrontImage(frontImageUrl);
                setSelfieImage(selfieImageUrl);
                if (responseData.data?.document_type) {
                  setDocumentId(responseData.data.document_id);
                  setSelectedDocumentType(responseData.data.document_type);
                }
                setCreateKyc(responseData);
              } else {
              }
            }
          );
        } catch (error) {}
      };

      fetchData();
      getKycGet();
      getKycDetails();
    }
  }, [isFocused]);

  // Handles the press event when the "Verify" button is pressed.
  // Verifies that all required images and data are available before proceeding.
  const handleVerifyButtonPress = () => {
    if (
      frontImageUrl !== null &&
      backImageUrl !== null &&
      documentId !== null &&
      selfieImageUrl !== null
    ) {
      setLoading(true);
      const KycAuthRequest = new KycAuthRequestModel(
        documentId,
        frontImageUrl,
        backImageUrl,
        selfieImageUrl
      );

      kycCreatePostApi(
        KycAuthRequest,
        async (response) => {
          getUserInfo();
          await fetchData();
          setKycStatus(getUserResponse?.data?.kycstatus ?? "");
          setKycSubmit(getUserResponse?.data?.kycsubmit ?? "");
          setLoading(false);
          showTextPopup(strings.success, response.message ?? "");
        },
        (error) => {
          setLoading(false);
          getUserInfo();
          fetchData();
          setKycStatus(getUserResponse?.data?.kycstatus ?? "");
          setKycSubmit(getUserResponse?.data?.kycsubmit ?? "");
          showTextPopup(strings.error, response.message ?? "");
        }
      );
    } else {
      // Handle the case where either frontImageUrl or backImageUrl is null
    }
  };

  /**
   * Gets the full URL by concatenating a partial URL with the base URL.
   *
   * @param {string | undefined} partialUrl - The partial URL to concatenate.
   * @returns {string} The full URL.
   */
  const getFullImageUrl = (partialUrl: string | undefined) => {
    return partialUrl
      ? `https://nextazyfinanceapp.s3.eu-west-3.amazonaws.com${partialUrl}`
      : "";
  };

  /**
   * Posts data to the KYC creation API.
   *
   * @param {any} data - The data to post.
   * @param {(response: KycCreateResponseModel) => void} onSuccess - A callback function to handle success.
   * @param {(error: any) => void} onError - A callback function to handle errors.
   *
   * @returns {void}
   */
  const kycCreatePostApi = async (
    data: any,
    onSuccess: (response: KycCreateResponseModel) => void,
    onError: (error: any) => void
  ) => {
    try {
      await serverCommunication.postApi(
        URLConstants.kycCreate,
        data,
        (
          statusCode: number,
          responseData: KycCreateResponseModel,
          error: any
        ) => {
          if (!error) {
            try {
              onSuccess(responseData);
            } catch (parseError) {
              onError(error);
            }
          } else {
            onError(error);
          }
        }
      );
    } catch (error) {
      onError(error);
    }
  };

  /**
   * Handles the change in KYC document selection.
   * Updates the selected document type and resets images and document ID.
   *
   * @param {any} item - The selected KYC document item.
   * @returns {void}
   */
  const handleKycChange = (item: any) => {
    setSelectedDocumentType(item.documentName);
    setBackImage(null);
    setFrontImage(null);
    const filteredUsers = response?.data
      ? response.data.filter((user) => user.documentName === item.documentName)
      : [];

    if (
      filteredUsers &&
      filteredUsers[0] &&
      filteredUsers[0].id !== undefined
    ) {
      setCreateKycDocu(true);
      setDocumentId(filteredUsers[0].id);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colored.background,
    },
    modalTouchable: {
      flex: 1,
      justifyContent: "center",
    },
    backgroundcontainer: {
      flex: 1,
      marginHorizontal: ratioWidthBasedOniPhoneX(25),
      backgroundColor: colored.background,
    },
    headerContainer: {
      marginTop: ratioHeightBasedOniPhoneX(20),
      backgroundColor: colored.background,
      flexDirection: "row",
      width: "auto",
      alignItems: "center", // Center the items vertically
    },
    backButtonImage: {
      height: ratioHeightBasedOniPhoneX(20),
      width: ratioWidthBasedOniPhoneX(20),
      resizeMode: "contain",
      tintColor: colored.textColor,
    },
    headerTextContainer: {
      flex: 1,
      alignItems: "center",
    },
    headerText: {
      color: colored.textColor,
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
    },
    documentContainer: {
      marginTop: ratioHeightBasedOniPhoneX(51),
      justifyContent: "flex-start",
      alignContent: "flex-start",
    },
    chooseDocumentText: {
      color: colored.lightText,
      textAlign: "left",
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(14)),
    },
    buttonContainer: {
      marginTop: ratioHeightBasedOniPhoneX(20),
      flexDirection: "row",
      alignContent: "center",
      justifyContent: "flex-start",
      flexWrap: "wrap",
    },

    button: {
      backgroundColor: colored.cardBackGround,
      borderRadius: ratioHeightBasedOniPhoneX(30),
      height: ratioHeightBasedOniPhoneX(36),
      paddingHorizontal: ratioWidthBasedOniPhoneX(30),
      justifyContent: "center",
      marginHorizontal: ratioWidthBasedOniPhoneX(5),
      marginBottom: ratioHeightBasedOniPhoneX(10),
    },
    selectedButton: {
      backgroundColor: colors.lightGreen,
      color: colors.background,
    },
    buttonText: {
      color: colored.textColor,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },
    uploadDocumentText: {
      marginTop: ratioHeightBasedOniPhoneX(25),
      color: colored.lightblack,
      textAlign: "left",
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
    },
    subTitle: {
      color: colors.mainlyBlue,
      paddingVertical: ratioHeightBasedOniPhoneX(5),
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },

    imageContainer: {
      flexDirection: "row",
      paddingVertical: ratioHeightBasedOniPhoneX(20),
    },
    squareView: {
      flex: 0.5,
      height: ratioHeightBasedOniPhoneX(90),
      backgroundColor: colored.cardBackGround,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: ratioHeightBasedOniPhoneX(10),
    },
    rowContainer: {
      flexDirection: "column",
      alignContent: "center",
      alignItems: "center",
      justifyContent: "center",
    },
    circularImage: {
      width: ratioHeightBasedOniPhoneX(36),
      height: ratioHeightBasedOniPhoneX(36),
      borderRadius: ratioHeightBasedOniPhoneX(36),
    },
    bottomText: {
      marginTop: ratioHeightBasedOniPhoneX(10),
      color: colored.textColor, // Change this to your preferred font
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },
    ssnNumber: {
      color: colors.black,
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(12)),
    },
    input: {
      backgroundColor: "transparent",
      marginBottom: ratioHeightBasedOniPhoneX(8),
      borderRadius: ratioHeightBasedOniPhoneX(14),
      height: ratioHeightBasedOniPhoneX(48),
      paddingHorizontal: ratioWidthBasedOniPhoneX(2),
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(14)),
    },

    centerView: {
      marginTop: "auto",
      alignItems: "center",
    },

    verifybutton: {
      width: "100%",
      backgroundColor: colors.green,
      height: ratioHeightBasedOniPhoneX(48),
      justifyContent: "center",
      borderRadius: ratioHeightBasedOniPhoneX(24),
    },
    verifybuttonText: {
      color: colors.white,
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
    },
    topRightButtonContainer: {
      position: "absolute",
      top: -ratioHeightBasedOniPhoneX(10),
      right: -ratioWidthBasedOniPhoneX(10),
    },
    closeButton: {
      backgroundColor: colors.red,
      borderRadius: ratioHeightBasedOniPhoneX(15),
      width: ratioWidthBasedOniPhoneX(30),
      height: ratioHeightBasedOniPhoneX(30),
      justifyContent: "center",
      alignItems: "center",
    },
    closeButtonText: {
      color: "white",
      fontSize: ratioHeightBasedOniPhoneX(18),
      fontWeight: "bold",
    },
    imageView: {
      marginHorizontal: ratioWidthBasedOniPhoneX(40),
      height: ratioHeightBasedOniPhoneX(200),
      width: ratioWidthBasedOniPhoneX(250),
      backgroundColor: colors.white,
      alignItems: "center", // Center the image horizontally
      justifyContent: "center",
    },

    dropdown: {
      height: ratioHeightBasedOniPhoneX(40),
      borderBottomColor: "gray",
      padding: 0,
      borderBottomWidth: ratioWidthBasedOniPhoneX(0.5),
    },

    selectedTextStyle: {
      fontSize: ratioHeightBasedOniPhoneX(16),
      color: colored.black,
    },

    dropDowncontainer: {
      marginTop: ratioHeightBasedOniPhoneX(15),
      backgroundColor: colored.background,
    },
    lineContainer: {
      marginTop: ratioHeightBasedOniPhoneX(5),
      height: ratioHeightBasedOniPhoneX(1),
      backgroundColor: colored.lightText,
    },
    documentText: {
      color: colored.black,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(14)),
    },
    NoData: {
      color: colored.textColor,
      textAlign: "center",
      alignContent: "center",
      marginTop: ratioHeightBasedOniPhoneX(12),
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(18)),
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backgroundcontainer}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={handleBackPress}>
            <Image
              source={require("../assets/images/left-arrow.png")}
              style={styles.backButtonImage}
            />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerText}>Upload KYC</Text>
          </View>
        </View>
        <View style={styles.documentContainer}>
          <Text style={styles.chooseDocumentText}>Choose Document type</Text>

          {((kycStatus === "PENDING" && kycSubmit === "SUBMIT") ||
            kycStatus === "APPROVED") &&
          response.data != null ? (
            <View style={styles.dropDowncontainer}>
              <Text style={styles.documentText}>{selectedDocumentType}</Text>
              <View style={styles.lineContainer} />
            </View>
          ) : (
            <>
              {response.data?.length === 0 || response.data === null ? (
                <Text style={styles.NoData}>No Data</Text>
              ) : (
                <Dropdown
                  style={styles.dropdown}
                  selectedTextStyle={styles.selectedTextStyle}
                  data={response.data ?? []}
                  placeholderStyle={{
                    color: colored.textColor,
                    ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(14)),
                  }}
                  maxHeight={ratioHeightBasedOniPhoneX(190)}
                  itemTextStyle={{
                    color: colors.black,
                    ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(14)),
                  }}
                  labelField="documentName"
                  valueField="documentName"
                  value={selectedDocumentType}
                  onChange={handleKycChange}
                />
              )}
            </>
          )}
        </View>

        {selectedDocumentType !== "" && (
          <>
            <Text style={styles.uploadDocumentText}>Upload Document</Text>
            <Text style={styles.subTitle}>
              Take pictures on a plain dark surface and make sure the numbers of
              your document are visible
            </Text>

            <View style={styles.imageContainer}>
              {renderImageUpload(frontImage, setFrontImage, "Front")}
              <View style={{ marginHorizontal: 10 }} />
              {renderImageUpload(backImage, setBackImage, "Back")}
            </View>

            <Text style={styles.uploadDocumentText}>Selfie</Text>
            <Text style={styles.subTitle}>
              Take a selfie and upload a clear image.
            </Text>
            <View style={styles.imageContainer}>
              {renderImageUpload(selfieImage, setSelfieImage, "Selfie")}
            </View>
          </>
        )}
        {kycStatus === "REJECTED" && (
          <>
            <Text style={[styles.uploadDocumentText, { color: colors.red }]}>
              KYC Rejected Reason:
            </Text>
            <Text style={styles.subTitle}>{kycCreateResponse.data?.note}</Text>
          </>
        )}

        {!(
          (kycStatus === "PENDING" && kycSubmit !== "NOT_SUBMIT") ||
          kycStatus === "APPROVED" ||
          selectedDocumentType == ""
        ) && (
          <View style={styles.centerView}>
            <Button
              mode="contained"
              onPress={handleVerifyButtonPress}
              labelStyle={styles.verifybuttonText}
              style={styles.verifybutton}
            >
              {"Verify"}
            </Button>
          </View>
        )}
        <ActionSheet
          ref={actionSheetRef}
          options={options}
          cancelButtonIndex={options.length - 1}
          onPress={(index) => handleOptionSelected(index, kycType)}
        />
      </View>
      <Loader loading={loading} />
      <ShowAlertMessage
        isVisible={popupVisible}
        title={popupTitle}
        message={popupMessage}
        onClose={() => setPopupVisible(false)}
      />
      <Modal isVisible={isAlertVisible} backdropOpacity={0.5}>
        <TouchableOpacity
          style={styles.modalTouchable}
          onPress={hideModal}
          activeOpacity={1}
        >
          <View style={styles.imageView}>
            <Image
              style={{ width: "100%", height: "100%" }}
              source={
                kycType === "Front"
                  ? { uri: frontImage }
                  : kycType === "Selfie"
                  ? { uri: selfieImage }
                  : { uri: backImage }
              }
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default KycUpload;
