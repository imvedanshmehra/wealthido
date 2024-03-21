import URLConstants from "../Networking/URLConstants";
import serverCommunication from "../Networking/serverCommunication";

export const callApi = async (
  url: string,
  data: any,
  onSuccess: (response: any) => void,
  onError: (error: any) => void
) => {
  try {
    await serverCommunication.postApi(
      url,
      data,
      (statusCode: number, responseData: any, error: any) => {
        if (!error) {
          try {
            onSuccess(responseData);
          } catch (parseError) {
            onError(parseError);
          }
        } else {
          onError(error);
        }
      }
    );
  } catch (error) {
    onError(error);
  }
};

export const getWalletTransactionHistory = async (
  data: any,
  onSuccess: (response: any) => void,
  onError: (error: any) => void
) => {
  await callApi(
    URLConstants.getWalletTransactionHistory,
    data,
    onSuccess,
    onError
  );
};
