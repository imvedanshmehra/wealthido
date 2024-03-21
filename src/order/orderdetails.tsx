import {
  View,
  Text,
  Image,
  StyleSheet,
  RootTag,
  SafeAreaView,
  TouchableOpacity,
  Platform,
} from "react-native";
import colors, { dark, light } from "../colors";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "../Extension/ScreenUtils";
import { useContext } from "react";
import React from "react";
import { ThemeContext } from "../Networking/themeContext";
import Timeline from "react-native-timeline-flatlist";

const OrderDetails: React.FC<{ status: string }> = ({ status }) => {
  const navigation: NavigationProp<RootTag> = useNavigation();
  const { theme } = useContext(ThemeContext);
  const colored = theme === "dark" ? dark : light;
  const data = [
    { title: "Ordered Sunday , 14 Jul 2023" },
    {
      title: "Shipped Monday , 14 Jul 2023",
      description: "Package Left",
      icon: require("../assets/images/truck.png"),
    },
    { title: "Out for delivery", color: colors.dimGray },
    { title: "Arriving Wednesday", color: colors.dimGray },
  ];
  const renderDetail = (rowData) => {
    let title = <Text style={styles.subTitle}>{rowData.title}</Text>;
    var desc = null;
    if (rowData.description)
      desc = (
        <View>
          <Text style={styles.subTitleEnd}>{rowData.description}</Text>
        </View>
      );
    return (
      <View>
        {title}
        {desc}
      </View>
    );
  };
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colored.headerColor,
    },
    headerContainer: {
      marginTop: ratioHeightBasedOniPhoneX(20),
      flexDirection: "row",
      marginHorizontal: ratioWidthBasedOniPhoneX(11),
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
      fontFamily: "Inter-Bold",
      fontSize: ratioHeightBasedOniPhoneX(16),
      color: colored.textColor,
    },
    cardContainer: {
      marginHorizontal: ratioWidthBasedOniPhoneX(16),
      padding: ratioHeightBasedOniPhoneX(24),
      borderRadius: ratioHeightBasedOniPhoneX(8),
    },
    column: {
      flexDirection: "column",
    },
    GoldView: {
      flexDirection: "row",
      alignItems: "flex-start",
    },
    columnContainer: {
      flexDirection: "column",
      flex: 1,
      marginLeft: ratioWidthBasedOniPhoneX(8),
    },
    circleImage: {
      height: ratioHeightBasedOniPhoneX(47),
      width: ratioHeightBasedOniPhoneX(47),
    },
    rowContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },

    cardShippingContainer: {
      flexDirection: "row",
      paddingHorizontal: ratioWidthBasedOniPhoneX(35),
      marginBottom: ratioHeightBasedOniPhoneX(71),
    },
    subTitle: {
      color: colored.black,
      fontSize: ratioHeightBasedOniPhoneX(16),
      fontFamily: "Inter-Bold",
      marginBottom: ratioHeightBasedOniPhoneX(5),
    },
    subTitleEnd: {
      fontFamily: "Inter-Medium",
      color: colored.lightText,
      fontSize: ratioHeightBasedOniPhoneX(14),
    },
    item: {
      marginHorizontal: ratioWidthBasedOniPhoneX(20),
    },

    image: {
      height: ratioHeightBasedOniPhoneX(60),
      width: ratioWidthBasedOniPhoneX(55),
    },
    subTitleEndBlack: {
      fontFamily: "Inter-Medium",
      color: colored.lightblack,
      fontSize: ratioHeightBasedOniPhoneX(14),
    },

    rowContainerButton: {
      flexDirection: "row",
      justifyContent: "space-evenly",
      alignItems: "center",
      marginVertical: ratioHeightBasedOniPhoneX(10),
    },
    Buybutton: {
      backgroundColor: colors.lightGreen,
      borderRadius: ratioHeightBasedOniPhoneX(37),
      flex: 1,
      alignItems: "center",
      marginHorizontal: ratioWidthBasedOniPhoneX(10),
    },
    buttonText: {
      fontSize: ratioHeightBasedOniPhoneX(16),
      color: colors.white,
      fontFamily: "Inter-Medium",
      textAlign: "center",
      paddingVertical: ratioHeightBasedOniPhoneX(20),
    },
    cancelbutton: {
      backgroundColor: colors.buttonGray,
      borderRadius: ratioHeightBasedOniPhoneX(37),
      flex: 1,
      alignItems: "center",
      marginHorizontal: ratioWidthBasedOniPhoneX(10),
    },
    buttoncancelText: {
      fontSize: ratioHeightBasedOniPhoneX(16),
      color: colors.black,
      fontFamily: "Inter-Medium",
      textAlign: "center",
      paddingVertical: ratioHeightBasedOniPhoneX(20),
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
      shadowOpacity: 0.1,
      elevation: 4,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Image
            source={require("../assets/images/left-arrow.png")}
            style={styles.backButtonImage}
          />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}>Orders Tracking</Text>
        </View>
      </View>
      <View style={[styles.cardContainer]}>
        <View style={styles.column}>
          <View style={styles.GoldView}>
            <Image
              source={require("../assets/images/goldorder.png")}
              style={styles.circleImage}
            />
            <View style={styles.columnContainer}>
              <View style={styles.rowContainer}>
                <Text style={styles.subTitle}>2g of Gold</Text>
              </View>
              <Text style={styles.subTitleEnd}>GOLD031</Text>
              <Text style={styles.subTitleEnd}>Ordered: 20th Jul 2023</Text>
            </View>
          </View>
        </View>
      </View>

      <Timeline
        circleSize={ratioHeightBasedOniPhoneX(10)}
        circleColor={colors.timelineCircle}
        lineColor={colors.timelineCircle}
        data={data}
        renderDetail={renderDetail}
        detailContainerStyle={{
          marginTop: ratioHeightBasedOniPhoneX(-12),
          paddingLeft: ratioWidthBasedOniPhoneX(7),
        }}
        innerCircle={"icon"}
        rowContainerStyle={{
          height: ratioHeightBasedOniPhoneX(110),
        }}
        iconStyle={{
          width: ratioHeightBasedOniPhoneX(32),
          height: ratioHeightBasedOniPhoneX(32),
          borderRadius: ratioHeightBasedOniPhoneX(32),
        }}
      />

      <View style={styles.cardShippingContainer}>
        <View style={styles.item}>
          <Text style={styles.subTitle}>Shipping Address</Text>
          <Text style={styles.subTitleEnd}>
            152 Mandan RoadPatterson,Mo 63956
          </Text>
          <Text style={styles.subTitleEnd}>
            Phone: <Text style={styles.subTitleEndBlack}>330-726-0321</Text>
          </Text>
        </View>
      </View>
      {/* <View style={styles.rowContainerButton}>
        <TouchableOpacity style={styles.cancelbutton}>
          <Text style={styles.buttoncancelText}>Cancel Order</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.Buybutton}>
          <Text style={styles.buttonText}>Need Support</Text>
        </TouchableOpacity>
      </View> */}
    </SafeAreaView>
  );
};

export default OrderDetails;
