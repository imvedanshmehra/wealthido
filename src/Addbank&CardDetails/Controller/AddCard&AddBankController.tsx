import URLConstants from "../../Networking/URLConstants";
import serverCommunication from "../../Networking/serverCommunication";

export const setDefault = async (
  paymentMethodID: any,
  onSuccess: (response: any) => void,
  onError: (error: any) => void,
  setLoading: (loading: boolean) => void,
  setLoadingFalse: () => void
) => {
  try {
    setLoading(true);
    await serverCommunication.postApi(
      `${URLConstants.setDefault}${paymentMethodID}`,
      null,
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
  } finally {
    setLoadingFalse();
  }
};

export const addBankAccount = async (
  data: any,
  onSuccess: (response: any) => void,
  onError: (error: any) => void,
  setLoading: (loading: boolean) => void,
  setLoadingFalse: () => void
) => {
  try {
    setLoading(true);
    await serverCommunication.postApi(
      URLConstants.addBankAccount,
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
  } finally {
    setLoadingFalse();
  }
};

export const verifyBankAccount = async (
  data: any,
  onSuccess: (response: any) => void,
  onError: (error: any) => void,
  setLoading: (loading: boolean) => void,
  setLoadingFalse: () => void
) => {
  try {
    setLoading(true);
    await serverCommunication.postApi(
      URLConstants.verifyBankAccount,
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
  } finally {
    setLoadingFalse();
  }
};
