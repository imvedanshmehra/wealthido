import { Alert } from "react-native";
import { Environment, Inquiry } from "react-native-persona";
import serverCommunication from "../Networking/serverCommunication";
import URLConstants from "../Networking/URLConstants";
import StorageService from "../StorageService";

export const createInquiry = ({
  onPressIn,
  inquiryId,
  sessionToken,
}: {
  onPressIn?: () => void;
  inquiryId?: string;
  sessionToken?: string;
}) => {
  const getPersonakycStatus = async (inquiryId: string) => {
    try {
      await serverCommunication.getApi(
        URLConstants.getPersonakycStatus + inquiryId,
        (statusCode: any, responseData: any, error: any) => {
          if (!error && onPressIn) {
            onPressIn();
            getUserInfo();
          } else if (error) {
          }
        }
      );
    } catch (error) {}
  };

  const getUserInfo = async () => {
    try {
      await serverCommunication.getApi(
        URLConstants.userInfo,
        (statusCode: any, responseData: any, error: any) => {
          if (!error) {
            StorageService.setIsLogin(responseData);
          } else {
          }
        }
      );
    } catch (error) {}
  };

  const resumePersonaKyc = async (inquiryId: string, sessionToken: string) => {
    const data = {
      inquiryId: inquiryId,
      sessionId: sessionToken,
    };

    try {
      await serverCommunication.postApi(
        URLConstants.resumePersonaKyc,
        data,
        (statusCode: number, responseData: any, error: any) => {
          if (onPressIn) {
            onPressIn();
          }
        }
      );
    } catch (error) {
      if (onPressIn) {
        onPressIn();
      }
    }
  };

  // Check if there is a sessionToken, if not, create a new inquiry

  const inquiry = inquiryId
    ? Inquiry.fromInquiry(inquiryId).sessionToken(sessionToken ?? "")
    : Inquiry.fromTemplate("itmpl_VcyT28vRjNSoPDbMX94mP8XH").environment(
        Environment.SANDBOX
      );

  inquiry.onComplete(
    (inquiryId: string, status: any, fields: any, extraData: any) => {
      getPersonakycStatus(inquiryId);
    }
  );

  inquiry.onCanceled((inquiryId: any, sessionToken: any) => {
    resumePersonaKyc(inquiryId, sessionToken);
  });

  inquiry.onError((error: { message: string | undefined }) => {
    if (onPressIn) {
      onPressIn();
    }
    Alert.alert("Error", error.message);
  });

  const builtInquiry = inquiry.build();
  builtInquiry.start();
};
