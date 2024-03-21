import URLConstants from "../Networking/URLConstants";
import serverCommunication from "../Networking/serverCommunication";

const PasswordChangedController = {
  changePassword: async (
    data: any,
    onSuccess: (response: any) => void,
    onError: (error: any) => void
  ) => {
    try {
      await serverCommunication.postApi(
        URLConstants.changePassword,
        data,
        (statusCode: any, responseData: any, error: any) => {
          if (!error) {
            try {
              onSuccess(responseData);
            } catch (parseError) {
              onError(error);
            }
          } else {
            onError(error);
          }
        }
      );
    } catch (error) {
      onError(error);
    }
  },
};

export default PasswordChangedController;
