import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Platform,
} from "react-native";
import colors, { dark, light } from "../colors";
import {
  NavigationProp,
  useIsFocused,
  useNavigation,
} from "@react-navigation/native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "../Extension/ScreenUtils";
import serverCommunication from "../Networking/serverCommunication";
import URLConstants from "../Networking/URLConstants";
import HTTPStatusCode from "../Networking/HttpStatusCode";
import { useContext, useEffect, useState } from "react";
import { AuctionResponseModel } from "./Model/AuctionResponseModel";
import {
  ProgressDaysDifference,
  calculateAuctionDuration,
  calculateDaysDifference,
  calculateDaysLeft,
  capitalizeFirstLetter,
  formatDate,
  formatTime,
  subtractNanoseconds,
} from "../Utility";
import { ChitStatus } from "../enums";
import DurationProgressBar from "../DurationProgressBar";
import React from "react";
import { ChitGroupResponseModelDatum } from "../ChitFundScreen/Model/ChitGroupResponseModelDatum";
import StorageService from "../StorageService";
import { LoginResponseModel } from "../LoginScreen/Modal/LoginResponseModel";
import { ThemeContext } from "../Networking/themeContext";
import Loader from "../Loader";
import WealthidoFonts from "../Helpers/WealthidoFonts";
import ChitFundImage from "../assets/images/chitDetails_large.svg";
import DollorSymbol from "../assets/images/svg/ant-design_dollar-circle-filled.svg";
import AuctionSymbol from "../assets/images/svg/ri_auction-fill.svg";
import { Divider } from "react-native-paper";
import ShowAlertMessage from "../Popup/showAlertMessage";
import NoData from "../NoData";
import strings from "../Extension/strings";

const OnGoing: React.FC<{ status: string }> = ({ status }) => {
  const navigation: NavigationProp<any> = useNavigation();
  const [auctionList, setUserAuctionList] =
    useState<AuctionResponseModel | null>(null);
  const [response, setResponse] = useState<LoginResponseModel | null>(null);
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();
  const [duration, setDuration] = useState(5); // Replace initialDuration with your actual starting value
  const { theme } = useContext(ThemeContext);
  const colored = theme === "dark" ? dark : light;
  const handleNavigate = (data: ChitGroupResponseModelDatum) => {
    status === ChitStatus.COMPLETED ? null : handleNavigateChitAuction(data);
  };
  const handleNavigateChitDetails = (data: ChitGroupResponseModelDatum) => {
    status === ChitStatus.UPCOMING ? chitDetails(data) : null;
  };

  const handleNavigateChitAuction = async (
    data: ChitGroupResponseModelDatum
  ) => {
    await StorageService.setIsbidAmount(true);
    navigation.navigate("chitAuction", {
      data,
      userId: response?.data?.id,
    });
  };

  const chitDetails = (data: ChitGroupResponseModelDatum) => {
    navigation.navigate("chitDetails", { tag: "4", data });
  };
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupTitle, setPopupTitle] = useState("");

  const showTextPopup = async (title: string, message: string) => {
    setPopupVisible(true);
    setPopupTitle(title);
    setPopupMessage(message);
    return true;
  };

  /**
   * Fetches login response data and sets the response if available.
   * @async
   */
  const fetchData = async () => {
    try {
      const loginResponseData = await StorageService.getIsLogin();
      if (loginResponseData !== null) {
        setResponse(loginResponseData);
      }
    } catch (error) {
      console.error("Error fetching login response data:", error);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchData();
      getUserAuctionList();
    }
  }, [isFocused]);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setDuration((prevDuration) => Math.max(0, prevDuration - 1));
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  /**
   * Fetches the user's auction list and updates the state with the response data.
   * @async
   */
  const getUserAuctionList = async () => {
    // Create an object with request data
    const data = {
      page: 1,
      limit: 1000,
      status: status,
    };
    // Set loading state to true while making the request
    setLoading(true);
    try {
      // Make a POST request to get the auction list
      await serverCommunication.postApi(
        URLConstants.getAuctionList,
        data,
        (
          statusCode: number,
          responseData: AuctionResponseModel,
          error: any
        ) => {
          // Check if the response status is OK and update the user's auction list
          if (!error) {
            if (responseData.status == HTTPStatusCode.ok) {
              setUserAuctionList(responseData);
            }
          } else {
            showTextPopup(strings.error, responseData?.message ?? "");
          }
        }
      );
    } catch (error) {
      // Handle and log any errors that occur during the request
      console.error("Error object:", error);
    } finally {
      // Set loading state back to false after the request is complete
      setLoading(false);
    }
  };

  /**
   * Render an item for a chit group in the list.
   * @param {ChitGroupResponseModelDatum} item - The chit group data to render.
   * @returns {React.JSX.Element} - The rendered component for the item.
   */
  const renderItem = (
    item: ChitGroupResponseModelDatum | any,
    index: number
  ): React.JSX.Element => {
    // Extract auction status information
    const auctionStatus = item.auctionStatus;
    const isAuctionUpcoming = auctionStatus === ChitStatus.UPCOMING;
    const isAuctionCompleted = auctionStatus === ChitStatus.COMPLETED;
    const isAuctionOngoing = auctionStatus === ChitStatus.ONGOING;

    // Calculate the "from" date and days difference
    const fromDate = new Date(item?.from ?? "");
    const daysDifference = calculateDaysDifference(fromDate, item.chitduration);
    const daysLeft = calculateDaysLeft(item.auctionDate);

    // Set the auction duration when an auction is ongoing
    if (isAuctionOngoing && item.auctionDate) {
      setDuration(
        calculateAuctionDuration(
          item.time,
          subtractNanoseconds(item.auctionduration)
        )
      );
    }

    // Calculate auction duration in seconds
    const auctionDurationInSeconds = subtractNanoseconds(item.auctionduration);

    // Callback function when the auction ends
    const onAuctionEnd = () => {
      getUserAuctionList();
    };

    return (
      <View>
        <TouchableOpacity
          onPress={() =>
            isAuctionUpcoming
              ? handleNavigateChitDetails(item)
              : isAuctionCompleted
              ? navigation.navigate("WinnerList", { chitId: item.chitId })
              : handleNavigate(item)
          }
          activeOpacity={isAuctionCompleted ? 1 : 0.4}
        >
          <View
            style={[
              styles.card,
              Platform.OS === "ios" ? styles.iosShadow : styles.androidShadow,
              index == 0 && { marginTop: ratioHeightBasedOniPhoneX(15) },
            ]}
          >
            <View style={styles.justifyCard}>
              <View style={styles.cardInner}>
                <View style={styles.cardImage}>
                  <ChitFundImage />
                </View>
                <View>
                  <Text style={styles.subTitle}>{item.chitGroupName}</Text>
                  <Text style={styles.subTitleEnd}>{item.chitGroupId} </Text>
                  <Text style={styles.subTitleEndYour}>
                    Value :
                    <Text
                      style={styles.subTitleValue}
                    >{`$${item.chitValue}`}</Text>
                  </Text>
                </View>
              </View>
              <View></View>
              <View>
                <AnimatedCircularProgress
                  size={36}
                  width={ratioWidthBasedOniPhoneX(4)}
                  fill={ProgressDaysDifference(fromDate) / item.chitduration}
                  tintColor="#FF8001"
                  backgroundColor={theme === "dark" ? "#808185" : "#FFDBB5"}
                >
                  {(fill) => (
                    <Text style={styles.progressText}>{daysDifference}</Text>
                  )}
                </AnimatedCircularProgress>
              </View>
            </View>
            {isAuctionOngoing && item.auctionduration ? (
              <View style={styles.progress}>
                <DurationProgressBar
                  duration={subtractNanoseconds(item.auctionduration)}
                  auctionDate={item.auctionDate}
                  auctionTime={item.time}
                />
              </View>
            ) : (
              <View style={styles.progress} />
            )}
            <View style={styles.cardFooter}>
              <View style={styles.cardInner}>
                <View>
                  <DollorSymbol />
                </View>
                <View>
                  <Text style={styles.subTitleEndCard}>Due:</Text>
                </View>
                <View>
                  <Text style={styles.subTitleEndblack}>
                    ${item.contribution}
                  </Text>
                </View>
                <View>
                  <AuctionSymbol />
                </View>
                <View>
                  <Text style={styles.errorText}>
                    {item.auctionStatus === ChitStatus.UPCOMING ||
                    item.auctionStatus == ChitStatus.COMPLETED ? (
                      item.auctionDate ? (
                        <Text style={{ color: colored.textColor }}>
                          {daysLeft == 2
                            ? "Tomorrow"
                            : daysLeft == 1
                            ? "Today"
                            : formatDate(item.auctionDate)}
                        </Text>
                      ) : (
                        "No Date"
                      )
                    ) : isAuctionOngoing && item.auctionDate ? (
                      <Text style={{ color: colors.red }}>
                        {formatTime(
                          calculateAuctionDuration(
                            item.time,
                            auctionDurationInSeconds,
                            onAuctionEnd
                          )
                        )}
                      </Text>
                    ) : null}
                  </Text>
                </View>
                <View>
                  <Text style={styles.subTitleEndblack}>
                    {" "}
                    {`(${capitalizeFirstLetter(item.auctionStatus)})`}
                  </Text>
                </View>
              </View>
              <View>
                <Text style={styles.payText}>
                  {isAuctionUpcoming || isAuctionCompleted ? "" : "Bid"}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* <WebSocketExample/> */}
      </View>
    );
  };

  const styles = StyleSheet.create({
    listBg: {
      backgroundColor: colored.headerColor,
      flex: 1,
    },

    image: {
      height: ratioHeightBasedOniPhoneX(64),
      width: ratioWidthBasedOniPhoneX(64),
      borderRadius: ratioHeightBasedOniPhoneX(8),
    },
    card: {
      flex: 1,
      backgroundColor: colored.cardBackGround,
      padding: ratioHeightBasedOniPhoneX(20),
      width: ratioWidthBasedOniPhoneX(335),
      height: ratioHeightBasedOniPhoneX(159),
      borderRadius: ratioHeightBasedOniPhoneX(5),
      justifyContent: "center",
      alignItems: "center",
      marginBottom: ratioHeightBasedOniPhoneX(10),
      marginHorizontal: ratioHeightBasedOniPhoneX(20),
    },
    justifyCard: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: ratioHeightBasedOniPhoneX(20),
    },
    cardInner: {
      flex: 1,
      flexDirection: "row",
    },
    cardImage: {
      marginRight: ratioWidthBasedOniPhoneX(10),
    },

    subTitle: {
      color: colored.textColor,
      ...WealthidoFonts.extraBoldFont(ratioHeightBasedOniPhoneX(16)),
    },
    subTitleEnd: {
      color: colored.lightText,
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(14)),
    },
    subTitleValue: {
      color: colored.lightblack,
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(14)),
    },
    progressText: {
      color: colored.chitsubColor,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(8)),
    },
    progress: {
      marginTop: ratioHeightBasedOniPhoneX(40),
      width: "100%",
    },

    cardFooter: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: ratioHeightBasedOniPhoneX(15),
    },
    subTitleEndCard: {
      color: colored.lightText,
      marginRight: ratioWidthBasedOniPhoneX(5),
      marginLeft: ratioWidthBasedOniPhoneX(5),
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(12)),
    },
    subTitleEndblack: {
      color: colored.lightblack,
      marginRight: ratioWidthBasedOniPhoneX(5),
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(12)),
    },
    payText: {
      color: colors.lightGreen,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(14)),
    },
    subTitleEndGray: {
      color: colors.grayColor,
      marginLeft: ratioWidthBasedOniPhoneX(5),
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },
    errorText: {
      color: colors.error,
      marginLeft: ratioWidthBasedOniPhoneX(5),
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
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
      elevation: 4,
    },
    subTitleEndYour: {
      color: colored.lightText,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(14)),
    },
  });

  return (
    <View style={styles.listBg}>
      {auctionList?.data && auctionList?.data?.list?.length === 0 ? (
        <NoData />
      ) : (
        <FlatList
          data={auctionList?.data?.list}
          renderItem={({ item, index }) => renderItem(item, index)}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item: any) => item.id.toString()}
        ></FlatList>
      )}
      <Loader loading={loading} />
      <ShowAlertMessage
        isVisible={isPopupVisible}
        title={popupTitle}
        message={popupMessage}
        onClose={() => setPopupVisible(false)}
      />
    </View>
  );
};

export default OnGoing;
