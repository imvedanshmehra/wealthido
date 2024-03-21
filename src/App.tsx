import React, { useEffect, useState } from "react";
import {
  TransitionPresets,
  createStackNavigator,
} from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./LoginScreen/login";
import Signup from "./RegisterScreen/Signup";
import ForgotScreen from "./ForgetScreen/ForgetScreen";
import VerificationCode from "./VerficationCodeScreen/verificationCode";
import { ThemeProvider } from "./Networking/themeContext";
import BioMetryScreen from "./BioMetryScreen";
import { NativeBaseProvider } from "native-base";
import Auction from "./Auction/Auction";
import TabNavigator from "./Transaction/Transaction";
import NavigationService from "./NavigationService";
import OnboardingScreen from "./OnBoardingScreen/onBoardingScreen";
import { StripeProvider } from "@stripe/stripe-react-native";
import VerificationCodeEmailEdit from "./Profile/VerficationCodeEmailEdit";
import SplashImage from "./SplashImage";
import BiometricSetup from "./Biometric/BiometricSetup";
import Splash from "./SplashScreen/Splash";
import Customize from "./Customize/Customize";
import systemMaintenance from "./SystemMaintenance";
import OtpVerification from "./More/OtpVerification";
import BiometricLogin from "./LoginScreen/BiometricLogin";
import Ticket from "./More/Ticket/Ticket";
import TicketReplay from "./More/Ticket/TicketReplay";
import AddBank from "./Addbank&CardDetails/AddBank";
import BankCardDetails from "./Addbank&CardDetails/BankCardDetails";
import TicketRaise from "./More/Ticket/RaiseTicket";
import AddCard from "./Addbank&CardDetails/AddCard";
import BeneficiaryListScreen from "./More/Beneficiary/BeneficiaryList";
import AddBeneficiary from "./More/Beneficiary/AddBeneficiary";
import { MenuProvider } from "react-native-popup-menu";
import UploadAllDocument from "./More/Document/UploadAllDocument";
import InvestorProfile from "./Investor/InvestorProfile";
import TwoFactorVerification from "./TwoFactAuth/TwoFactorVerification";
import TotalPayable from "./Payment/TotalPayable";
import DocumentViewerScreen from "./More/Document/DocumentViewer";
import PaymentMethodScreen from "./Wallet/PaymentMethodScreen";
import GoldPaymentMethod from "./Buy/GoldPaymentMethod";
import OrdersTransaction from "./GoldInvestment/OrdersTransaction";
import branch, { BranchParams } from "react-native-branch";
import MyComponent from "./Utility";

const Contribution = React.lazy(
  () => import("./ContributionChart/Contribution")
);
const chitDetails = React.lazy(() => import("./ChitDetails/chitDetails"));
const OnGoing = React.lazy(() => import("./Auction/OngoingScreen"));
const Notification = React.lazy(() => import("./Profile/Notification"));
const KycUpload = React.lazy(() => import("./KycScreen/KycUpload"));
const ChitAuction = React.lazy(() => import("./ChitAuctionScreen/ChitAuction"));
const YourChitGroups = React.lazy(
  () => import("./YourChitGroupsScreen/YourChitGroups")
);
const YourChitGroupOnGoing = React.lazy(
  () => import("./YourChitGroupsScreen/YourChitGroupOnGoing")
);
const PasswordChanged = React.lazy(
  () => import("./PasswordChangeScreen/passwordchange")
);
const PasswordUpdate = React.lazy(
  () => import("./PasswordChangeScreen/PasswordUpdate")
);
const OrderDetails = React.lazy(() => import("./order/orderdetails"));
const OrderView = React.lazy(() => import("./order/order"));
const GoldInvestment = React.lazy(
  () => import("./GoldInvestment/GoldInvestment")
);
const SubscriptionplanDetail = React.lazy(
  () => import("./SubscriptionPlanDetail/SubscriptionplanDetail")
);
const SubscriptionPlan = React.lazy(
  () => import("./SubScriptionplan/SubScriptionplan")
);
const ContactInformation = React.lazy(
  () => import("./ContactInformation/ContactInformation")
);
const Withdraw = React.lazy(() => import("./Withdraw/Withdraw"));
const WinnerList = React.lazy(() => import("./Auction/WinnerList"));
const EditProfile = React.lazy(() => import("./Profile/ProfileUpdate"));
const PdfViewerScreen = React.lazy(() => import("./ChitDetails/PdfViwer"));
const TwoFactorauth = React.lazy(() => import("./TwoFactAuth/TwoFactorauth"));
const WalletScreen = React.lazy(() => import("./Wallet/WalletScreen"));
const SetSecurityPin = React.lazy(() => import("./SetSecurity/SetSecurityPin"));
const ReferralScreen = React.lazy(() => import("./Referral/Referral"));
const SecurityPinScreen = React.lazy(
  () => import("./SetSecurity/SecurityPinScreen")
);
const more = React.lazy(() => import("./More/more"));
const BuyGoldScreen = React.lazy(() => import("./Buy/buyGold"));
const Faq = React.lazy(() => import("./Faq/Faq"));
const Tutorials = React.lazy(() => import("./Tutorials/Tutorials"));
const EmailEdit = React.lazy(() => import("./Profile/EmailEdit"));
const BuyGoldSuccess = React.lazy(() => import("./Buy/BuyGoldSuccess"));
const ChitFundsExplore = React.lazy(
  () => import("./ChitFundsExplore/ChitFundsExplore")
);
const ConfirmPinScreen = React.lazy(
  () => import("./SetSecurity/ConfirmPrinScreen")
);
const ChangePinScreen = React.lazy(
  () => import("./SetSecurity/ChangePinScreen")
);
const MainTabs = React.lazy(() => import("./MainTabs"));
const WithdrawWallet = React.lazy(() => import("./Withdraw/WithdrawWallet"));
const Stack = createStackNavigator();

const App = (): JSX.Element => {
  const [unsubscribeFromBranch, setUnsubscribeFromBranch] = useState<any>(null);

  const screenConfigs = [
    { name: "SplashScreen", component: Splash },
    { name: "OnboardingScreen", component: OnboardingScreen },
    { name: "Logins", component: LoginScreen },
    { name: "MainTab", component: MainTabs },
    { name: "VerificationCodeScreen", component: VerificationCode },
    { name: "SignupScreen", component: Signup },
    { name: "ForgetScreen", component: ForgotScreen },
    { name: "chitDetails", component: chitDetails },
    { name: "contribution", component: Contribution },
    { name: "chitAuction", component: ChitAuction },
    { name: "notification", component: Notification },
    { name: "KycUpload", component: KycUpload },
    { name: "PasswordChangedScreen", component: PasswordChanged },
    { name: "Ongoing", component: OnGoing },
    { name: "AuctionScreen", component: Auction },
    { name: "yourChitGroups", component: YourChitGroups },
    { name: "yourChitGroupOnGoing", component: YourChitGroupOnGoing },
    { name: "PasswordUpdate", component: PasswordUpdate },
    { name: "EditProfile", component: EditProfile },
    { name: "WinnerList", component: WinnerList },
    { name: "PdfViewer", component: PdfViewerScreen },
    { name: "orderView", component: OrderView },
    { name: "orderDetails", component: OrderDetails },
    { name: "TransactionScreen", component: TabNavigator },
    { name: "Goldinvestment", component: GoldInvestment },
    { name: "SubScriptionplan", component: SubscriptionPlan },
    { name: "SubscriptionplanDetail", component: SubscriptionplanDetail },
    { name: "withdrawScreen", component: Withdraw },
    { name: "GoldPaymentMethodScreen", component: GoldPaymentMethod },
    { name: "contactInformationScreen", component: ContactInformation },
    { name: "BioMetryScreens", component: BioMetryScreen },
    { name: "Tutorials", component: Tutorials },
    { name: "ChitFundsExplore", component: ChitFundsExplore },
    { name: "WalletScreen", component: WalletScreen },
    { name: "TwoFactorAuth", component: TwoFactorauth },
    { name: "Referral", component: ReferralScreen },
    { name: "SetSecurityPin", component: SetSecurityPin },
    { name: "SecurityPinScreen", component: SecurityPinScreen },
    { name: "WithdrawWallet", component: WithdrawWallet },
    { name: "More", component: more },
    { name: "buyGold", component: BuyGoldScreen },
    { name: "FaqScreen", component: Faq },
    { name: "EmailEdit", component: EmailEdit },
    { name: "ChangePinScreen", component: ChangePinScreen },
    { name: "ConfirmPinScreen", component: ConfirmPinScreen },
    { name: "VerificationCodeEmailEdit", component: VerificationCodeEmailEdit },
    { name: "BuyGoldSuccess", component: BuyGoldSuccess },
    { name: "SplashImageScreen", component: SplashImage },
    { name: "BiometricSetupScreen", component: BiometricSetup },
    { name: "CustomizeScreen", component: Customize },
    { name: "systemMaintenanceScreen", component: systemMaintenance },
    { name: "OtpVerificationScreen", component: OtpVerification },
    { name: "BiometricLoginScreen", component: BiometricLogin },
    { name: "TicketScreen", component: Ticket },
    { name: "TicketReplayScreen", component: TicketReplay },
    { name: "TicketRaiseScreen", component: TicketRaise },
    { name: "AddBank", component: AddBank },
    { name: "BankCardDetailsScreen", component: BankCardDetails },
    { name: "AddCardScreen", component: AddCard },
    { name: "BeneficiaryListScreen", component: BeneficiaryListScreen },
    { name: "AddBeneficiary", component: AddBeneficiary },
    { name: "UploadAllDocumentScreen", component: UploadAllDocument },
    { name: "InvestorProfile", component: InvestorProfile },
    { name: "TwoFactorVerificationScreen", component: TwoFactorVerification },
    { name: "TotalPayableScreen", component: TotalPayable },
    { name: "DocumentViewer", component: DocumentViewerScreen },
    { name: "PaymentMethodScreen", component: PaymentMethodScreen },
    { name: "OrdersTransactionScreen", component: OrdersTransaction },
  ];

  useEffect(() => {
    const unsubscribe = branch.subscribe({
      onOpenStart: ({ uri, cachedInitialEvent }) => {
        console.log(
          `Branch subscribe onOpenStart, will open ${uri} cachedInitialEvent is ${cachedInitialEvent}`
        );
      },
      onOpenComplete: ({ error, params, uri }) => {
        if (error) {
          console.error(
            `Branch subscribe onOpenComplete, Error from opening uri: ${uri} error: ${error}`
          );
          return;
        }
        if (params) {
          console.log(
            "===================================>Test",
            MyComponent.referralCode
          );
          if (params["+clicked_branch_link"]) {
            MyComponent.referralCode = params["referral_code"];
            console.log(
              "===================================>",
              MyComponent.referralCode
            );
            return;
          }
        }
      },
    });

    setUnsubscribeFromBranch(unsubscribe);

    return () => {
      if (unsubscribeFromBranch) {
        unsubscribeFromBranch();
      }
    };
  }, []);

  return (
    <NativeBaseProvider>
      <StripeProvider publishableKey="pk_test_51Ntw4WLcVnrkpaxNon7IEeWVQ3xEyA1ynornh16WI1XaajmcgMeHC4qa8YChdaAn7m7PJtfCigkoZpcIMqX3Z5wf00BD8PcWuD">
        <MenuProvider>
          <ThemeProvider>
            <NavigationContainer
              ref={(navigatorRef: any) => {
                NavigationService.setTopLevelNavigator(navigatorRef);
              }}
            >
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                {screenConfigs.map((config: any) => (
                  <Stack.Screen
                    key={config.name}
                    name={config.name}
                    component={config.component}
                    options={{
                      headerShown: false,
                      ...(config.name == "SplashImageScreen" ||
                      config.name == "BioMetryScreens"
                        ? TransitionPresets.FadeFromBottomAndroid
                        : {}),
                    }}
                  />
                ))}
              </Stack.Navigator>
            </NavigationContainer>
          </ThemeProvider>
        </MenuProvider>
      </StripeProvider>
    </NativeBaseProvider>
  );
};

export default App;
