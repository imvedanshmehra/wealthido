import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Platform,
  Alert,
  Linking,
} from "react-native";
import strings from "../Extension/strings";
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "../Extension/ScreenUtils";
import React, { useContext, useEffect, useState } from "react";
import serverCommunication from "../Networking/serverCommunication";
import URLConstants from "../Networking/URLConstants";
import {
  AuctionHistoryModelDatum,
  AuctionHistoryModelResponse,
} from "./Model/AuctionHistoryModel";
import { ThemeContext } from "../Networking/themeContext";
import RNHTMLtoPDF from "react-native-html-to-pdf";
import RNFS from "react-native-fs";
import { check, PERMISSIONS, request, RESULTS } from "react-native-permissions";
import Share from "react-native-share";
import colors, { dark, light } from "../colors";
import WealthidoFonts from "../Helpers/WealthidoFonts";
import BackImage from "../assets/images/back.svg";
import WhiteBackImage from "../assets/images/WhiteBack.svg";
import ExportImage from "../assets/images/contributionchart.svg";
import { Divider } from "react-native-paper";

const WinnerList = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const route = useRoute();
  const { theme } = useContext(ThemeContext);
  const colored = theme === "dark" ? dark : light;
  const { chitId } = route.params as { chitId: any };
  const [getContributionResponse, setGetContribution] =
    useState<AuctionHistoryModelResponse | null>(null);

  useEffect(() => {
    if (isFocused) {
      const getContribution = async () => {
        try {
          await serverCommunication.postApi(
            `${URLConstants.getAuctionHistory}${chitId}`,
            [],
            (statusCode: any, responseData: any, error: any) => {
              setGetContribution(responseData);
            }
          );
        } catch (error) {
          console.log("Error:", error);
        }
      };
      getContribution();
    }
  }, [isFocused]);

  /**
   * Increment and return the provided index by one.
   *
   * @param {number} index - The index to be incremented.
   * @returns {number} The incremented index.
   */
  const counts = (index: number) => {
    return ++index;
  };

  /**
   * Render an item for the auction history list.
   *
   * @param {AuctionHistoryModelDatum} data - The auction history data to render.
   * @param {number} index - The index of the item in the list.
   * @returns {React.JSX.Element} - The rendered component for the item.
   */
  const renderItem = (
    data: AuctionHistoryModelDatum,
    index: number
  ): React.JSX.Element => (
    <View style={styles.rowItem}>
      <Text style={styles.listItemText}>{counts(index)}</Text>
      <Text style={styles.listItemText}>{data.winnerName}</Text>
      <Text style={styles.listItemText}>{data.highestBid}</Text>
      <Text style={styles.listItemText}>{data.winningAmount}</Text>
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colored.headerColor,
    },
    headerContainer: {
      flexDirection: "row",
      backgroundColor: colored.headerColor,
      marginTop: ratioHeightBasedOniPhoneX(20),
      justifyContent: "space-between",
      alignItems: "center",
      marginHorizontal: ratioWidthBasedOniPhoneX(16),
      // Center the items vertically
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
      ...WealthidoFonts.extraBoldFont(ratioHeightBasedOniPhoneX(16)),
      color: colored.textColor,
    },

    row: {
      justifyContent: "space-around",
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: ratioWidthBasedOniPhoneX(16),
      marginTop: ratioHeightBasedOniPhoneX(20),
    },
    rowItem: {
      justifyContent: "space-around",
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: ratioWidthBasedOniPhoneX(16),
      flex: 1,
    },
    NoData: {
      color: colored.textColor,
      justifyContent: "center",
      textAlign: "center",
      alignItems: "center",
      alignContent: "center",
      marginTop: ratioHeightBasedOniPhoneX(130),
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(20)),
    },
    listText: {
      color: colored.dimGray,
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
      height: ratioHeightBasedOniPhoneX(34),
      width: ratioWidthBasedOniPhoneX(34),
      marginRight: ratioWidthBasedOniPhoneX(15),
      resizeMode: "contain",
    },
    listBg: {
      backgroundColor: colored.headerColor,
      flex: 1,
      marginTop: ratioHeightBasedOniPhoneX(16),
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
      elevation: 2,
    },
  });

  const generateHtmlContent = () => {
    if (!getContributionResponse) {
      return "";
    }
    const tableRows = getContributionResponse.data
      .map((row) => {
        return `<tr>
                <td>${1}</td>
                <td>${row.winnerName}</td>
                <td>${row.highestBid}</td>
                <td>${row.winningAmount}</td>
          
              </tr>`;
      })
      .join("");

    const headerRow = `
      <tr>
        <th colspan="4" style="font-size: 25px; text-transform: uppercase;">${"Winner List"}</th>
      </tr>
      <tr>
        <th>MONTHS</th>
        <th>Winner Name</th>
        <th>Bid Amount</th>
        <th>Prize Money</th>
      </tr>
    `;

    return `<html>
      <body style="text-align: center;">
        <div style="margin: 0 auto; text-align: center;">
          <table border="1" style="display: inline-block;">
            <thead>
              ${headerRow}
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        </div>
      </body>
    </html>`;
  };

  const exportToPdf = async () => {
    try {
      const htmlContent = generateHtmlContent();

      if (!htmlContent) {
        console.log("No data to export to PDF.");
        return;
      }

      const options = {
        html: htmlContent,
        fileName: "WinnerList.pdf",
        directory: RNFS.DocumentDirectoryPath,
      };

      const pdf = await RNHTMLtoPDF.convert(options);
      return pdf.filePath;
    } catch (error) {
      console.error("PDF Export Error:", error);
      return null;
    }
  };

  const shareLocalFile = async (filePath: string, filename: string) => {
    try {
      const shareOptions = {
        title: "Finance App",
        message: "Finance App Winner List ",
        url: `file://${filePath}`,
        type: "application/pdf", // Replace with the appropriate file type
        filename,
      };
      await Share.open(shareOptions);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleExportToPdf = async () => {
    try {
      if (Platform.OS === "ios") {
        const filePath = await exportToPdf();
        if (filePath) {
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
            const FileName = "WinnerList.pdf";

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
                console.log("err", err);
              });

            break;
          case RESULTS.DENIED:
            break;
          case RESULTS.BLOCKED:
            showPermissionBlockedMessage();
            break;
          default:
        }
      }
    } catch (error) {
      console.error("Error exporting PDF:", error);
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

  const generateUniqueFilename = () => {
    return `WinnerList.pdf`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          {theme === "dark" ? (
            <WhiteBackImage style={styles.backButtonImage} />
          ) : (
            <BackImage style={styles.backButtonImage} />
          )}
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}>Winner List</Text>
        </View>
        <TouchableOpacity onPress={handleExportToPdf}>
          <ExportImage />
        </TouchableOpacity>
      </View>
      <Divider
        style={[
          {
            height: ratioHeightBasedOniPhoneX(1),
            backgroundColor: colored.shadowcolor,
            marginTop: ratioHeightBasedOniPhoneX(15),
          },
          Platform.OS == "android" ? styles.androidShadow : styles.iosShadow,
        ]}
      />
      <View style={styles.row}>
        <Text style={styles.listText}>{strings.months}</Text>
        <Text style={styles.listText}>{strings.winnerList}</Text>
        <Text style={styles.listText}>{strings.bidAmount}</Text>
        <Text style={styles.listText}>{strings.prizeMoney}</Text>
      </View>
      <View style={styles.listBg}>
        {getContributionResponse && getContributionResponse.data.length == 0 ? (
          <Text style={styles.NoData}>No Data</Text>
        ) : (
          <FlatList
            data={getContributionResponse?.data}
            renderItem={({ item, index }) => renderItem(item, index)}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item: any) => item.id}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default WinnerList;
