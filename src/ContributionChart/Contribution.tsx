import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Platform,
  Alert,
  Linking,
} from "react-native";
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import RNHTMLtoPDF from "react-native-html-to-pdf";
import colors, { dark, light } from "../colors";
import strings from "../Extension/strings";
import serverCommunication from "../Networking/serverCommunication";
import URLConstants from "../Networking/URLConstants";
import { ContributionResponseModelList } from "./Model/ContributionResponseModel";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "../Extension/ScreenUtils";
import { ThemeContext } from "../Networking/themeContext";
import Share from "react-native-share";
import RNFS from "react-native-fs";
import { PERMISSIONS, RESULTS, request } from "react-native-permissions";
import WealthidoFonts from "../Helpers/WealthidoFonts";
import BackImage from "../assets/images/back.svg";
import WhiteBackImage from "../assets/images/WhiteBack.svg";
import ExportImage from "../assets/images/contributionchart.svg";
import { Divider } from "react-native-paper";

const Contribution = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const route = useRoute();
  const { contributionId, tag } = route.params as {
    contributionId: any;
    tag: any;
  };
  const [getContributionResponse, setGetContribution] = useState<
    ContributionResponseModelList[]
  >([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const { theme } = useContext(ThemeContext);
  const colored = theme === "dark" ? dark : light;

  useEffect(() => {
    const getContribution = async () => {
      try {
        await serverCommunication.getApi(
          `${URLConstants.getContribution}${contributionId.id}`,
          (statusCode: any, responseData: any, error: any) => {
            setGetContribution(responseData.data.list);
          }
        );
      } catch (error) {
        console.error("Error:", error);
      }
    };

    if (isFocused) {
      getContribution();
    }
  }, [isFocused]);

  const counts = (index: number) => {
    return ++index;
  };

  const renderItem = (data: ContributionResponseModelList, index: number) => {
    return (
      <View style={styles.rowItem}>
        <Text style={styles.listItemText}>{counts(index)}</Text>
        <Text style={styles.listItemText}>{data.bidAmount}</Text>
        <Text style={styles.listItemText}>{data.dividend}</Text>
        <Text style={styles.listItemText}>{data.dueAmount}</Text>
      </View>
    );
  };

  const generateTableRows = (data) => {
    return data
      .map((row) => {
        // Filter out the 'id' property from the row
        const { id, ...rowWithoutId } = row;

        // Create table row HTML without the 'id' property
        return `<tr>${Object.values(rowWithoutId)
          .map((cell) => `<td>${cell}</td>`)
          .join("")}</tr>`;
      })
      .join("");
  };

  const generateHeaderRows = (contributionId) => {
    return `
      <tr>
        <th colspan="4" style="font-size: 25px; text-transform: uppercase;">${contributionId.chitGroupName}</th>
      </tr>
      <tr>
        <th>MONTHS</th>
        <th>Due Amount</th>
        <th>Bid Amount</th>
        <th>Dividend</th>
      </tr>
    `;
  };

  const generateHtmlContent = () => {
    const tableRows = generateTableRows(getContributionResponse);
    const headerRows = generateHeaderRows(contributionId);

    return `<html>
      <body style="text-align: center;">
        <div style="margin: 0 auto; text-align: center;">
          <table border="1" style="display: inline-block;">
            <thead>
              ${headerRows}
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        </div>
      </body>
    </html>`;
  };

  const shareLocalFile = async (filePath: string, filename: string) => {
    try {
      const shareOptions = {
        title: "Finance App",
        message: "Finance App Contribution Chart ",
        url: `file://${filePath}`,
        type: "application/pdf", // Replace with the appropriate file type
        filename,
      };
      await Share.open(shareOptions);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const generateUniqueFilename = () => {
    // const timestamp = new Date().getTime();
    return `Contribution.pdf`;
  };

  const handleExportToPdf = async () => {
    try {
      if (Platform.OS === "ios") {
        const filePath = await exportToPdf();
        if (filePath) {
          console.log("PDF File Path:", filePath);
          const filename = generateUniqueFilename();
          shareLocalFile(filePath, filename);
        } else {
          console.log("No PDF file to export.");
        }
      }
      if (Platform.OS === "android") {
        const permissionResult = await request(
          Platform.Version >= 33
            ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
            : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
        );
        switch (permissionResult) {
          case RESULTS.GRANTED:
            const filePath: any = await exportToPdf();
            const destinationPath = RNFS.DownloadDirectoryPath;
            const FileName = "Contribution.pdf";

            const destinationFile = destinationPath + "/" + FileName;

            RNFS.copyFile(filePath, destinationFile)
              .then((result) => {
                return RNFS.unlink(filePath)
                  .then((value) => {
                    Alert.alert("Download Successfully");
                  })
                  .catch((err) => {
                    Alert.alert("Download Failed");
                  });
              })
              .catch((err) => {
                Alert.alert("Failed");
                console.log("err", err);
              });

            break;
          case RESULTS.DENIED:
            console.log("Permission denied.");
            break;
          case RESULTS.BLOCKED:
            showPermissionBlockedMessage();
            break;
          default:
            console.log("Unknown permission result:", permissionResult);
        }
      }
    } catch (error) {
      console.error("Error exporting PDF:", error);
    }
  };

  const exportToPdf = async () => {
    try {
      setIsDownloading(true); // Start the download
      const htmlContent = generateHtmlContent();
      const options = {
        html: htmlContent,
        fileName: "Contribution.pdf",
        directory: RNFS.DocumentDirectoryPath,
      };

      const pdf = await RNHTMLtoPDF.convert(options);
      setIsDownloading(false); // Stop the download
      return pdf.filePath;
    } catch (error) {
      setIsDownloading(false); // Stop the download on error
      console.error("PDF Export Error:", error);
      return null;
    }
  };

  const showPermissionBlockedMessage = () => {
    Alert.alert(
      "Permission Blocked",
      "To export PDF files, please enable the storage permission in your device settings.",
      [
        {
          text: "Open Settings",
          onPress: () => {
            Linking.openSettings();
          },
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colored.headerColor,
    },
    headerContainer: {
      ...Platform.select({
        ios: {
          shadowColor: theme !== "dark" ? colors.silverGrayColor : undefined,
          shadowOffset: { width: 0, height: 3.7 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
        },
        android: {
          elevation: theme !== "dark" ? 5 : undefined,
          shadowColor: theme !== "dark" ? colors.black : undefined,
        },
      }),
      height: ratioHeightBasedOniPhoneX(Platform.OS == "ios" ? 78 : 48),
      paddingTop: ratioHeightBasedOniPhoneX(Platform.OS == "ios" ? 36 : 0),
      flexDirection: "row",
      paddingHorizontal: ratioWidthBasedOniPhoneX(20),
      justifyContent: "space-between",
      backgroundColor:
        theme === "light" ? colored.headerColor : colored.darkheaderColor,
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
      alignItems: "center", // Center the text horizontally
    },
    headerText: {
      color: colors.orange,
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(18)),
    },
    row: {
      justifyContent: "space-between",
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: ratioHeightBasedOniPhoneX(20),
      marginTop: ratioHeightBasedOniPhoneX(10),
    },
    rowItem: {
      justifyContent: "space-between",
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: ratioWidthBasedOniPhoneX(20),
      flex: 1,
    },
    listText: {
      color: colors.dimGray,
      width: ratioWidthBasedOniPhoneX(86),
      textAlign: "center",
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(13)),
    },
    listItemText: {
      color: colored.textColor,
      padding: ratioHeightBasedOniPhoneX(10),
      width: ratioWidthBasedOniPhoneX(86),
      textAlign: "center",
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },
    image: {
      height: ratioWidthBasedOniPhoneX(34),
      width: ratioWidthBasedOniPhoneX(34),
      borderRadius: ratioWidthBasedOniPhoneX(34),
    },
    listBg: {
      backgroundColor: colored.headerColor,
      flex: 1,
      marginTop: ratioHeightBasedOniPhoneX(16),
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    loadingText: {
      color: colors.black,
      marginTop: ratioHeightBasedOniPhoneX(8),
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
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
  });

  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <View
        style={[
          styles.headerContainer,
          Platform.OS == "android" ? styles.androidShadow : styles.iosShadow,
        ]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          {theme === "dark" ? (
            <WhiteBackImage style={styles.backButtonImage} />
          ) : (
            <BackImage style={styles.backButtonImage} />
          )}
        </TouchableOpacity>

        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}>{strings.contributionChart}</Text>
        </View>
        <TouchableOpacity onPress={handleExportToPdf}>
          <ExportImage />
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <Text style={styles.listText}>{strings.months}</Text>
        <Text style={styles.listText}>{strings.bidAmount}</Text>
        <Text style={styles.listText}>{strings.dividend}</Text>
        <Text style={styles.listText}>{strings.dueAmount}</Text>
      </View>
      <View style={styles.listBg}>
        {isDownloading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.red} />
            <Text
              style={styles.loadingText}
            >{`Downloading ${downloadProgress}%`}</Text>
          </View>
        ) : (
          <FlatList
            data={getContributionResponse}
            renderItem={({ item, index }) => renderItem(item, index)}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Contribution;
