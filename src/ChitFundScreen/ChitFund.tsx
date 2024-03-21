import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "../Extension/ScreenUtils";
import { ThemeContext } from "../Networking/themeContext";
import colors, { dark, light } from "../colors";
import HeaderView from "./HeaderView";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { ChitGroupResponseModelDatum } from "./Model/ChitGroupResponseModelDatum";
import { ChitStatus } from "../enums";
import { ChitGroupResponseModel } from "./Model/ChitGroupResponseModel";
import { UserJoinedChitGroupResponseModel } from "./Model/UserJoinedChitGroupResponseModel";
import {
  ProgressDaysDifference,
  calculateDaysDifference,
  calculateDaysLeft,
  calculateProgressRatio,
} from "../Utility";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { Button, Divider, ProgressBar } from "react-native-paper";
import { ChitStatusModelResponse } from "./Model/ChitStatusModelResponse";
import serverCommunication from "../Networking/serverCommunication";
import URLConstants from "../Networking/URLConstants";
import HTTPStatusCode from "../Networking/HttpStatusCode";
import BottomSheet from "react-native-raw-bottom-sheet";
import strings from "../Extension/strings";
import { FilterAuthRequestModel } from "./Model/FilterAuthrequestModel";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import Loader from "../Loader";
import { LoginResponseModel } from "../LoginScreen/Modal/LoginResponseModel";
import ChitFundsExplore from "../ChitFundsExplore/ChitFundsExplore";
import { createInquiry } from "../More/inquiry";
import WealthidoFonts from "../Helpers/WealthidoFonts";
import Slide2 from "../assets/images/StartInvestImage.svg";
import {
  getChitGroups,
  getUserInfo,
  getUserJoinedChitGroup,
  joinConstraint,
} from "./ChitFundController";
import FilterSelectedImage from "../assets/images/FilterselectedImage.svg";
import FilterImage from "../assets/images/Filter_white.svg";
import ChitFundImage from "../assets/images/ChitImage.svg";
import DollorSymbol from "../assets/images/svg/ant-design_dollar-circle-filled.svg";
import AuctionSymbol from "../assets/images/svg/ri_auction-fill.svg";
import FilterImageBlack from "../assets/images/homeImage/FilterImageBlack.svg";
import ShowAlertMessage from "../Popup/showAlertMessage";
import { JoinConstraintResponseModel } from "./Model/JoinConstraintResponseModel";
import NoData from "../NoData";

const searchIcon = require("../assets/images/svg/search.png"); // Replace with the actual path to your search image
const closeIcon = require("../assets/images/Close.png"); // Replace with the actual path to your search image
const options = [
  { durationName: strings.twelveMonths, durationId: 12 },
  { durationName: strings.twentyFour, durationId: 24 },
  { durationName: strings.fourtyEight, durationId: 48 },
];

const ChitFund = () => {
  const navigation: any = useNavigation();
  const { theme } = useContext(ThemeContext);
  const colored = theme === "dark" ? dark : light;
  const [response, setChitGroupsData] = useState<ChitGroupResponseModel | any>(
    null
  );
  const [joinData, setjoinConstraint] = useState<
    JoinConstraintResponseModel | any
  >(null);
  const [getUserDetails, setUserDetails] = useState<LoginResponseModel | null>(
    null
  );
  const [durationtwenty, setDurationtwenty] = React.useState(false);
  const [searchName, setSearch] = useState("");
  const [visible, setVisible] = React.useState(false);
  const [filterData, setFilterData] = useState<
    ChitGroupResponseModelDatum[] | undefined
  >();
  const [userJoinedChitDetails, setUserJoinedChitGroup] =
    useState<UserJoinedChitGroupResponseModel | null>(null);
  const [chitStatus, setChitStatus] = useState<ChitStatusModelResponse | null>(
    null
  );
  const [filter, setFilter] = useState<{ items: string[][] }>({ items: [] });
  const isFocused = useIsFocused();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [value, setValue] = useState<number[]>([1000, 25000]);
  const [amount, setAmount] = useState<number[]>([100, 5000]);
  const [duration, setDuration] = useState<number>();
  const [durationName, setDurationName] = useState<String>();
  const [loading, setLoading] = useState(false);
  const [loadingInvestor, setLoadingInvestor] = useState(false);
  const [dataReceived, setDataReceived] = useState(false);
  const [joinReceived, setJoinReceived] = useState(false);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupTitle, setPopupTitle] = useState("");
  const [showButton, setShowButton] = useState<boolean>(false);
  const CARD_WIDTH = Dimensions.get("window").width * 0.9;

  const showTextPopup = async (title: string, message: string) => {
    setPopupVisible(true);
    setPopupTitle(title);
    setPopupMessage(message);
    return true;
  };

  useEffect(() => {
    if (isFocused) {
      setLoading(true);
      Promise.all([
        getChitGroups(
          (value) => {
            setDataReceived(value);
          },
          (chitGroupsData) => {
            setChitGroupsData(chitGroupsData);
          }
        ),
        getUserJoinedChitGroup(
          (message) => {
            showTextPopup(strings.error, message);
          },
          (loading) => {
            setJoinReceived(loading);
          },
          (responseData) => {
            setUserJoinedChitGroup(responseData);
          }
        ),
        getUserInfo((userData) => {
          setUserDetails(userData);
        }),
        joinConstraint(
          (value) => {
            setDataReceived(value);
          },
          (joinConstraintData) => {
            setjoinConstraint(joinConstraintData);
          }
        ),
      ]).finally(() => {
        setLoading(false);
      });
    }
  }, [isFocused]);

  const validateUserName = (text: string): void => {
    setSearch(text);
    if (text.length >= 1) {
      const data = response?.data.filter(
        (item: any) =>
          item.chitGroupName?.toLowerCase().includes(text.toLowerCase())
      );
      setDurationtwenty(true);
      setFilterData(data);
    } else {
      setDurationtwenty(false);
      setFilterData(response?.data);
    }
  };

  const handleClearSearch = () => {
    setSearch("");
    setDurationtwenty(false);
    setFilterData(response?.data);
  };

  const viewAllButtonPress = async () => {
    if (userJoinedChitDetails?.data) {
      navigation.navigate("yourChitGroups", {
        userJoinedData: userJoinedChitDetails.data,
      });
    }
  };
  const handleNavigate = (tag: any, data: ChitGroupResponseModelDatum) => {
    navigation.navigate("chitDetails", { tag, data });
  };

  const renderFirstTypeItem = (
    data: ChitGroupResponseModelDatum,
    index: any
  ) => {
    const fromDate = new Date(data?.from ?? "");
    const daysDifference = calculateDaysDifference(fromDate, data.chitduration);
    const progressRatio = calculateProgressRatio(
      ProgressDaysDifference(fromDate),
      data.chitduration
    );
    const daysLeft = calculateDaysLeft(data.auctionDate);

    return visible == true || durationtwenty == true ? null : (
      <TouchableOpacity
        onPress={() => {
          data.auctionStatus == ChitStatus.ONGOING &&
          data.chitStatus == ChitStatus.ONGOING
            ? navigation.navigate("chitDetails", { tag: "2", data: data })
            : navigation.navigate("chitDetails", { tag: "1", data: data });
        }}
        activeOpacity={1}
      >
        <View
          style={[
            styles.card,
            {
              width: CARD_WIDTH,
              marginLeft: index != 0 ? ratioWidthBasedOniPhoneX(10) : 0,
            },
          ]}
        >
          <View style={styles.justifyCard}>
            <View style={styles.cardInner}>
              <Image
                style={styles.cardImage}
                source={require("../assets/images/chitDetails_large.png")}
              />
              <View style={{ marginLeft: ratioHeightBasedOniPhoneX(10) }}>
                <Text
                  style={[
                    styles.subTitle,
                    {
                      ...WealthidoFonts.semiBoldFont(
                        ratioHeightBasedOniPhoneX(16)
                      ),
                    },
                  ]}
                >
                  {data.chitGroupName}
                </Text>
                <View style={{ marginTop: ratioHeightBasedOniPhoneX(7) }} />
                <Text style={styles.subTitleEndYour}>{data.chitGroupId} </Text>
                <Text style={styles.subTitleEndSecond}>
                  Value -
                  <Text style={styles.subTitleValue}>
                    {" "}
                    {`$${data.chitValue}`}
                  </Text>
                </Text>
              </View>
            </View>
            <View></View>
            <View>
              <AnimatedCircularProgress
                size={36}
                width={ratioWidthBasedOniPhoneX(4)}
                fill={ProgressDaysDifference(fromDate) / data.chitduration}
                tintColor="#FF8001"
                backgroundColor={theme === "dark" ? "#808185" : "#FFDBB5"}
              >
                {(fill) => (
                  <Text style={styles.progressText}>{daysDifference}</Text>
                )}
              </AnimatedCircularProgress>
            </View>
          </View>
          <View style={styles.progress}>
            <ProgressBar
              progress={progressRatio}
              color={colors.lightGreen}
              style={{
                backgroundColor: colored.progressColor,
                height: ratioHeightBasedOniPhoneX(4),
                borderRadius: ratioHeightBasedOniPhoneX(15),
              }}
            />
          </View>
          <View style={styles.cardFooter}>
            <View style={styles.cardInner}>
              <View style={{ marginTop: ratioHeightBasedOniPhoneX(-1) }}>
                <DollorSymbol />
              </View>
              <View>
                <Text style={styles.subTitleEndCard}>Due:</Text>
              </View>
              <View>
                <Text style={styles.subTitleEndblack}>
                  ${data.contribution}
                </Text>
              </View>
              {!isNaN(daysLeft) ? (
                daysLeft === 0 || daysLeft == 1 ? (
                  <View style={styles.rowContainer}>
                    <AuctionSymbol />
                    <Text style={styles.subTitleEndGray}>Today</Text>
                  </View>
                ) : (
                  <View style={styles.rowContainer}>
                    <AuctionSymbol />
                    <Text style={styles.subTitleEndGray}>
                      {daysLeft} days left
                    </Text>
                  </View>
                )
              ) : null}
            </View>
            <View>
              <Text style={styles.payText}>{"View"}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSecondTypeItem = (
    data: ChitGroupResponseModelDatum,
    index: Number
  ) => {
    const fromDate = new Date(data?.from ?? "");
    const isLastItem = index === response?.data?.length - 1;
    const daysDifference = calculateDaysDifference(fromDate, data.chitduration);
    return (
      <TouchableOpacity
        onPress={() => {
          handleNavigate("0", data);
        }}
        activeOpacity={1}
        style={{
          marginHorizontal: ratioWidthBasedOniPhoneX(
            Platform.OS == "android" ? 20 : 0
          ),
        }}
      >
        <View>
          <View
            style={[styles.cardSecond, isLastItem && styles.lastItemPadding]}
          >
            <View style={styles.justifyCard}>
              <View style={styles.cardInner}>
                <View style={styles.cardImage}>
                  <ChitFundImage />
                </View>

                <View style={{ marginLeft: ratioWidthBasedOniPhoneX(-8) }}>
                  <Text
                    style={[
                      styles.subTitle,
                      {
                        ...WealthidoFonts.semiBoldFont(
                          ratioHeightBasedOniPhoneX(16)
                        ),
                      },
                    ]}
                  >
                    {data.chitGroupName}
                  </Text>
                  <View style={{ marginTop: ratioHeightBasedOniPhoneX(5) }} />
                  <Text style={styles.subTitleEnd}>
                    Eligible for all auctions{" "}
                  </Text>
                </View>
              </View>
              <View>
                <AnimatedCircularProgress
                  size={36}
                  width={ratioWidthBasedOniPhoneX(4)}
                  fill={ProgressDaysDifference(fromDate) / data.chitduration}
                  tintColor="#FF8001"
                  backgroundColor={theme === "dark" ? "#808185" : "#FFDBB5"}
                >
                  {(fill) => (
                    <Text style={styles.progressText}>{daysDifference}</Text>
                  )}
                </AnimatedCircularProgress>
              </View>
              <View></View>
            </View>
            <View style={styles.divider}>
              <Divider
                style={{
                  backgroundColor: colored.progressColor,
                  height: ratioHeightBasedOniPhoneX(1),
                }}
              />
            </View>
            <View style={styles.justifySecondChit}>
              <View>
                <Text style={styles.subTitleEndText}>Chit Value </Text>
                <Text style={styles.subTitleChit}>${data.chitValue}</Text>
              </View>
              <View>
                <Text style={styles.subTitleEndText}>Chit No.</Text>
                <Text style={styles.subTitleChit}>{data.chitGroupId} </Text>
              </View>
              <View>
                <Text style={styles.subTitleEndText}>Duration</Text>
                <Text style={styles.subTitleChit}>{data.chitduration}mo.</Text>
              </View>
            </View>
            <View style={styles.footerContent}>
              <View>
                <Text style={styles.subTitleEndText}>Monthly Subscription</Text>
                <Text style={styles.subTitleChit}>${data.contribution}</Text>
              </View>
              <View style={styles.investButton}>
                <Text style={styles.investButtonText}>Invest</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderStickyheader = () => {
    return (
      <View
        style={[
          styles.stickyHeaderContainer,
          {
            marginHorizontal: ratioWidthBasedOniPhoneX(
              Platform.OS == "android" ? 20 : 0
            ),
          },
        ]}
      >
        <View style={styles.justify}>
          <Text style={styles.subTitle}>{"Digital Chits"}</Text>
          {dataReceived ? (
            response?.data?.length == 0 ? null : (
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  bottomSheetRef.current?.open();
                }}
              >
                {durationtwenty == true ? null : filter.items.length == 0 ? (
                  theme === "dark" ? (
                    <View style={styles.filterImage}>
                      <FilterImageBlack />
                    </View>
                  ) : (
                    <View style={styles.filterImage}>
                      <FilterImage />
                    </View>
                  )
                ) : (
                  <FilterSelectedImage />
                )}
              </TouchableOpacity>
            )
          ) : null}
        </View>
        <FlatList
          data={filter.items[filter.items.length - 1]}
          renderItem={({ item, index }) => renderFilterRow(item, index)} // Pass the item and index directly
          keyExtractor={(item) => item}
          numColumns={2} // Provide a unique key for each item
        />
      </View>
    );
  };

  const renderFilterRow = (item: any, index: any) => (
    <View
      key={item}
      style={[styles.filterContainer, index === 1 && { marginLeft: 10 }]}
    >
      <Text style={[styles.textViewFilter]}>{item}</Text>
    </View>
  );

  const filterList = async (
    startValue: any,
    endValue: any,
    duration: any,
    startAmount: any,
    endAmount: any
  ) => {
    const filterRequestAuth = new FilterAuthRequestModel(
      startValue,
      endValue,
      duration,
      startAmount,
      endAmount
    );
    setLoading(true);
    try {
      await serverCommunication.postApi(
        URLConstants.getChitStatus,
        filterRequestAuth,
        (
          statusCode: number,
          responseData: ChitStatusModelResponse,
          error: any
        ) => {
          if (!error) {
            if (responseData.status == HTTPStatusCode.ok) {
              setChitStatus(responseData);
            }
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
    bottomSheetRef.current?.close();
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colored.headerColor,
      flex: 1,
    },
    searchContainer: {
      ...Platform.select({
        ios: {
          shadowColor: colors.black,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        android: {
          elevation: 4,
          shadowColor: colors.black,
        },
      }),
      borderWidth: theme !== "dark" ? undefined : ratioHeightBasedOniPhoneX(1),
      borderColor: "#222528",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colored.cardBackGround,
      marginTop: ratioHeightBasedOniPhoneX(10),
      borderRadius: ratioHeightBasedOniPhoneX(37),
      marginHorizontal: ratioHeightBasedOniPhoneX(20),
      height: ratioHeightBasedOniPhoneX(40),
    },
    searchInput: {
      flex: 1,
      color: colored.textColor,
      includeFontPadding: false,
      paddingHorizontal: ratioWidthBasedOniPhoneX(20),
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },
    searchIcon: {
      paddingVertical: ratioHeightBasedOniPhoneX(8),
      width: ratioWidthBasedOniPhoneX(20),
      height: ratioHeightBasedOniPhoneX(20),
      marginRight: ratioWidthBasedOniPhoneX(20),
    },
    stickyHeaderContainer: {
      marginTop: visible == true || durationtwenty == true ? 0 : 0,
      zIndex: 1,
      alignContent: "center",
      justifyContent: "center",
    },
    justifyFirst: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      marginTop:
        visible == true || durationtwenty == true
          ? 0
          : ratioHeightBasedOniPhoneX(15),
      justifyContent: "space-between",
      marginHorizontal: ratioWidthBasedOniPhoneX(20),
      marginBottom: ratioHeightBasedOniPhoneX(15),
    },
    chitTitle: {
      height: ratioHeightBasedOniPhoneX(28),
      color: colored.lightblack,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },
    subTitle: {
      color: colored.lightblack,
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(18)),
    },
    subTitleEnd: {
      color: colored.lightText,
      ...WealthidoFonts.regularFont(ratioHeightBasedOniPhoneX(12)),
    },
    subTitleEndSecond: {
      color: colored.lightText,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(14)),
    },
    subTitleValue: {
      color: colored.lightblack,
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(14)),
    },
    subTitleEndYour: {
      color: colored.lightText,
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(14)),
    },
    subTitleEndText: {
      color: colored.lightText,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
      marginBottom: ratioHeightBasedOniPhoneX(1),
    },
    backgroundImage: {
      marginTop: ratioHeightBasedOniPhoneX(20),
      height: ratioHeightBasedOniPhoneX(113),
      borderRadius: ratioHeightBasedOniPhoneX(6),
    },
    bannerInner: {
      marginLeft: ratioWidthBasedOniPhoneX(78),
      padding: ratioHeightBasedOniPhoneX(24),
      position: "absolute",
    },
    textTitle: {
      color: colors.white,
      marginBottom: ratioHeightBasedOniPhoneX(5),
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(16)),
    },
    text: {
      color: colors.white,
      ...WealthidoFonts.regularFont(ratioHeightBasedOniPhoneX(12)),
    },
    textViewFilter: {
      color: colored.textColorFilter,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(13)),
    },
    justify: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      alignContent: "center",
      marginTop:
        visible == true || durationtwenty == true
          ? 0
          : ratioHeightBasedOniPhoneX(15),
      justifyContent: "space-between",
      marginBottom: ratioHeightBasedOniPhoneX(15),
    },
    subTitleText: {
      color: colored.textColor,
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
    },
    filterImage: {
      ...Platform.select({
        ios: {
          shadowColor: colors.black,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
        },
        android: {
          elevation: 4,
          shadowColor: colors.black,
        },
      }),
      height: ratioHeightBasedOniPhoneX(36),
      width: ratioWidthBasedOniPhoneX(36),
      borderRadius: ratioHeightBasedOniPhoneX(36),
      justifyContent: "center",
      alignItems: "center",
    },
    NoData: {
      color: colored.black,
      fontSize: ratioHeightBasedOniPhoneX(20),
      fontFamily: "Inter-SemiBold",
      justifyContent: "center",
      textAlign: "center",
      alignItems: "center",
      alignContent: "center",
      marginTop: ratioHeightBasedOniPhoneX(130),
    },
    card: {
      ...Platform.select({
        ios: {
          shadowColor: colors.black,
          shadowOffset: { width: 0.2, height: 0.2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        android: {
          shadowColor: colors.black,
          elevation: 8,
        },
      }),
      backgroundColor: colored.cardBackGround,
      padding: ratioHeightBasedOniPhoneX(20),
      width: ratioWidthBasedOniPhoneX(330),
      height: ratioHeightBasedOniPhoneX(159),
      borderRadius: ratioHeightBasedOniPhoneX(5),
      marginVertical: ratioHeightBasedOniPhoneX(10),
    },
    justifyCard: {
      flex: 1,
      flexDirection: "row",
      marginBottom: ratioHeightBasedOniPhoneX(20),
    },
    cardInner: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "flex-start",
    },
    cardImage: {
      height: ratioHeightBasedOniPhoneX(65),
      width: ratioWidthBasedOniPhoneX(65),
    },
    progressText: {
      color: colored.chitsubColor,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(8)),
    },
    progress: {
      marginTop: ratioHeightBasedOniPhoneX(40),
      width: "100%",
      marginBottom: ratioHeightBasedOniPhoneX(0),
    },
    cardFooter: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: ratioHeightBasedOniPhoneX(15),
    },
    subTitleEndCard: {
      color: colors.spanishGray,
      marginRight: ratioWidthBasedOniPhoneX(5),
      marginLeft: ratioWidthBasedOniPhoneX(5),
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },
    subTitleEndblack: {
      color: colored.lightblack,
      marginRight: ratioWidthBasedOniPhoneX(5),
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },
    rowContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    rowContainerFilter: {
      flexDirection: "row",
      marginTop: ratioHeightBasedOniPhoneX(10),
      justifyContent: "space-between",
    },
    subTitleEndGray: {
      color: colors.spanishGray,
      marginLeft: ratioWidthBasedOniPhoneX(5),
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },
    payText: {
      color: colors.lightGreen,
      marginTop: ratioHeightBasedOniPhoneX(-2),
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(14)),
    },
    cardSecond: {
      ...Platform.select({
        ios: {
          shadowColor: colors.black,
          shadowOffset: { width: 0.3, height: 0.3 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        android: {
          shadowColor: colors.black,
          elevation: 8,
        },
      }),
      backgroundColor: colored.cardBackGround,
      padding: ratioHeightBasedOniPhoneX(15),
      height: ratioHeightBasedOniPhoneX(188),
      marginBottom: ratioHeightBasedOniPhoneX(10),
      borderRadius: ratioHeightBasedOniPhoneX(8),
    },
    lastItemPadding: {
      marginBottom: ratioHeightBasedOniPhoneX(
        Platform.OS == "android" ? 85 : 110
      ),
    },
    divider: {
      position: "relative",
    },
    justifySecondChit: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      position: "relative",
      top: ratioHeightBasedOniPhoneX(10),
      justifyContent: "space-between",
      marginBottom: ratioHeightBasedOniPhoneX(10),
    },
    subTitleChit: {
      color: colored.chitsubColor,
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(14)),
    },
    footerContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: ratioHeightBasedOniPhoneX(10),
    },
    investButton: {
      backgroundColor: colors.orange,
      justifyContent: "center",
      paddingVertical: ratioHeightBasedOniPhoneX(8),
      borderRadius: ratioHeightBasedOniPhoneX(22),
      paddingHorizontal: ratioHeightBasedOniPhoneX(17),
    },
    investButtonText: {
      color: colors.white,
      textAlign: "center",
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(14)),
    },
    filterContainer: {
      height: ratioHeightBasedOniPhoneX(35),
      borderRadius: ratioHeightBasedOniPhoneX(20),
      backgroundColor: colored.FilterBg,
      borderColor: colored.shadowcolor,
      borderWidth: ratioWidthBasedOniPhoneX(1.5),
      width: ratioWidthBasedOniPhoneX(160),
      justifyContent: "center",
      alignItems: "center",
      marginBottom: ratioHeightBasedOniPhoneX(10),
    },
    containerBottom: {
      backgroundColor:
        theme === "light" ? colored.FilterBg : colored.segementBackGround,
      paddingLeft: ratioWidthBasedOniPhoneX(20),
      paddingRight: ratioHeightBasedOniPhoneX(20),
      marginTop: ratioHeightBasedOniPhoneX(-15),
    },
    filterText: {
      color: colored.textColor,
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
    },
    resetText: {
      color: colors.lightGreen,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(16)),
    },
    reset: {
      marginTop: ratioWidthBasedOniPhoneX(3),
      color: colors.dimGray,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(14)),
    },
    durationText: {
      backgroundColor: theme === "light" ? colored.FilterBg : "transparent",
      marginTop: ratioHeightBasedOniPhoneX(10),
      color: theme === "light" ? colored.textColorFilter : colors.white,
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(14)),
    },
    seekBarText: {
      color: colored.lightText,
      marginTop: ratioHeightBasedOniPhoneX(15),
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(12)),
    },
    durationRow: {
      flexDirection: "row",
    },
    backButton: {
      backgroundColor: colored.buttonGray,
      height: ratioHeightBasedOniPhoneX(48),
      flex: 1,
      justifyContent: "center",
      borderRadius: ratioHeightBasedOniPhoneX(40),
    },
    bottomContainer: {
      marginTop: "auto",
      flexDirection: "row",
      gap: ratioHeightBasedOniPhoneX(9),
      backgroundColor: theme === "light" ? colored.headerColor : "transparent",
      height: ratioHeightBasedOniPhoneX(62),
      marginBottom: ratioHeightBasedOniPhoneX(25),
      borderTopWidth:
        theme === "light" ? undefined : ratioHeightBasedOniPhoneX(1),
      borderColor: "#222528",
    },
    button: {
      backgroundColor: colored.lightGreen,
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      height: ratioHeightBasedOniPhoneX(40),
      marginVertical: ratioHeightBasedOniPhoneX(16),
      borderRadius: ratioHeightBasedOniPhoneX(37),
    },
    buttonText: {
      color: colors.white,
      textAlign: "center",
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
    },
    cancelText: {
      color: colored.textColor,
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
    },
    spacing: {
      marginHorizontal: ratioWidthBasedOniPhoneX(9),
    },
    trackStyle: {
      height: ratioHeightBasedOniPhoneX(5),
      color: colors.lightGreen,
      borderRadius: ratioHeightBasedOniPhoneX(5),
    },
    imageB: {
      height: ratioHeightBasedOniPhoneX(25),
      width: ratioWidthBasedOniPhoneX(25),
      justifyContent: "center",
      alignItems: "center",
      padding: ratioHeightBasedOniPhoneX(15),
      marginTop: ratioHeightBasedOniPhoneX(10),
    },
    durationContainerGreen: {
      flexDirection: "row",
      height: ratioHeightBasedOniPhoneX(36),
      borderRadius: ratioHeightBasedOniPhoneX(30),
      backgroundColor: colors.green,
      marginTop: ratioHeightBasedOniPhoneX(9),
      width: ratioWidthBasedOniPhoneX(130),
      borderWidth:
        theme === "light"
          ? ratioWidthBasedOniPhoneX(1)
          : ratioWidthBasedOniPhoneX(0),
      borderColor: colors.white,
      justifyContent: "center",
      alignItems: "center",
    },
    durationContainer: {
      height: ratioHeightBasedOniPhoneX(36),
      borderRadius: ratioHeightBasedOniPhoneX(30),
      backgroundColor: colored.FilterBg,
      marginTop: ratioHeightBasedOniPhoneX(9),
      borderColor: colored.shadowcolor,
      borderWidth: ratioWidthBasedOniPhoneX(1),
      width: ratioWidthBasedOniPhoneX(130),
      justifyContent: "center",
      alignItems: "center",
    },
    textViewGreen: {
      color: colors.white,
      textAlign: "center",
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(14)),
    },
    textView: {
      color: colored.textColorFilter,
      textAlign: "center",
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(13)),
    },
    stackButtonContainer: {
      marginHorizontal: ratioWidthBasedOniPhoneX(94),
      height: ratioHeightBasedOniPhoneX(48),
      backgroundColor: "transparent",
      position: "absolute",
      bottom:
        Platform.OS == "android"
          ? ratioHeightBasedOniPhoneX(20)
          : ratioHeightBasedOniPhoneX(20),
      left: 0,
      right: 0,
    },
    stackButton: {
      flexDirection: "row", // Display image and text in a row
      alignContent: "center",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.orange,
      height: ratioHeightBasedOniPhoneX(50),
      borderRadius: ratioHeightBasedOniPhoneX(25),
      paddingHorizontal: ratioWidthBasedOniPhoneX(25),
    },
    buttonImage: {
      width: ratioWidthBasedOniPhoneX(20),
      height: ratioHeightBasedOniPhoneX(20),
      marginRight: 8,
    },
    listContainer: {
      flex: 1,
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

  function renderUserJoinedChitDetails() {
    if (
      userJoinedChitDetails?.data?.list &&
      userJoinedChitDetails.data.list.length > 0
    ) {
      return (
        <View style={styles.stickyHeaderContainer}>
          <View
            style={[
              styles.justifyFirst,
              {
                marginBottom: ratioHeightBasedOniPhoneX(0),
                marginTop: ratioHeightBasedOniPhoneX(15),
              },
            ]}
          >
            <View
              style={
                visible == true || durationtwenty == true
                  ? null
                  : styles.chitTitle
              }
            >
              <Text
                style={
                  visible == true || durationtwenty == true
                    ? null
                    : styles.subTitle
                }
              >
                {visible == true || durationtwenty == true
                  ? null
                  : "Your Digital Chits"}
              </Text>
            </View>
            <TouchableOpacity onPress={viewAllButtonPress} activeOpacity={1}>
              <View
                style={
                  visible == true || durationtwenty == true
                    ? null
                    : styles.chitTitle
                }
              >
                <Text
                  style={
                    visible == true || durationtwenty == true
                      ? null
                      : [
                          styles.subTitleEnd,
                          {
                            ...WealthidoFonts.semiBoldFont(
                              ratioHeightBasedOniPhoneX(14)
                            ),
                          },
                        ]
                  }
                >
                  {visible == true || durationtwenty == true
                    ? null
                    : "View All"}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View>
            <FlatList
              data={userJoinedChitDetails.data.list}
              renderItem={({ item, index }) => renderFirstTypeItem(item, index)}
              keyExtractor={(item: any) => item.id}
              snapToAlignment="center"
              pagingEnabled={true}
              snapToInterval={CARD_WIDTH + ratioWidthBasedOniPhoneX(20)}
              showsHorizontalScrollIndicator={false}
              scrollEventThrottle={1}
              contentContainerStyle={{
                paddingHorizontal: ratioWidthBasedOniPhoneX(20),
              }}
              horizontal={true}
            />
          </View>
        </View>
      );
    }
  }

  function renderChitGroups() {
    if (
      (filterData && filterData?.length === 0) ||
      (chitStatus && chitStatus?.data?.list?.length === 0) ||
      response?.data?.length == 0
    ) {
      return (
        <>
          <View style={styles.stickyHeaderContainer}>
            <View
              style={[
                styles.justify,
                { marginHorizontal: ratioWidthBasedOniPhoneX(20) },
              ]}
            >
              <Text style={[styles.subTitle]}>{"Digital Chits"}</Text>
              {dataReceived ? (
                response?.data?.length == 0 ? null : (
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {
                      bottomSheetRef.current?.open();
                    }}
                  >
                    {durationtwenty == true ? null : filter.items.length ==
                      0 ? (
                      theme === "dark" ? (
                        <View style={styles.filterImage}>
                          <FilterImageBlack />
                        </View>
                      ) : (
                        <View style={styles.filterImage}>
                          <FilterImage />
                        </View>
                      )
                    ) : (
                      <FilterSelectedImage />
                    )}
                  </TouchableOpacity>
                )
              ) : null}
            </View>
            <FlatList
              data={filter.items[filter.items.length - 1]}
              renderItem={({ item, index }) => renderFilterRow(item, index)}
              keyExtractor={(item) => item}
              contentContainerStyle={{
                marginHorizontal: ratioWidthBasedOniPhoneX(20),
              }}
              numColumns={2}
            />
          </View>
          <NoData />
        </>
      );
    } else {
      return (
        <FlatList
          data={
            durationtwenty
              ? filterData
              : visible
              ? chitStatus?.data?.list
              : response?.data || []
          }
          renderItem={({ item, index }) => renderSecondTypeItem(item, index)}
          ListHeaderComponent={renderStickyheader}
          stickyHeaderIndices={[0]}
          contentContainerStyle={{
            marginHorizontal: ratioWidthBasedOniPhoneX(
              Platform.OS == "ios" ? 20 : 0
            ),
          }}
          keyExtractor={(item) => item.id}
        />
      );
    }
  }

  function createMultiSlider(
    values: any,
    onValuesChange: any,
    min: any,
    max: any,
    step: any
  ) {
    return (
      <MultiSlider
        values={values}
        sliderLength={ratioWidthBasedOniPhoneX(315)}
        onValuesChange={onValuesChange}
        trackStyle={styles.trackStyle}
        min={min}
        max={max}
        step={step}
        snapped
        allowOverlap
        customMarker={(e) => (
          <View>
            <Image
              source={require("../assets/images/Ellipse2.png")}
              style={styles.imageB}
            />
          </View>
        )}
        selectedStyle={{
          backgroundColor: colored.lightGreen,
        }}
        unselectedStyle={{
          backgroundColor: colors.lightGray,
        }}
      />
    );
  }

  const handleValueAmountChange = (newValue: number[]) => {
    setAmount(newValue);
  };

  const handleValueChange = (newValue: number[]) => {
    setValue(newValue);
  };

  const handleButtonClick = () => {
    let startValue = value[0];
    let endValue = value[1];
    let startAmount = amount[0];
    let endAmount = amount[1];

    filterList(startValue, endValue, duration, startAmount, endAmount);
    setFilter({ items: [] });

    // Calculate chitValue
    const chitValue = calculateChitValue(value[0], value[1]);
    const amountValue = calculateAmountValue(amount[0], amount[1]);

    // Append data based on conditions
    appendData(
      chitValue,
      durationName === undefined ? null : durationName,
      amountValue
    );

    // Set visibility
    setVisible(true);
  };

  const calculateChitValue = (value1: number, value2: number) => {
    if (value1 !== 1000 || value2 !== 25000) {
      return `$${value1} - $${value2}`;
    }
    return null;
  };

  const calculateAmountValue = (amount1: number, amount2: number) => {
    if (amount1 !== 100 || amount2 !== 5000) {
      return `$${amount1} - $${amount2}`;
    }
    return null;
  };

  const appendData = async (chitValue: any, duration: any, amount: any) => {
    await setFilter({ items: [] });
    const newDataItem = [];

    if (chitValue) {
      newDataItem.push(chitValue);
    }
    if (duration) {
      newDataItem.push(duration);
    }
    if (amount) {
      newDataItem.push(amount);
    }

    // Create a new object with the updated data
    const updatedData = {
      ...filter,
      items: [...filter.items, newDataItem],
    };

    // Update the state with the new object
    setFilter(updatedData);
  };

  const rows: { durationName: string; durationId: number }[][] = [];
  for (let i = 0; i < options.length; i += 2) {
    rows.push(options.slice(i, i + 2));
  }

  const renderRow = (rowItems: any) => {
    return (
      <View style={[styles.durationRow]}>
        {rowItems.map((item: any, index: any) => (
          <TouchableOpacity
            key={item.durationId.toString()}
            onPress={() => {
              setDuration(item.durationId);
              setDurationName(item.durationName);
            }}
            activeOpacity={1}
            style={[
              duration === item.durationId
                ? styles.durationContainerGreen
                : styles.durationContainer,
              index === 1 ? { marginLeft: 10 } : null, // Apply spacing to the second item
            ]}
          >
            <Text
              style={
                duration === item.durationId
                  ? styles.textViewGreen
                  : styles.textView
              }
            >
              {item.durationName}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const onInvestorPress = async () => {
    // You can perform any actions you want here
    await joinConstraint(
      (value) => {
        setDataReceived(value);
      },
      (joinConstraintData) => {
        setjoinConstraint(joinConstraintData);
        setLoading(false);
        setLoadingInvestor(false);
      }
    );
  };

  const kycOnPress = () => {
    if (joinData?.data?.investorProfileStatus == false) {
      setLoadingInvestor(true);
      return navigation.navigate("InvestorProfile", {
        onGoBack: onInvestorPress,
      });
    }
    if (getUserDetails?.data?.kycstatus === "REJECTED") {
      setLoadingInvestor(false);
      navigation.navigate("KycUpload");
    } else if (
      getUserDetails?.data?.kycstatus !== "APPROVED" ||
      joinData?.data?.kycStatus == false
    ) {
      setLoadingInvestor(false);
      setLoading(true);
      createInquiry({
        onPressIn: async () => {
          await joinConstraint(
            (value) => {
              setDataReceived(value);
            },
            (joinConstraintData) => {
              setjoinConstraint(joinConstraintData);
            }
          );
        },
        inquiryId: getUserDetails?.data?.personaInquiryId,
        sessionToken: getUserDetails?.data?.personaSessionId,
      });
    }
  };

  return (
    <View style={{ backgroundColor: colored.headerColor, flex: 1 }}>
      <StatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={theme === "dark" ? colored.darkheaderColor : "white"}
        translucent={false}
      />
      <Loader loading={loading}>
        {joinData?.data?.kycStatus == true ? (
          <View style={styles.container}>
            <HeaderView
              title="Digital Chits"
              onPress={() => {
                navigation.navigate("TransactionScreen");
              }}
            />

            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search"
                placeholderTextColor={colored.dimGray}
                underlineColorAndroid="transparent"
                cursorColor={colored.textColor}
                onChangeText={validateUserName}
                value={searchName}
              />
              {searchName.length > 0 ? (
                <TouchableOpacity onPress={handleClearSearch}>
                  <Image source={closeIcon} style={styles.searchIcon} />
                </TouchableOpacity>
              ) : (
                <Image source={searchIcon} style={styles.searchIcon} />
              )}
            </View>

            <ScrollView
              style={styles.listContainer}
              showsVerticalScrollIndicator={false}
            >
              {renderUserJoinedChitDetails()}
              {renderChitGroups()}
            </ScrollView>

            <View style={styles.stackButtonContainer}>
              <TouchableOpacity
                style={styles.stackButton}
                onPress={() => {
                  navigation.navigate("AuctionScreen");
                }}
              >
                <Image
                  source={require("../assets/images/megaphone.png")}
                  style={styles.buttonImage}
                />
                <Text style={styles.buttonText}>View Auction</Text>
              </TouchableOpacity>
            </View>

            <BottomSheet
              ref={bottomSheetRef} // Set the height
              closeOnDragDown
              dragFromTopOnly
              customStyles={{
                draggableIcon: { backgroundColor: "transparent" },
                container: {
                  backgroundColor: colored.FilterBg,
                  borderRadius:
                    theme == "light" ? ratioWidthBasedOniPhoneX(10) : 0,
                  height: "auto",
                },
              }}
            >
              <View style={styles.containerBottom}>
                <View style={styles.rowContainerFilter}>
                  <Text style={styles.filterText}> {strings.filter} </Text>
                  {showButton == true ? (
                    <TouchableOpacity
                      onPress={() => {
                        bottomSheetRef.current?.close();
                        setValue([1000, 25000]);
                        setAmount([100, 5000]);
                        filterList(null, null, null, null, null);
                        setVisible(false);
                        setFilter({ items: [] });
                        setDuration(undefined);
                        setDurationName(undefined);
                        setShowButton(false);
                      }}
                    >
                      <Text style={styles.resetText}> {strings.reset} </Text>
                    </TouchableOpacity>
                  ) : (
                    <Text style={styles.reset}> {strings.reset} </Text>
                  )}
                </View>

                <Text style={styles.durationText}>Chit Value</Text>
                <View style={styles.rowContainer}>
                  <Text style={styles.seekBarText}>${value[0]}</Text>
                  <Text style={styles.seekBarText}>${value[1]}</Text>
                </View>
                <View style={{ paddingLeft: ratioWidthBasedOniPhoneX(5) }}>
                  {createMultiSlider(
                    value,
                    handleValueChange,
                    1000,
                    25000,
                    1000
                  )}
                </View>
                <View style={{ marginTop: ratioHeightBasedOniPhoneX(-15) }} />
                <Text
                  style={[
                    styles.durationText,
                    { marginBottom: ratioHeightBasedOniPhoneX(10) },
                  ]}
                >
                  Duration
                </Text>
                {rows.map((row, index) => (
                  <View key={index.toString()}>{renderRow(row)}</View>
                ))}
                <Text
                  style={[
                    styles.durationText,
                    { marginTop: ratioHeightBasedOniPhoneX(20) },
                  ]}
                >
                  {strings.monthlySubscription}
                </Text>
                <View style={styles.rowContainer}>
                  <Text style={styles.seekBarText}>${amount[0]}</Text>
                  <Text style={styles.seekBarText}>${amount[1]}</Text>
                </View>
                <View style={{ paddingLeft: ratioWidthBasedOniPhoneX(5) }}>
                  {createMultiSlider(
                    amount,
                    handleValueAmountChange,
                    100,
                    5000,
                    100
                  )}
                </View>
                <View style={styles.bottomContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      bottomSheetRef.current?.close();
                    }}
                    style={[
                      styles.button,
                      {
                        backgroundColor: colored.buttonGray,
                      },
                    ]}
                  >
                    <Text
                      style={[styles.buttonText, { color: colored.lightblack }]}
                    >
                      {strings.cancel}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      handleButtonClick();
                      setShowButton(true);
                    }}
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>{strings.apply}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </BottomSheet>
          </View>
        ) : loadingInvestor ? (
          <Loader loading={loadingInvestor}>
            <ChitFundsExplore
              onPress={kycOnPress}
              buttonBackGroundColor={colors.orange}
              HeaderImage={Slide2}
              title={"Digital Chits: A savings and borrowing model"}
              description={
                "Digital Chits facilitate both saving and borrowing within a trusted community. Members contribute towards a common fund, and each month, a lucky member gets access to the total funds through a fair auction system, helping them achieve their financial goals."
              }
              theme={""}
            />
          </Loader>
        ) : (
          <ChitFundsExplore
            onPress={kycOnPress}
            buttonBackGroundColor={colors.orange}
            HeaderImage={Slide2}
            title={"Digital Chits: A savings and borrowing model"}
            description={
              "Digital Chits facilitate both saving and borrowing within a trusted community. Members contribute towards a common fund, and each month, a lucky member gets access to the total funds through a fair auction system, helping them achieve their financial goals."
            }
            theme={""}
          />
        )}
        <ShowAlertMessage
          isVisible={isPopupVisible}
          title={popupTitle}
          message={popupMessage}
          onClose={() => setPopupVisible(false)}
        />
      </Loader>
    </View>
  );
};

export default ChitFund;
