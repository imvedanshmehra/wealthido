import {
  NavigationProp,
  useIsFocused,
  useNavigation,
} from "@react-navigation/native";
import { ThemeContext } from "../Networking/themeContext";
import { useContext, useEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Linking,
  Platform,
  RootTag,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import colors, { dark, light } from "../colors";
import React from "react";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "../Extension/ScreenUtils";
import { formatUSPhoneNumber } from "../Utility";
import { PERMISSIONS, RESULTS, check, request } from "react-native-permissions";
import Contacts from "react-native-contacts";
import WealthidoFonts from "../Helpers/WealthidoFonts";
import QRCode from "react-native-qrcode-svg";
import URLConstants from "../Networking/URLConstants";
import ViewShot from "react-native-view-shot";
import Share from "react-native-share";
import SendSMS from "react-native-sms";
import Loader from "../Loader";
import NoData from "../NoData";
import { ReferralResponseModel } from "./Model/ReferralResponseModel";

const ContactScreen: React.FC<{
  status: string;
  selectedIndex: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  referralData: ReferralResponseModel | null;
}> = ({ status, selectedIndex, setIndex, referralData }) => {
  const navigation: NavigationProp<RootTag> = useNavigation();
  const { theme } = useContext(ThemeContext);
  const colored = theme === "dark" ? dark : light;
  const [searchValue, setSearchValue] = useState("");
  const [contacts, setContacts] = useState<ContactList[]>([]);
  const [contactsFilter, setContactsFilter] = useState<ContactList[]>([]);
  const isFocused = useIsFocused();
  const [searchfilter, setSearchFilter] = useState<boolean>(false);
  const viewShotRef = useRef<ViewShot>(null);
  const [loading, setLoading] = useState(false);

  /**
   * Captures a screenshot of a specific component and shares the captured image.
   */

  const shareLink = () => {
    const urlToShare = referralData?.data?.referral?.referralLink;
    const message = "Referral link!";

    Share.open({
      message: message,
      url: urlToShare,
    })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  interface ContactList {
    // other properties...
    phoneNumbers: { number: string }[];
    rawContactId: string;
  }

  const sendInvitation = (contacts: ContactList) => {
    const invitationLink = referralData?.data?.referral?.referralLink; // Replace with your actual invitation link
    // Check if the contact has a valid phone number
    if (
      contacts.phoneNumbers &&
      contacts.phoneNumbers.length > 0 &&
      contacts.phoneNumbers[0].number
    ) {
      const recipientNumber = contacts.phoneNumbers[0].number;
      SendSMS.send(
        {
          body: `Begin Your Wealth Journey Now! ${invitationLink}`,
          recipients: [recipientNumber],
          successTypes: ["sent", "queued"], // Handle additional success types if needed
          allowAndroidSendWithoutReadPermission: true, // Android specific option, adjust as needed
        },
        (completed, canceled, error) => {}
      );
    } else {
      console.warn("Contact does not have a valid phone number");
    }
  };

  const filterContacts = (text: string) => {
    setSearchValue(text);
    const data = contacts.filter((item) =>
      Platform.OS == "android"
        ? item.displayName?.toLowerCase().includes(text.toLowerCase())
        : item.givenName?.toLowerCase().includes(text.toLowerCase())
    );
    if (text.length >= 1) {
      setContactsFilter(data);
      setSearchFilter(true);
    } else {
      setContactsFilter(contacts);
      setSearchFilter(false);
    }
  };

  /**
   * A React hook that requests permission to access the user's contacts when the screen is focused.
   * It checks the platform (iOS or Android) and requests the appropriate permission.
   * If the permission is granted, it retrieves all the contacts and sets them in the state.
   * If the permission is blocked, it displays an alert asking the user to enable the permission in the settings.
   * The function is triggered whenever the screen is focused.
   */

  useEffect(() => {
    const requestContactsPermission = async () => {
      let permission;
      if (Platform.OS === "ios") {
        permission = await request(PERMISSIONS.IOS.CONTACTS);
      } else if (Platform.OS === "android") {
        permission = await request(PERMISSIONS.ANDROID.READ_CONTACTS);
      }
      if (permission === RESULTS.GRANTED) {
        try {
          setLoading(true);
          const contacts = await Contacts.getAll();
          setContacts(contacts);
        } catch (e) {
        } finally {
          setLoading(false);
        }
      } else if (permission === RESULTS.BLOCKED) {
        Alert.alert(
          "Permission",
          "This app needs contact permission. Please enable it in settings.",
          [
            {
              text: "OK",
              onPress: () => {
                Linking.openSettings();
              },
            },
          ]
        );
      } else {
      }
    };
    const requestSMSPermission = async () => {
      try {
        const result = await request(PERMISSIONS.ANDROID.SEND_SMS);

        if (result === RESULTS.GRANTED) {
          console.log("SMS permission granted");
          return true;
        } else {
          console.warn("SMS permission denied");
          return false;
        }
      } catch (error) {
        console.error("Error requesting SMS permission:", error);
        return false;
      }
    };

    if (isFocused) {
      requestContactsPermission();
      requestSMSPermission();
    }
  }, [isFocused]);

  const inviteButtonHandler = () => {
    setIndex(1);
  };

  const params = {
    url: URLConstants.Image_URL + contacts.map((item) => item.displayName),
    title: "Terms & Condition",
  };

  const styles = StyleSheet.create({
    bodyContainer: {
      flex: 1,
      marginTop: ratioHeightBasedOniPhoneX(15),
    },
    codeContainer: {
      marginTop: ratioHeightBasedOniPhoneX(10),
      justifyContent: "center",
      backgroundColor: colored.QRCodeBg,
      borderRadius: ratioHeightBasedOniPhoneX(8),
      height: "auto",
      alignItems: "center",
      overflow: "hidden",
      marginHorizontal: ratioWidthBasedOniPhoneX(94),
      paddingVertical: ratioHeightBasedOniPhoneX(16),
      paddingHorizontal: ratioWidthBasedOniPhoneX(16),
    },
    referral: {
      color: colored.textColor,
      marginTop: ratioHeightBasedOniPhoneX(8),
      textAlign: "center",
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(12)),
    },
    code: {
      color: colors.mainlyBlue,
      textAlign: "center",
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },
    termsAndConditionText: {
      color: colored.referralCodeText,
      textAlign: "center",
      marginTop: ratioHeightBasedOniPhoneX(15),
      marginBottom: ratioHeightBasedOniPhoneX(9),
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(10)),
    },
    ButtonNextRow: {
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor:
        theme === "light" ? colored.cardBackGround : "transparent",
      marginTop: "auto",
      paddingVertical: ratioHeightBasedOniPhoneX(40),
      paddingHorizontal: ratioWidthBasedOniPhoneX(20),
      gap: ratioHeightBasedOniPhoneX(15),
    },
    inviteButton: {
      backgroundColor: colored.lightGreen,
      borderRadius: ratioHeightBasedOniPhoneX(37),
      width: "100%",
      justifyContent: "center",
      height: ratioHeightBasedOniPhoneX(40),
    },
    inviteButtonText: {
      color: colors.white,
      textAlign: "center",
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
    },
    shareButton: {
      backgroundColor: colored.shareButtonOther,
      borderRadius: ratioHeightBasedOniPhoneX(37),
      width: "100%",
      justifyContent: "center",
      height: ratioHeightBasedOniPhoneX(40),
    },
    shareButtonText: {
      color: colored.textColor,
      textAlign: "center",
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
      shadowColor: "black",
      elevation: 4,
    },
    contactContainer: {
      flex: 1,
      flexDirection: "column",
      marginTop: ratioHeightBasedOniPhoneX(15),
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: ratioHeightBasedOniPhoneX(37),
      marginTop: ratioHeightBasedOniPhoneX(10),
      height: ratioHeightBasedOniPhoneX(40),
      backgroundColor: colored.searchBg,
      marginHorizontal: ratioHeightBasedOniPhoneX(16),
    },
    searchInput: {
      flex: 1,
      color: colored.textColor,
      includeFontPadding: false,
      padding: 0,
      margin: 0,
      paddingHorizontal: ratioWidthBasedOniPhoneX(20),
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },
    searchIcon: {
      paddingVertical: ratioHeightBasedOniPhoneX(8),
      width: ratioWidthBasedOniPhoneX(22),
      height: ratioHeightBasedOniPhoneX(22),
      marginRight: ratioWidthBasedOniPhoneX(20),
    },
    contactListContainer: {
      marginTop: ratioHeightBasedOniPhoneX(15),
      flex: 1,
    },
    contactText: {
      color: colors.lightblack,
      marginHorizontal: ratioHeightBasedOniPhoneX(16),
      marginBottom: ratioHeightBasedOniPhoneX(16),
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
    },
    containerChit: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: ratioHeightBasedOniPhoneX(8),
      marginHorizontal: ratioHeightBasedOniPhoneX(16),
      alignItems: "center",
    },
    row: {
      flexDirection: "row",
      gap: ratioWidthBasedOniPhoneX(10),
      width: "100%",
      paddingHorizontal: ratioWidthBasedOniPhoneX(20),
      paddingVertical: ratioHeightBasedOniPhoneX(10),
      borderRadius: ratioHeightBasedOniPhoneX(5),
    },
    contactAvatar: {
      borderRadius: ratioHeightBasedOniPhoneX(40),
      backgroundColor: colors.blueColor,
      height: ratioHeightBasedOniPhoneX(40),
      width: ratioHeightBasedOniPhoneX(40),
      justifyContent: "center",
      alignContent: "center",
    },
    contactLetter: {
      color: colors.white,
      textAlign: "center",
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(14)),
    },
    contactName: {
      color: colored.textColor,
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(14)),
    },
    contactNumber: {
      color: colors.mainlyBlue,
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(12)),
    },
    NoData: {
      color: colored.textColor,
      textAlign: "center",
      alignContent: "center",
      marginTop: ratioHeightBasedOniPhoneX(40),
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(18)),
    },
    mainText: {
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(18)),
      color: colored.textColor,
      paddingHorizontal: ratioWidthBasedOniPhoneX(20),
    },
  });
  1;
  const getContactListItem = (data: ContactList) => (
    <TouchableOpacity
      style={styles.containerChit}
      onPress={() => {
        sendInvitation(data);
      }}
      activeOpacity={1}
    >
      <View
        style={[
          styles.row,
          Platform.OS == "android" ? styles.androidShadow : styles.iosShadow,
          { backgroundColor: colored.cardBackGround },
        ]}
      >
        <View style={styles.contactAvatar}>
          <Text style={styles.contactLetter}>
            {Platform.OS === "ios"
              ? data?.givenName?.[0] || "-"
              : data?.displayName?.[0] || "-"}
          </Text>
        </View>
        <View>
          <Text style={styles.contactName}>
            {Platform.OS === "ios"
              ? data?.givenName || "-"
              : data?.displayName || "-"}
          </Text>
          <Text style={styles.contactNumber}>
            {data?.phoneNumbers.length
              ? formatUSPhoneNumber(data?.phoneNumbers[0].number)
              : "-"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      {status === "Code" && (
        <View style={styles.bodyContainer}>
          <Text style={styles.mainText}>Code</Text>
          <View
            style={[
              styles.codeContainer,
              Platform.OS == "android"
                ? styles.androidShadow
                : styles.iosShadow,
            ]}
          >
            <ViewShot
              ref={viewShotRef}
              style={[
                {
                  padding: ratioHeightBasedOniPhoneX(10),
                  backgroundColor: colors.white,
                },
              ]}
            >
              <QRCode
                value={referralData?.data?.referral?.referralLink}
                size={ratioHeightBasedOniPhoneX(155)}
              ></QRCode>
            </ViewShot>
            <Text style={styles.referral}>Referral Code</Text>
            <Text style={styles.code}>
              {referralData?.data?.referral?.referralCode}
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("PdfViewer", params);
              }}
            >
              <Text style={styles.termsAndConditionText}>
                Terms & Conditions
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.ButtonNextRow}>
            <TouchableOpacity
              style={styles.inviteButton}
              onPress={inviteButtonHandler}
            >
              <Text style={styles.inviteButtonText}>Invite from contacts</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareButton} onPress={shareLink}>
              <Text style={styles.shareButtonText}>Share with other apps</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {status === "Contacts" && (
        <View style={styles.contactContainer}>
          <Text style={styles.mainText}>Contacts</Text>
          <View
            style={[
              styles.searchContainer,
              Platform.OS == "android"
                ? styles.androidShadow
                : styles.iosShadow,
            ]}
          >
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name or number"
              placeholderTextColor={colors.dimGray}
              underlineColorAndroid="transparent"
              onChangeText={filterContacts}
              selectionColor={colored.textColor}
              value={searchValue}
            />
            <Image
              source={require("../assets/images/svg/search.png")}
              style={styles.searchIcon}
            />
          </View>
          <View style={styles.contactListContainer}>
            {contacts && contacts.length === 0 ? (
              <NoData />
            ) : (
              <FlatList
                data={searchfilter ? contactsFilter : contacts}
                renderItem={({ item }) => getContactListItem(item)}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item: any) => item.rawContactId}
              ></FlatList>
            )}
          </View>
          <Loader loading={loading} />
        </View>
      )}
    </>
  );
};

export default ContactScreen;

export interface ContactList {
  displayName?: string;
  givenName?: string;
  phoneNumbers: Array<{ number: string }>;
  rawContactId?: string;
}
