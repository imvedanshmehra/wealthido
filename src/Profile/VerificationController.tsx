import HTTPStatusCode from "../Networking/HttpStatusCode";
import HttpStatusCode from "../Networking/HttpStatusCode";
import serverCommunication from "../Networking/serverCommunication";

export const resendNewMobileNo = async (
  data: any,
  url: any,
  onSuccess: (responseData: any) => void,
  showTextPopup: (message: string) => void,
  setIsAlertVisible: (visible: boolean) => void
) => {
  try {
    await serverCommunication.postApi(
      url,
      data,
      (statusCode: number, responseData: any, error: any) => {
        if (!error) {
          onSuccess(responseData);
        } else {
          if (responseData.statusCode == HttpStatusCode.unauthorized) {
            setIsAlertVisible(true);
            return;
          }
          showTextPopup(error.message);
        }
      }
    );
  } catch (error) {
    showTextPopup("An error occurred while resending OTP.");
  }
};

export const verificationEmailOrPhone = async (
  url: any,
  data: any,
  showTextPopup: (message: string) => void,
  setLoading: (loading: boolean) => void
) => {
  setLoading(true);
  try {
    await serverCommunication.postApi(
      url,
      data,
      (statusCode: number, responseData: any, error: any) => {
        if (!error) {
          if (responseData.status == HTTPStatusCode.ok) {
            showTextPopup(responseData.message ?? "");
          } else {
            showTextPopup(responseData.message ?? "");
          }
        } else {
          showTextPopup(error.message);
        }
      }
    );
  } catch (error) {
    console.error("Error object:", error);
  } finally {
    setLoading(false);
  }
};
