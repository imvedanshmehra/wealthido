import strings from "../Extension/strings";
import HttpStatusCode from "../Networking/HttpStatusCode";
import serverCommunication from "../Networking/serverCommunication";
import { SignupResponseModel } from "../RegisterScreen/Modal/SignupResponseModel";
import { TwoFactorSetUpLaterAuthRequestModel } from "./Model/TwoFactorSetUpLaterAuthRequestModel";

/**
 * Handles the response from a server API call.
 */
export const handleResponse = async (
  url: string,
  data: TwoFactorSetUpLaterAuthRequestModel,
  successNavigationScreen: any,
  setLoading: (loading: boolean) => void,
  setLoadingFalse: () => void,
  navigation: any,
  showTextPopup: (title: string, message: string) => Promise<boolean>,
  password?: string
) => {
  setLoading(true);
  try {
    await serverCommunication.postApi(
      url,
      data,
      (statusCode: number, responseData: SignupResponseModel, error: any) => {
        if (!error) {
          if (
            responseData.status === HttpStatusCode.ok &&
            responseData.data?.isVerified
          ) {
            navigation.reset({
              index: 1,
              routes: [
                { name: successNavigationScreen[0] },
                {
                  name: successNavigationScreen[1],
                  params: {
                    phoneNumber: responseData.data.phoneNo,
                    password: password,
                  },
                },
              ],
            });
          } else {
            showTextPopup(strings.error, responseData?.message ?? "");
          }
        } else {
          showTextPopup(strings.error, responseData?.message ?? "");
        }
      }
    );
  } catch (error) {
    showTextPopup(strings.error, strings.defaultError);
  } finally {
    setLoadingFalse();
  }
};

export type RouteParams = {
  phoneNumber?: number;
  password?: string;
};
