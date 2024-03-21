import strings from "../Extension/strings";
import HttpStatusCode from "../Networking/HttpStatusCode";
import URLConstants from "../Networking/URLConstants";
import serverCommunication from "../Networking/serverCommunication";
import StorageService from "../StorageService";
import { BiometricAuthRequestModel } from "./Model/BiometricAuthRequestModel";

export const handleResponse = async (
  data: BiometricAuthRequestModel,
  setLoading: (loading: boolean) => void,
  setLoadingFalse: () => void,
  navigation?: any,
  showTextPopup?: (title: string, message: string) => void,
  successNavigationScreen?: any
) => {
  setLoading(true);
  try {
    await serverCommunication.postApi(
      URLConstants.fingerPrintStatus,
      data,
      (statusCode: number, responseData: any, error: any) => {
        if (responseData.status === HttpStatusCode.ok) {
          StorageService.setIsEnableFingerOrFaceLock(
            responseData?.data?.enableFingerOrFaceLock
          );
          navigation?.reset({
            index: 0,
            routes: [
              {
                name: successNavigationScreen,
              },
            ],
          });
        } else {
          showTextPopup?.(strings.error, responseData?.message ?? "");
        }
      }
    );
  } catch (error) {
    console.error("Error object:", error);
  } finally {
    setLoadingFalse();
  }
};

export type RouteParams = {
  phoneNumber?: number;
};
