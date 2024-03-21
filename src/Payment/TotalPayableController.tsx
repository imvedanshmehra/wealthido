import { AddBankResponseModel } from "../Addbank&CardDetails/Model/AddBankResponseModel";
import strings from "../Extension/strings";
import HTTPStatusCode from "../Networking/HttpStatusCode";
import URLConstants from "../Networking/URLConstants";
import serverCommunication from "../Networking/serverCommunication";

export const getCardAndBank = async (
  setBankDetails: (responseData: any) => void,
  setCardDetails?: (responseData: any) => void
) => {
  try {
    await serverCommunication.postApi(
      URLConstants.getCardAndBank,
      null,
      (statusCode: number, responseData: AddBankResponseModel, error: any) => {
        if (statusCode == HTTPStatusCode.ok) {
          setBankDetails(responseData.data?.bankList ?? null);
          if (setCardDetails) {
            setCardDetails(responseData.data?.cardList ?? null);
          }
        }
      }
    );
  } catch (error) {
    console.error("Error object:", error);
  }
};

export const getWalletRewardBalance = async (
  setWalletRewardBalance: (responseData: any) => void,
  showTextPopup: (title: string, message: string) => void
) => {
  try {
    await serverCommunication.getApi(
      URLConstants.getRewardAndWallet,
      (statusCode: any, responseData: any, error: any) => {
        if (!error) {
          if (statusCode === HTTPStatusCode.ok) {
            setWalletRewardBalance(responseData);
          } else {
            showTextPopup(strings.error, responseData?.message ?? "");
          }
        } else {
          showTextPopup(strings.error, responseData?.message ?? "");
        }
      }
    );
  } catch (error) {}
};
